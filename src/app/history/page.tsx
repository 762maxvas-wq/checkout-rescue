import AppHeader from "@/components/AppHeader";
import { HistoryList } from "@/components/HistoryList";

export default function HistoryPage() {
  return (
    <main className="page-shell">
      <AppHeader />

      <section className="app-card" style={{ marginBottom: 24 }}>
        <div className="page-kicker">
          <span className="app-badge">History</span>
        </div>

        <h1 className="page-section-title">История проверок</h1>

        <p className="section-subtitle">
          Здесь хранятся последние сохранённые запуски диагностики по твоему
          аккаунту. Можно возвращаться к прошлым кейсам и быстро повторять
          разбор.
        </p>
      </section>

      <HistoryList />
    </main>
  );
}