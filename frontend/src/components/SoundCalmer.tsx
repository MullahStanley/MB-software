import React, { useState, useEffect, useRef } from 'react';
import { Headphones, Volume2, VolumeX, Play, Pause, Clock, Sparkles } from 'lucide-react';

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

  // Initialize or resume AudioContext
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
    gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
    gain.connect(ctx.destination);
    gainNodeRef.current = gain;

    if (type === 'white') {
      // White Noise synthesis
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
      // Brown Noise synthesis (integrating white noise for 1/f^2 warm rumble)
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Compensate for low amplitude
      }
      const brownSource = ctx.createBufferSource();
      brownSource.buffer = buffer;
      brownSource.loop = true;
      brownSource.connect(gain);
      brownSource.start();
      sourceNodeRef.current = brownSource;
    } else if (type === 'pink') {
      // Pink Noise synthesis (Paul Kellet's filter method)
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
      // 432Hz ambient harmonic drone
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(216, ctx.currentTime);
      osc2.frequency.setValueAtTime(220, ctx.currentTime); // 4Hz delta wave beat

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

  // Handle Volume change
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume * 0.4, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Timer countdown
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
    <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-indigo-400 font-semibold mb-1">
            <Headphones className="w-3.5 h-3.5" />
            <span>Pure Web Audio Neuro-Synthesizer</span>
          </div>
          <h2 className="text-xl font-bold text-white">Brown & White Noise Calmer</h2>
          <p className="text-xs text-slate-400">
            Synthesized directly in your browser. Masks intrusive thoughts, ADHD chatter, and external office/city din.
          </p>
        </div>

        {/* Master Play/Pause Header */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all ${
            isPlaying
              ? 'bg-rose-600 hover:bg-rose-500 text-white'
              : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-500/20'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isPlaying ? 'Mute Soundscape' : 'Play Soundscape'}</span>
        </button>
      </div>

      {/* Sound Type Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            type: 'brown' as NoiseType,
            title: 'Deep Brown Noise',
            subtitle: 'Warm, low-frequency rumble like a heavy waterfall. Deeply calming for ADHD & high cortisol.'
          },
          {
            type: 'white' as NoiseType,
            title: 'Crisp White Noise',
            subtitle: 'Full-spectrum static mask for tinnitus, chatty roommates, and sleep initiation.'
          },
          {
            type: 'pink' as NoiseType,
            title: 'Rain Pink Noise',
            subtitle: 'Balanced acoustic slope reminiscent of rustling leaves and steady gentle rainfall.'
          },
          {
            type: 'binaural' as NoiseType,
            title: '432Hz Delta Drone',
            subtitle: 'Subtle harmonic binaural pulsation promoting restorative parasympathetic states.'
          }
        ].map((item) => {
          const isCurrent = activeNoise === item.type;
          return (
            <div
              key={item.type}
              onClick={() => handleSelectNoise(item.type)}
              className={`p-4 rounded-xl cursor-pointer border transition-all ${
                isCurrent && isPlaying
                  ? 'bg-slate-850 border-teal-500 shadow-md shadow-teal-500/10 ring-1 ring-teal-500/40'
                  : 'bg-slate-850/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{item.title}</span>
                {isCurrent && isPlaying && (
                  <span className="flex space-x-0.5">
                    <span className="w-1 h-3 bg-teal-400 rounded-full animate-bounce"></span>
                    <span className="w-1 h-3 bg-teal-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1 h-3 bg-teal-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{item.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Volume Slider & Session Timer */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Volume Control */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-300">
            <span className="flex items-center space-x-1.5">
              <Volume2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Acoustic Output Level</span>
            </span>
            <span className="font-mono text-teal-400 font-bold">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer"
          />
        </div>

        {/* Timer Presets */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-300">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Timer</span>
            </span>
            <span className="font-mono text-indigo-400 font-bold">
              {formatTimer(timerSecondsLeft)}
            </span>
          </div>
          <div className="flex space-x-2">
            {[5, 15, 30, null].map((mins) => {
              const selected = timerMinutes === mins;
              return (
                <button
                  key={mins === null ? 'inf' : mins}
                  onClick={() => handleSelectTimer(mins)}
                  className={`flex-1 py-1 text-xs rounded border transition-all ${
                    selected
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {mins === null ? 'Continuous' : `${mins}m`}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
