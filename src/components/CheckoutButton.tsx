"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  async function handleCheckout() {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=/pricing");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/billing/checkout", {
        method: "POST",
      });

      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        router.push("/sign-in?redirect_url=/pricing");
        return;
      }

      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Не удалось открыть страницу оплаты");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("checkout button failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Не удалось открыть оплату. Проверь настройки Stripe."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading || !isLoaded}
      className="app-link-button"
    >
      {loading ? "Переходим к оплате..." : "Оформить Pro"}
    </button>
  );
}