import { prisma } from "@/lib/prisma";

export async function getKbEntryByCode(code: string) {
  return prisma.diagnosticRule.findUnique({
    where: {
      canonicalCode: code,
    },
  });
}

export async function getKbEntries() {
  return prisma.diagnosticRule.findMany({
    orderBy: {
      canonicalCode: "asc",
    },
  });
}

export function buildKbTitle(code: string, title: string) {
  return `${title} — ${code} | Checkout Rescue`;
}

export function buildKbDescription(title: string, explanation: string) {
  const text = `${title}. ${explanation}`;
  return text.length > 155 ? `${text.slice(0, 152)}...` : text;
}
