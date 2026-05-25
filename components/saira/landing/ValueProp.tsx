import { useTranslations } from "next-intl";
import { ComparisonCard } from "./ComparisonCard";

export function ValueProp() {
  const t = useTranslations("valueProp");

  return (
    <section className="saira-valueprop" aria-labelledby="valueprop-title">
      <div className="saira-valueprop-inner">
        <div className="saira-valueprop-text">
          <span className="saira-section-eyebrow">02</span>
          <h2 id="valueprop-title" className="saira-section-title">
            {t("title")}
          </h2>
          <p className="saira-valueprop-body">{t("body")}</p>
        </div>

        <div className="saira-valueprop-card-wrap">
          <ComparisonCard />
        </div>
      </div>

      <p className="saira-valueprop-savings-line">
        <span className="saira-valueprop-savings-mark" aria-hidden="true">
          —
        </span>
        <span>{t("savings")}</span>
      </p>
    </section>
  );
}
