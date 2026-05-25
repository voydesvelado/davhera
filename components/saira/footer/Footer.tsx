import { useTranslations } from "next-intl";
import { SairaLogo } from "@/components/saira/header/SairaLogo";
import { LanguageSwitcher } from "@/components/saira/header/LanguageSwitcher";

// Contacto real del catálogo PDF de Saira (junio 2024).
const WHATSAPP_NUMBER = "5521977086637"; // sin + ni espacios para wa.me
const EMAIL = "sairaecotour@gmail.com";
const INSTAGRAM = "saira.ecotour";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="saira-footer" aria-labelledby="footer-brand">
      <div className="saira-footer-inner">
        <div className="saira-footer-brand-col">
          <div className="saira-footer-brand" id="footer-brand">
            <SairaLogo size={28} className="saira-footer-logo" />
            <span className="saira-footer-wordmark">Saira</span>
          </div>
          <p className="saira-footer-tagline">{t("tagline")}</p>
        </div>

        <div className="saira-footer-col">
          <h3 className="saira-footer-col-title">{t("reservations")}</h3>
          <ul className="saira-footer-list">
            <li>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="saira-footer-link"
              >
                WhatsApp · +55 21 97708-6637
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="saira-footer-link">
                {EMAIL}
              </a>
            </li>
          </ul>
        </div>

        <div className="saira-footer-col">
          <h3 className="saira-footer-col-title">{t("followUs")}</h3>
          <ul className="saira-footer-list">
            <li>
              <a
                href={`https://instagram.com/${INSTAGRAM}`}
                target="_blank"
                rel="noopener noreferrer"
                className="saira-footer-link"
              >
                @{INSTAGRAM}
              </a>
            </li>
          </ul>
        </div>

        <div className="saira-footer-col saira-footer-lang">
          <LanguageSwitcher />
        </div>
      </div>

      <div className="saira-footer-bottom">
        <p className="saira-footer-rights">
          © {year} Saira Ecotour · {t("rights")}
        </p>
      </div>
    </footer>
  );
}
