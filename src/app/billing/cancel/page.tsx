import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export default function BillingCancelPage() {
  return (
    <main className="page-shell">
      <AppHeader />

      <section
        className="app-card"
        style={{
          maxWidth: 820,
          margin: "0 auto",
        }}
      >
        <div className="page-kicker">
          <span className="app-badge">Payment cancelled</span>
        </div>

        <h1 className="page-section-title">Оплата отменена</h1>

        <p className="section-subtitle" style={{ marginBottom: 24 }}>
          Ничего страшного. Ты можешь продолжить пользоваться бесплатной версией
          и вернуться к Pro позже, когда захочешь открыть расширенные функции.
        </p>

        <div className="soft-card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginTop: 0 }}>Что доступно уже сейчас</h3>
          <ul className="list-tight app-secondary">
            <li>базовая диагностика</li>
            <li>база знаний</li>
            <li>локальная история запусков</li>
            <li>повторный запуск разборов</li>
          </ul>
        </div>

        <div className="app-actions">
          <Link href="/pricing" className="app-link-button">
            Вернуться к тарифам
          </Link>

          <Link
            href="/diagnose"
            className="app-link-button app-link-button--ghost"
          >
            Продолжить бесплатно
          </Link>
        </div>
      </section>
    </main>
  );
}