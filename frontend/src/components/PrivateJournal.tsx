import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Lock, 
  Trash2, 
  Plus, 
  Calendar, 
  Smile, 
  Tag, 
  Shuffle, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { api, JournalEntry } from '../api';

const JOURNAL_MOODS = ['Reflective', 'Vulnerable', 'Grateful', 'Relieved', 'Exhausted', 'Uncertain'];

export const PrivateJournal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('Reflective');
  const [tagsInput, setTagsInput] = useState('');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  useEffect(() => {
    loadJournalData();
  }, []);

  const loadJournalData = async () => {
    try {
      setLoading(true);
      const [allEntries, promptList] = await Promise.all([
        api.getJournal(),
        api.getJournalPrompts()
      ]);
      setEntries(allEntries);
      setPrompts(promptList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleShufflePrompt = () => {
    if (prompts.length > 0) {
      setActivePromptIndex((prev) => (prev + 1) % prompts.length);
    }
  };

  const handleUsePromptInEditor = () => {
    const currentPrompt = prompts[activePromptIndex];
    if (currentPrompt) {
      setTitle(currentPrompt.slice(0, 50) + '...');
      setContent((prev) => (prev ? `${prev}\n\n[Prompt Reflection: ${currentPrompt}]\n` : `[Prompt Reflection: ${currentPrompt}]\n`));
    }
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const saved = await api.addJournalEntry({
        title: title.trim() || 'Untitled Journal Note',
        content: content.trim(),
        promptUsed: prompts[activePromptIndex],
        mood: selectedMood,
        tags
      });

      setEntries([saved, ...entries]);
      setTitle('');
      setContent('');
      setTagsInput('');
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await api.deleteJournalEntry(id);
      setEntries(entries.filter((e) => e.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#1B4326] text-[#F4F1EA] rounded-2xl p-6 sm:p-8 border-2 border-[#1B4326] shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#B9D2B9] text-[#1B4326] text-xs font-bold mb-3 border border-[#2E6F40]/30">
            <Lock className="w-3.5 h-3.5 text-[#1B4326]" />
            <span>Encrypted & Private to Your Device</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-normal text-[#F4F1EA]">
            Private Journal: Safe Unpacking of the Unfiltered Mind.
          </h1>
          <p className="mt-2 text-sm text-[#F4F1EA]/85 leading-relaxed font-normal">
            No followers, no likes, and zero performance pressure. Regular expressive writing downregulates chronic amygdala activation and releases intrusive thought loops.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Prompt & Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Rotating Prompt Card */}
          {prompts.length > 0 && (
            <div className="p-4 rounded-xl bg-[#B9D2B9]/30 border border-[#2E6F40]/30 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center space-x-1.5 text-xs font-bold text-[#1B4326]">
                  <Sparkles className="w-3.5 h-3.5 text-[#2E6F40]" />
                  <span>Grounding Journal Prompt</span>
                </span>
                <button
                  type="button"
                  onClick={handleShufflePrompt}
                  className="flex items-center space-x-1 text-xs text-[#2B2E2B]/80 hover:text-[#1B4326] transition-colors font-medium"
                >
                  <Shuffle className="w-3 h-3 text-[#2E6F40]" />
                  <span>Next Prompt</span>
                </button>
              </div>

              <p className="text-sm font-serif italic text-[#1B4326] my-2">
                "{prompts[activePromptIndex]}"
              </p>

              <button
                type="button"
                onClick={handleUsePromptInEditor}
                className="text-xs px-2.5 py-1 rounded bg-[#1B4326] text-[#F4F1EA] hover:bg-[#2E6F40] transition-all font-semibold"
              >
                Use this prompt in entry
              </button>
            </div>
          )}

          {/* Journal Editor */}
          <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#D8D4C9] shadow-sm space-y-4 text-[#2B2E2B]">
            <div className="flex items-center justify-between border-b border-[#D8D4C9] pb-3">
              <h3 className="text-sm font-serif font-bold text-[#1B4326] flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-[#2E6F40]" />
                <span>Write New Reflection</span>
              </h3>
              {isSavedNotice && (
                <span className="flex items-center space-x-1 text-xs text-[#2E6F40] font-semibold animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Saved privately!</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Title of this reflection..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F4F1EA] text-sm px-3.5 py-2 rounded-lg border border-[#D8D4C9] text-[#2B2E2B] focus:outline-none focus:border-[#1B4326] font-medium"
                />
              </div>

              <div>
                <textarea
                  required
                  rows={8}
                  placeholder="Let your thoughts flow freely. Do not edit or self-censor..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#F4F1EA] text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D8D4C9] text-[#2B2E2B] focus:outline-none focus:border-[#1B4326] leading-relaxed font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Mood Tag */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#1B4326] mb-1">
                    Felt Tone
                  </label>
                  <select
                    value={selectedMood}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    className="w-full bg-[#F4F1EA] text-xs px-2.5 py-1.5 rounded-lg border border-[#D8D4C9] text-[#2B2E2B] focus:outline-none focus:border-[#1B4326]"
                  >
                    {JOURNAL_MOODS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#1B4326] mb-1">
                    Themes (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Boundaries, Career, Family"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-[#F4F1EA] text-xs px-2.5 py-1.5 rounded-lg border border-[#D8D4C9] text-[#2B2E2B] focus:outline-none focus:border-[#1B4326]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#D8D4C9]">
                <span className="flex items-center space-x-1 text-[11px] text-[#2B2E2B]/70 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E6F40]" />
                  <span>Zero public visibility</span>
                </span>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] text-xs sm:text-sm font-semibold shadow transition-all"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Past Journal Entries (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-serif font-bold text-[#1B4326]">Your Past Entries ({entries.length})</h3>
            <span className="text-xs text-[#2B2E2B]/60 font-medium">Personal Archive</span>
          </div>

          {entries.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#FFFFFF] border border-[#D8D4C9] text-center shadow-sm">
              <p className="text-xs text-[#2B2E2B]/75">Your journal vault is waiting for your first entry.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D8D4C9] space-y-2 hover:border-[#1B4326] transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs text-[#2B2E2B]/70">
                    <span className="flex items-center text-[11px]">
                      <Calendar className="w-3 h-3 mr-1 text-[#2E6F40]" />
                      {new Date(entry.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#B9D2B9] text-[#1B4326] font-semibold border border-[#2E6F40]/30">
                        {entry.mood}
                      </span>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-[#2B2E2B]/50 hover:text-rose-600 p-0.5"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-[#1B4326]">{entry.title}</h4>
                  <p className="text-xs text-[#2B2E2B] whitespace-pre-line line-clamp-4 leading-relaxed">
                    {entry.content}
                  </p>

                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {entry.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#F4F1EA] text-[#2E6F40] font-medium border border-[#D8D4C9]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
