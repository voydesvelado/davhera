import { useTranslations } from "next-intl";
import type { Tour } from "@/lib/saira/types";

export function TourDescription({ tour }: { tour: Tour }) {
  const t = useTranslations(`tours.${tour.slug}`);

  return (
    <section className="saira-tour-description">
      <p className="saira-tour-description-short">{t("shortDescription")}</p>
      <div className="saira-tour-description-long">
        {t("longDescription")
          .split("\n\n")
          .map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
      </div>
    </section>
  );
}
