import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { activateProPlanFromCheckoutSession } from "@/lib/billing";

type BillingSuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function BillingSuccessPage({
  searchParams,
}: BillingSuccessPageProps) {
  const { session_id } = await searchParams;

  let activated = false;
  let errorMessage = "";

  if (session_id) {
    try {
      await activateProPlanFromCheckoutSession(session_id);
      activated = true;
    } catch (error) {
      console.error("billing success activation failed:", error);
      errorMessage =
        error instanceof Error
          ? error.message
          : "Не удалось завершить активацию тарифа";
    }
  } else {
    errorMessage = "Не удалось подтвердить статус оплаты";
  }

  return (
    <main className="page-shell">
      <AppHeader />

      <section
        className="app-card"
        style={{
          maxWidth: 820,
          margin: "0 auto",
        }}
      >
        <div className="page-kicker">
          <span className="app-badge">Billing</span>
        </div>

        <h1 className="page-section-title">
          {activated ? "Pro успешно активирован" : "Оплата получена"}
        </h1>

        <p className="section-subtitle" style={{ marginBottom: 24 }}>
          {activated
            ? "Спасибо! Подписка Checkout Rescue Pro активирована, и расширенный доступ уже доступен в вашем аккаунте."
            : "Платёж был обработан, но подтверждение тарифа ещё не завершено. Попробуйте открыть личный кабинет или вернуться позже."}
        </p>

        {activated ? (
          <div className="soft-card" style={{ marginBottom: 20 }}>
            <h3 style={{ marginTop: 0 }}>Что теперь доступно</h3>
            <ul className="list-tight app-secondary">
              <li>полный сценарий диагностики</li>
              <li>расширенный fix-plan</li>
              <li>support template</li>
              <li>история сохранённых кейсов</li>
              <li>безлимитные разборы</li>
            </ul>
          </div>
        ) : (
          <div className="soft-card" style={{ marginBottom: 20 }}>
            <h3 style={{ marginTop: 0 }}>Что можно сделать</h3>
            <p className="app-secondary" style={{ marginBottom: 10 }}>
              Откройте личный кабинет и проверьте текущий статус тарифа. Если
              доступ не обновился, попробуйте вернуться немного позже.
            </p>

            <p className="app-secondary" style={{ marginBottom: 0 }}>
              {errorMessage}
            </p>
          </div>
        )}

        <div className="app-actions">
          <Link href="/account" className="app-link-button">
            Открыть кабинет
          </Link>

          <Link
            href="/pricing"
            className="app-link-button app-link-button--ghost"
          >
            Вернуться к тарифам
          </Link>
        </div>
      </section>
    </main>
  );
}