"use client";

import { useEffect, useState } from "react";

type PlanResponse = {
  ok: boolean;
  plan: "free" | "pro" | "team";
};

export function PlanStatusPill() {
  const [plan, setPlan] = useState<"free" | "pro" | "team">("free");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadPlan() {
      try {
        const res = await fetch("/api/account/plan", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await res.json()) as PlanResponse;

        if (!mounted) return;

        if (res.ok && data?.ok) {
          setPlan(data.plan);
        } else {
          setPlan("free");
        }
      } catch {
        if (!mounted) return;
        setPlan("free");
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    }

    loadPlan();

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return null;
  }

  const isPro = plan === "pro" || plan === "team";

  return (
    <span
      className="stat-pill"
      style={{
        background: isPro
          ? "rgba(37, 99, 235, 0.10)"
          : "var(--surface-soft)",
        borderColor: isPro
          ? "rgba(37, 99, 235, 0.22)"
          : "var(--border)",
        color: isPro ? "var(--primary)" : "var(--text-soft)",
      }}
    >
      {isPro ? "Pro активен" : "Free"}
    </span>
  );
}