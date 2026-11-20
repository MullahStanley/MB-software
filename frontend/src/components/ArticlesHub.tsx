import React, { useState, useEffect } from 'react';
import { Clock, Search, Check } from 'lucide-react';
import { api, Article } from '../api';
import { PageHeader } from './ui/PageHeader';
import { Modal } from './ui/Modal';

export const ArticlesHub: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await api.getArticles();
      setArticles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Guides"
        title="Clear reading for your 20s and early 30s."
        description="Short, practical articles on boundaries, nervous-system resets, family expectations and quarter-life crossroads — written to be read in one sitting."
      />

      {/* Search */}
      <div className="relative">
        <label htmlFor="guide-search" className="sr-only">Search guides</label>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          id="guide-search"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by keyword — quarter-life, burnout, vagus nerve, boundaries…"
          className="field pl-9"
        />
      </div>

      {/* Articles grid */}
      {loading ? (
        <div className="panel p-8 text-center text-sm text-slate-500" role="status">Loading guides…</div>
      ) : filteredArticles.length === 0 ? (
        <div className="panel p-8 text-center text-sm text-slate-500">
          No guides match that search. Try a broader keyword.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              className="panel flex cursor-pointer flex-col justify-between gap-4 p-5 transition-colors hover:border-forest-400"
            >
              <button
                type="button"
                onClick={() => setSelectedArticle(art)}
                className="text-left"
              >
                <div className="mb-2 flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="chip">{art.category}</span>
                  <span className="flex items-center text-[11px]">
                    <Clock className="mr-1 h-3 w-3 text-slate-400" aria-hidden="true" />
                    {art.readTime}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 hover:text-forest-700">
                  {art.title}
                </h2>
                <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {art.summary}
                </p>
              </button>

              <div className="border-t border-slate-100 pt-3">
                <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Core takeaway
                </span>
                <p className="line-clamp-1 text-sm text-forest-800">{art.takeaways[0]}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Reader */}
      <Modal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        title={selectedArticle?.title || ''}
        description={selectedArticle ? `${selectedArticle.category} · ${selectedArticle.readTime}` : undefined}
        maxWidth="max-w-2xl"
        footer={
          <button type="button" onClick={() => setSelectedArticle(null)} className="btn btn-sm btn-primary">
            Close guide
          </button>
        }
      >
        {selectedArticle && (
          <div className="space-y-5">
            <p className="rounded-lg border border-forest-200 bg-forest-50 p-4 text-sm leading-relaxed text-forest-900">
              {selectedArticle.summary}
            </p>

            <div className="max-w-[65ch] space-y-4 whitespace-pre-line text-sm leading-7 text-slate-700">
              {selectedArticle.content}
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-700">
                Actionable steps
              </h3>
              <ul className="space-y-2">
                {selectedArticle.takeaways.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedArticle.tags && selectedArticle.tags.length > 0 && (
              <ul className="flex flex-wrap gap-1.5" aria-label="Topics">
                {selectedArticle.tags.map((tag, i) => (
                  <li key={i} className="chip">{tag}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
