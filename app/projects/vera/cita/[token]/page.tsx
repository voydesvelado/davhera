import { CitaPageClient } from "./CitaPageClient";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function CitaPage({ params }: PageProps) {
  const { token } = await params;
  return <CitaPageClient token={token} />;
}
