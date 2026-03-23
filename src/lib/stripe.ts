import Stripe from "stripe";

declare global {
  // eslint-disable-next-line no-var
  var __stripe__: Stripe | undefined;
}

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY_missing");
  }

  if (!global.__stripe__) {
    global.__stripe__ = new Stripe(secretKey);
  }

  return global.__stripe__;
}