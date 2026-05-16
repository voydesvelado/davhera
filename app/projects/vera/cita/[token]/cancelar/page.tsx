import { CancelarPageClient } from "./CancelarPageClient";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function CancelarPage({ params }: PageProps) {
  const { token } = await params;
  return <CancelarPageClient token={token} />;
}
