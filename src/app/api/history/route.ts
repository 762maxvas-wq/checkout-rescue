import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const appUser = await requireAppUser();

    const items = await prisma.diagnosticRequest.findMany({
      where: {
        userId: appUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      include: {
        result: true,
      },
    });

    const normalized = items
      .filter((item) => item.result)
      .map((item) => ({
        id: item.id,
        createdAt: item.createdAt.toISOString(),
        issueInput: item.issueInput,
        canonicalCode: item.result!.canonicalCode,
        title: item.result!.title,
        source: item.result!.source,
        severity: item.result!.severity,
        confidence: item.result!.confidence,
        probableImpact: item.result!.probableImpact,
        humanExplanation: item.result!.humanExplanation,
      }));

    return NextResponse.json({
      ok: true,
      items: normalized,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";

    if (message === "unauthorized") {
      return NextResponse.json(
        { ok: false, error: "unauthorized", items: [] },
        { status: 401 }
      );
    }

    console.error("history route failed:", error);

    return NextResponse.json(
      { ok: false, error: "internal_server_error", items: [] },
      { status: 500 }
    );
  }
}