import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/billing";

export async function POST() {
  try {
    const user = await requireAppUser();
    const priceId = process.env.STRIPE_PRO_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        {
          ok: false,
          error: "STRIPE_PRO_PRICE_ID is not configured",
        },
        { status: 500 }
      );
    }

    const session = await createCheckoutSession({
      userId: user.id,
      email: user.email,
      priceId,
    });

    if (!session.url) {
      return NextResponse.json(
        {
          ok: false,
          error: "Stripe did not return checkout url",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      url: session.url,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "checkout_session_failed";

    if (message === "unauthorized") {
      return NextResponse.json(
        {
          ok: false,
          error: "unauthorized",
        },
        { status: 401 }
      );
    }

    if (message === "email_required") {
      return NextResponse.json(
        {
          ok: false,
          error: "email_required",
        },
        { status: 400 }
      );
    }

    console.error("billing checkout failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}