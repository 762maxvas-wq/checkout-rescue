import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export default function HomePage() {
  return (
    <main className="page-shell">
      <AppHeader />

      <section className="hero-grid">
        <div
          className="app-card"
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: 520,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(circle at 12% 18%, rgba(79, 140, 255, 0.20), transparent 24%), radial-gradient(circle at 88% 22%, rgba(56, 189, 248, 0.14), transparent 18%), linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
            }}
          />

          <div
            style={{
              position: "absolute",
              right: -40,
              top: 50,
              width: 360,
              height: 360,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(79,140,255,0.18) 0%, rgba(79,140,255,0.04) 45%, transparent 72%)",
              filter: "blur(8px)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="display-eyebrow">
              <span className="app-badge">Диагностика ошибок оплаты</span>
            </div>

            <h1 className="section-title" style={{ maxWidth: 640 }}>
              Ошибки оплаты
              <br />
              в Stripe и Shopify
            </h1>

            <p className="hero-lead" style={{ maxWidth: 620, marginTop: 18 }}>
              Получите ответ, почему не проходит платёж: введите код ошибки и
              узнайте вероятные причины и первые шаги к решению.
            </p>

            <div
              className="app-actions"
              style={{ marginTop: 28, marginBottom: 30 }}
            >
              <Link href="/diagnose" className="app-link-button">
                Запустить диагностику
              </Link>

              <Link
                href="/knowledge-base"
                className="app-link-button app-link-button--ghost"
              >
                Открыть базу знаний
              </Link>
            </div>
          </div>

          <div
            className="kpi-grid"
            style={{ position: "relative", zIndex: 1, marginTop: 10 }}
          >
            <div className="kpi-card">
              <div className="kpi-card__value">3 бесплатно</div>
              <div className="kpi-card__label">первых разбора без оплаты</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card__value">Быстрый старт</div>
              <div className="kpi-card__label">
                первый ориентир по ошибке за пару минут
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card__value">Pro-доступ</div>
              <div className="kpi-card__label">
                полный сценарий диагностики без лимита
              </div>
            </div>
          </div>
        </div>

        <div
          className="app-card"
          style={{
            minHeight: 520,
            display: "grid",
            alignContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                marginTop: 0,
                marginBottom: 12,
                fontSize: 30,
                letterSpacing: "-0.03em",
              }}
            >
              Что вы получаете
            </h2>

            <p className="section-subtitle" style={{ marginBottom: 22 }}>
              Один понятный маршрут от ошибки к решению — без хаоса и лишних
              действий.
            </p>

            <div className="stack-md">
              <div className="soft-card">
                <h3>Понятный разбор</h3>
                <p>
                  Вводите код ошибки и контекст, а сервис возвращает severity,
                  confidence, вероятные причины и первые рабочие проверки.
                </p>
              </div>

              <div className="soft-card">
                <h3>База знаний</h3>
                <p>
                  Быстро переходите к статье по коду ошибки и глубже понимаете,
                  что произошло и как действовать дальше.
                </p>
              </div>

              <div className="soft-card">
                <h3>История кейсов</h3>
                <p>
                  Все прошлые разборы сохраняются в аккаунте, чтобы можно было
                  вернуться к проблеме и повторить диагностику в пару кликов.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <div className="app-card">
          <div className="page-kicker">
            <span className="app-badge">How it works</span>
          </div>

          <h2 className="page-section-title">Как работает Checkout Rescue</h2>

          <p className="section-subtitle" style={{ marginBottom: 24 }}>
            Сервис помогает быстро перейти от расплывчатой checkout-проблемы к
            понятному сценарию действий.
          </p>

          <div className="feature-grid">
            <div className="feature-card">
              <h3>1. Вводите проблему</h3>
              <p>
                Указываете платформу, код ошибки и контекст, чтобы сервис понял,
                о каком сценарии оплаты идёт речь.
              </p>
            </div>

            <div className="feature-card">
              <h3>2. Получаете разбор</h3>
              <p>
                Система показывает severity, confidence, likely causes и first
                checks, чтобы можно было быстро сориентироваться.
              </p>
            </div>

            <div className="feature-card">
              <h3>3. Переходите к решению</h3>
              <p>
                В Pro открывается полный fix-plan, шаблон обращения в поддержку
                и более глубокий рабочий сценарий.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <div className="app-card">
          <div className="page-kicker">
            <span className="app-badge">Why teams use it</span>
          </div>

          <h2 className="page-section-title">
            Почему это удобно в реальной работе
          </h2>

          <p className="section-subtitle" style={{ marginBottom: 24 }}>
            Checkout Rescue создан не ради красивой витрины, а ради скорости,
            ясности и уверенности в ежедневной работе с оплатами.
          </p>

          <div className="feature-grid">
            <div className="feature-card">
              <h3>Меньше ручного поиска</h3>
              <p>
                Вместо долгого блуждания по логам и документации вы сразу
                получаете понятное направление и первый набор проверок.
              </p>
            </div>

            <div className="feature-card">
              <h3>Быстрее принятие решений</h3>
              <p>
                Видно, насколько проблема критична, что вероятнее всего её
                вызвало и с чего разумнее начать.
              </p>
            </div>

            <div className="feature-card">
              <h3>Путь к Pro понятен</h3>
              <p>
                Бесплатный режим позволяет оценить продукт, а платный тариф
                открывает полный рабочий сценарий без ограничений.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}