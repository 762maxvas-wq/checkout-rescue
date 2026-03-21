"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { DiagnoseResponse, PlatformSource } from "@/lib/types";
import { UpgradeButton } from "@/components/UpgradeButton";

export function DiagnoseForm({
  initialIssue = "authentication_required",
}: {
  initialIssue?: string;
}) {
  const [source, setSource] = useState<PlatformSource>("shopify");
  const [issueInput, setIssueInput] = useState(initialIssue);
  const [context, setContext] = useState(
    "Shopify store. Stripe payment fails after 3DS challenge."
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnoseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [freeLimitReached, setFreeLimitReached] = useState(false);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setFreeLimitReached(false);
    setLimitMessage(null);

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          issueInput,
          context,
        }),
      });

      let data: DiagnoseResponse | { message?: string; error?: string };

      try {
        data = await res.json();
      } catch {
        throw new Error("Сервер вернул некорректный ответ");
      }

      if (!res.ok) {
        const apiError =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : null;

        const message =
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof data.message === "string"
            ? data.message
            : apiError || "Request failed";

        if (res.status === 403 && apiError === "free_limit_reached") {
          setFreeLimitReached(true);
          setLimitMessage(message);
          return;
        }

        throw new Error(message);
      }

      const typedData = data as DiagnoseResponse;
      setResult(typedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="stack-lg">
      <section className="split-grid">
        <div className="app-card">
          <div className="display-eyebrow">
            <span className="app-badge">Diagnose</span>
          </div>

          <h1 className="section-title">Почему не проходит оплата</h1>

          <p className="hero-lead">
            Введите код ошибки и контекст заказа, чтобы получить понятный
            разбор: уровень критичности, confidence, вероятные причины и первые
            шаги для проверки.
          </p>

          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-card__value">Stripe</div>
              <div className="kpi-card__label">payment diagnostics</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card__value">Shopify</div>
              <div className="kpi-card__label">checkout cases</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card__value">Fast</div>
              <div className="kpi-card__label">first checks</div>
            </div>
          </div>
        </div>

        <div className="app-card">
          <h2 style={{ marginTop: 0, fontSize: 30, letterSpacing: "-0.03em" }}>
            Что покажет разбор
          </h2>

          <ul className="list-tight app-secondary" style={{ marginBottom: 18 }}>
            <li>понятное объяснение ошибки</li>
            <li>уровень критичности и confidence</li>
            <li>вероятные причины отказа</li>
            <li>первые шаги для проверки</li>
          </ul>

          <div className="soft-card">
            <div
              className="app-muted"
              style={{
                fontSize: 13,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Пример кейса
            </div>

            <div style={{ fontWeight: 800, marginBottom: 8 }}>
              authentication_required
            </div>

            <p style={{ margin: 0 }}>
              Частый сценарий: клиент не завершил 3DS / SCA challenge, и оплата
              остановилась на этапе подтверждения.
            </p>
          </div>
        </div>
      </section>

      <section className="app-card">
        <form onSubmit={handleSubmit} className="stack-md">
          <div className="form-grid">
            <label className="field">
              <div className="field__label">Источник</div>
              <select
                value={source}
                disabled={loading}
                onChange={(e) => setSource(e.target.value as PlatformSource)}
              >
                <option value="shopify">Shopify</option>
                <option value="stripe">Stripe</option>
                <option value="shopify_payments">Shopify Payments</option>
              </select>
            </label>

            <label className="field">
              <div className="field__label">Код ошибки</div>
              <input
                value={issueInput}
                disabled={loading}
                onChange={(e) => setIssueInput(e.target.value)}
                placeholder="authentication_required"
              />
            </label>

            <label className="field field--full">
              <div className="field__label">Контекст</div>
              <textarea
                value={context}
                disabled={loading}
                onChange={(e) => setContext(e.target.value)}
                rows={7}
              />
            </label>
          </div>

          <div className="app-actions">
            <button
              type="submit"
              disabled={loading}
              className="app-button"
              style={{
                opacity: loading ? 0.8 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Готовим разбор..." : "Начать разбор"}
            </button>

            <Link href="/kb" className="app-link-button app-link-button--ghost">
              Открыть базу знаний
            </Link>

            <Link
              href="/history"
              className="app-link-button app-link-button--ghost"
            >
              Открыть историю
            </Link>
          </div>
        </form>
      </section>

      {freeLimitReached && (
        <section
          className="app-card"
          style={{
            border: "1px solid rgba(37, 99, 235, 0.22)",
            boxShadow: "0 20px 50px rgba(37, 99, 235, 0.10)",
          }}
        >
          <div className="page-kicker">
            <span className="app-badge">Upgrade</span>
          </div>

          <h2
            style={{
              marginTop: 0,
              marginBottom: 12,
              fontSize: 34,
              letterSpacing: "-0.03em",
            }}
          >
            Бесплатный лимит использован
          </h2>

          <p className="section-subtitle" style={{ maxWidth: "100%" }}>
            {limitMessage ||
              "Free plan includes 3 diagnoses. Upgrade to Pro to continue."}
          </p>

          <div
            className="feature-grid"
            style={{
              gridTemplateColumns: "1fr 1fr",
              alignItems: "stretch",
              marginTop: 20,
            }}
          >
            <div className="soft-card">
              <h3 style={{ marginTop: 0 }}>Что уже было доступно бесплатно</h3>
              <ul className="list-tight app-secondary">
                <li>3 бесплатных разбора</li>
                <li>базовая диагностика ошибки</li>
                <li>severity и confidence</li>
                <li>likely causes и first checks</li>
              </ul>
            </div>

            <div className="soft-card">
              <h3 style={{ marginTop: 0 }}>Что откроет Pro</h3>
              <ul className="list-tight app-secondary">
                <li>безлимитные разборы</li>
                <li>полный fix-plan</li>
                <li>support template</li>
                <li>расширенный рабочий сценарий</li>
              </ul>
            </div>
          </div>

          <div className="app-actions" style={{ marginTop: 22 }}>
            <UpgradeButton />

            <Link
              href="/pricing"
              className="app-link-button app-link-button--ghost"
            >
              Посмотреть тарифы
            </Link>
          </div>
        </section>
      )}

      {error && (
        <section className="app-card app-card--danger">
          <div className="app-badge" style={{ marginBottom: 12 }}>
            Error
          </div>

          <div style={{ color: "var(--danger-text)" }}>
            <strong>Ошибка:</strong> {error}
          </div>
        </section>
      )}

      {result && (
        <section className="result-layout">
          <article className="app-card">
            <div
              className="app-muted"
              style={{
                fontSize: 13,
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Result
            </div>

            <h2
              style={{
                margin: "0 0 8px 0",
                fontSize: 42,
                letterSpacing: "-0.04em",
              }}
            >
              {result.result.title}
            </h2>

            <p className="app-secondary" style={{ marginTop: 0 }}>
              {result.result.sourceLabel} • {result.result.canonicalCode}
            </p>

            <div className="metric-grid">
              <div className="metric-card">
                <div className="metric-card__label">Severity</div>
                <div className="metric-card__value">
                  {result.result.severity}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-card__label">Confidence</div>
                <div className="metric-card__value">
                  {result.result.confidence}%
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-card__label">Free left</div>
                <div className="metric-card__value">
                  {typeof result.remainingFreeRuns !== "undefined" &&
                  result.remainingFreeRuns !== null
                    ? result.remainingFreeRuns
                    : "∞"}
                </div>
              </div>
            </div>

            <p style={{ lineHeight: 1.8 }}>
              <strong>Что это значит:</strong> {result.result.humanExplanation}
            </p>

            <p style={{ lineHeight: 1.8 }}>
              <strong>Влияние:</strong> {result.result.probableImpact}
            </p>

            <section style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 24, letterSpacing: "-0.02em" }}>
                Likely causes
              </h3>
              <ul className="list-tight">
                {result.result.likelyCauses.map((item, index) => (
                  <li key={`${index}-${item}`}>{item}</li>
                ))}
              </ul>
            </section>

            <section style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 24, letterSpacing: "-0.02em" }}>
                First checks
              </h3>
              <ul className="list-tight">
                {result.result.firstChecks.map((item, index) => (
                  <li key={`${index}-${item}`}>{item}</li>
                ))}
              </ul>
            </section>
          </article>

          <aside className="sidebar-stack">
            <div className="app-card">
              <div
                className="app-muted"
                style={{
                  fontSize: 13,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Full resolve
              </div>

              <h3
                style={{
                  marginTop: 0,
                  fontSize: 28,
                  letterSpacing: "-0.03em",
                }}
              >
                Полный разбор
              </h3>

              <p className="app-secondary" style={{ lineHeight: 1.75 }}>
                Расширенный доступ открывает пошаговый fix-plan, шаблон
                обращения в поддержку и более глубокий разбор кейса.
              </p>

              {result.result.isPremiumLocked ? (
                <>
                  <ul
                    className="list-tight app-secondary"
                    style={{ marginBottom: 20 }}
                  >
                    <li>пошаговый fix-plan</li>
                    <li>support template</li>
                    <li>история похожих кейсов</li>
                    <li>приоритетный доступ к расширенному разбору</li>
                  </ul>

                  <UpgradeButton />
                </>
              ) : (
                <>
                  <div style={{ marginBottom: 18 }}>
                    <strong>Fix plan:</strong>
                    <ul className="list-tight">
                      {result.result.fixPlan?.map((item, index) => (
                        <li key={`${index}-${item}`}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <p style={{ lineHeight: 1.75 }}>
                    <strong>Support template:</strong>{" "}
                    {result.result.supportTemplate}
                  </p>
                </>
              )}
            </div>

            <div className="app-card">
              <h3
                style={{ marginTop: 0, fontSize: 24, letterSpacing: "-0.02em" }}
              >
                Следующий шаг
              </h3>

              <p className="app-secondary" style={{ lineHeight: 1.75 }}>
                После разбора можно вернуться в историю, повторить диагностику
                или открыть статью по коду ошибки в базе знаний.
              </p>
            </div>
          </aside>
        </section>
      )}
    </div>
  );
}