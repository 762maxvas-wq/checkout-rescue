import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/billing";

export const runtime = "nodejs";

export async function POST() {
  try {
    const user = await requireAppUser();

    const priceId = process.env.STRIPE_PRO_PRICE_ID?.trim();
    if (!priceId) {
      return NextResponse.json(
        { ok: false, error: "STRIPE_PRO_PRICE_ID_missing" },
        { status: 500 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY?.trim()) {
      return NextResponse.json(
        { ok: false, error: "STRIPE_SECRET_KEY_missing" },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_APP_URL?.trim()) {
      return NextResponse.json(
        { ok: false, error: "NEXT_PUBLIC_APP_URL_missing" },
        { status: 500 }
      );
    }

    if (!user?.id) {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 }
      );
    }

    if (!user?.email) {
      return NextResponse.json(
        { ok: false, error: "email_required" },
        { status: 400 }
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

    return NextResponse.json(
      { ok: true, url: session.url },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "checkout_session_failed";

    console.error("api/billing/checkout failed:", error);

    const status =
      message === "unauthorized"
        ? 401
        : message === "email_required"
        ? 400
        : 500;

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}