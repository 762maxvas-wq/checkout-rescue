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
  {
    code: "card_declined",
    title: "Платёж отклонён банком",
    description:
      "Банк-эмитент отклонил операцию. Причина может быть связана с ограничениями карты или внутренними правилами банка.",
    severity: "High",
  },
  {
    code: "expired_card",
    title: "Срок действия карты истёк",
    description:
      "Карта клиента больше не действительна, поэтому оплата не может быть завершена.",
    severity: "Medium",
  },
  {
    code: "processing_error",
    title: "Ошибка обработки платежа",
    description:
      "Во время обработки платежа произошёл технический сбой на стороне системы или провайдера.",
    severity: "High",
  },
  {
    code: "incorrect_number",
    title: "Неверный номер карты",
    description:
      "Провайдер получил некорректный номер карты. Обычно это ошибка ввода данных.",
    severity: "Medium",
  },
  {
    code: "fraudulent",
    title: "Платёж помечен как подозрительный",
    description:
      "Антифрод-система определила высокий риск операции и отклонила платёж.",
    severity: "High",
  },
  {
    code: "pickup_card",
    title: "Карта заблокирована банком",
    description:
      "Банк сообщает, что карта больше не должна использоваться и операция по ней запрещена.",
    severity: "High",
  },
  {
    code: "lost_card",
    title: "Карта отмечена как утерянная",
    description:
      "Карта клиента числится как утерянная, поэтому оплата по ней отклоняется автоматически.",
    severity: "High",
  },
  {
    code: "stolen_card",
    title: "Карта отмечена как украденная",
    description:
      "Банк пометил карту как украденную, и такие операции обычно блокируются автоматически.",
    severity: "High",
  },
  {
    code: "invalid_expiry_month",
    title: "Неверно указан месяц окончания карты",
    description:
      "В поле срока действия карты указан некорректный месяц. Обычно это ошибка ввода.",
    severity: "Medium",
  },
  {
    code: "invalid_expiry_year",
    title: "Неверно указан год окончания карты",
    description:
      "В поле срока действия карты указан некорректный год. Обычно это ошибка ввода или проблема формы.",
    severity: "Medium",
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