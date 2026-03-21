import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/billing";

export async function POST() {
  try {
    const appUser = await requireAppUser();

    const priceId = process.env.STRIPE_PRO_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "STRIPE_PRO_PRICE_ID is not configured" },
        { status: 500 }
      );
    }

    const session = await createCheckoutSession({
      userId: appUser.id,
      email: appUser.email,
      priceId,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe checkout URL was not returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";

    if (message === "unauthorized") {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    console.error("checkout route error:", error);

    return NextResponse.json(
      { error: "Ошибка создания оплаты" },
      { status: 500 }
    );
  }
}