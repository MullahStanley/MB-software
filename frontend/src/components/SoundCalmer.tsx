import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, Clock } from 'lucide-react';

type NoiseType = 'brown' | 'white' | 'pink' | 'binaural';

export const SoundCalmer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNoise, setActiveNoise] = useState<NoiseType>('brown');
  const [volume, setVolume] = useState(0.5);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(15);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(15 * 60);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioNode | null>(null);
  const secondSourceRef = useRef<AudioNode | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      try {
        (sourceNodeRef.current as any).stop?.();
        sourceNodeRef.current.disconnect();
      } catch (e) {}
      sourceNodeRef.current = null;
    }
    if (secondSourceRef.current) {
      try {
        (secondSourceRef.current as any).stop?.();
        secondSourceRef.current.disconnect();
      } catch (e) {}
      secondSourceRef.current = null;
    }
  };

  const startAudio = (type: NoiseType) => {
    stopAudio();
    const ctx = getAudioContext();

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.35, ctx.currentTime);
    gain.connect(ctx.destination);
    gainNodeRef.current = gain;

    if (type === 'white') {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const whiteSource = ctx.createBufferSource();
      whiteSource.buffer = buffer;
      whiteSource.loop = true;
      whiteSource.connect(gain);
      whiteSource.start();
      sourceNodeRef.current = whiteSource;
    } else if (type === 'brown') {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
      const brownSource = ctx.createBufferSource();
      brownSource.buffer = buffer;
      brownSource.loop = true;
      brownSource.connect(gain);
      brownSource.start();
      sourceNodeRef.current = brownSource;
    } else if (type === 'pink') {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }
      const pinkSource = ctx.createBufferSource();
      pinkSource.buffer = buffer;
      pinkSource.loop = true;
      pinkSource.connect(gain);
      pinkSource.start();
      sourceNodeRef.current = pinkSource;
    } else if (type === 'binaural') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(216, ctx.currentTime);
      osc2.frequency.setValueAtTime(220, ctx.currentTime);

      const merger = ctx.createChannelMerger(2);
      osc1.connect(merger, 0, 0);
      osc2.connect(merger, 0, 1);
      merger.connect(gain);

      osc1.start();
      osc2.start();
      sourceNodeRef.current = osc1;
      secondSourceRef.current = osc2;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startAudio(activeNoise);
    } else {
      stopAudio();
    }
    return () => {
      stopAudio();
    };
  }, [isPlaying, activeNoise]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume * 0.35, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying && timerSecondsLeft !== null && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev && prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timerSecondsLeft]);

  const handleSelectNoise = (type: NoiseType) => {
    setActiveNoise(type);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const handleSelectTimer = (mins: number | null) => {
    setTimerMinutes(mins);
    setTimerSecondsLeft(mins ? mins * 60 : null);
  };

  const formatTimer = (secs: number | null) => {
    if (secs === null) return 'Continuous';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section className="panel p-5 sm:p-6" aria-labelledby="sound-heading">
      <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow mb-1">Soundscapes</p>
          <h2 id="sound-heading" className="text-lg font-semibold tracking-tight">Noise generator</h2>
          <p className="text-xs text-slate-500">
            Synthesized locally in your browser — nothing streams, nothing is tracked.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className={`btn self-start sm:self-auto ${isPlaying ? 'bg-slate-800 text-white hover:bg-slate-700' : 'btn-primary'}`}
        >
          {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          <span>{isPlaying ? 'Stop audio' : 'Play audio'}</span>
        </button>
      </div>

      {/* Noise types */}
      <fieldset>
        <legend className="sr-only">Choose a soundscape</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              type: 'brown' as NoiseType,
              title: 'Deep brown noise',
              subtitle: 'Warm waterfall rumble. Calms focus jitter and nervous tension.'
            },
            {
              type: 'white' as NoiseType,
              title: 'Crisp white noise',
              subtitle: 'Standard background static for masking conversation and sleep.'
            },
            {
              type: 'pink' as NoiseType,
              title: 'Gentle pink noise',
              subtitle: 'Balanced frequencies resembling steady falling rain.'
            },
            {
              type: 'binaural' as NoiseType,
              title: '432Hz calm drone',
              subtitle: 'Subtle harmonic tone for grounding meditation.'
            }
          ].map((item) => {
            const isCurrent = activeNoise === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => handleSelectNoise(item.type)}
                aria-pressed={isCurrent && isPlaying}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  isCurrent && isPlaying
                    ? 'border-forest-600 bg-forest-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">{item.title}</span>
                  {isCurrent && isPlaying && (
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-forest-600" aria-hidden="true"></span>
                  )}
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{item.subtitle}</p>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Sliders */}
      <div className="mt-4 grid grid-cols-1 items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
        {/* Volume */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-700">
            <label htmlFor="volume-range" className="flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
              <span>Volume</span>
            </label>
            <span className="font-mono text-forest-700">{Math.round(volume * 100)}%</span>
          </div>
          <input
            id="volume-range"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full cursor-pointer accent-forest-600"
          />
        </div>

        {/* Timer */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-700">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span>Timer</span>
            </span>
            <span className="font-mono font-semibold text-slate-700">{formatTimer(timerSecondsLeft)}</span>
          </div>
          <div className="flex gap-1.5" role="group" aria-label="Sleep timer">
            {[5, 15, 30, null].map((mins) => {
              const selected = timerMinutes === mins;
              return (
                <button
                  key={mins === null ? 'inf' : mins}
                  type="button"
                  onClick={() => handleSelectTimer(mins)}
                  aria-pressed={selected}
                  className={`btn btn-sm flex-1 ${
                    selected ? 'border border-forest-600 bg-forest-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {mins === null ? 'Continuous' : `${mins}m`}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
