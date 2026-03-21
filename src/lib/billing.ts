import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(params: {
  userId: string;
  email: string;
  priceId: string;
}) {
  const { userId, email, priceId } = params;

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  let customerId = subscription?.stripeCustomerId ?? undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email,
      metadata: { userId },
    });

    customerId = customer.id;

    await prisma.subscription.upsert({
      where: { userId },
      update: { stripeCustomerId: customerId },
      create: {
        userId,
        plan: "free",
        status: "active",
        stripeCustomerId: customerId,
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
    metadata: {
      userId,
    },
  });

  return session;
}

export async function activateProPlanFromCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session.customer) {
    throw new Error("checkout_session_missing_customer");
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer.id;

  const paymentStatus = session.payment_status;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (paymentStatus !== "paid" && session.mode !== "subscription") {
    throw new Error("checkout_not_completed");
  }

  const existing = await prisma.subscription.findFirst({
    where: {
      stripeCustomerId: customerId,
    },
  });

  if (!existing) {
    throw new Error("subscription_record_not_found");
  }

  await prisma.subscription.update({
    where: { userId: existing.userId },
    data: {
      plan: "pro",
      status: "active",
    },
  });

  return {
    ok: true,
    customerId,
    subscriptionId: subscriptionId ?? null,
    userId: existing.userId,
  };
}

export async function getUserPlan(
  clerkUserId: string
): Promise<"free" | "pro" | "team"> {
  const appUser = await prisma.user.findUnique({
    where: { externalAuthId: clerkUserId },
    include: {
      subscription: true,
    },
  });

  if (!appUser?.subscription) return "free";

  const sub = appUser.subscription;

  if (sub.status !== "active" && sub.status !== "trialing") return "free";

  return sub.plan;
}