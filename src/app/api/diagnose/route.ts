import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAppUser } from "@/lib/auth";
import { getUserPlan } from "@/lib/billing";
import { buildDiagnosticResult, normalizeIssue } from "@/lib/diagnostics";
import { prisma } from "@/lib/prisma";
import { canRunDiagnosis, logUsage } from "@/lib/usage";

const requestSchema = z.object({
  source: z.enum(["stripe", "shopify", "shopify_payments"]),
  issueInput: z.string().min(1),
  context: z.string().optional().default(""),
});

export async function POST(req: NextRequest) {
  try {
    const appUser = await requireAppUser();
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "invalid_request",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { source, issueInput, context } = parsed.data;
    const plan = await getUserPlan(appUser.externalAuthId);
    const usage = await canRunDiagnosis(appUser.id, plan);

    if (!usage.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: "free_limit_reached",
          message: "Free plan includes 3 diagnoses. Upgrade to Pro to continue.",
        },
        { status: 403 }
      );
    }

    const normalizedCode = normalizeIssue(issueInput);

    const requestRecord = await prisma.diagnosticRequest.create({
      data: {
        userId: appUser.id,
        source,
        issueInput,
        context,
        normalizedCode,
      },
    });

    const rule = await prisma.diagnosticRule.findUnique({
      where: { canonicalCode: normalizedCode },
    });

    const isPremium = plan === "pro" || plan === "team";

    const result = buildDiagnosticResult({
      source,
      context,
      rule,
      isPremium,
    });

    const resultRecord = await prisma.diagnosticResult.create({
      data: {
        requestId: requestRecord.id,
        userId: appUser.id,
        source,
        canonicalCode: result.canonicalCode,
        title: result.title,
        severity: result.severity,
        confidence: result.confidence,
        probableImpact: result.probableImpact,
        humanExplanation: result.humanExplanation,
        likelyCauses: result.likelyCauses,
        firstChecks: result.firstChecks,
        fixPlan: result.fixPlan ?? Prisma.JsonNull,
        supportTemplate: result.supportTemplate,
        isPremiumLocked: result.isPremiumLocked,
      },
    });

    await logUsage(appUser.id, "diagnose");

    const remainingFreeRuns =
      usage.remaining === null ? null : Math.max(0, usage.remaining - 1);

    return NextResponse.json({
      ok: true,
      plan,
      remainingFreeRuns,
      requestId: requestRecord.id,
      result: {
        source: resultRecord.source,
        sourceLabel: result.sourceLabel,
        canonicalCode: resultRecord.canonicalCode,
        title: resultRecord.title,
        severity: resultRecord.severity,
        confidence: resultRecord.confidence,
        probableImpact: resultRecord.probableImpact,
        humanExplanation: resultRecord.humanExplanation,
        likelyCauses: resultRecord.likelyCauses,
        firstChecks: resultRecord.firstChecks,
        fixPlan: resultRecord.fixPlan,
        supportTemplate: resultRecord.supportTemplate,
        isPremiumLocked: resultRecord.isPremiumLocked,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";

    if (message === "unauthorized") {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "internal_server_error" },
      { status: 500 }
    );
  }
}