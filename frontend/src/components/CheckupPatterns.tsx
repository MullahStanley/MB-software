import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { api, Checkup } from '../api';
import { PageHeader } from './ui/PageHeader';

interface CheckupPatternsProps {
  onTriggerThreshold: (level: number, details?: string) => void;
  onNavigateTab: (tab: string) => void;
}

const MOOD_OPTIONS = [
  { label: 'Grounded & clear', val: 'Grounded' },
  { label: 'Energized / productive', val: 'Energized' },
  { label: 'Restless / scattered', val: 'Restless' },
  { label: 'Anxious / tight chest', val: 'Anxious' },
  { label: 'Burnt out / fatigued', val: 'Burnt Out' },
  { label: 'Overwhelmed', val: 'Overwhelmed' },
];

const LIFE_DOMAINS = [
  'Work & career',
  'Rent & budget',
  'Loneliness / friendship',
  'Studies & exams',
  'Family pressure',
  'Sleep & screen time',
  'Future direction'
];

export const CheckupPatterns: React.FC<CheckupPatternsProps> = ({ onTriggerThreshold, onNavigateTab }) => {
  const [checkups, setCheckups] = useState<Checkup[]>([]);
  const [patterns, setPatterns] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [stressLevel, setStressLevel] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(6);
  const [focusLevel, setFocusLevel] = useState(5);
  const [selectedMood, setSelectedMood] = useState('Grounded');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [lastLoggedThreshold, setLastLoggedThreshold] = useState<{ level: number; description: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allCheckups, patternData] = await Promise.all([
        api.getCheckups(),
        api.getCheckupPatterns()
      ]);
      setCheckups(allCheckups);
      setPatterns(patternData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter(d => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const handleSubmitCheckup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.submitCheckup({
        stressLevel,
        energyLevel,
        focusLevel,
        moodState: selectedMood,
        lifeDomains: selectedDomains,
        notes
      });

      setLastLoggedThreshold(res.thresholdTriggered);
      if (res.thresholdTriggered.level >= 3) {
        onTriggerThreshold(res.thresholdTriggered.level, res.thresholdTriggered.description);
      }

      setNotes('');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Daily check-in"
        title="Track patterns, not just numbers."
        description="A 60-second check-in helps you see what triggers stress, how your energy recovers week to week, and when it's time to reach out for support."
      />

      {/* Threshold alert banner if triggered */}
      {lastLoggedThreshold && (
        <div className={`flex items-start gap-3 rounded-xl border p-4 ${
          lastLoggedThreshold.level >= 4
            ? 'border-rose-200 bg-rose-50 text-rose-800'
            : lastLoggedThreshold.level >= 2
            ? 'border-amber-200 bg-amber-50 text-amber-800'
            : 'border-forest-200 bg-forest-50 text-forest-800'
        }`}>
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold">
                Threshold level {lastLoggedThreshold.level} noted
              </span>
              <button
                type="button"
                onClick={() => onTriggerThreshold(lastLoggedThreshold.level)}
                className="btn btn-sm btn-outline"
              >
                View interventions
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-700">{lastLoggedThreshold.description}</p>
          </div>
        </div>
      )}

      {/* 2-column: form + patterns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Daily form */}
        <section className="panel p-5 sm:p-6 lg:col-span-5" aria-labelledby="checkin-heading">
          <div className="mb-4 border-b border-slate-100 pb-3">
            <h2 id="checkin-heading" className="text-base font-semibold">Today's check-in</h2>
            <p className="text-xs text-slate-500">Record your current state</p>
          </div>

          <form onSubmit={handleSubmitCheckup} className="space-y-5">
            {/* Stress slider */}
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <label htmlFor="stress-range" className="font-medium text-slate-700">Stress & overwhelm</label>
                <span className={`font-mono text-xs font-semibold ${stressLevel >= 8 ? 'text-rose-600' : stressLevel >= 5 ? 'text-amber-600' : 'text-forest-700'}`}>
                  {stressLevel} / 10
                </span>
              </div>
              <input
                id="stress-range"
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full cursor-pointer accent-forest-600"
              />
              <div className="mt-0.5 flex justify-between text-[11px] text-slate-400">
                <span>1 (calm)</span>
                <span>5 (manageable)</span>
                <span>10 (overloaded)</span>
              </div>
            </div>

            {/* Energy slider */}
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <label htmlFor="energy-range" className="font-medium text-slate-700">Physical energy</label>
                <span className="font-mono text-xs font-semibold text-forest-700">{energyLevel} / 10</span>
              </div>
              <input
                id="energy-range"
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full cursor-pointer accent-forest-600"
              />
            </div>

            {/* Mood pills */}
            <fieldset>
              <legend className="mb-1.5 text-xs font-medium text-slate-700">Primary feeling</legend>
              <div className="grid grid-cols-2 gap-1.5">
                {MOOD_OPTIONS.map((m) => {
                  const isSelected = selectedMood === m.val;
                  return (
                    <button
                      type="button"
                      key={m.val}
                      onClick={() => setSelectedMood(m.val)}
                      aria-pressed={isSelected}
                      className={`rounded-lg border px-2.5 py-2 text-left text-xs transition-colors ${
                        isSelected
                          ? 'border-forest-600 bg-forest-50 font-semibold text-forest-800'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Life domains */}
            <fieldset>
              <legend className="mb-1.5 text-xs font-medium text-slate-700">What is draining your capacity?</legend>
              <div className="flex flex-wrap gap-1.5">
                {LIFE_DOMAINS.map((dom) => {
                  const active = selectedDomains.includes(dom);
                  return (
                    <button
                      type="button"
                      key={dom}
                      onClick={() => toggleDomain(dom)}
                      aria-pressed={active}
                      className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                        active
                          ? 'border-forest-600 bg-forest-600 font-medium text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {dom}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Micro note */}
            <div>
              <label htmlFor="checkin-note" className="mb-1 block text-xs font-medium text-slate-700">
                Short note (private)
              </label>
              <textarea
                id="checkin-note"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Tough meeting with the team, lack of sleep."
                className="field"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <span>Save daily check-in</span>
            </button>
          </form>
        </section>

        {/* Pattern visuals */}
        <div className="space-y-4 lg:col-span-7">
          {/* KPI row */}
          {patterns && (
            <div className="grid grid-cols-3 gap-3">
              <div className="panel p-4">
                <span className="block text-xs font-medium text-slate-500">7-day stress</span>
                <span className="mt-1 block text-2xl font-semibold text-slate-900">
                  {patterns.averageStress} <span className="text-xs font-normal text-slate-400">/10</span>
                </span>
              </div>
              <div className="panel p-4">
                <span className="block text-xs font-medium text-slate-500">7-day energy</span>
                <span className="mt-1 block text-2xl font-semibold text-forest-700">
                  {patterns.averageEnergy} <span className="text-xs font-normal text-slate-400">/10</span>
                </span>
              </div>
              <div className="panel p-4">
                <span className="block text-xs font-medium text-slate-500">Trend</span>
                <span className="mt-2 block truncate text-sm font-semibold text-slate-800">
                  {patterns.stressTrend}
                </span>
              </div>
            </div>
          )}

          {/* Trajectory chart */}
          <section className="panel p-5" aria-labelledby="trajectory-heading">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id="trajectory-heading" className="text-sm font-semibold">Recent check-in trajectory</h2>
                <p className="text-xs text-slate-500">Stress vs. energy over your last entries</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-700">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-600"></span>
                  Stress
                </span>
                <span className="flex items-center gap-1 text-forest-700">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-forest-600"></span>
                  Energy
                </span>
              </div>
            </div>

            {loading ? (
              <p className="py-8 text-center text-sm text-slate-400" role="status">Loading…</p>
            ) : checkups.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No check-ins recorded yet.</p>
            ) : (
              <div className="flex h-44 items-end justify-between gap-2 border-b border-slate-100 px-2 pt-4">
                {checkups.slice(-7).map((c, idx) => {
                  const stressH = (c.stressLevel / 10) * 100;
                  const energyH = (c.energyLevel / 10) * 100;
                  const dateLabel = new Date(c.timestamp).toLocaleDateString([], { weekday: 'short' });

                  return (
                    <div key={c.id || idx} className="flex h-full flex-1 flex-col items-center justify-end">
                      <div className="flex h-32 w-full items-end justify-center gap-1.5">
                        <div
                          className="w-3 rounded-t bg-slate-600"
                          style={{ height: `${stressH}%` }}
                          title={`Stress: ${c.stressLevel}/10`}
                        ></div>
                        <div
                          className="w-3 rounded-t bg-forest-500"
                          style={{ height: `${energyH}%` }}
                          title={`Energy: ${c.energyLevel}/10`}
                        ></div>
                      </div>
                      <span className="mt-2 text-[11px] font-medium text-slate-500">{dateLabel}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Life correlates */}
          {patterns && patterns.topLifeDrains && patterns.topLifeDrains.length > 0 && (
            <section className="panel p-5" aria-labelledby="drains-heading">
              <h2 id="drains-heading" className="mb-2 text-sm font-semibold">Primary stress factors</h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {patterns.topLifeDrains.slice(0, 4).map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs">
                    <span className="font-medium text-slate-700">{item.domain}</span>
                    <span className="font-mono font-semibold text-forest-700">{item.count} logs</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick grounding link */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-forest-200 bg-forest-50 p-4">
            <div>
              <p className="text-sm font-semibold text-forest-900">Need a quick nervous system reset?</p>
              <p className="mt-0.5 text-xs text-forest-700">
                Two minutes of box breathing, or brown noise to mask the noise.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('calm')}
              className="btn btn-sm btn-primary shrink-0"
            >
              <span>Open pacer</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
