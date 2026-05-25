import { Link } from "@/app/proyectos/saira/lib/i18n/navigation";
import { SairaLogo } from "./SairaLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  return (
    <header className="saira-header">
      <Link href="/" className="saira-header-brand" aria-label="Saira · inicio">
        <SairaLogo size={26} className="saira-header-logo" />
        <span className="saira-header-wordmark">Saira</span>
      </Link>
      <LanguageSwitcher />
    </header>
  );
}
