import AppHeader from "@/components/AppHeader";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { AccountPlanCard } from "@/components/AccountPlanCard";

export default async function AccountPage() {
  const user = await currentUser();

  const firstName =
    user?.firstName ||
    user?.username ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "Пользователь";

  const email = user?.emailAddresses?.[0]?.emailAddress ?? "Email не найден";

  return (
    <main className="page-shell">
      <AppHeader />

      <section className="app-card" style={{ marginBottom: 24 }}>
        <div className="page-kicker">
          <span className="app-badge">Account</span>
        </div>

        <h1 className="page-section-title">Личный кабинет</h1>

        <p className="section-subtitle">
          Здесь ты можешь управлять своим аккаунтом, отслеживать тариф, быстро
          возвращаться к истории разборов и переходить к расширенным
          возможностям Pro.
        </p>
      </section>

      <section
        className="feature-grid"
        style={{ gridTemplateColumns: "1.1fr 0.9fr", alignItems: "start" }}
      >
        <article className="app-card">
          <h2
            style={{
              marginTop: 0,
              marginBottom: 18,
              fontSize: 30,
              letterSpacing: "-0.03em",
            }}
          >
            Профиль
          </h2>

          <div className="stack-md">
            <div className="soft-card">
              <div className="app-muted" style={{ marginBottom: 6 }}>
                Имя
              </div>
              <div style={{ fontWeight: 800, fontSize: 20 }}>{firstName}</div>
            </div>

            <div className="soft-card">
              <div className="app-muted" style={{ marginBottom: 6 }}>
                Email
              </div>
              <div style={{ fontWeight: 700 }}>{email}</div>
            </div>

            <div className="soft-card">
              <div className="app-muted" style={{ marginBottom: 6 }}>
                Действия
              </div>
              <div className="app-actions">
                <UserButton afterSignOutUrl="/" />
                <Link
                  href="/history"
                  className="app-link-button app-link-button--ghost"
                >
                  Открыть историю
                </Link>
              </div>
            </div>
          </div>
        </article>

        <aside className="sidebar-stack">
          <AccountPlanCard />

          <div className="app-card">
            <h3
              style={{
                marginTop: 0,
                marginBottom: 12,
                fontSize: 24,
                letterSpacing: "-0.02em",
              }}
            >
              Что уже доступно
            </h3>

            <ul className="list-tight app-secondary">
              <li>личный вход через Clerk</li>
              <li>защищённый маршрут кабинета</li>
              <li>отображение текущего тарифа</li>
              <li>быстрый доступ к истории запусков</li>
              <li>готовность к переходу на Pro</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}