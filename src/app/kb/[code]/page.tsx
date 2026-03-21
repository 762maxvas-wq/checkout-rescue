import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/AppHeader";

const kbArticles: Record<
  string,
  {
    title: string;
    explanation: string;
    severity: string;
    impact: string;
    likelyCauses: string[];
    firstChecks: string[];
    seoTerms: string[];
  }
> = {
  authentication_required: {
    title: "Authentication required",
    explanation:
      "Платёж требует дополнительной аутентификации клиента. Чаще всего это 3DS / SCA-подтверждение, которое не было завершено или прошло с ошибкой.",
    severity: "Medium",
    impact:
      "Покупатель не завершает оплату, checkout прерывается, конверсия снижается.",
    likelyCauses: [
      "Покупатель не завершил 3DS challenge",
      "Банк потребовал повторную аутентификацию",
      "Окно подтверждения закрылось слишком рано",
      "Проблема с редиректом после 3DS",
    ],
    firstChecks: [
      "Проверить, появляется ли окно 3DS у клиента",
      "Проверить возврат пользователя обратно в checkout после подтверждения",
      "Проверить логи Stripe PaymentIntent / Charge",
      "Убедиться, что браузер или расширения не блокируют challenge flow",
    ],
    seoTerms: [
      "authentication required stripe",
      "3ds required shopify",
      "shopify stripe authentication required",
      "sca payment failed",
    ],
  },

  do_not_honor: {
    title: "Do not honor",
    explanation:
      "Банк отклонил операцию без подробного объяснения. Обычно это решение на стороне эмитента карты.",
    severity: "High",
    impact:
      "Платёж не проходит, пользователь не завершает покупку, возрастает число брошенных checkout.",
    likelyCauses: [
      "Ограничение со стороны банка",
      "Подозрение на риск-операцию",
      "Лимиты по карте",
      "Внутренние правила эмитента",
    ],
    firstChecks: [
      "Попросить клиента связаться с банком",
      "Предложить попробовать другую карту",
      "Проверить страну, валюту и риск-факторы заказа",
      "Посмотреть Stripe Radar / risk insights",
    ],
    seoTerms: [
      "do not honor stripe",
      "shopify do not honor",
      "bank declined do not honor",
      "stripe issuer declined",
    ],
  },

  insufficient_funds: {
    title: "Insufficient funds",
    explanation:
      "На карте клиента недостаточно средств для завершения платежа.",
    severity: "Low",
    impact:
      "Платёж не проходит, но причина обычно понятна и быстро устраняется другой картой или пополнением счёта.",
    likelyCauses: [
      "Недостаточно средств на карте",
      "Лимит доступного остатка меньше суммы заказа",
      "Часть суммы заблокирована банком",
    ],
    firstChecks: [
      "Попросить клиента попробовать другую карту",
      "Попросить проверить баланс",
      "Проверить итоговую сумму заказа и валюту",
    ],
    seoTerms: [
      "insufficient funds stripe",
      "shopify insufficient funds",
      "card declined insufficient funds",
    ],
  },
};

export default async function KbCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const article = kbArticles[code];

  if (!article) {
    notFound();
  }

  return (
    <main className="page-shell">
      <AppHeader />

      <div style={{ marginBottom: 20 }}>
        <Link href="/kb">← Назад к базе знаний</Link>
      </div>

      <section className="result-layout">
        <article className="app-card article-content">
          <div className="article-kicker">Knowledge Base</div>

          <h1 className="article-title">{article.title}</h1>

          <p className="article-lead">{article.explanation}</p>

          <section>
            <h2>Canonical code</h2>
            <p>
              <strong>{code}</strong>
            </p>
          </section>

          <section>
            <h2>Насколько это критично</h2>
            <p>
              <strong>Severity:</strong> {article.severity}
            </p>
            <p className="app-secondary">{article.impact}</p>
          </section>

          <section>
            <h2>Наиболее вероятные причины</h2>
            <ul className="list-tight">
              {article.likelyCauses.map((cause, index) => (
                <li key={`${index}-${cause}`}>{cause}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Что проверить в первую очередь</h2>
            <ol className="list-tight">
              {article.firstChecks.map((check, index) => (
                <li key={`${index}-${check}`}>{check}</li>
              ))}
            </ol>
          </section>

          <section>
            <h2>Связанные поисковые формулировки</h2>
            <ul className="list-tight">
              {article.seoTerms.map((term, index) => (
                <li key={`${index}-${term}`}>{term}</li>
              ))}
            </ul>
          </section>
        </article>

        <aside className="sidebar-stack sticky-panel">
          <div className="app-card">
            <div className="app-badge" style={{ marginBottom: 12 }}>
              Quick action
            </div>

            <h3
              style={{
                marginTop: 0,
                marginBottom: 12,
                fontSize: 28,
                letterSpacing: "-0.03em",
              }}
            >
              Быстрый переход
            </h3>

            <p className="app-secondary" style={{ lineHeight: 1.8 }}>
              Хочешь сразу проверить код на практике — открой диагностику с уже
              подставленным issue.
            </p>

            <Link href={`/diagnose?issue=${code}`} className="app-link-button">
              Открыть диагностику
            </Link>
          </div>

          <div className="app-card">
            <div className="app-badge" style={{ marginBottom: 12 }}>
              Next step
            </div>

            <h3
              style={{
                marginTop: 0,
                marginBottom: 12,
                fontSize: 28,
                letterSpacing: "-0.03em",
              }}
            >
              Что дальше
            </h3>

            <p className="app-secondary" style={{ lineHeight: 1.8, margin: 0 }}>
              После диагностики можно будет сохранять кейсы в историю и собирать
              базу повторяющихся платёжных проблем по реальным запускам.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}