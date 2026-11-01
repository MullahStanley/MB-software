import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Sparkles, 
  AlertTriangle, 
  Calendar, 
  ShieldAlert, 
  Zap, 
  Brain, 
  CheckCircle2, 
  ArrowRight,
  HeartPulse
} from 'lucide-react';
import { api, Checkup } from '../api';

interface CheckupPatternsProps {
  onTriggerThreshold: (level: number, details?: string) => void;
  onNavigateTab: (tab: string) => void;
}

const MOOD_OPTIONS = [
  { label: 'Grounded & Clear', val: 'Grounded', color: 'text-teal-400 border-teal-500/40 bg-teal-500/10' },
  { label: 'Energized / Inspired', val: 'Energized', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
  { label: 'Restless / Scatter', val: 'Restless', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
  { label: 'Anxious / Tight Chest', val: 'Anxious', color: 'text-orange-400 border-orange-500/40 bg-orange-500/10' },
  { label: 'Burnt Out / Low Battery', val: 'Burnt Out', color: 'text-purple-400 border-purple-500/40 bg-purple-500/10' },
  { label: 'Overwhelmed / Spiral', val: 'Overwhelmed', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
];

const LIFE_DOMAINS = [
  'Work & Boss Demands',
  'Rent & Living Expenses',
  'Loneliness / Friendship Shifts',
  'Academic Pressure',
  'Parental Expectations',
  'Sleep & Screen Exhaustion',
  'Quarter-Life Direction'
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
      // If threshold level is 3, 4, 5, or 6, notify parent modal
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
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/40 rounded-2xl p-6 sm:p-8 border border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Pattern Holding & Nervous System Diagnostic</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Not just tracking a mood—understanding your developmental cycle.
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Log quick daily biometric-sensory check-ins. Mental Beacon stores your recurring patterns, identifies peak stressors, and automatically raises protective safety thresholds if distress climbs.
          </p>
        </div>
      </div>

      {/* Threshold Alert Banner if triggered */}
      {lastLoggedThreshold && (
        <div className={`p-4 rounded-xl border flex items-start space-x-3 transition-all ${
          lastLoggedThreshold.level >= 4
            ? 'bg-rose-950/40 border-rose-500 text-rose-200'
            : lastLoggedThreshold.level >= 2
            ? 'bg-amber-950/40 border-amber-500 text-amber-200'
            : 'bg-teal-950/40 border-teal-500 text-teal-200'
        }`}>
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">
                Threshold Level {lastLoggedThreshold.level} Activated
              </span>
              <button
                onClick={() => onTriggerThreshold(lastLoggedThreshold.level)}
                className="text-xs px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 font-semibold"
              >
                View Support Step
              </button>
            </div>
            <p className="text-xs mt-1 text-slate-300">{lastLoggedThreshold.description}</p>
          </div>
        </div>
      )}

      {/* 2-Column Layout: Form on Left, Pattern Analytics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Daily Check-in Form */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-teal-400" />
              <h2 className="text-base font-bold text-white">Daily Sensor Check-In</h2>
            </div>
            <span className="text-xs text-slate-400">Takes 60 seconds</span>
          </div>

          <form onSubmit={handleSubmitCheckup} className="space-y-4">
            {/* Stress Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-300">Stress & Overwhelm Level</span>
                <span className={`font-mono font-bold ${stressLevel >= 8 ? 'text-rose-400' : stressLevel >= 5 ? 'text-amber-400' : 'text-teal-400'}`}>
                  {stressLevel}/10 {stressLevel >= 8 ? '(High Distress)' : stressLevel >= 5 ? '(Moderate)' : '(Calm)'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>1 - Peaceful</span>
                <span>5 - Busy</span>
                <span>10 - Red Alert</span>
              </div>
            </div>

            {/* Energy Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-300">Energy & Physical Vitality</span>
                <span className="font-mono font-bold text-emerald-400">{energyLevel}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Mood State Pills */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Primary Emotional Texture
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MOOD_OPTIONS.map((m) => {
                  const isSelected = selectedMood === m.val;
                  return (
                    <button
                      type="button"
                      key={m.val}
                      onClick={() => setSelectedMood(m.val)}
                      className={`text-xs px-2.5 py-2 rounded-lg border text-left transition-all ${
                        isSelected
                          ? `${m.color} ring-1 ring-current font-bold`
                          : 'bg-slate-850/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Life Domains Draining You */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                What is drawing down your capacity today? (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {LIFE_DOMAINS.map((dom) => {
                  const active = selectedDomains.includes(dom);
                  return (
                    <button
                      type="button"
                      key={dom}
                      onClick={() => toggleDomain(dom)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        active
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                          : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-300'
                      }`}
                    >
                      {dom}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Context Note */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Contextual Micro-Note (Private)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Tough sync with project lead, skipped lunch."
                className="w-full bg-slate-950 text-xs px-3 py-2 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record Biometric Check-in</span>
            </button>
          </form>
        </div>

        {/* Right Col: Longitudinal Patterns & Insights */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pattern Summary Cards */}
          {patterns && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Avg Stress (7-Day)</span>
                <span className="text-2xl font-extrabold text-teal-400 font-mono mt-1 block">
                  {patterns.averageStress} / 10
                </span>
                <span className="text-[11px] text-slate-500">Baseline load</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Avg Vitality</span>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono mt-1 block">
                  {patterns.averageEnergy} / 10
                </span>
                <span className="text-[11px] text-slate-500">Restoration capacity</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-xs text-slate-400 block">Trend Indicator</span>
                <span className="text-sm font-bold text-indigo-300 mt-2 block truncate">
                  {patterns.stressTrend}
                </span>
                <span className="text-[11px] text-slate-500">Adaptive balance</span>
              </div>
            </div>
          )}

          {/* Historical Stress & Energy Trajectory */}
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                  <span>Your Stress vs Energy Wave (Recent Logs)</span>
                </h3>
                <p className="text-xs text-slate-400">Visualizing nervous system rhythm over time</p>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center space-x-1 text-teal-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block"></span>
                  <span>Stress</span>
                </span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                  <span>Energy</span>
                </span>
              </div>
            </div>

            {checkups.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No checkups recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {/* Visual Bar Chart Comparison */}
                <div className="h-44 flex items-end justify-between space-x-2 pt-4 px-2 border-b border-slate-800">
                  {checkups.slice(-7).map((c, idx) => {
                    const stressH = (c.stressLevel / 10) * 100;
                    const energyH = (c.energyLevel / 10) * 100;
                    const dateLabel = new Date(c.timestamp).toLocaleDateString([], { weekday: 'short' });

                    return (
                      <div key={c.id || idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                        {/* Hover Tooltip */}
                        <div className="absolute -top-10 bg-slate-800 text-[10px] text-slate-200 px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10 border border-slate-700">
                          Stress: {c.stressLevel} | Energy: {c.energyLevel} ({c.moodState})
                        </div>

                        <div className="w-full flex items-end justify-center space-x-1 h-32">
                          <div
                            className="w-3 rounded-t bg-teal-500/80 hover:bg-teal-400 transition-all"
                            style={{ height: `${stressH}%` }}
                            title={`Stress: ${c.stressLevel}`}
                          ></div>
                          <div
                            className="w-3 rounded-t bg-emerald-500/70 hover:bg-emerald-400 transition-all"
                            style={{ height: `${energyH}%` }}
                            title={`Energy: ${c.energyLevel}`}
                          ></div>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-2">{dateLabel}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Top Life Drains Pattern */}
          {patterns && patterns.topLifeDrains && patterns.topLifeDrains.length > 0 && (
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <h3 className="font-bold text-sm text-white mb-2 flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Primary Life Stress Correlates</span>
              </h3>
              <p className="text-xs text-slate-400 mb-3">
                Identified from your check-ins as recurring triggers:
              </p>
              <div className="space-y-2">
                {patterns.topLifeDrains.slice(0, 4).map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-850 text-xs">
                    <span className="text-slate-300 font-medium">{item.domain}</span>
                    <span className="text-teal-400 font-mono text-[11px]">{item.count} check-ins</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Developmental Links */}
          <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-800/40 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-teal-300">Need immediate nervous system regulation?</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Our audio synthesizer & visual breathing guides trigger parasympathetic deceleration in 180 seconds.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('calm')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shrink-0 ml-3"
            >
              <span>Calm Space</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
