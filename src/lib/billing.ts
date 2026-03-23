import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type AppPlan = "free" | "pro" | "team";
type AppSubscriptionStatus =
  | "active"
  | "inactive"
  | "canceled"
  | "past_due"
  | "trialing";

type CreateCheckoutSessionArgs = {
  userId: string;
  email: string;
  priceId: string;
};

function mapPriceIdToPlan(priceId?: string | null): AppPlan {
  if (priceId && priceId === process.env.STRIPE_TEAM_PRICE_ID) {
    return "team";
  }

  if (priceId && priceId === process.env.STRIPE_PRO_PRICE_ID) {
    return "pro";
  }

  return "free";
}

function mapStripeStatus(
  status?: Stripe.Subscription.Status | null
): AppSubscriptionStatus {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "canceled":
      return "canceled";
    default:
      return "inactive";
  }
}

export async function getUserPlan(userId: string): Promise<AppPlan> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: {
      plan: true,
      status: true,
      currentPeriodEnd: true,
    },
  });

  if (!subscription) {
    return "free";
  }

  const isPaidPlan =
    subscription.plan === "pro" || subscription.plan === "team";

  const hasActiveStatus =
    subscription.status === "active" ||
    subscription.status === "trialing" ||
    subscription.status === "past_due";

  const isNotExpired =
    !subscription.currentPeriodEnd ||
    subscription.currentPeriodEnd > new Date();

  if (isPaidPlan && hasActiveStatus && isNotExpired) {
    return subscription.plan;
  }

  return "free";
}

export async function activateProPlanFromCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  const userId = session.metadata?.userId;

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null;

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id ?? null;

  if (!userId) {
    throw new Error("missing_user_id_in_checkout_session");
  }

  if (!customerId) {
    throw new Error("missing_customer_id_in_checkout_session");
  }

  if (!subscriptionId) {
    throw new Error("missing_subscription_id_in_checkout_session");
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["items.data.price"],
  });

  const firstItem = subscription.items.data[0];
  const priceId =
    typeof firstItem?.price?.id === "string" ? firstItem.price.id : null;

  const plan = mapPriceIdToPlan(priceId);
  const status = mapStripeStatus(subscription.status);
  const currentPeriodEnd =
    typeof subscription.current_period_end === "number"
      ? new Date(subscription.current_period_end * 1000)
      : null;

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      stripeCustomerId: customerId,
      stripeSubId: subscriptionId,
      plan,
      status,
      currentPeriodEnd,
    },
    create: {
      userId,
      stripeCustomerId: customerId,
      stripeSubId: subscriptionId,
      plan,
      status,
      currentPeriodEnd,
    },
  });

  return {
    ok: true,
    plan,
    status,
  };
}

export async function createCheckoutSession({
  userId,
  email,
  priceId,
}: CreateCheckoutSessionArgs) {
  if (!email) {
    throw new Error("email_required");
  }

  if (!priceId) {
    throw new Error("STRIPE_PRO_PRICE_ID_missing");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL_missing");
  }

  const baseUrl = appUrl.replace(/\/$/, "");

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      allow_promotion_codes: true,
      metadata: {
        userId,
      },
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });

    return session;
  } catch (error) {
    console.error("Stripe checkout create failed:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("checkout_session_failed");
  }
}
