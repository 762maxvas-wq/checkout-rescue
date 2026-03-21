"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type HistoryItem = {
  id: string;
  createdAt: string;
  issueInput: string;
  canonicalCode: string;
  title: string;
  source: string;
  severity: string;
  confidence: number;
  probableImpact: string;
  humanExplanation: string;
};

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString("ru-RU", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}

export function HistoryList() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadHistory() {
      try {
        const res = await fetch("/api/history", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!mounted) return;

        if (res.ok && data?.ok && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          setItems([]);
        }
      } catch {
        if (!mounted) return;
        setItems([]);
      } finally {
        if (mounted) {
          setLoaded(true);
        }
      }
    }

    loadHistory();

    return () => {
      mounted = false;
    };
  }, []);

  if (!loaded) {
    return (
      <div className="app-card">
        <h2 style={{ marginTop: 0, fontSize: 30 }}>Загружаем историю...</h2>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="app-card">
        <h2 style={{ marginTop: 0, fontSize: 32, letterSpacing: "-0.03em" }}>
          История пока пуста
        </h2>

        <p
          className="app-secondary"
          style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 20 }}
        >
          Запусти хотя бы одну диагностику, и здесь появятся сохранённые кейсы.
          Потом можно будет быстро возвращаться к прошлым разборам.
        </p>

        <div className="app-actions">
          <Link href="/diagnose" className="app-link-button">
            Перейти к диагностике
          </Link>

          <Link href="/kb" className="app-link-button app-link-button--ghost">
            Открыть базу знаний
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="stack-md">
      <div className="app-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 6px 0",
                fontSize: 30,
                letterSpacing: "-0.03em",
              }}
            >
              Сохранённые разборы
            </h2>
            <div className="app-secondary">
              Всего запусков в истории: {items.length}
            </div>
          </div>
        </div>
      </div>

      {items.map((item) => (
        <article key={item.id} className="app-card hover-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              alignItems: "flex-start",
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <div>
              <div
                className="app-muted"
                style={{
                  fontSize: 13,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {formatDate(item.createdAt)}
              </div>

              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: 30,
                  letterSpacing: "-0.03em",
                }}
              >
                {item.title}
              </h3>

              <div className="app-secondary">
                {item.source} • {item.canonicalCode}
              </div>
            </div>

            <div className="stat-pill">Severity: {item.severity}</div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div className="soft-card">
              <div className="app-muted" style={{ marginBottom: 6 }}>
                Введённый issue
              </div>
              <div style={{ fontWeight: 800 }}>{item.issueInput}</div>
            </div>

            <div className="soft-card">
              <div className="app-muted" style={{ marginBottom: 6 }}>
                Confidence
              </div>
              <div style={{ fontWeight: 800 }}>{item.confidence}%</div>
            </div>
          </div>

          <p
            className="app-secondary"
            style={{ marginTop: 0, lineHeight: 1.8, marginBottom: 12 }}
          >
            {item.humanExplanation}
          </p>

          <p
            className="app-secondary"
            style={{ marginTop: 0, lineHeight: 1.8, marginBottom: 18 }}
          >
            <strong>Влияние:</strong> {item.probableImpact}
          </p>

          <div className="app-actions">
            <Link
              href={`/diagnose?issue=${item.issueInput}`}
              className="app-link-button"
            >
              Повторить диагностику
            </Link>

            <Link
              href={`/kb/${item.canonicalCode}`}
              className="app-link-button app-link-button--ghost"
            >
              Открыть статью
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}