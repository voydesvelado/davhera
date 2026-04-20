"use client";

interface CaseStudyFooterProps {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function CaseStudyFooter({ title, subtitle, ctaLabel, ctaHref }: CaseStudyFooterProps) {
  return (
    <footer className="px-6 py-16 border-t border-stone-200">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <p className="text-2xl font-bold mb-1" style={{ color: "#F97316", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</p>
          <p className="text-xs text-stone-400">{subtitle}</p>
        </div>
        <div className="flex gap-3">
          <a href="/" className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white rounded-lg border border-stone-200 hover:border-stone-300 active:scale-95 transition-all">← Portfolio</a>
          {ctaLabel && ctaHref && (
            <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-xs font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 active:scale-95 transition-all">{ctaLabel}</a>
          )}
        </div>
      </div>
    </footer>
  );
}
