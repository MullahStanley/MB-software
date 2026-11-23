import React from 'react';
import { ArrowLeft, BookOpen, ExternalLink } from 'lucide-react';

const RESOURCES: { title: string; url: string; source: string }[] = [
  {
    title: "KCA University's Commitment to Mental Wellness",
    url: 'https://www.kcau.ac.ke/kca-universitys-commitment-to-mental-wellness',
    source: 'KCA University',
  },
  {
    title: 'KCA University Advances Research and Innovation in Mental Health Through Digital Solutions',
    url: 'https://www.kcau.ac.ke/kca-university-advances-research-and-innovation-in-mental-health-through-digital-solutions',
    source: 'KCA University',
  },
  {
    title: '2025 Year-End Reflection Workbook',
    url: 'https://drive.google.com/file/d/1xz9-Agta3vHqYyWFVK9OZO-HGOzCbnDH/view?usp=sharing',
    source: 'Mental Beacon',
  },
  {
    title: 'Q1 2026 Reflection Workbook',
    url: 'https://drive.google.com/file/d/1Dk-Yd7VEw7bQPejMmaZM-U4x8DYYZPE2/view?usp=sharing',
    source: 'Mental Beacon',
  },
];

export const UnderDevelopment: React.FC<{ onGoHome: () => void; onGoArticles: () => void }> = ({
  onGoHome,
}) => {
  return (
    <main className="flex-1 w-full bg-[#F4F1EA] text-[#2B2E2B]">
      <section className="min-h-[70vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-xl w-full text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#B9D2B9]/40 text-[#1B4326] flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1B4326] mb-3">Resources</h1>
          <p className="text-[#2B2E2B]/80 mb-8">
            Curated therapy-related articles and free tools to support your mental wellness journey.
          </p>

          <div className="mt-4 text-left space-y-2">
            {RESOURCES.map((r) => (
              <a
                key={r.title}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[#D8D4C9] hover:border-[#1B4326] transition-colors text-left"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <BookOpen className="w-4 h-4 text-[#2E6F40] flex-shrink-0" />
                  <span className="text-sm text-[#1B4326] truncate">{r.title}</span>
                </span>
                <span className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-[#2B2E2B]/60">{r.source}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#2E6F40]" />
                </span>
              </a>
            ))}
          </div>

          <button
            onClick={onGoHome}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1B4326] text-[#F4F1EA] font-semibold hover:bg-[#2E6F40] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </section>
    </main>
  );
};