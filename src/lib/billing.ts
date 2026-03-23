import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CreateCheckoutSessionArgs = {
  userId: string;
  email: string;
  priceId: string;
};

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
    throw new Error("checkout_session_failed");
  }
}