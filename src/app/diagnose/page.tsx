import AppHeader from "@/components/AppHeader";
import { DiagnoseForm } from "@/components/DiagnoseForm";

export default async function DiagnosePage({
  searchParams,
}: {
  searchParams: Promise<{ issue?: string }>;
}) {
  const params = await searchParams;
  const initialIssue = params.issue ?? "authentication_required";

  return (
    <main className="page-shell">
      <AppHeader />
      <DiagnoseForm initialIssue={initialIssue} />
    </main>
  );
}