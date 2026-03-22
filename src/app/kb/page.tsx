import Link from "next/link";
import AppHeader from "@/components/AppHeader";

const articles = [
  {
    code: "authentication_required",
    title: "Требуется дополнительная аутентификация",
    description:
      "Платёж требует дополнительной аутентификации клиента (3DS / SCA).",
    severity: "Medium",
  },
  {
    code: "do_not_honor",
    title: "Отклонено банком",
    description:
      "Банк отклонил операцию без объяснения. Обычно это решение эмитента.",
    severity: "High",
  },
  {
    code: "insufficient_funds",
    title: "Недостаточно средств",
    description: "Недостаточно средств на карте клиента.",
    severity: "Low",
  },
];

function getSeverityLabel(severity: string) {
  const value = severity.toLowerCase();

  if (value === "low") return "Низкая";
  if (value === "medium") return "Средняя";
  if (value === "high") return "Высокая";

  return severity;
}

export default function KbPage() {
  return (
    <main className="page-shell">
      <AppHeader />

      <section className="app-card" style={{ marginBottom: 24 }}>
        <div className="page-kicker">
          <span className="app-badge">База знаний</span>
        </div>

        <h1 className="page-section-title">База знаний</h1>

        <p className="section-subtitle">
          Справочник типовых ошибок платежей и проблем checkout. Здесь можно
          быстро открыть нужный код и получить краткое объяснение, уровень
          критичности и первые шаги для проверки.
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

                <div className="stat-pill">
                  Критичность: {getSeverityLabel(a.severity)}
                </div>
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