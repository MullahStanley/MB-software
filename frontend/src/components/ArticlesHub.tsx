import React, { useState, useEffect } from 'react';
import { FileText, Clock, Tag, BookOpen, Sparkles, Search, ArrowRight, X } from 'lucide-react';
import { api, Article } from '../api';

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
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950/40 rounded-2xl p-6 sm:p-8 border border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Youth Psychoeducation & Brain Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Practical Developmental Guides for Ages 15–35.
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Evidence-based perspectives on neurobiology, executive dysfunction, establishing boundaries with family, handling early career panic, and somatic recovery.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by topic, e.g. quarter-life, burnout, vagus nerve, boundaries..."
          className="w-full bg-transparent text-xs sm:text-sm text-slate-200 focus:outline-none"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white text-xs mr-2">
            Clear
          </button>
        )}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="px-2 py-0.5 rounded-full bg-teal-950/60 text-teal-300 border border-teal-800/40 text-[11px] font-medium">
                  {art.category}
                </span>
                <span className="flex items-center text-slate-500 text-[11px]">
                  <Clock className="w-3 h-3 mr-1" />
                  {art.readTime}
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                {art.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {art.summary}
              </p>
            </div>

            {/* Takeaways Preview */}
            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Key Insight:</span>
              <p className="text-xs text-teal-200/90 italic line-clamp-1">
                • {art.takeaways[0]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-700 shadow-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-slate-800 flex items-start justify-between">
              <div>
                <span className="text-xs text-teal-400 font-semibold uppercase tracking-wider block mb-1">
                  {selectedArticle.category} • {selectedArticle.readTime}
                </span>
                <h2 className="text-xl font-bold text-white leading-tight">
                  {selectedArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors ml-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Summary Callout */}
              <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-800/40 text-xs text-teal-200 leading-relaxed font-medium">
                {selectedArticle.summary}
              </div>

              {/* Main Content */}
              <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-4 font-sans">
                {selectedArticle.content}
              </div>

              {/* Key Takeaways */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Actionable Takeaways
                </h4>
                <ul className="space-y-1.5">
                  {selectedArticle.takeaways.map((t, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                      <span className="text-teal-400 font-bold shrink-0">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
              >
                Finished Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
