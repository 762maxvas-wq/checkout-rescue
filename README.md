# Checkout Rescue

Диагностический SaaS для ошибок Shopify + Stripe / Shopify Payments.

Что уже есть в этом каркасе:
- диагностика по 8 типовым кейсам;
- Prisma + PostgreSQL;
- Clerk auth;
- free limit `1 diagnose / day`;
- Stripe Checkout + webhook;
- история кейсов;
- публичные KB-страницы `/kb/[code]`;
- KB-индекс `/kb`.

## Быстрый старт

1. Скопируй `.env.example` в `.env.local` и заполни ключи.
2. Установи зависимости:

```bash
npm install
```

3. Сгенерируй Prisma client и миграцию:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Залей стартовые rules:

```bash
npm run prisma:seed
```

5. Запусти проект:

```bash
npm run dev
```

## Что можно делать дальше

- подключить красивый UI-kit вместо базовой разметки;
- добавить реальную страницу paywall на KB;
- добавить `/sitemap.xml` и `robots.txt`;
- расширить rule-base;
- добавить AI-слой поверх rule-engine.
