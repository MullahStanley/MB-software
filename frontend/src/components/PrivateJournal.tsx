import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Trash2, 
  Calendar, 
  Shuffle, 
  CheckCircle2, 
  ShieldCheck,
  Feather
} from 'lucide-react';
import { api, JournalEntry } from '../api';
import { PageHeader } from './ui/PageHeader';

const JOURNAL_MOODS = ['Reflective', 'Vulnerable', 'Grateful', 'Relieved', 'Fatigued', 'Uncertain'];

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
      setContent((prev) => (prev ? `${prev}\n\n[Prompt: ${currentPrompt}]\n` : `[Prompt: ${currentPrompt}]\n`));
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
        title: title.trim() || 'Untitled reflection',
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
      <PageHeader
        eyebrow="Private journal"
        title="Write without being watched."
        description="A quiet space with no scores, streaks or audience. Expressive writing unloads mental chatter and brings perspective to heavy weeks — entries stay yours alone."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Editor column */}
        <div className="space-y-4 lg:col-span-7">
          {/* Prompt suggestion */}
          {prompts.length > 0 && (
            <div className="rounded-xl border border-forest-200 bg-forest-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-forest-800">
                  <Feather className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
                  Writing prompt
                </span>
                <button
                  type="button"
                  onClick={handleShufflePrompt}
                  className="flex items-center gap-1 text-xs font-medium text-forest-700 hover:text-forest-900"
                >
                  <Shuffle className="h-3 w-3" aria-hidden="true" />
                  Next prompt
                </button>
              </div>

              <p className="text-sm italic leading-relaxed text-slate-800">
                “{prompts[activePromptIndex]}”
              </p>

              <button
                type="button"
                onClick={handleUsePromptInEditor}
                className="btn btn-sm btn-outline mt-3"
              >
                Use this prompt
              </button>
            </div>
          )}

          {/* Editor */}
          <section className="panel p-5 sm:p-6" aria-labelledby="new-entry-heading">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 id="new-entry-heading" className="text-sm font-semibold">New reflection</h2>
              {isSavedNotice && (
                <span className="flex items-center gap-1 text-xs font-semibold text-forest-700" role="status">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Saved
                </span>
              )}
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4">
              <div>
                <label htmlFor="entry-title" className="sr-only">Reflection title</label>
                <input
                  id="entry-title"
                  type="text"
                  placeholder="Reflection title…"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="field font-medium"
                />
              </div>

              <div>
                <label htmlFor="entry-content" className="sr-only">Your reflection</label>
                <textarea
                  id="entry-content"
                  required
                  rows={9}
                  placeholder="Start writing freely…"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="field leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="entry-mood" className="mb-1 block text-xs font-medium text-slate-700">
                    Tone / mood
                  </label>
                  <select
                    id="entry-mood"
                    value={selectedMood}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    className="field"
                  >
                    {JOURNAL_MOODS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="entry-tags" className="mb-1 block text-xs font-medium text-slate-700">
                    Keywords (comma separated)
                  </label>
                  <input
                    id="entry-tags"
                    type="text"
                    placeholder="e.g. work, sleep, boundaries"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="field"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Lock className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
                  Stored securely, never shared
                </span>
                <button type="submit" className="btn btn-sm btn-primary">
                  Save entry
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Entries column */}
        <section className="space-y-3 lg:col-span-5" aria-labelledby="entries-heading">
          <div className="flex items-center justify-between pb-1">
            <h2 id="entries-heading" className="text-sm font-semibold">
              Your entries ({entries.length})
            </h2>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
              Private
            </span>
          </div>

          {loading ? (
            <div className="panel p-8 text-center text-sm text-slate-500" role="status">
              Loading your entries…
            </div>
          ) : entries.length === 0 ? (
            <div className="panel p-8 text-center text-sm text-slate-500">
              No journal entries yet.
            </div>
          ) : (
            <ul className="max-h-[700px] space-y-3 overflow-y-auto pr-1">
              {entries.map((entry) => (
                <li key={entry.id}>
                  <article className="panel p-4 transition-colors hover:border-slate-300">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center text-[11px]">
                        <Calendar className="mr-1 h-3 w-3 text-slate-400" aria-hidden="true" />
                        <time dateTime={entry.createdAt}>
                          {new Date(entry.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </time>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="chip">{entry.mood}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-0.5 text-slate-400 hover:text-rose-600"
                          title="Delete entry"
                          aria-label={`Delete entry: ${entry.title}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold">{entry.title}</h3>
                    <p className="mt-1 line-clamp-3 whitespace-pre-line text-xs leading-relaxed text-slate-600">
                      {entry.content}
                    </p>

                    {entry.tags && entry.tags.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-1" aria-label="Tags">
                        {entry.tags.map((tag, i) => (
                          <li key={i} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                            #{tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
