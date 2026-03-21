export type PlatformSource = "stripe" | "shopify" | "shopify_payments";
export type Severity = "low" | "medium" | "high" | "critical";

export type DiagnoseRequest = {
  source: PlatformSource;
  issueInput: string;
  context?: string;
};

export type DiagnoseResponse = {
  ok: boolean;
  requestId: string;
  plan?: "free" | "pro" | "team";
  remainingFreeRuns?: number | null;
  result: {
    source: PlatformSource;
    sourceLabel: string;
    canonicalCode: string;
    title: string;
    severity: Severity;
    confidence: number;
    probableImpact: string;
    humanExplanation: string;
    likelyCauses: string[];
    firstChecks: string[];
    fixPlan: string[] | null;
    supportTemplate: string | null;
    isPremiumLocked: boolean;
  };
};
