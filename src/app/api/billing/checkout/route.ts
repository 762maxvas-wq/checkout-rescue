import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/billing";

export async function POST() {
  try {
    const user = await requireAppUser();

    const session = await createCheckoutSession({
      userId: user.id,
      email: user.email,
      priceId: process.env.STRIPE_PRO_PRICE_ID!,
    });

    return NextResponse.json({
      ok: true,
      url: session.url,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "checkout_session_failed",
      },
      { status: 500 }
    );
  }
}
