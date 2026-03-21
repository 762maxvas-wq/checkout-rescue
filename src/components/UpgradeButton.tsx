"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PLAN_STORAGE_KEY, type PlanType } from "@/lib/plan";

export function UpgradeButton() {
  const [plan, setPlan] = useState<PlanType>("free");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PLAN_STORAGE_KEY);
      setPlan(raw === "pro" ? "pro" : "free");
    } finally {
      setReady(true);
    }
  }, []);

  if (!ready) {
    return null;
  }

  if (plan === "pro") {
    return (
      <Link href="/account" className="app-link-button app-link-button--ghost">
        Pro активен
      </Link>
    );
  }

  return (
    <Link href="/pricing" className="app-link-button">
      Купить Pro
    </Link>
  );
}