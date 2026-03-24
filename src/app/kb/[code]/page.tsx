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
    title: "Требуется дополнительная аутентификация",
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
    title: "Отклонено банком без объяснения",
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
    title: "Недостаточно средств",
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

  card_declined: {
    title: "Платёж отклонён банком",
    explanation:
      "Банк-эмитент отклонил операцию. Это общее сообщение, за которым могут скрываться ограничения карты, риск-оценка или внутренние правила банка.",
    severity: "High",
    impact:
      "Покупатель не завершает оплату, а магазин теряет часть конверсии.",
    likelyCauses: [
      "Банк отклонил операцию по внутренним правилам",
      "Карта ограничена для онлайн-платежей",
      "Сработали антифрод-фильтры",
      "Попытка оплаты выглядит нетипично для банка",
    ],
    firstChecks: [
      "Проверить, есть ли более точный decline code в логах провайдера",
      "Сравнить долю отказов по странам, устройствам и BIN",
      "Попросить покупателя попробовать другую карту или способ оплаты",
    ],
    seoTerms: [
      "card declined stripe",
      "shopify card declined",
      "payment failed card declined",
    ],
  },

  expired_card: {
    title: "Срок действия карты истёк",
    explanation:
      "Провайдер сообщает, что срок действия карты уже истёк. Обычно это пользовательская ошибка или устаревшие данные сохранённой карты.",
    severity: "Medium",
    impact:
      "Покупатель не может завершить оплату, хотя проблема обычно не связана с интеграцией.",
    likelyCauses: [
      "Покупатель ввёл данные карты с истёкшим сроком действия",
      "В аккаунте сохранена устаревшая карта",
      "Покупатель не заметил, что карта уже недействительна",
    ],
    firstChecks: [
      "Проверить, нет ли всплеска на сохранённых картах",
      "Убедиться, что ошибка не маскирует другую проблему формы",
      "Сделать текст ошибки понятным для пользователя",
    ],
    seoTerms: [
      "expired card stripe",
      "shopify expired card",
      "payment failed expired card",
    ],
  },

  processing_error: {
    title: "Ошибка обработки платежа",
    explanation:
      "Во время обработки платежа произошёл технический сбой. Это может быть временная проблема на стороне провайдера, сети или конкретного сценария checkout.",
    severity: "High",
    impact:
      "Пользователь не может завершить оплату, а причина выглядит как технический сбой в процессе обработки.",
    likelyCauses: [
      "Временный сбой на стороне платёжного провайдера",
      "Проблема в сетевом взаимодействии между checkout и провайдером",
      "Ошибка проявляется только в части браузеров или устройств",
      "Сбой вызван нестабильным сценарием подтверждения платежа",
    ],
    firstChecks: [
      "Проверить сырые логи ошибки и время возникновения",
      "Сравнить частоту processing_error по браузерам и устройствам",
      "Убедиться, что проблема не связана с недавними изменениями checkout",
    ],
    seoTerms: [
      "processing error stripe",
      "shopify processing error",
      "payment processing error checkout",
    ],
  },

  incorrect_number: {
    title: "Неверный номер карты",
    explanation:
      "Провайдер получил неверный номер карты. Обычно это ошибка ввода или неудачная попытка использовать недействительную карту.",
    severity: "Medium",
    impact:
      "Покупатель не завершает оплату, но проблема обычно связана с вводом данных, а не с интеграцией.",
    likelyCauses: [
      "Покупатель ввёл номер карты с ошибкой",
      "Часть номера карты была скопирована некорректно",
      "Форма оплаты недостаточно ясно показывает ошибку ввода",
    ],
    firstChecks: [
      "Проверить, нет ли всплеска после изменений формы оплаты",
      "Убедиться, что поле номера карты корректно работает на мобильных устройствах",
      "Проверить текст ошибки и понятность подсказок для пользователя",
    ],
    seoTerms: [
      "incorrect number stripe",
      "shopify incorrect card number",
      "payment failed incorrect number",
    ],
  },

  fraudulent: {
    title: "Платёж помечен как подозрительный",
    explanation:
      "Платёж был отмечен как подозрительный антифрод-системой. Это не всегда означает реальное мошенничество, но операция считается рискованной.",
    severity: "High",
    impact:
      "Часть реальных покупателей может быть заблокирована вместе с действительно рискованными попытками оплаты.",
    likelyCauses: [
      "Антифрод-модель определила высокий риск транзакции",
      "Нетипичная страна, устройство или поведение покупателя",
      "Много повторных попыток за короткое время",
      "Профиль заказа выглядит рискованно для провайдера или банка",
    ],
    firstChecks: [
      "Проверить risk signals и fraud insights в логах провайдера",
      "Сравнить долю таких отказов по странам, устройствам и payment methods",
      "Убедиться, что не было резких изменений в checkout flow или трафике",
    ],
    seoTerms: [
      "fraudulent stripe",
      "shopify fraudulent payment",
      "payment flagged as fraudulent",
    ],
  },

  pickup_card: {
    title: "Карта заблокирована банком",
    explanation:
      "Банк сообщает, что карта больше не должна использоваться. Обычно это означает, что карта заблокирована, изъята или признана недействительной.",
    severity: "High",
    impact:
      "Платёж не может быть завершён, а карта клиента, скорее всего, уже заблокирована банком.",
    likelyCauses: [
      "Карта заблокирована банком",
      "Банк пометил карту как недействительную",
      "Старая карта больше не обслуживается",
      "Платёжная операция запрещена на стороне эмитента",
    ],
    firstChecks: [
      "Попросить клиента использовать другую карту",
      "Не предлагать повторять ту же оплату много раз",
      "Проверить, не выросла ли доля таких отказов у конкретного BIN",
    ],
    seoTerms: [
      "pickup card stripe",
      "shopify pickup card",
      "card declined pickup card",
    ],
  },

  lost_card: {
    title: "Карта отмечена как утерянная",
    explanation:
      "Банк сообщает, что карта числится как утерянная. Обычно такая карта блокируется, и попытка оплаты по ней отклоняется автоматически.",
    severity: "High",
    impact:
      "Платёж отклоняется, а карта клиента, вероятно, уже не может использоваться для новых операций.",
    likelyCauses: [
      "Карта была отмечена владельцем как утерянная",
      "Банк уже выпустил замену старой карте",
      "Клиент пытается оплатить старой заблокированной картой",
    ],
    firstChecks: [
      "Попросить клиента использовать другую карту",
      "Проверить, нет ли повторных попыток по тому же card fingerprint",
      "Убедиться, что ошибка приходит именно от эмитента",
    ],
    seoTerms: [
      "lost card stripe",
      "shopify lost card",
      "card declined lost card",
    ],
  },

  stolen_card: {
    title: "Карта отмечена как украденная",
    explanation:
      "Банк сообщает, что карта числится как украденная. Такие операции почти всегда блокируются автоматически.",
    severity: "High",
    impact:
      "Платёж отклоняется автоматически, а операция рассматривается как высокорисковая.",
    likelyCauses: [
      "Карта была помечена банком как украденная",
      "Используется уже заблокированная карта",
      "Операция попала под усиленный риск-контроль",
    ],
    firstChecks: [
      "Не предлагать повторную оплату по той же карте",
      "Проверить связанные risk signals в системе провайдера",
      "Сравнить частоту таких отказов по странам и типам трафика",
    ],
    seoTerms: [
      "stolen card stripe",
      "shopify stolen card",
      "card declined stolen card",
    ],
  },

  invalid_expiry_month: {
    title: "Неверно указан месяц окончания карты",
    explanation:
      "Провайдер сообщает, что месяц срока действия карты введён некорректно. Обычно это простая ошибка пользователя или неудачный ввод в форме.",
    severity: "Medium",
    impact:
      "Покупатель не может завершить оплату, но проблема обычно связана только с неверным вводом данных.",
    likelyCauses: [
      "Покупатель ошибся при вводе месяца",
      "Форма оплаты неудобно обрабатывает дату карты",
      "Автозаполнение браузера подставило неверные данные",
    ],
    firstChecks: [
      "Проверить поведение поля даты на мобильных устройствах",
      "Убедиться, что формат ввода понятен пользователю",
      "Проверить, не было ли изменений в маске поля карты",
    ],
    seoTerms: [
      "invalid expiry month stripe",
      "shopify invalid expiry month",
      "payment failed invalid expiry month",
    ],
  },

  invalid_expiry_year: {
    title: "Неверно указан год окончания карты",
    explanation:
      "Провайдер сообщает, что год срока действия карты введён некорректно. Обычно это ошибка пользователя или проблема формы ввода.",
    severity: "Medium",
    impact:
      "Покупатель не завершает оплату, но проблема обычно связана с вводом даты карты, а не с интеграцией.",
    likelyCauses: [
      "Покупатель ввёл неправильный год окончания карты",
      "Автозаполнение браузера подставило неверное значение",
      "Форма оплаты некорректно обрабатывает ввод года",
    ],
    firstChecks: [
      "Проверить поле срока действия на мобильных устройствах",
      "Убедиться, что формат ввода года понятен пользователю",
      "Проверить, не ломает ли автозаполнение форму оплаты",
    ],
    seoTerms: [
      "invalid expiry year stripe",
      "shopify invalid expiry year",
      "payment failed invalid expiry year",
    ],
  },
};

function getSeverityLabel(severity: string) {
  const value = severity.toLowerCase();

  if (value === "low") return "Низкая";
  if (value === "medium") return "Средняя";
  if (value === "high") return "Высокая";

  return severity;
}

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
          <div className="article-kicker">База знаний</div>

          <h1 className="article-title">{article.title}</h1>

          <p className="article-lead">{article.explanation}</p>

          <section>
            <h2>Код ошибки</h2>
            <p>
              <strong>{code}</strong>
            </p>
          </section>

          <section>
            <h2>Насколько это критично</h2>
            <p>
              <strong>Критичность:</strong> {getSeverityLabel(article.severity)}
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
              Быстрый переход
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
              подставленным кодом ошибки.
            </p>

            <Link href={`/diagnose?issue=${code}`} className="app-link-button">
              Открыть диагностику
            </Link>
          </div>

          <div className="app-card">
            <div className="app-badge" style={{ marginBottom: 12 }}>
              Следующий шаг
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