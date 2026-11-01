import React, { useState, useRef, useEffect } from 'react';
import { Gamepad2, Sparkles, Wind, Eye, RotateCcw, Check, Plus, Cloud } from 'lucide-react';

export const CalmingGames: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'pebbles' | 'clouds' | 'grounding'>('pebbles');

  // Game 1: Zen Pebble Balancer State
  const [stones, setStones] = useState<{ id: number; width: number; height: number; x: number; y: number; color: string }[]>([]);
  const [isStable, setIsStable] = useState(true);

  const stoneColors = ['#0d9488', '#0f766e', '#115e59', '#14b8a6', '#2dd4bf', '#5eead4'];

  const resetPebbles = () => {
    setStones([
      { id: 1, width: 140, height: 32, x: 100, y: 220, color: '#0d9488' }
    ]);
    setIsStable(true);
  };

  useEffect(() => {
    resetPebbles();
  }, []);

  const handleAddStone = () => {
    if (stones.length >= 7) return;
    const topStone = stones[stones.length - 1];
    const newWidth = Math.max(50, topStone.width - 16);
    // Slight jitter to simulate delicate balance
    const offset = (Math.random() - 0.5) * 18;
    const newX = topStone.x + offset;

    const newStone = {
      id: Date.now(),
      width: newWidth,
      height: 28,
      x: newX,
      y: topStone.y - 28,
      color: stoneColors[stones.length % stoneColors.length]
    };

    setStones([...stones, newStone]);
  };

  // Game 2: Thought Unhooker (Cloud Pop)
  const [thoughtInput, setThoughtInput] = useState('');
  const [clouds, setClouds] = useState<{ id: number; text: string; opacity: number }[]>([
    { id: 1, text: "I'm late to my own life", opacity: 1 },
    { id: 2, text: "Everyone on social media is happier than me", opacity: 0.9 }
  ]);

  const handleAddCloudThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thoughtInput.trim()) return;
    setClouds([{ id: Date.now(), text: thoughtInput.trim(), opacity: 1 }, ...clouds]);
    setThoughtInput('');
  };

  const handleDissolveCloud = (id: number) => {
    setClouds(clouds.filter(c => c.id !== id));
  };

  // Game 3: 5-4-3-2-1 Sensory Grounding State
  const [groundingStep, setGroundingStep] = useState(0);
  const groundingSteps = [
    { count: 5, prompt: "Acknowledge 5 things you can see around you right now", icon: "Look at a plant, a shadow, a cup, a pattern on the wall..." },
    { count: 4, prompt: "Acknowledge 4 things you can physically feel", icon: "The chair under your legs, feet on the floor, texture of your shirt..." },
    { count: 3, prompt: "Acknowledge 3 things you can hear", icon: "Hum of air conditioning, distant traffic, your own breathing..." },
    { count: 2, prompt: "Acknowledge 2 things you can smell or love smelling", icon: "Coffee, fresh air, rain, soap, mint..." },
    { count: 1, prompt: "Acknowledge 1 gentle thing you appreciate about yourself", icon: "You showed up today, you are resilient, you are evolving..." }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/40 rounded-2xl p-6 sm:p-8 border border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Cognitive Play & Somatic Grounding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Calm Micro-Games for Mental De-escalation.
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Gentle interactive tools designed to pull your attention away from catastrophic future loops and gently anchor it back in physical presence.
          </p>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveGame('pebbles')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeGame === 'pebbles'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Zen Pebble Balancer
        </button>
        <button
          onClick={() => setActiveGame('clouds')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeGame === 'clouds'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Thought Cloud Unhooker
        </button>
        <button
          onClick={() => setActiveGame('grounding')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeGame === 'grounding'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          5-4-3-2-1 Sensory Grounder
        </button>
      </div>

      {/* Game 1: Zen Pebble Balancer */}
      {activeGame === 'pebbles' && (
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-white">Zen River Stone Tower</h3>
              <p className="text-xs text-slate-400">
                Stack smooth river stones one by one. Practice steady patience with every placement.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleAddStone}
                disabled={stones.length >= 7}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>Place Next Pebble ({stones.length}/7)</span>
              </button>
              <button
                onClick={resetPebbles}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                title="Reset Tower"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stacking Canvas Area */}
          <div className="h-72 bg-gradient-to-b from-slate-950 to-slate-900 rounded-xl border border-slate-800 flex flex-col justify-end items-center pb-6 relative overflow-hidden">
            {/* Ambient Water Horizon Line */}
            <div className="absolute bottom-6 w-full border-b border-teal-500/20"></div>

            <div className="relative z-10 flex flex-col items-center">
              {stones.map((s, idx) => (
                <div
                  key={s.id}
                  className="rounded-full shadow-lg transition-all duration-300 flex items-center justify-center my-0.5"
                  style={{
                    width: `${s.width}px`,
                    height: `${s.height}px`,
                    backgroundColor: s.color,
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <span className="text-[10px] text-white/50 font-mono select-none">
                    {idx === 0 ? 'Foundation' : `Stone ${idx + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-teal-950/30 border border-teal-800/30 text-xs text-teal-300 text-center">
            {stones.length >= 7 ? "✨ Tower complete. Take a deep, appreciative breath." : "Place another stone gently to test your focus."}
          </div>
        </div>
      )}

      {/* Game 2: Thought Cloud Unhooker */}
      {activeGame === 'clouds' && (
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white">Cognitive Defusion Cloud Dissolver</h3>
            <p className="text-xs text-slate-400">
              In Acceptance & Commitment Therapy (ACT), thoughts are not facts—they are passing mental weather. Enter any sticky anxiety, watch it become a cloud, and tap to release it.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAddCloudThought} className="flex space-x-2">
            <input
              type="text"
              required
              placeholder="e.g. What if I never find what I'm passionate about?"
              value={thoughtInput}
              onChange={(e) => setThoughtInput(e.target.value)}
              className="flex-1 bg-slate-950 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-700 text-slate-200 focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-semibold shadow"
            >
              Materialize Cloud
            </button>
          </form>

          {/* Sky Canvas with Floating Clouds */}
          <div className="min-h-64 p-6 bg-gradient-to-b from-sky-950/60 via-slate-900 to-slate-950 rounded-xl border border-slate-800 flex flex-wrap gap-4 items-center justify-center">
            {clouds.length === 0 ? (
              <div className="text-center text-slate-400 text-xs">
                <Sparkles className="w-6 h-6 mx-auto text-teal-400 mb-2" />
                <span>The sky of your mind is clear right now.</span>
              </div>
            ) : (
              clouds.map((cloud) => (
                <div
                  key={cloud.id}
                  onClick={() => handleDissolveCloud(cloud.id)}
                  className="cursor-pointer group relative p-4 rounded-3xl bg-slate-800/90 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/50 text-xs text-slate-200 max-w-xs shadow-lg transition-all transform hover:-translate-y-1"
                  title="Click to dissolve and unhook from this thought"
                >
                  <div className="flex items-center space-x-2 mb-1 text-slate-400 group-hover:text-rose-400">
                    <Cloud className="w-4 h-4" />
                    <span className="text-[10px] font-semibold">Passing Thought (Click to Dissolve)</span>
                  </div>
                  <p className="font-medium text-white">{cloud.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Game 3: 5-4-3-2-1 Sensory Grounding */}
      {activeGame === 'grounding' && (
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">5-4-3-2-1 Sensory Somatic Guide</h3>
            <p className="text-xs text-slate-400">
              The gold-standard psychological exercise to anchor a nervous system spiraling into panic.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-300 font-extrabold text-2xl flex items-center justify-center border border-teal-500/40">
              {groundingSteps[groundingStep].count}
            </div>

            <h4 className="text-lg font-bold text-white max-w-md">
              {groundingSteps[groundingStep].prompt}
            </h4>

            <p className="text-xs text-slate-400 italic max-w-sm">
              "{groundingSteps[groundingStep].icon}"
            </p>

            <div className="pt-4 flex space-x-3">
              {groundingStep > 0 && (
                <button
                  onClick={() => setGroundingStep(groundingStep - 1)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Previous
                </button>
              )}
              {groundingStep < groundingSteps.length - 1 ? (
                <button
                  onClick={() => setGroundingStep(groundingStep + 1)}
                  className="px-6 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow"
                >
                  I've Noticed These ({groundingStep + 1}/5)
                </button>
              ) : (
                <button
                  onClick={() => setGroundingStep(0)}
                  className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow"
                >
                  Complete & Restart
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
