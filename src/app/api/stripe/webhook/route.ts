import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/billing";

function mapPriceToPlan(priceId: string): "free" | "pro" | "team" {
  if (priceId === process.env.STRIPE_TEAM_PRICE_ID) return "team";
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";
  return "free";
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const customerId = typeof session.customer === "string" ? session.customer : null;
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;

    if (userId && customerId && subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ["items.data.price"],
      });

      const firstItem = subscription.items.data[0];
      const priceId = firstItem?.price?.id;
      const plan = priceId ? mapPriceToPlan(priceId) : "free";
      const status = subscription.status === "active" ? "active" : "trialing";
      const periodEndUnix = subscription.items.data[0]?.current_period_end ?? null;

      await prisma.subscription.upsert({
        where: { userId },
        update: {
          stripeCustomerId: customerId,
          stripeSubId: subscriptionId,
          plan,
          status,
          currentPeriodEnd: periodEndUnix ? new Date(periodEndUnix * 1000) : null,
        },
        create: {
          userId,
          stripeCustomerId: customerId,
          stripeSubId: subscriptionId,
          plan,
          status,
          currentPeriodEnd: periodEndUnix ? new Date(periodEndUnix * 1000) : null,
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await prisma.subscription.updateMany({
      where: { stripeSubId: subscription.id },
      data: {
        plan: "free",
        status: "canceled",
      },
    });
  }

  return NextResponse.json({ received: true });
}
