import { useTranslations } from "next-intl";
import { MapPin, ExternalLink } from "lucide-react";
import type { Tour } from "@/lib/saira/types";

export function TourMeetingPoint({ tour }: { tour: Tour }) {
  const t = useTranslations(`tours.${tour.slug}`);
  const tCommon = useTranslations("common");

  const meetingPoint = t("meetingPoint");
  const mapsUrl = tour.meetingPointMapsUrl;
  // El embed acepta query libre. Cuando David entregue coords reales y
  // se pueblen meetingPointMapsUrl, podemos pasar a un embed con place_id.
  const embedQuery = encodeURIComponent(meetingPoint + ", Rio de Janeiro");
  const embedSrc = `https://www.google.com/maps?q=${embedQuery}&output=embed`;

  return (
    <section className="saira-tour-meeting">
      <h2 className="saira-tour-section-title">
        <MapPin className="saira-tour-section-icon" aria-hidden="true" />
        {tCommon("meetingPoint")}
      </h2>

      <p className="saira-tour-meeting-text">{meetingPoint}</p>

      <div className="saira-tour-meeting-map">
        <iframe
          src={embedSrc}
          width="100%"
          height="320"
          style={{ border: 0, display: "block" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa · ${tour.name}`}
        />
      </div>

      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="saira-tour-meeting-link"
        >
          {tCommon("openInMaps")}
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      )}
    </section>
  );
}
