import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="auth-page">
      <div className="auth-page__center">
        <SignUp />
      </div>
    </main>
  );
}