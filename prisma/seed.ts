import { PrismaClient, PlatformSource, Severity } from "@prisma/client";

const prisma = new PrismaClient();

type SeedRule = {
  canonicalCode: string;
  title: string;
  description: string;
  severity: Severity;
  supportedSources: PlatformSource[];
  confidenceBase: number;
  probableImpact: string;
  humanExplanation: string;
  likelyCauses: string[];
  firstChecks: string[];
  fixPlan: string[];
  supportTemplate: string;
  seoTerms: string[];
};

const rules: SeedRule[] = [
  {
    canonicalCode: "authentication_required",
    title: "Требуется дополнительная аутентификация клиента",
    description: "3DS/SCA flow needs completion",
    severity: "high",
    supportedSources: ["stripe", "shopify", "shopify_payments"],
    confidenceBase: 86,
    probableImpact: "Покупатель не завершает checkout после шага подтверждения.",
    humanExplanation:
      "Платеж требует 3DS/SCA-подтверждение. Обычно проблема появляется, когда frontend не доводит покупателя до успешного завершения аутентификации.",
    likelyCauses: [
      "Не завершён 3DS/SCA flow на стороне клиента",
      "Нарушен confirm step в checkout flow",
      "Редирект блокируется браузером",
      "Проблема возникает только на части устройств",
    ],
    firstChecks: [
      "Проверь статус PaymentIntent и наличие next_action",
      "Проверь, выполняется ли подтверждение после 3DS",
      "Прогони тестовую карту Stripe со сценарием 3DS",
    ],
    fixPlan: [
      "Повтори транзакцию в test mode и найди момент потери user flow",
      "Сверь frontend integration с confirm step",
      "Добавь логирование статусов PaymentIntent",
      "Протестируй кейс на мобильных браузерах",
    ],
    supportTemplate:
      "Hello support team. We see repeated authentication_required failures during checkout. Please review recent payment attempts and confirm whether incomplete customer authentication is the root cause.",
    seoTerms: ["authentication_required", "3ds failed", "shopify checkout authentication required"],
  },
  {
    canonicalCode: "generic_decline",
    title: "Банк отклонил платеж без точной причины",
    description: "Issuer declined payment without detailed explanation",
    severity: "high",
    supportedSources: ["stripe", "shopify", "shopify_payments"],
    confidenceBase: 80,
    probableImpact: "Платеж не проходит, а причина выглядит расплывчатой.",
    humanExplanation:
      "Провайдер получил общий отказ от банка-эмитента без конкретного технического кода.",
    likelyCauses: [
      "Банк заблокировал операцию как рискованную",
      "Несоответствие billing data",
      "Карта ограничена для онлайн-оплаты",
      "Повторные попытки попали под антифрод",
    ],
    firstChecks: [
      "Сверь billing address и ZIP/postal code",
      "Проверь долю decline по странам и BIN",
      "Попроси пользователя попробовать другую карту",
    ],
    fixPlan: [
      "Собери выборку decline по устройствам и странам",
      "Проверь аномалии после недавних изменений checkout",
      "Подготовь fallback-сообщение для клиента",
      "Запроси у провайдера обзор risk patterns",
    ],
    supportTemplate:
      "Hello support team. We are seeing multiple generic_decline events. Please check whether there are issuer-side or provider-side risk trends visible in logs.",
    seoTerms: ["generic decline stripe", "shopify generic decline", "payment declined without reason"],
  },
  {
    canonicalCode: "insufficient_funds",
    title: "Недостаточно средств на карте",
    description: "Issuer reports insufficient funds",
    severity: "medium",
    supportedSources: ["stripe", "shopify", "shopify_payments"],
    confidenceBase: 92,
    probableImpact: "Покупатель не может завершить оплату, но проблема обычно не в интеграции.",
    humanExplanation:
      "Банк сообщает, что на карте недостаточно средств или лимит онлайн-операций исчерпан.",
    likelyCauses: [
      "Недостаточно баланса",
      "Превышен дневной лимит",
      "Есть ограничения банка по валюте или стране",
    ],
    firstChecks: [
      "Проверь, нет ли всплеска только на одном типе карт",
      "Убедись, что ошибка не маскирует другую проблему",
      "Покажи пользователю понятный следующий шаг",
    ],
    fixPlan: [
      "Добавь UX-подсказку: попробовать другую карту",
      "Не делай лишних повторных auto-retry",
      "Добавь короткую статью в help center",
    ],
    supportTemplate:
      "Hello support team. We are seeing insufficient_funds responses and want to confirm there is no provider-side misclassification in recent attempts.",
    seoTerms: ["insufficient funds stripe", "shopify insufficient funds", "card has insufficient funds"],
  },
  {
    canonicalCode: "do_not_honor",
    title: "Банк отклонил операцию по внутренним правилам",
    description: "Issuer rejected the payment under internal bank rules",
    severity: "high",
    supportedSources: ["stripe", "shopify", "shopify_payments"],
    confidenceBase: 77,
    probableImpact: "Часть реальных покупателей теряет возможность оплатить без понятной причины.",
    humanExplanation:
      "Это общий банковский отказ, при котором банк не раскрывает деталей.",
    likelyCauses: [
      "Риск-фильтры банка",
      "Нетипичная география или устройство покупателя",
      "Слишком много попыток за короткий период",
    ],
    firstChecks: [
      "Сравни долю отказов по странам и устройствам",
      "Проверь влияние недавних изменений checkout",
      "Подготовь fallback: другая карта или payment method",
    ],
    fixPlan: [
      "Добавь альтернативный способ оплаты",
      "Проверь коммуникацию ошибок для покупателя",
      "Собери образцы order/session data",
      "Попроси провайдера проверить risk signals",
    ],
    supportTemplate:
      "Hello support team. We see repeated do_not_honor declines. Please confirm whether issuer-side or provider-side risk patterns explain these events.",
    seoTerms: ["do not honor stripe", "do not honor shopify", "issuer declined do not honor"],
  },
  {
    canonicalCode: "incorrect_cvc",
    title: "Неверный CVC/CVV код",
    description: "Customer entered an invalid card security code",
    severity: "medium",
    supportedSources: ["stripe", "shopify", "shopify_payments"],
    confidenceBase: 94,
    probableImpact: "Покупатель не проходит оплату, но интеграция обычно работает нормально.",
    humanExplanation:
      "Провайдер получил неверный код безопасности карты.",
    likelyCauses: [
      "Покупатель ввёл неправильный CVC",
      "Сохранённая карта устарела",
      "Непонятный UX поля CVC",
    ],
    firstChecks: [
      "Проверь всплеск после изменения checkout UI",
      "Проверь мобильную версию поля CVC",
      "Улучши текст ошибки для пользователя",
    ],
    fixPlan: [
      "Покажи inline-help для поля CVC",
      "Сократи число лишних шагов до повторной попытки",
      "Протестируй мобильные формы оплаты",
    ],
    supportTemplate:
      "Hello support team. We are seeing incorrect_cvc failures and want to confirm these are customer-entry issues rather than an integration-side problem.",
    seoTerms: ["incorrect cvc stripe", "incorrect cvv shopify", "payment failed incorrect cvc"],
  },
  {
    canonicalCode: "payouts_paused",
    title: "Выплаты приостановлены",
    description: "Payouts are temporarily paused pending review or verification",
    severity: "critical",
    supportedSources: ["shopify", "shopify_payments"],
    confidenceBase: 84,
    probableImpact: "Магазин может продавать, но выплаты остаются замороженными.",
    humanExplanation:
      "Провайдер временно приостановил выплаты. Обычно это связано с верификацией бизнеса или проверкой compliance.",
    likelyCauses: [
      "Не завершена верификация бизнеса",
      "Нужны дополнительные документы",
      "Провайдер инициировал review аккаунта",
      "Недавно изменились данные компании или банка",
    ],
    firstChecks: [
      "Проверь баннеры и action items в Shopify admin",
      "Проверь последние письма от провайдера",
      "Сверь юридические и банковские данные",
    ],
    fixPlan: [
      "Собери список недостающих документов",
      "Проверь совпадение реквизитов компании",
      "Подготовь краткое резюме бизнеса для support",
      "Назначь owner на закрытие verification items в течение 24 часов",
    ],
    supportTemplate:
      "Hello support team. Our payouts are currently paused. Please confirm the exact verification or compliance items still required and whether any blockers are visible from your side.",
    seoTerms: ["shopify payouts paused", "shopify payments payouts paused", "payments verification required shopify"],
  },
  {
    canonicalCode: "payment_failed",
    title: "Неуспешная оплата в checkout",
    description: "Generic checkout payment failure",
    severity: "high",
    supportedSources: ["stripe", "shopify", "shopify_payments"],
    confidenceBase: 74,
    probableImpact: "Пользователь не может завершить покупку, а магазин теряет конверсию.",
    humanExplanation:
      "Это общее описание сбоя на checkout. Нужно сузить причину: провайдер, браузер, настройки checkout или кастомизация.",
    likelyCauses: [
      "Частный decline code скрыт за общим сообщением",
      "Ошибка на стороне checkout integration",
      "Конфликт app, extension или кастомного скрипта",
      "Проблема в конкретном браузере или устройстве",
    ],
    firstChecks: [
      "Посмотри журналы ошибок и сырые сообщения провайдера",
      "Сравни, где именно падает flow",
      "Проверь недавние изменения темы и checkout extensions",
    ],
    fixPlan: [
      "Включи подробное логирование на checkout",
      "Повтори сценарий в test mode",
      "Отключи недавние кастомные элементы по одному",
      "Раздели проблему по браузерам и payment methods",
    ],
    supportTemplate:
      "Hello support team. We see generic payment_failed behavior during checkout and need help isolating whether the issue comes from the provider, checkout configuration, or a merchant-side customization.",
    seoTerms: ["shopify payment failed", "checkout failed shopify", "payment failed stripe checkout"],
  },
  {
    canonicalCode: "verification_required",
    title: "Требуется дополнительная верификация аккаунта",
    description: "Account verification is required by the payment provider",
    severity: "critical",
    supportedSources: ["stripe", "shopify", "shopify_payments"],
    confidenceBase: 82,
    probableImpact: "Часть функций аккаунта ограничена, возможны проблемы с выплатами или платежами.",
    humanExplanation:
      "Платёжный провайдер требует дополнительную проверку аккаунта, бизнеса или владельца.",
    likelyCauses: [
      "Не хватает документов KYC/KYB",
      "Изменились данные бизнеса или банка",
      "Провайдер инициировал compliance review",
    ],
    firstChecks: [
      "Проверь action items в админке и email",
      "Сверь юридические данные и банковские реквизиты",
      "Убедись, кто в команде владеет документами",
    ],
    fixPlan: [
      "Собери все требуемые документы в одном месте",
      "Проверь читаемость и совпадение реквизитов",
      "Зафиксируй дату submission",
      "Если review затянулся — открой support case",
    ],
    supportTemplate:
      "Hello support team. Our account shows verification_required. Please confirm the exact remaining compliance items and whether any blockers are preventing review completion.",
    seoTerms: ["verification required stripe", "shopify payments verification required", "account verification payment provider"],
  },
];

async function main() {
  for (const rule of rules) {
    await prisma.diagnosticRule.upsert({
      where: { canonicalCode: rule.canonicalCode },
      update: rule,
      create: rule,
    });
  }

  console.log(`Seeded ${rules.length} diagnostic rules.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
