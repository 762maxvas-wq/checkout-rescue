import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import CheckoutButton from "@/components/CheckoutButton";

export default function PricingPage() {
  return (
    <main className="page-shell">
      <AppHeader />

      <section className="app-card" style={{ marginBottom: 24 }}>
        <div className="page-kicker">
          <span className="app-badge">Pricing</span>
        </div>

        <h1 className="page-section-title">Тарифы</h1>

        <p className="section-subtitle">
          Выберите подходящий формат: бесплатный доступ для первых разборов или
          Pro для полного сценария диагностики без ограничений.
        </p>
      </section>

      <section
        className="feature-grid"
        style={{ gridTemplateColumns: "1fr 1fr", alignItems: "stretch" }}
      >
        <article className="app-card hover-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div>
              <div className="app-badge" style={{ marginBottom: 12 }}>
                Free
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 34,
                  letterSpacing: "-0.04em",
                }}
              >
                Бесплатно
              </h2>
            </div>

            <div className="stat-pill">Для старта</div>
          </div>

          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              marginBottom: 18,
            }}
          >
            €0
          </div>

          <ul className="list-tight app-secondary" style={{ marginBottom: 24 }}>
            <li>3 бесплатных разбора</li>
            <li>базовая диагностика ошибки</li>
            <li>confidence и severity</li>
            <li>likely causes и first checks</li>
            <li>доступ к базе знаний</li>
            <li>история сохранённых разборов</li>
          </ul>

          <div className="app-actions">
            <Link
              href="/diagnose"
              className="app-link-button app-link-button--ghost"
            >
              Попробовать бесплатно
            </Link>
          </div>
        </article>

        <article
          className="app-card hover-card"
          style={{
            border: "1px solid rgba(37, 99, 235, 0.22)",
            boxShadow: "0 20px 50px rgba(37, 99, 235, 0.10)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div>
              <div className="app-badge" style={{ marginBottom: 12 }}>
                Pro
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 34,
                  letterSpacing: "-0.04em",
                }}
              >
                Полный доступ
              </h2>
            </div>

            <div className="stat-pill">Рекомендуем</div>
          </div>

          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              marginBottom: 6,
            }}
          >
            €29
          </div>

          <div className="app-muted" style={{ marginBottom: 18 }}>
            в месяц
          </div>

          <ul className="list-tight app-secondary" style={{ marginBottom: 24 }}>
            <li>всё из бесплатного тарифа</li>
            <li>полный fix-plan</li>
            <li>support template</li>
            <li>расширенная история кейсов</li>
            <li>безлимитные разборы</li>
          </ul>

          <div className="app-actions">
            <CheckoutButton />
            <Link
              href="/sign-in"
              className="app-link-button app-link-button--ghost"
            >
              Уже есть аккаунт
            </Link>
          </div>
        </article>
      </section>

      <section className="app-card" style={{ marginTop: 24 }}>
        <h2
          style={{
            marginTop: 0,
            marginBottom: 12,
            fontSize: 30,
            letterSpacing: "-0.03em",
          }}
        >
          Почему Pro
        </h2>

        <p className="section-subtitle" style={{ maxWidth: "100%" }}>
          Pro открывает полный сценарий работы: расширенный fix-plan, больше
          практических шагов по устранению ошибок, доступ к шаблону обращения в
          поддержку и удобную историю кейсов без ограничений бесплатного тарифа.
        </p>
      </section>
    </main>
  );
}