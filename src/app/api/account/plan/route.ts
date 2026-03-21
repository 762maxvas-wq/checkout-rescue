import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserPlan } from "@/lib/billing";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        ok: true,
        plan: "free",
      });
    }

    const plan = await getUserPlan(userId);

    return NextResponse.json({
      ok: true,
      plan,
    });
  } catch (error) {
    console.error("account plan route failed:", error);

    return NextResponse.json(
      {
        ok: false,
        plan: "free",
      },
      { status: 500 }
    );
  }
}