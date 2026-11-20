import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Volume2, VolumeX, Wind } from 'lucide-react';

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  phases: { name: string; duration: number }[];
  targetMood: string;
}

const PATTERNS: BreathingPattern[] = [
  {
    id: '4-7-8',
    name: '4-7-8 Deep Relaxation',
    description: 'Dr. Andrew Weil’s classic natural tranquilizer for the nervous system.',
    targetMood: 'Acute Panic, Chest Tightness & Bedtime Overwhelm',
    phases: [
      { name: 'Inhale (Nose)', duration: 4 },
      { name: 'Hold Gently', duration: 7 },
      { name: 'Slow Exhale (Mouth)', duration: 8 }
    ]
  },
  {
    id: 'box',
    name: 'Box Breathing (4-4-4-4)',
    description: 'Used by high-stress professionals and first responders to clear cortisol surges.',
    targetMood: 'Work Stress, Imposter Syndrome & Brain Fog',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold Full', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Hold Empty', duration: 4 }
    ]
  },
  {
    id: 'resonance',
    name: 'Resonant Coherence (5.5s)',
    description: 'Brings heart rate variability (HRV) into optimal 0.1Hz cardiovascular resonance.',
    targetMood: 'Restlessness, Scatter & Sensory Fatigue',
    phases: [
      { name: 'Smooth Inhale', duration: 5.5 },
      { name: 'Smooth Exhale', duration: 5.5 }
    ]
  },
  {
    id: '7-11',
    name: '7-11 Panic Release',
    description: 'Longer exhale stimulates the vagus nerve and shuts down the fight-or-flight response.',
    targetMood: 'Severe Spiraling, Overstimulation & Anxiety',
    phases: [
      { name: 'Deep Inhale', duration: 7 },
      { name: 'Prolonged Exhale', duration: 11 }
    ]
  }
];

export const BreathingExercise: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(PATTERNS[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeRemainingInPhase, setTimeRemainingInPhase] = useState(PATTERNS[0].phases[0].duration);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Web Audio Context for soft chime
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSoftChime = (freq = 440) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch (e) {
      // Audio autoplay restriction fallback
    }
  };

  useEffect(() => {
    let timer: any = null;

    if (isActive) {
      const currentPhase = selectedPattern.phases[currentPhaseIndex];
      timer = setInterval(() => {
        setTimeRemainingInPhase((prev) => {
          if (prev <= 0.1) {
            // Next phase
            const nextPhaseIndex = (currentPhaseIndex + 1) % selectedPattern.phases.length;
            if (nextPhaseIndex === 0) {
              setCyclesCompleted((c) => c + 1);
            }
            setCurrentPhaseIndex(nextPhaseIndex);
            playSoftChime(nextPhaseIndex === 0 ? 528 : 432);
            return selectedPattern.phases[nextPhaseIndex].duration;
          }
          return Math.max(0, +(prev - 0.1).toFixed(1));
        });
      }, 100);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, currentPhaseIndex, selectedPattern, soundEnabled]);

  const handleSelectPattern = (pattern: BreathingPattern) => {
    setSelectedPattern(pattern);
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setTimeRemainingInPhase(pattern.phases[0].duration);
    setCyclesCompleted(0);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setTimeRemainingInPhase(selectedPattern.phases[0].duration);
    setCyclesCompleted(0);
  };

  const currentPhase = selectedPattern.phases[currentPhaseIndex];
  const phaseProgress = 1 - timeRemainingInPhase / currentPhase.duration;

  // Calculate breathing scale for animation
  let scale = 1;
  if (currentPhase.name.toLowerCase().includes('inhale')) {
    scale = 1 + phaseProgress * 0.45;
  } else if (currentPhase.name.toLowerCase().includes('hold')) {
    scale = currentPhaseIndex === 1 ? 1.45 : 1.0;
  } else {
    // Exhale
    scale = 1.45 - phaseProgress * 0.45;
  }

  return (
    <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#D8D4C9] shadow-sm space-y-6 text-[#2B2E2B]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8D4C9] pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-[#2E6F40] font-semibold mb-1">
            <Wind className="w-3.5 h-3.5" />
            <span>Somatic Vagus Nerve Regulation</span>
          </div>
          <h2 className="text-xl font-serif font-bold text-[#1B4326]">Visual Breathing Pacer</h2>
          <p className="text-xs text-[#2B2E2B]/75">
            Suggested based on your stress level to drop heart rate within 3 minutes
          </p>
        </div>

        {/* Mute Chime Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#F4F1EA] text-[#2B2E2B] hover:text-[#1B4326] border border-[#D8D4C9] self-start sm:self-auto font-medium"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#2E6F40]" /> : <VolumeX className="w-3.5 h-3.5 text-[#2B2E2B]/50" />}
          <span>{soundEnabled ? 'Chime Active' : 'Muted'}</span>
        </button>
      </div>

      {/* Pattern Selector Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {PATTERNS.map((p) => {
          const isSelected = selectedPattern.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleSelectPattern(p)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#B9D2B9] border-[#1B4326] text-[#1B4326] shadow-sm font-bold ring-1 ring-[#1B4326]/40'
                  : 'bg-[#F4F1EA] border-[#D8D4C9] text-[#2B2E2B]/80 hover:text-[#1B4326] hover:border-[#1B4326]'
              }`}
            >
              <span className="font-bold text-xs block text-[#1B4326]">{p.name}</span>
              <span className="text-[10px] text-[#2B2E2B]/70 block line-clamp-1 mt-0.5">{p.targetMood}</span>
            </button>
          );
        })}
      </div>

      {/* Breathing Visual Canvas Center */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Outer Ripple Wave */}
          <div
            className="absolute rounded-full border border-[#2E6F40]/30 transition-all duration-300 ease-out"
            style={{
              width: `${scale * 170}px`,
              height: `${scale * 170}px`,
              opacity: isActive ? 0.6 : 0.2
            }}
          ></div>

          {/* Core Breathing Orb */}
          <div
            className="relative rounded-full flex flex-col items-center justify-center transition-all duration-200 ease-out shadow-lg"
            style={{
              width: `${scale * 130}px`,
              height: `${scale * 130}px`,
              background: currentPhase.name.toLowerCase().includes('inhale')
                ? 'radial-gradient(circle, rgba(185,210,185,0.9) 0%, rgba(46,111,64,0.6) 70%, transparent 100%)'
                : currentPhase.name.toLowerCase().includes('hold')
                ? 'radial-gradient(circle, rgba(200,184,126,0.9) 0%, rgba(139,115,50,0.6) 70%, transparent 100%)'
                : 'radial-gradient(circle, rgba(27,67,38,0.85) 0%, rgba(19,50,28,0.7) 70%, transparent 100%)',
              border: '2px solid #1B4326'
            }}
          >
            <span className="text-sm sm:text-base font-serif font-bold text-[#F4F1EA] tracking-wide text-center px-4">
              {currentPhase.name}
            </span>
            <span className="text-3xl sm:text-4xl font-mono font-extrabold text-[#F4F1EA] mt-1">
              {Math.ceil(timeRemainingInPhase)}s
            </span>
          </div>
        </div>

        {/* Phase Details & Cycle Progress */}
        <div className="mt-4 text-center space-y-1">
          <p className="text-xs text-[#2B2E2B]/80 font-medium">{selectedPattern.description}</p>
          <span className="text-xs font-mono text-[#2E6F40] block font-semibold">
            Cycles Completed: <strong>{cyclesCompleted}</strong> / 4 Recommended
          </span>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center space-x-3">
          <button
            onClick={() => {
              if (!isActive) playSoftChime(440);
              setIsActive(!isActive);
            }}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow transition-all ${
              isActive
                ? 'bg-amber-700 hover:bg-amber-800 text-white'
                : 'bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA]'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pause Pacer' : 'Begin Breathing Session'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-[#F4F1EA] hover:bg-[#B9D2B9]/40 text-[#2B2E2B] border border-[#D8D4C9] transition-colors"
            title="Reset Pacer"
          >
            <RotateCcw className="w-4 h-4 text-[#1B4326]" />
          </button>
        </div>
      </div>
    </div>
  );
};
