import React, { useState, useEffect } from 'react';
import { RotateCcw, Plus, Cloud } from 'lucide-react';
import { PageHeader } from './ui/PageHeader';

export const CalmingGames: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'pebbles' | 'clouds' | 'grounding'>('pebbles');

  // Game 1: Zen Pebble Balancer
  const [stones, setStones] = useState<{ id: number; width: number; height: number; x: number; y: number; color: string }[]>([]);

  const stoneColors = ['#15803d', '#166534', '#16a34a', '#22c55e', '#4ade80', '#86efac'];

  const resetPebbles = () => {
    setStones([
      { id: 1, width: 140, height: 32, x: 100, y: 220, color: '#166534' }
    ]);
  };

  useEffect(() => {
    resetPebbles();
  }, []);

  const handleAddStone = () => {
    if (stones.length >= 7) return;
    const topStone = stones[stones.length - 1];
    const newWidth = Math.max(50, topStone.width - 16);
    const offset = (Math.random() - 0.5) * 16;
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
  const [clouds, setClouds] = useState<{ id: number; text: string }[]>([
    { id: 1, text: "I'm behind everyone in my peer group" },
    { id: 2, text: "What if I chose the wrong career path?" }
  ]);

  const handleAddCloudThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thoughtInput.trim()) return;
    setClouds([{ id: Date.now(), text: thoughtInput.trim() }, ...clouds]);
    setThoughtInput('');
  };

  const handleDissolveCloud = (id: number) => {
    setClouds(clouds.filter(c => c.id !== id));
  };

  // Game 3: 5-4-3-2-1 Sensory Grounding
  const [groundingStep, setGroundingStep] = useState(0);
  const groundingSteps = [
    { count: 5, prompt: "Notice 5 things you can see around you", example: "A plant, light on the wall, a notebook, a door frame…" },
    { count: 4, prompt: "Notice 4 things you can physically feel", example: "Your feet resting on the floor, the texture of your clothes…" },
    { count: 3, prompt: "Notice 3 things you can hear", example: "A distant car, ventilation hum, your own breath…" },
    { count: 2, prompt: "Notice 2 things you can smell", example: "Coffee, fresh air, paper, soap…" },
    { count: 1, prompt: "Acknowledge 1 gentle truth about yourself", example: "You are doing your best, and that is sufficient for today." }
  ];

  const games = [
    { id: 'pebbles' as const, label: 'Stone balancer' },
    { id: 'clouds' as const, label: 'Thought clouds' },
    { id: 'grounding' as const, label: '5-4-3-2-1 grounding' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Grounding tools"
        title="Small activities to anchor attention."
        description="Simple interactive exercises for when your mind is stuck on future worst-cases — no scores, no timers, no winning."
      />

      {/* Game selector */}
      <nav aria-label="Grounding activities" className="flex gap-0.5 overflow-x-auto border-b border-slate-200">
        {games.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => setActiveGame(game.id)}
            aria-current={activeGame === game.id ? 'true' : undefined}
            className={`tab ${activeGame === game.id ? 'tab-active' : ''}`}
          >
            {game.label}
          </button>
        ))}
      </nav>

      {/* Game 1: Zen Pebble Balancer */}
      {activeGame === 'pebbles' && (
        <section className="panel space-y-4 p-5 sm:p-6" aria-labelledby="stones-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="stones-heading" className="text-base font-semibold">River stone tower</h2>
              <p className="text-xs text-slate-500">
                Stack river stones one by one. Steady patience with every placement.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddStone}
                disabled={stones.length >= 7}
                className="btn btn-sm btn-primary"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Place stone ({stones.length}/7)</span>
              </button>
              <button
                type="button"
                onClick={resetPebbles}
                className="btn btn-icon btn-outline"
                title="Reset tower"
                aria-label="Reset tower"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="relative flex h-72 flex-col items-center justify-end overflow-hidden rounded-lg border border-slate-200 bg-slate-50 pb-6">
            <div className="absolute bottom-6 w-full border-b border-slate-200"></div>

            <div className="relative z-10 flex flex-col items-center">
              {stones.map((s, idx) => (
                <div
                  key={s.id}
                  className="my-0.5 flex items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    width: `${s.width}px`,
                    height: `${s.height}px`,
                    backgroundColor: s.color,
                  }}
                >
                  <span className="select-none font-mono text-[10px] text-white/90">
                    {idx === 0 ? 'Base' : `${idx + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="rounded-lg border border-forest-200 bg-forest-50 p-3 text-center text-sm font-medium text-forest-800">
            {stones.length >= 7 ? "Tower complete. Take a slow, steady breath." : "Place another stone gently to test your focus."}
          </p>
        </section>
      )}

      {/* Game 2: Thought Cloud */}
      {activeGame === 'clouds' && (
        <section className="panel space-y-4 p-5 sm:p-6" aria-labelledby="clouds-heading">
          <div>
            <h2 id="clouds-heading" className="text-base font-semibold">Thought cloud dissolver</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
              In cognitive psychology, thoughts aren't permanent facts — they're passing mental weather.
              Type a worry, watch it become a cloud, and tap to let it drift away.
            </p>
          </div>

          <form onSubmit={handleAddCloudThought} className="flex gap-2">
            <label htmlFor="thought-input" className="sr-only">A worried thought</label>
            <input
              id="thought-input"
              type="text"
              required
              placeholder="e.g. I have to figure out my whole 10-year plan right now…"
              value={thoughtInput}
              onChange={(e) => setThoughtInput(e.target.value)}
              className="field"
            />
            <button type="submit" className="btn btn-primary shrink-0">
              Add cloud
            </button>
          </form>

          <div className="flex min-h-56 flex-wrap items-center justify-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-6">
            {clouds.length === 0 ? (
              <p className="text-sm font-medium text-slate-400">Your sky is clear right now.</p>
            ) : (
              clouds.map((cloud) => (
                <button
                  key={cloud.id}
                  type="button"
                  onClick={() => handleDissolveCloud(cloud.id)}
                  className="max-w-xs rounded-xl border border-slate-200 bg-white p-3.5 text-left transition-all hover:border-rose-300 hover:bg-rose-50/50"
                  title="Click to dissolve this thought"
                >
                  <span className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                    <Cloud className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
                    Click to dissolve
                  </span>
                  <span className="block text-sm font-medium text-slate-900">{cloud.text}</span>
                </button>
              ))
            )}
          </div>
        </section>
      )}

      {/* Game 3: 5-4-3-2-1 */}
      {activeGame === 'grounding' && (
        <section className="panel space-y-4 p-5 sm:p-6" aria-labelledby="grounding-heading">
          <div>
            <h2 id="grounding-heading" className="text-base font-semibold">5-4-3-2-1 sensory grounding</h2>
            <p className="mt-1 text-sm text-slate-600">
              The classic grounding sequence for when your nervous system feels scattered.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-600 text-2xl font-bold text-white" aria-hidden="true">
              {groundingSteps[groundingStep].count}
            </span>

            <h3 className="max-w-md text-base font-semibold">
              {groundingSteps[groundingStep].prompt}
            </h3>

            <p className="max-w-sm text-sm italic text-slate-500">
              “{groundingSteps[groundingStep].example}”
            </p>

            <div className="flex gap-2 pt-3">
              {groundingStep > 0 && (
                <button
                  type="button"
                  onClick={() => setGroundingStep(groundingStep - 1)}
                  className="btn btn-sm btn-outline"
                >
                  Previous
                </button>
              )}
              {groundingStep < groundingSteps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setGroundingStep(groundingStep + 1)}
                  className="btn btn-sm btn-primary"
                >
                  I've noticed ({groundingStep + 1}/5)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setGroundingStep(0)}
                  className="btn btn-sm btn-primary"
                >
                  Restart grounding
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
