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
    <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-teal-400 font-semibold mb-1">
            <Wind className="w-3.5 h-3.5" />
            <span>Somatic Vagus Nerve Regulation</span>
          </div>
          <h2 className="text-xl font-bold text-white">Visual Breathing Pacer</h2>
          <p className="text-xs text-slate-400">
            Suggested based on your stress level to drop heart rate within 3 minutes
          </p>
        </div>

        {/* Mute Chime Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 self-start sm:self-auto"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-teal-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
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
                  ? 'bg-teal-500/15 border-teal-500 text-white shadow-md shadow-teal-500/10 ring-1 ring-teal-500/40'
                  : 'bg-slate-850/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className="font-bold text-xs block text-teal-300">{p.name}</span>
              <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">{p.targetMood}</span>
            </button>
          );
        })}
      </div>

      {/* Breathing Visual Canvas Center */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Outer Ripple Wave */}
          <div
            className="absolute rounded-full border border-teal-500/20 transition-all duration-300 ease-out"
            style={{
              width: `${scale * 170}px`,
              height: `${scale * 170}px`,
              opacity: isActive ? 0.6 : 0.2
            }}
          ></div>

          {/* Core Breathing Orb */}
          <div
            className="relative rounded-full flex flex-col items-center justify-center transition-all duration-200 ease-out shadow-2xl"
            style={{
              width: `${scale * 130}px`,
              height: `${scale * 130}px`,
              background: currentPhase.name.toLowerCase().includes('inhale')
                ? 'radial-gradient(circle, rgba(45,212,191,0.6) 0%, rgba(13,148,136,0.3) 70%, transparent 100%)'
                : currentPhase.name.toLowerCase().includes('hold')
                ? 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, rgba(67,56,202,0.3) 70%, transparent 100%)'
                : 'radial-gradient(circle, rgba(16,185,129,0.5) 0%, rgba(5,150,105,0.2) 70%, transparent 100%)',
              border: '2px solid rgba(45, 212, 191, 0.4)'
            }}
          >
            <span className="text-sm sm:text-base font-extrabold text-white tracking-wide text-center px-4">
              {currentPhase.name}
            </span>
            <span className="text-3xl sm:text-4xl font-mono font-extrabold text-teal-200 mt-1">
              {Math.ceil(timeRemainingInPhase)}s
            </span>
          </div>
        </div>

        {/* Phase Details & Cycle Progress */}
        <div className="mt-4 text-center space-y-1">
          <p className="text-xs text-slate-300">{selectedPattern.description}</p>
          <span className="text-xs font-mono text-teal-400 block">
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
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all ${
              isActive
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-500/20'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pause Pacer' : 'Begin Breathing Session'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Reset Pacer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
