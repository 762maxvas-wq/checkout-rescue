import { prisma } from "@/lib/prisma";

const FREE_TOTAL_DIAGNOSE_LIMIT = 3;

export async function getTotalUsageCount(userId: string, action: string) {
  return prisma.usageLog.count({
    where: {
      userId,
      action,
    },
  });
}

export async function canRunDiagnosis(
  userId: string,
  plan: "free" | "pro" | "team"
) {
  if (plan === "pro" || plan === "team") {
    return { allowed: true, remaining: null as number | null };
  }

  const usedTotal = await getTotalUsageCount(userId, "diagnose");
  const remaining = Math.max(0, FREE_TOTAL_DIAGNOSE_LIMIT - usedTotal);

  return {
    allowed: usedTotal < FREE_TOTAL_DIAGNOSE_LIMIT,
    remaining,
  };
}

export async function logUsage(userId: string, action: string) {
  await prisma.usageLog.create({
    data: {
      userId,
      action,
    },
  });
}