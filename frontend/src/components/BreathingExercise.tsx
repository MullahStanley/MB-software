import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

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
    name: '4-7-8 relaxation',
    description: 'A natural tranquilizer for acute stress and bedtime restlessness.',
    targetMood: 'For tight chest & anxiety',
    phases: [
      { name: 'Inhale through nose', duration: 4 },
      { name: 'Hold breath', duration: 7 },
      { name: 'Exhale through mouth', duration: 8 }
    ]
  },
  {
    id: 'box',
    name: 'Box breathing (4-4-4-4)',
    description: 'Regulates the nervous system during intense work or study pressure.',
    targetMood: 'For work stress & focus',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Hold', duration: 4 }
    ]
  },
  {
    id: 'resonance',
    name: 'Resonant breathing (5.5s)',
    description: 'Aligns heart-rate variability into natural 0.1Hz coherence.',
    targetMood: 'For mental fatigue',
    phases: [
      { name: 'Smooth inhale', duration: 5.5 },
      { name: 'Smooth exhale', duration: 5.5 }
    ]
  },
  {
    id: '7-11',
    name: '7-11 calm',
    description: 'A longer exhale stimulates the vagus nerve to slow heart rate.',
    targetMood: 'For acute overwhelm',
    phases: [
      { name: 'Inhale', duration: 7 },
      { name: 'Long exhale', duration: 11 }
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
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.1);
    } catch (e) {}
  };

  useEffect(() => {
    let timer: any = null;

    if (isActive) {
      timer = setInterval(() => {
        setTimeRemainingInPhase((prev) => {
          if (prev <= 0.1) {
            const nextPhaseIndex = (currentPhaseIndex + 1) % selectedPattern.phases.length;
            if (nextPhaseIndex === 0) {
              setCyclesCompleted((c) => c + 1);
            }
            setCurrentPhaseIndex(nextPhaseIndex);
            playSoftChime(nextPhaseIndex === 0 ? 528 : 440);
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

  let scale = 1;
  if (currentPhase.name.toLowerCase().includes('inhale')) {
    scale = 1 + phaseProgress * 0.35;
  } else if (currentPhase.name.toLowerCase().includes('hold')) {
    scale = currentPhaseIndex === 1 ? 1.35 : 1.0;
  } else {
    scale = 1.35 - phaseProgress * 0.35;
  }

  return (
    <section className="panel p-5 sm:p-6" aria-labelledby="pacer-heading">
      <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow mb-1">Breathing pacer</p>
          <h2 id="pacer-heading" className="text-lg font-semibold tracking-tight">Guided visual pacer</h2>
          <p className="text-xs text-slate-500">
            Follow the rhythm to lower your heart rate within three minutes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="btn btn-sm btn-outline self-start sm:self-auto"
          aria-pressed={soundEnabled}
        >
          {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" /> : <VolumeX className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />}
          <span>{soundEnabled ? 'Chime on' : 'Muted'}</span>
        </button>
      </div>

      {/* Pattern selector */}
      <fieldset>
        <legend className="sr-only">Choose a breathing pattern</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {PATTERNS.map((p) => {
            const isSelected = selectedPattern.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPattern(p)}
                aria-pressed={isSelected}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  isSelected
                    ? 'border-forest-600 bg-forest-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <span className="block text-xs font-semibold text-slate-900">{p.name}</span>
                <span className="mt-0.5 block line-clamp-1 text-[11px] text-slate-500">{p.targetMood}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Visual breathing orb */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative flex h-64 w-64 items-center justify-center">
          {/* Outer ring */}
          <div
            className="absolute rounded-full border border-forest-200 transition-all duration-300"
            style={{
              width: `${scale * 170}px`,
              height: `${scale * 170}px`,
            }}
          ></div>

          {/* Central orb */}
          <div
            className="relative flex flex-col items-center justify-center rounded-full border border-forest-300 transition-all duration-200"
            style={{
              width: `${scale * 135}px`,
              height: `${scale * 135}px`,
              backgroundColor: currentPhase.name.toLowerCase().includes('inhale')
                ? '#dcfce7'
                : currentPhase.name.toLowerCase().includes('hold')
                ? '#f0fdf4'
                : '#bbf7d0',
            }}
          >
            <span className="px-4 text-center text-xs font-semibold tracking-wide text-forest-900">
              {currentPhase.name}
            </span>
            <span className="mt-1 font-mono text-3xl font-bold text-forest-900">
              {Math.ceil(timeRemainingInPhase)}s
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-1 text-center">
          <p className="text-sm text-slate-600">{selectedPattern.description}</p>
          <span className="block font-mono text-xs font-semibold text-forest-700">
            Cycles completed: {cyclesCompleted} / 4 recommended
          </span>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (!isActive) playSoftChime(440);
              setIsActive(!isActive);
            }}
            className={`btn ${isActive ? 'bg-slate-800 text-white hover:bg-slate-700' : 'btn-primary'}`}
          >
            {isActive ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            <span>{isActive ? 'Pause' : 'Start pacer'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="btn btn-icon btn-outline"
            title="Reset pacer"
            aria-label="Reset pacer"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};
