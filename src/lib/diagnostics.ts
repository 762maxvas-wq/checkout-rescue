import type { DiagnosticRule, PlatformSource, Severity } from "@prisma/client";

export function normalizeIssue(issueInput: string): string {
  const raw = issueInput.trim().toLowerCase();

  const aliases: Record<string, string> = {
    "3ds failed": "authentication_required",
    "payment failed": "payment_failed",
    "checkout failed": "payment_failed",
    "verification needed": "verification_required",
  };

  if (!raw) return "payment_failed";
  return aliases[raw] || raw;
}

export function inferConfidence(
  base: number,
  context: string,
  source: PlatformSource,
  canonicalCode: string,
  supportedSources: PlatformSource[]
): number {
  let score = base;
  const lowered = context.toLowerCase();

  if (lowered.includes("3ds") && canonicalCode === "authentication_required") score += 4;
  if (lowered.includes("payout") && canonicalCode === "payouts_paused") score += 5;
  if (source === "shopify_payments" && ["payouts_paused", "verification_required"].includes(canonicalCode)) {
    score += 4;
  }
  if (!supportedSources.includes(source)) {
    score -= 6;
  }

  return Math.max(62, Math.min(97, score));
}

type BuildDiagnosticInput = {
  source: PlatformSource;
  context?: string;
  rule: DiagnosticRule | null;
  isPremium: boolean;
};

export function buildDiagnosticResult({ source, context = "", rule, isPremium }: BuildDiagnosticInput) {
  const sourceLabelMap: Record<PlatformSource, string> = {
    stripe: "Stripe",
    shopify: "Shopify",
    shopify_payments: "Shopify Payments",
  };

  if (!rule) {
    return {
      source,
      sourceLabel: sourceLabelMap[source],
      canonicalCode: "payment_failed",
      title: "Неуспешная оплата в checkout",
      severity: "high" as Severity,
      confidence: 68,
      probableImpact: "Пользователь не может завершить покупку.",
      humanExplanation:
        "Мы не нашли точное совпадение в rule-base, поэтому отдали безопасный общий диагноз.",
      likelyCauses: [
        "Частный decline code скрыт за общим сообщением",
        "Ошибка на стороне checkout integration",
        "Проблема в app, extension или кастомизации",
      ],
      firstChecks: [
        "Проверь журналы ошибок",
        "Сравни поведение по браузерам и устройствам",
        "Проверь последние изменения checkout",
      ],
      fixPlan: isPremium
        ? [
            "Включи подробное логирование",
            "Повтори сценарий в test mode",
            "Отключи последние кастомные изменения",
          ]
        : null,
      supportTemplate: isPremium ? "Hello support team..." : null,
      isPremiumLocked: !isPremium,
    };
  }

  const supportedSources = rule.supportedSources as PlatformSource[];
  const confidence = inferConfidence(rule.confidenceBase, context, source, rule.canonicalCode, supportedSources);

  return {
    source,
    sourceLabel: sourceLabelMap[source],
    canonicalCode: rule.canonicalCode,
    title: rule.title,
    severity: rule.severity,
    confidence,
    probableImpact: rule.probableImpact,
    humanExplanation: rule.humanExplanation,
    likelyCauses: rule.likelyCauses as string[],
    firstChecks: rule.firstChecks as string[],
    fixPlan: isPremium ? (rule.fixPlan as string[]) : null,
    supportTemplate: isPremium ? rule.supportTemplate : null,
    isPremiumLocked: !isPremium,
  };
}
