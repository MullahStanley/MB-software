import React, { useEffect } from 'react';
import { ArrowLeft, BookOpen, Construction } from 'lucide-react';

const RESOURCES = [
  { title: 'The Neuroscience of the Quarter-Life Crisis (Ages 18–30)', tab: 'articles' },
  { title: 'The 5-Minute De-escalation Protocol for Acute Overload', tab: 'articles' },
  { title: 'How to Hold Loving Boundaries with Parents', tab: 'articles' },
];

export const UnderDevelopment: React.FC<{ onGoHome: () => void; onGoArticles: () => void }> = ({
  onGoHome,
  onGoArticles,
}) => {
  useEffect(() => {
    const t = setTimeout(() => onGoHome(), 6000);
    return () => clearTimeout(t);
  }, [onGoHome]);

  return (
    <main className="flex-1 w-full bg-[#F4F1EA] text-[#2B2E2B]">
      <section className="min-h-[70vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-xl w-full text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#B9D2B9]/40 text-[#1B4326] flex items-center justify-center mb-6">
            <Construction className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1B4326] mb-3">Under development</h1>
          <p className="text-[#2B2E2B]/80 mb-8">
            This page is being gently built. You will be redirected to the home page shortly.
          </p>
          <button
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1B4326] text-[#F4F1EA] font-semibold hover:bg-[#2E6F40] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="mt-12 text-left">
            <p className="text-xs font-bold tracking-widest uppercase text-[#2E6F40] mb-3">
              Three resources while you wait
            </p>
            <div className="space-y-2">
              {RESOURCES.map((r) => (
                <button
                  key={r.title}
                  onClick={onGoArticles}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-[#D8D4C9] hover:border-[#1B4326] transition-colors text-left"
                >
                  <BookOpen className="w-4 h-4 text-[#2E6F40] flex-shrink-0" />
                  <span className="text-sm text-[#1B4326]">{r.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
