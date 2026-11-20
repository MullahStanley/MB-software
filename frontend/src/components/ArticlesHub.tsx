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
      <div className="bg-[#1B4326] text-[#F4F1EA] rounded-2xl p-6 sm:p-8 border-2 border-[#1B4326] shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#B9D2B9] text-[#1B4326] text-xs font-bold mb-3 border border-[#2E6F40]/30">
            <BookOpen className="w-3.5 h-3.5 text-[#1B4326]" />
            <span>Youth Psychoeducation & Brain Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-normal text-[#F4F1EA]">
            Practical Developmental Guides for Ages 15–35.
          </h1>
          <p className="mt-2 text-sm text-[#F4F1EA]/85 leading-relaxed font-normal">
            Evidence-based perspectives on neurobiology, executive dysfunction, establishing boundaries with family, handling early career panic, and somatic recovery.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-3 bg-[#FFFFFF] p-3 rounded-xl border border-[#D8D4C9] shadow-sm">
        <Search className="w-4 h-4 text-[#2E6F40] ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by topic, e.g. quarter-life, burnout, vagus nerve, boundaries..."
          className="w-full bg-transparent text-xs sm:text-sm text-[#2B2E2B] focus:outline-none placeholder-[#2B2E2B]/50"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-[#2B2E2B]/60 hover:text-[#1B4326] text-xs mr-2 font-medium">
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
            className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#D8D4C9] hover:border-[#1B4326] cursor-pointer transition-all flex flex-col justify-between space-y-4 shadow-sm group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#2B2E2B]/70">
                <span className="px-2 py-0.5 rounded-full bg-[#B9D2B9] text-[#1B4326] text-[11px] font-bold border border-[#2E6F40]/30">
                  {art.category}
                </span>
                <span className="flex items-center text-[#2B2E2B]/60 text-[11px] font-medium">
                  <Clock className="w-3 h-3 mr-1" />
                  {art.readTime}
                </span>
              </div>
              <h3 className="text-base font-serif font-bold text-[#1B4326] group-hover:text-[#2E6F40] transition-colors">
                {art.title}
              </h3>
              <p className="text-xs text-[#2B2E2B]/80 leading-relaxed line-clamp-3">
                {art.summary}
              </p>
            </div>

            {/* Takeaways Preview */}
            <div className="pt-3 border-t border-[#D8D4C9]">
              <span className="text-[11px] font-bold text-[#2E6F40] block mb-1">Key Insight:</span>
              <p className="text-xs text-[#1B4326] italic line-clamp-1 font-medium">
                • {art.takeaways[0]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FFFFFF] rounded-2xl max-w-2xl w-full border-2 border-[#1B4326] shadow-2xl overflow-hidden my-8 text-[#2B2E2B]">
            <div className="p-6 bg-[#1B4326] text-[#F4F1EA] border-b border-[#1B4326] flex items-start justify-between">
              <div>
                <span className="text-xs text-[#C8B87E] font-semibold uppercase tracking-wider block mb-1">
                  {selectedArticle.category} • {selectedArticle.readTime}
                </span>
                <h2 className="text-xl font-serif font-bold text-[#F4F1EA] leading-tight">
                  {selectedArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-[#F4F1EA]/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors ml-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Summary Callout */}
              <div className="p-4 rounded-xl bg-[#B9D2B9]/30 border border-[#2E6F40]/30 text-xs text-[#1B4326] leading-relaxed font-medium">
                {selectedArticle.summary}
              </div>

              {/* Main Content */}
              <div className="text-sm text-[#2B2E2B] leading-relaxed whitespace-pre-line space-y-4 font-sans">
                {selectedArticle.content}
              </div>

              {/* Key Takeaways */}
              <div className="p-4 rounded-xl bg-[#F4F1EA] border border-[#D8D4C9] space-y-2">
                <h4 className="text-xs font-bold text-[#2E6F40] uppercase tracking-wider">
                  Actionable Takeaways
                </h4>
                <ul className="space-y-1.5">
                  {selectedArticle.takeaways.map((t, idx) => (
                    <li key={idx} className="text-xs text-[#2B2E2B] flex items-start space-x-2">
                      <span className="text-[#2E6F40] font-bold shrink-0">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 bg-[#F4F1EA] border-t border-[#D8D4C9] flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-lg bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] text-xs font-semibold"
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
