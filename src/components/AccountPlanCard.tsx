import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getUserPlan } from "@/lib/billing";

export async function AccountPlanCard() {
  const { userId } = await auth();

  const plan = userId ? await getUserPlan(userId) : "free";
  const isPro = plan === "pro";

  return (
    <div className="app-card">
      <h3
        style={{
          marginTop: 0,
          marginBottom: 12,
          fontSize: 28,
          letterSpacing: "-0.03em",
        }}
      >
        Тариф
      </h3>

      <div style={{ marginBottom: 14 }}>
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
      </div>

      <p className="app-secondary" style={{ lineHeight: 1.8 }}>
        {isPro
          ? "У аккаунта активен Pro-доступ. Доступны расширенные возможности, полный сценарий диагностики и платный маршрут продукта."
          : "Сейчас у аккаунта бесплатный доступ. Можно перейти к тарифам и оформить Pro для полного доступа без ограничений free-режима."}
      </p>

      <div className="app-actions" style={{ marginTop: 18 }}>
        {isPro ? (
          <>
            <Link href="/diagnose" className="app-link-button">
              Открыть диагностику
            </Link>

            <Link
              href="/pricing"
              className="app-link-button app-link-button--ghost"
            >
              Посмотреть тариф
            </Link>
          </>
        ) : (
          <>
            <Link href="/pricing" className="app-link-button">
              Подключить Pro
            </Link>

            <Link
              href="/diagnose"
              className="app-link-button app-link-button--ghost"
            >
              Продолжить бесплатно
            </Link>
          </>
        )}
      </div>
    </div>
  );
}