import React, { useState, useRef, useEffect } from 'react';
import { Gamepad2, Sparkles, Wind, Eye, RotateCcw, Check, Plus, Cloud } from 'lucide-react';

export const CalmingGames: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'pebbles' | 'clouds' | 'grounding'>('pebbles');

  // Game 1: Zen Pebble Balancer State
  const [stones, setStones] = useState<{ id: number; width: number; height: number; x: number; y: number; color: string }[]>([]);
  const [isStable, setIsStable] = useState(true);

  const stoneColors = ['#1B4326', '#2E6F40', '#5F996F', '#B9D2B9', '#C8B87E', '#8B7B42'];

  const resetPebbles = () => {
    setStones([
      { id: 1, width: 140, height: 32, x: 100, y: 220, color: '#1B4326' }
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
      <div className="bg-[#1B4326] text-[#F4F1EA] rounded-2xl p-6 sm:p-8 border-2 border-[#1B4326] shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#B9D2B9] text-[#1B4326] text-xs font-bold mb-3 border border-[#2E6F40]/30">
            <Gamepad2 className="w-3.5 h-3.5 text-[#1B4326]" />
            <span>Cognitive Play & Somatic Grounding</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-normal text-[#F4F1EA]">
            Calm Micro-Games for Mental De-escalation.
          </h1>
          <p className="mt-2 text-sm text-[#F4F1EA]/85 leading-relaxed font-normal">
            Gentle interactive tools designed to pull your attention away from catastrophic future loops and gently anchor it back in physical presence.
          </p>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex space-x-2 border-b border-[#D8D4C9] pb-2">
        <button
          onClick={() => setActiveGame('pebbles')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeGame === 'pebbles'
              ? 'bg-[#1B4326] text-[#F4F1EA] shadow'
              : 'text-[#2B2E2B]/80 hover:text-[#1B4326] hover:bg-[#B9D2B9]/30'
          }`}
        >
          Zen Pebble Balancer
        </button>
        <button
          onClick={() => setActiveGame('clouds')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeGame === 'clouds'
              ? 'bg-[#1B4326] text-[#F4F1EA] shadow'
              : 'text-[#2B2E2B]/80 hover:text-[#1B4326] hover:bg-[#B9D2B9]/30'
          }`}
        >
          Thought Cloud Unhooker
        </button>
        <button
          onClick={() => setActiveGame('grounding')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeGame === 'grounding'
              ? 'bg-[#1B4326] text-[#F4F1EA] shadow'
              : 'text-[#2B2E2B]/80 hover:text-[#1B4326] hover:bg-[#B9D2B9]/30'
          }`}
        >
          5-4-3-2-1 Sensory Grounder
        </button>
      </div>

      {/* Game 1: Zen Pebble Balancer */}
      {activeGame === 'pebbles' && (
        <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#D8D4C9] shadow-sm space-y-5 text-[#2B2E2B]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#1B4326]">Zen River Stone Tower</h3>
              <p className="text-xs text-[#2B2E2B]/75">
                Stack smooth river stones one by one. Practice steady patience with every placement.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleAddStone}
                disabled={stones.length >= 7}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#1B4326] hover:bg-[#2E6F40] disabled:opacity-50 text-[#F4F1EA] text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>Place Next Pebble ({stones.length}/7)</span>
              </button>
              <button
                onClick={resetPebbles}
                className="p-2 rounded-lg bg-[#F4F1EA] text-[#2B2E2B] border border-[#D8D4C9] hover:text-[#1B4326]"
                title="Reset Tower"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stacking Canvas Area */}
          <div className="h-72 bg-[#F4F1EA] rounded-xl border border-[#D8D4C9] flex flex-col justify-end items-center pb-6 relative overflow-hidden">
            {/* Ambient Water Horizon Line */}
            <div className="absolute bottom-6 w-full border-b border-[#2E6F40]/20"></div>

            <div className="relative z-10 flex flex-col items-center">
              {stones.map((s, idx) => (
                <div
                  key={s.id}
                  className="rounded-full shadow-md transition-all duration-300 flex items-center justify-center my-0.5"
                  style={{
                    width: `${s.width}px`,
                    height: `${s.height}px`,
                    backgroundColor: s.color,
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <span className="text-[10px] text-[#F4F1EA] font-mono select-none font-medium">
                    {idx === 0 ? 'Foundation' : `Stone ${idx + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#B9D2B9]/30 border border-[#2E6F40]/30 text-xs text-[#1B4326] text-center font-medium">
            {stones.length >= 7 ? "✨ Tower complete. Take a deep, appreciative breath." : "Place another stone gently to test your focus."}
          </div>
        </div>
      )}

      {/* Game 2: Thought Cloud Unhooker */}
      {activeGame === 'clouds' && (
        <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#D8D4C9] shadow-sm space-y-5 text-[#2B2E2B]">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#1B4326]">Cognitive Defusion Cloud Dissolver</h3>
            <p className="text-xs text-[#2B2E2B]/75">
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
              className="flex-1 bg-[#F4F1EA] text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-[#D8D4C9] text-[#2B2E2B] focus:outline-none focus:border-[#1B4326]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] text-xs sm:text-sm font-semibold shadow"
            >
              Materialize Cloud
            </button>
          </form>

          {/* Sky Canvas with Floating Clouds */}
          <div className="min-h-64 p-6 bg-[#F4F1EA] rounded-xl border border-[#D8D4C9] flex flex-wrap gap-4 items-center justify-center">
            {clouds.length === 0 ? (
              <div className="text-center text-[#2B2E2B]/70 text-xs">
                <Sparkles className="w-6 h-6 mx-auto text-[#2E6F40] mb-2" />
                <span className="font-serif italic text-sm text-[#1B4326]">The sky of your mind is clear right now.</span>
              </div>
            ) : (
              clouds.map((cloud) => (
                <div
                  key={cloud.id}
                  onClick={() => handleDissolveCloud(cloud.id)}
                  className="cursor-pointer group relative p-4 rounded-3xl bg-[#FFFFFF] hover:bg-rose-50 border-2 border-[#D8D4C9] hover:border-rose-400 text-xs text-[#2B2E2B] max-w-xs shadow transition-all transform hover:-translate-y-1"
                  title="Click to dissolve and unhook from this thought"
                >
                  <div className="flex items-center space-x-2 mb-1 text-[#2E6F40] group-hover:text-rose-600">
                    <Cloud className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Passing Thought (Click to Dissolve)</span>
                  </div>
                  <p className="font-medium text-[#1B4326] font-serif">{cloud.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Game 3: 5-4-3-2-1 Sensory Grounding */}
      {activeGame === 'grounding' && (
        <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#D8D4C9] shadow-sm space-y-6 text-[#2B2E2B]">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#1B4326]">5-4-3-2-1 Sensory Somatic Guide</h3>
            <p className="text-xs text-[#2B2E2B]/75">
              The gold-standard psychological exercise to anchor a nervous system spiraling into panic.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F4F1EA] border border-[#D8D4C9] flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#B9D2B9] text-[#1B4326] font-serif font-extrabold text-2xl flex items-center justify-center border-2 border-[#1B4326]">
              {groundingSteps[groundingStep].count}
            </div>

            <h4 className="text-lg font-serif font-bold text-[#1B4326] max-w-md">
              {groundingSteps[groundingStep].prompt}
            </h4>

            <p className="text-xs text-[#2B2E2B]/75 italic max-w-sm">
              "{groundingSteps[groundingStep].icon}"
            </p>

            <div className="pt-4 flex space-x-3">
              {groundingStep > 0 && (
                <button
                  onClick={() => setGroundingStep(groundingStep - 1)}
                  className="px-4 py-2 rounded-lg bg-[#FFFFFF] hover:bg-[#D8D4C9]/40 text-[#2B2E2B] text-xs border border-[#D8D4C9]"
                >
                  Previous
                </button>
              )}
              {groundingStep < groundingSteps.length - 1 ? (
                <button
                  onClick={() => setGroundingStep(groundingStep + 1)}
                  className="px-6 py-2 rounded-lg bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] text-xs font-semibold shadow"
                >
                  I've Noticed These ({groundingStep + 1}/5)
                </button>
              ) : (
                <button
                  onClick={() => setGroundingStep(0)}
                  className="px-6 py-2 rounded-lg bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] text-xs font-semibold shadow"
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
