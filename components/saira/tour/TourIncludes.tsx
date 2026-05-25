import { useTranslations } from "next-intl";
import { Check, Backpack } from "lucide-react";

export function TourIncludes({ slug }: { slug: string }) {
  const t = useTranslations(`tours.${slug}`);
  const tCommon = useTranslations("common");

  const included = t.raw("whatsIncluded") as string[];
  const toBring = t.raw("whatToBring") as string[];

  return (
    <div className="saira-tour-includes">
      <div className="saira-tour-includes-col">
        <h2 className="saira-tour-section-title">
          <Check className="saira-tour-section-icon" aria-hidden="true" />
          {tCommon("includes")}
        </h2>
        <ul className="saira-tour-list">
          {included.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="saira-tour-includes-col">
        <h2 className="saira-tour-section-title">
          <Backpack className="saira-tour-section-icon" aria-hidden="true" />
          {tCommon("bringWith")}
        </h2>
        <ul className="saira-tour-list">
          {toBring.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
