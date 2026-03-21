import Link from "next/link";
import AppHeader from "@/components/AppHeader";

const articles = [
  {
    code: "authentication_required",
    title: "Authentication required",
    description:
      "Платёж требует дополнительной аутентификации клиента (3DS / SCA).",
    severity: "Medium",
  },
  {
    code: "do_not_honor",
    title: "Do not honor",
    description:
      "Банк отклонил операцию без объяснения. Обычно это решение эмитента.",
    severity: "High",
  },
  {
    code: "insufficient_funds",
    title: "Insufficient funds",
    description: "Недостаточно средств на карте клиента.",
    severity: "Low",
  },
];

export default function KbPage() {
  return (
    <main className="page-shell">
      <AppHeader />

      <section className="app-card" style={{ marginBottom: 24 }}>
        <div className="page-kicker">
          <span className="app-badge">Knowledge Base</span>
        </div>

        <h1 className="page-section-title">База знаний</h1>

        <p className="section-subtitle">
          Справочник типовых ошибок платежей и checkout-проблем. Здесь можно
          быстро открыть нужный код и получить краткое объяснение, severity и
          первые шаги для проверки.
        </p>
      </section>

      <section className="kb-grid">
        {articles.map((a) => (
          <Link key={a.code} href={`/kb/${a.code}`}>
            <article className="app-card hover-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 14,
                  alignItems: "flex-start",
                  marginBottom: 14,
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: 30,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {a.title}
                  </h3>
                  <div className="app-muted" style={{ fontSize: 14 }}>
                    {a.code}
                  </div>
                </div>

                <div className="stat-pill">Severity: {a.severity}</div>
              </div>

              <p
                className="app-secondary"
                style={{
                  margin: 0,
                  fontSize: 17,
                  lineHeight: 1.8,
                }}
              >
                {a.description}
              </p>
            </article>
          </Link>
        ))}
      </section>
    </main>
  );
}