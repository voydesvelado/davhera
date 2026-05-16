import { ReagendarPageClient } from "./ReagendarPageClient";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function ReagendarPage({ params }: PageProps) {
  const { token } = await params;
  return <ReagendarPageClient token={token} />;
}
