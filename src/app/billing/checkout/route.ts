import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/billing";

export async function POST() {
  try {
    const user = await requireAppUser();

    const priceId = process.env.STRIPE_PRO_PRICE_ID;
    if (!priceId) {
      return NextResponse.json(
        { ok: false, error: "STRIPE_PRO_PRICE_ID_missing" },
        { status: 500 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { ok: false, error: "STRIPE_SECRET_KEY_missing" },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { ok: false, error: "NEXT_PUBLIC_APP_URL_missing" },
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
        { ok: false, error: "stripe_session_url_missing" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "checkout_session_failed";

    console.error("api/billing/checkout failed:", error);

    if (message === "unauthorized") {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 }
      );
    }

    if (message === "email_required") {
      return NextResponse.json(
        { ok: false, error: "email_required" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}