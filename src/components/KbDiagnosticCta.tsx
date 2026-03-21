"use client";

export function KbDiagnosticCta({ code }: { code: string }) {
  function handleOpenDiagnose() {
    const url = new URL(window.location.origin);
    url.pathname = "/";
    url.searchParams.set("issue", code);
    window.location.href = url.toString();
  }

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <h3 style={{ marginTop: 0 }}>Проверь свой кейс прямо сейчас</h3>
      <p>
        Если у тебя похожая ошибка, запусти диагностику и получи базовый результат бесплатно.
        Полный fix-plan откроется в Pro.
      </p>
      <button className="button button-primary" onClick={handleOpenDiagnose}>
        Запустить диагностику
      </button>
    </div>
  );
}
