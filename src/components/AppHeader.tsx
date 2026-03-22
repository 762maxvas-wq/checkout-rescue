"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { PlanStatusPill } from "@/components/PlanStatusPill";

const navItems = [
  { href: "/diagnose", label: "Диагностика" },
  { href: "/history", label: "История" },
  { href: "/kb", label: "База знаний" },
  { href: "/pricing", label: "Тарифы" },
];

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="app-header">
      <div className="app-brand">
        <Link href="/" className="app-brand__title">
          Checkout Rescue
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <nav className="app-nav">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`app-nav__link ${
                  isActive ? "app-nav__link--active" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <SignedIn>
            <Link
              href="/account"
              className={`app-nav__link ${
                pathname === "/account" ? "app-nav__link--active" : ""
              }`}
            >
              Кабинет
            </Link>
          </SignedIn>
        </nav>

        <SignedOut>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              href="/sign-in"
              className="app-link-button app-link-button--ghost"
            >
              Войти
            </Link>

            <Link
              href="/sign-up"
              className="app-link-button app-link-button--ghost"
            >
              Зарегистрироваться
            </Link>

            <Link href="/pricing" className="app-link-button">
              Купить Pro
            </Link>
          </div>
        </SignedOut>

        <SignedIn>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <PlanStatusPill />
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </div>
    </header>
  );
}