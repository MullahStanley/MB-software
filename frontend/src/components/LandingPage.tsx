import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Compass,
  Activity,
  Wind,
  Headphones,
  BookOpen,
  Gamepad2,
  MessageSquareHeart,
  ShieldAlert,
  Lock,
  ArrowRight,
  CheckCircle2,
  Heart,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Users,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Zap,
  TrendingUp,
  Brain,
  Shield,
  Clock,
  Quote
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  onOpenEmergency: () => void;
  onOpenTransparency: () => void;
  onOpenPro: () => void;
}

const COMMUNITIES_PREVIEW = [
  {
    id: 'quarter-life',
    title: 'Quarter-Life & Navigating the Unknown',
    tagline: 'Post-grad shock, feeling behind peers, and redefining success',
    stats: '94% report comparison anxiety',
    topTopic: 'Comparing my 23yo progress to LinkedIn influencers',
    sampleHandle: '@QuietWanderer24',
    icon: Compass,
    color: 'border-[#1B4326]'
  },
  {
    id: 'career-burnout',
    title: 'Early Career, Grind Culture & Burnout',
    tagline: 'First jobs, imposter syndrome, and boundary guilt',
    stats: '89% experience Sunday scaries & Slack dread',
    topTopic: 'How to shut off notifications without getting fired',
    sampleHandle: '@OverthinkingDev',
    icon: Zap,
    color: 'border-[#2E6F40]'
  },
  {
    id: 'financial-dread',
    title: 'Cost of Living & Financial Dread',
    tagline: 'Rent spikes, student loans, and social spending guilt',
    stats: '96% stress over emergency savings buffer',
    topTopic: 'Turning down dinners because rent jumped 18%',
    sampleHandle: '@BudgetSurvivalist',
    icon: Activity,
    color: 'border-[#1B4326]'
  },
  {
    id: 'social-loneliness',
    title: 'Social Shifts, Modern Dating & Loneliness',
    tagline: 'Making adult friends, ghosting fatigue, and empty weekends',
    stats: '82% report lack of physical third spaces',
    topTopic: 'Why does adult friend-making feel like job interviews?',
    sampleHandle: '@CalmRiver',
    icon: Users,
    color: 'border-[#2E6F40]'
  },
  {
    id: 'family-boundaries',
    title: 'Family Boundaries & Breaking Cycles',
    tagline: 'Parental expectations, cultural guilt, and emotional maturity',
    stats: '87% struggle saying no to family demands',
    topTopic: 'Navigating guilt when moving 300 miles away',
    sampleHandle: '@CycleBreaker',
    icon: Heart,
    color: 'border-[#1B4326]'
  },
  {
    id: 'sensory-overload',
    title: 'Sensory Overload & Doomscroll Detox',
    tagline: 'Screen fatigue, algorithmic rage, and revenge bedtime delay',
    stats: '91% average 5+ hours of late-night doomscrolling',
    topTopic: 'Revenge bedtime procrastination breaking my 8am meetings',
    sampleHandle: '@OfflineSeeker',
    icon: Wind,
    color: 'border-[#2E6F40]'
  }
];

const SAFETY_TIERS = [
  {
    tier: 'Tier 1',
    name: 'Gentle Peer Connection',
    desc: 'Automatic suggestions to relate with peers facing identical developmental friction, breaking isolation.',
    action: 'Join Peer Space'
  },
  {
    tier: 'Tier 2',
    name: 'Psychoeducation & Somatic Guides',
    desc: 'Targeted ACT/CBT cognitive defusion micro-articles and nervous system down-regulation guides.',
    action: 'Read Grounding Tools'
  },
  {
    tier: 'Tier 3',
    name: 'Somatic Breath & Noise Synthesizer',
    desc: 'Visual vagus nerve breath pacing (4-7-8, Box) combined with browser-generated acoustic brown/pink noise.',
    action: 'Regulate Vagus Nerve'
  },
  {
    tier: 'Tier 4',
    name: 'Trusted Contacts Reconnection',
    desc: 'Pre-composed, zero-shame micro-texts dispatched to your chosen inner circle to break silent spirals.',
    action: 'Low-Pressure SMS'
  },
  {
    tier: 'Tier 5',
    name: 'Crisis Lifelines & Specialists',
    desc: 'Immediate 1-tap direct access to 988 Suicide & Crisis Lifeline, Crisis Text Line (741741), and vetted specialists.',
    action: 'Direct 988 Escalation'
  },
  {
    tier: 'Tier 6',
    name: 'Automated Circle Safeguard',
    desc: 'Optional high-threshold automated safety check dispatched to emergency circle when self-escalation stalls.',
    action: 'Automated Safeguard'
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenEmergency,
  onOpenTransparency,
  onOpenPro
}) => {
  // Live Breathwork Demo State
  const [breathActive, setBreathActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCountdown, setBreathCountdown] = useState(4);
  const [audioChime, setAudioChime] = useState(true);

  // Web Audio Noise Synthesizer State
  const [synthNoisePlaying, setSynthNoisePlaying] = useState<string | null>(null);
  const [synthVolume, setSynthVolume] = useState(0.25);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Breathwork 4-7-8 Timer Loop
  useEffect(() => {
    let timer: any;
    if (breathActive) {
      timer = setInterval(() => {
        setBreathCountdown((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (breathPhase === 'Inhale') {
              setBreathPhase('Hold');
              playSoftTone(330, 0.4);
              return 7;
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Exhale');
              playSoftTone(220, 0.6);
              return 8;
            } else {
              setBreathPhase('Inhale');
              playSoftTone(440, 0.3);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [breathActive, breathPhase, audioChime]);

  // Audio tone helper
  const playSoftTone = (freq: number, dur: number) => {
    if (!audioChime) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(0.04, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {
      // Audio autoplay policy
    }
  };

  // Acoustic noise synthesis generator (Brown and Pink noise)
  const toggleNoise = (type: 'brown' | 'pink') => {
    if (synthNoisePlaying === type) {
      stopNoise();
      return;
    }
    stopNoise();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      if (type === 'brown') {
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        }
      } else {
        // Pink noise (Paul Kellet's filtered method)
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
      }

      const whiteNoiseNode = ctx.createBufferSource();
      whiteNoiseNode.buffer = buffer;
      whiteNoiseNode.loop = true;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(synthVolume, ctx.currentTime);

      whiteNoiseNode.connect(gain);
      gain.connect(ctx.destination);
      whiteNoiseNode.start();

      noiseSourceRef.current = whiteNoiseNode;
      gainNodeRef.current = gain;
      setSynthNoisePlaying(type);
    } catch (e) {
      console.error('Audio synthesizer error:', e);
    }
  };

  const stopNoise = () => {
    if (noiseSourceRef.current) {
      try {
        (noiseSourceRef.current as any).stop?.();
      } catch (e) {}
      noiseSourceRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    setSynthNoisePlaying(null);
  };

  const handleVolumeChange = (vol: number) => {
    setSynthVolume(vol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(vol, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => stopNoise();
  }, []);

  const faqs = [
    {
      q: 'How is Mental Beacon different from a typical mood tracker or mindfulness app?',
      a: 'Generic apps sell you subscriptions to log 1-to-5 smiley faces, or put you on a 6-week waiting list for $200/hr therapists. Mental Beacon is designed around the developmental friction of 15–35 year olds (quarter-life shock, rent dread, Slack boundary burnout). It gives you instant acoustic noise generation, ACT/CBT cognitive defusion, anonymous shared-struggle peer spaces, 7-day somatic pattern trajectories, and a proactive 6-level safety threshold with 988 Lifeline integration.'
    },
    {
      q: 'Is my identity protected, and will my data ever be sold?',
      a: 'We operate under a strict Zero-Ad & Zero-Tracker guarantee. We do not use Meta Pixels, Google Analytics trackers, or TikTok SDKs. All community interaction is pseudonymous (e.g. @QuietWanderer24). Your private journal entries are encrypted client-side. You can export all your data in 1 click or permanently erase it.'
    },
    {
      q: 'How does the 6-Level Safety Threshold (Emergency Circle) work?',
      a: 'Distress is progressive. Rather than waiting for a crisis, Beacon monitors check-up patterns and keywords. At Level 1, it recommends peer connection. Level 3 engages vagus breath pacing. If acute limits are reached (Levels 4–6), it helps dispatch pre-written zero-pressure check-in messages to your designated Trusted Contacts, links to the 988 Suicide & Crisis Lifeline, and activates safety protocols.'
    },
    {
      q: 'Why is the Core Tier 100% free forever for young adults?',
      a: 'Mental health support should never be blocked by a paywall when you are stressed about rent or tuition. Mental Beacon is financially sustained through B2B partnerships with universities and employers who license our developmental wellbeing infrastructure to reduce overloaded campus counseling queues.'
    }
  ];

  return (
    <div className="w-full bg-[#F4F1EA] text-[#2B2E2B] transition-colors selection:bg-[#B9D2B9] selection:text-[#1B4326]">
      {/* 1. Announcement Pill */}
      <section className="pt-6 pb-2 px-4 max-w-7xl mx-auto flex justify-center">
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#B9D2B9]/50 border border-[#2E6F40]/30 text-xs sm:text-sm font-medium text-[#1B4326] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#2E6F40] animate-pulse"></span>
          <span>Impact-Driven Youth Wellbeing Sanctuary (15–35)</span>
          <span className="hidden md:inline text-[#2E6F40]/70">• Zero Ad Trackers • 100% Free Core Tier</span>
        </div>
      </section>

      {/* 2. Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#2E6F40] mb-3">
          EARTHY, CALM & AUTHENTIC WELLBEING
        </p>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#1B4326] font-normal tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
          A quiet place to breathe, ground, and connect when life feels heavy.
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-[#2B2E2B] max-w-3xl mx-auto font-normal leading-relaxed mb-10">
          Not another generic mood tracker or 6-week therapy waiting list. Mental Beacon is purpose-built
          for quarter-life dread, early career burnout, rent anxiety, and screen fatigue. Built with
          anonymous peer spaces, real-time acoustic audio, somatic breathwork, and a proactive 6-level safety circle.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={() => onNavigate('communities')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1B4326] text-[#F4F1EA] font-semibold text-base hover:bg-[#2E6F40] transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-3 group border-2 border-[#1B4326]"
          >
            <span>Enter Free Sanctuary</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#live-grounder"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FFFFFF] text-[#1B4326] font-semibold text-base hover:bg-[#B9D2B9]/30 transition-all border-2 border-[#1B4326] shadow-sm flex items-center justify-center space-x-2"
          >
            <Wind className="w-5 h-5 text-[#2E6F40]" />
            <span>Try 60s Grounder</span>
          </a>

          <button
            onClick={onOpenEmergency}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-rose-50 text-rose-900 font-semibold text-base hover:bg-rose-100 transition-all border-2 border-rose-300 shadow-sm flex items-center justify-center space-x-2"
          >
            <ShieldAlert className="w-5 h-5 text-rose-700 animate-pulse" />
            <span>Safety Circle (988)</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D8D4C9] shadow-sm">
            <div className="text-2xl font-bold text-[#1B4326] font-serif">100% Free</div>
            <div className="text-xs text-[#2B2E2B]/80 font-medium">Core Tier for All Youth (15–35)</div>
          </div>
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D8D4C9] shadow-sm">
            <div className="text-2xl font-bold text-[#1B4326] font-serif">Zero Trackers</div>
            <div className="text-xs text-[#2B2E2B]/80 font-medium">No Meta Pixels or Ad Data Brokers</div>
          </div>
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D8D4C9] shadow-sm">
            <div className="text-2xl font-bold text-[#1B4326] font-serif">6-Tier Safety</div>
            <div className="text-xs text-[#2B2E2B]/80 font-medium">Proactive Crisis Circle & 988 Lifeline</div>
          </div>
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D8D4C9] shadow-sm">
            <div className="text-2xl font-bold text-[#1B4326] font-serif">4.85 / 5.0</div>
            <div className="text-xs text-[#2B2E2B]/80 font-medium">Peer CSAT & Grounding Satisfaction</div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Live Grounding Experience (Instant Relief Widget) */}
      <section id="live-grounder" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-[#FFFFFF] border-2 border-[#1B4326] shadow-xl overflow-hidden p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#B9D2B9] text-[#1B4326] inline-block mb-3">
              Interactive Nervous System Reliever
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif text-[#1B4326] font-normal mb-3">
              Experience immediate grounding right now.
            </h2>
            <p className="text-sm sm:text-base text-[#2B2E2B]">
              No signup required. Test our somatic vagus pacer and acoustic web audio generators below to down-regulate your nervous system in 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Live Breath Pacer */}
            <div className="p-6 rounded-2xl bg-[#F4F1EA] border border-[#D8D4C9] flex flex-col items-center text-center">
              <div className="flex items-center justify-between w-full mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E6F40]">
                  4-7-8 Somatic Vagus Pacer
                </span>
                <button
                  onClick={() => setAudioChime(!audioChime)}
                  className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#D8D4C9] text-[#2B2E2B] hover:text-[#1B4326] text-xs flex items-center space-x-1"
                  title="Toggle gentle chime"
                >
                  {audioChime ? <Volume2 className="w-4 h-4 text-[#2E6F40]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                </button>
              </div>

              {/* Animated Circle */}
              <div className="relative w-48 h-48 my-4 flex items-center justify-center">
                <div
                  className={`absolute rounded-full transition-all duration-1000 border-4 border-[#2E6F40] bg-[#B9D2B9]/40 ${
                    breathActive
                      ? breathPhase === 'Inhale'
                        ? 'w-44 h-44 scale-110 shadow-lg'
                        : breathPhase === 'Hold'
                        ? 'w-44 h-44 scale-105 shadow-md'
                        : 'w-24 h-24 scale-95 opacity-80'
                      : 'w-32 h-32 opacity-70'
                  }`}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-xl font-bold text-[#1B4326] font-serif">
                    {breathActive ? breathPhase : 'Ready'}
                  </span>
                  <span className="text-3xl font-extrabold text-[#2E6F40] mt-1">
                    {breathActive ? `${breathCountdown}s` : '4-7-8'}
                  </span>
                  <span className="text-[11px] text-[#2B2E2B]/80 font-medium mt-1">
                    {breathActive
                      ? breathPhase === 'Inhale'
                        ? 'Deep nasal inhale'
                        : breathPhase === 'Hold'
                        ? 'Hold gently at top'
                        : 'Slow mouth release'
                      : 'Natural tranquilizer'}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3 mt-2">
                <button
                  onClick={() => {
                    setBreathActive(!breathActive);
                    if (!breathActive) {
                      setBreathPhase('Inhale');
                      setBreathCountdown(4);
                      playSoftTone(440, 0.4);
                    }
                  }}
                  className={`px-5 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center space-x-2 transition-all ${
                    breathActive
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'bg-[#1B4326] text-[#F4F1EA] hover:bg-[#2E6F40]'
                  }`}
                >
                  {breathActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{breathActive ? 'Pause Session' : 'Start 4-7-8 Breath'}</span>
                </button>

                <button
                  onClick={() => {
                    setBreathActive(false);
                    setBreathPhase('Inhale');
                    setBreathCountdown(4);
                  }}
                  className="p-2 rounded-xl bg-[#FFFFFF] border border-[#D8D4C9] text-[#2B2E2B] hover:text-[#1B4326]"
                  title="Reset timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Live Acoustic Web Audio Synthesizer */}
            <div className="p-6 rounded-2xl bg-[#F4F1EA] border border-[#D8D4C9] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2E6F40]">
                    Acoustic Noise Synthesizer
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#B9D2B9] text-[#1B4326] font-semibold">
                    Pure Web Audio API
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[#1B4326] mb-2">
                  Browser-Generated Soundscapes
                </h3>
                <p className="text-xs text-[#2B2E2B] leading-relaxed mb-4">
                  Pure mathematical audio calculated in real-time by your device. Zero external streaming buffers or MP3 files. Designed to mask sensory distractions, racing thoughts, and late-night insomnia.
                </p>

                {/* Noise Buttons */}
                <div className="space-y-3 mb-4">
                  <button
                    onClick={() => toggleNoise('brown')}
                    className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all text-left ${
                      synthNoisePlaying === 'brown'
                        ? 'bg-[#1B4326] text-[#F4F1EA] border-[#1B4326] shadow-sm'
                        : 'bg-[#FFFFFF] text-[#2B2E2B] border-[#D8D4C9] hover:border-[#1B4326]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm">Brown Noise (Deep Rumble)</div>
                      <div className="text-xs opacity-80">Ideal for ADHD, focus, and chest tightness</div>
                    </div>
                    {synthNoisePlaying === 'brown' ? (
                      <Pause className="w-5 h-5 text-[#B9D2B9] animate-pulse" />
                    ) : (
                      <Play className="w-5 h-5 text-[#2E6F40]" />
                    )}
                  </button>

                  <button
                    onClick={() => toggleNoise('pink')}
                    className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all text-left ${
                      synthNoisePlaying === 'pink'
                        ? 'bg-[#1B4326] text-[#F4F1EA] border-[#1B4326] shadow-sm'
                        : 'bg-[#FFFFFF] text-[#2B2E2B] border-[#D8D4C9] hover:border-[#1B4326]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm">Pink Noise (Gentle Rain Slope)</div>
                      <div className="text-xs opacity-80">Balanced 1/f falloff for deep nervous relaxation</div>
                    </div>
                    {synthNoisePlaying === 'pink' ? (
                      <Pause className="w-5 h-5 text-[#B9D2B9] animate-pulse" />
                    ) : (
                      <Play className="w-5 h-5 text-[#2E6F40]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Volume Slider */}
              <div className="pt-2 border-t border-[#D8D4C9]">
                <div className="flex items-center justify-between text-xs text-[#2B2E2B]/80 mb-1.5 font-medium">
                  <span>Synthesizer Volume</span>
                  <span>{Math.round(synthVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.8"
                  step="0.01"
                  value={synthVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-[#2E6F40] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#D8D4C9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#2B2E2B]/80">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2E6F40]" />
              <span>Full suite includes 432Hz Drone, 7-11 Panic Release, Box Breathing, and White Noise.</span>
            </span>
            <button
              onClick={() => onNavigate('calm')}
              className="text-[#1B4326] hover:text-[#2E6F40] font-bold flex items-center space-x-1 underline underline-offset-4"
            >
              <span>Open Complete Breath & Sound Deck</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. The 6 Sub-divided Peer Communities Showcase */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2E6F40] mb-2 block">
            TARGETED RELATABILITY & SAFE CONVERSATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1B4326] font-normal mb-4">
            Six focus rooms where you never have to pretend.
          </h2>
          <p className="text-base text-[#2B2E2B]">
            Generic forums are noisy and toxic. Mental Beacon divides discussions into the exact developmental friction points of early adulthood, tracked by problem frequency algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMMUNITIES_PREVIEW.map((comm) => {
            const IconComponent = comm.icon;
            return (
              <div
                key={comm.id}
                className="rounded-2xl bg-[#FFFFFF] border-2 border-[#D8D4C9] hover:border-[#1B4326] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#B9D2B9]/50 text-[#1B4326] flex items-center justify-center border border-[#2E6F40]/30">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F4F1EA] text-[#2E6F40] border border-[#D8D4C9]">
                      {comm.stats}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-[#1B4326] mb-1.5 leading-snug">
                    {comm.title}
                  </h3>
                  <p className="text-xs text-[#2B2E2B]/80 font-medium mb-4">
                    {comm.tagline}
                  </p>

                  <div className="p-3 rounded-xl bg-[#F4F1EA] border border-[#D8D4C9] text-xs text-[#2B2E2B] mb-5">
                    <span className="font-semibold text-[#1B4326] block mb-1">Active Community Topic:</span>
                    <span className="italic">"{comm.topTopic}"</span>
                    <div className="mt-2 text-[11px] font-semibold text-[#2E6F40]">
                      Active handle: {comm.sampleHandle}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('communities')}
                  className="w-full py-2.5 rounded-xl bg-[#F4F1EA] hover:bg-[#1B4326] text-[#1B4326] hover:text-[#F4F1EA] font-semibold text-xs sm:text-sm border border-[#D8D4C9] hover:border-[#1B4326] transition-all flex items-center justify-center space-x-2"
                >
                  <span>Enter This Space</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Deep Forest Green Banner: The 6-Level Safety Circle & Proactive Escalation */}
      <section className="bg-[#1B4326] text-[#F4F1EA] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y-2 border-[#1B4326]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8B87E] mb-2 block">
              MULTI-LEVEL SAFETY ESCALATION ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#F4F1EA] font-normal mb-4">
              Catching distress before it becomes an emergency.
            </h2>
            <p className="text-base text-[#F4F1EA]/85 leading-relaxed">
              Most mental health products do nothing until a user is in acute crisis, or simply flash a helpline link. Mental Beacon introduces a progressive 6-tier threshold that down-regulates anxiety step-by-step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {SAFETY_TIERS.map((tier, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#FFFFFF]/10 backdrop-blur-md border border-[#F4F1EA]/20 p-6 flex flex-col justify-between hover:bg-[#FFFFFF]/15 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#C8B87E] text-[#1B4326]">
                      {tier.tier}
                    </span>
                    <Shield className="w-4 h-4 text-[#C8B87E]" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#F4F1EA] mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-[#F4F1EA]/80 leading-relaxed mb-4">
                    {tier.desc}
                  </p>
                </div>
                <div className="text-xs font-semibold text-[#C8B87E] flex items-center space-x-1 pt-2 border-t border-[#F4F1EA]/10">
                  <span>Standard Protocol: {tier.action}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF]/10 border border-[#F4F1EA]/25 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#F4F1EA] mb-1">
                Configure Your Inner Trusted Circle
              </h3>
              <p className="text-xs text-[#F4F1EA]/80">
                Designate trusted friends or mentors with pre-written, low-pressure messages. Directly connected to the 988 Suicide & Crisis Lifeline.
              </p>
            </div>
            <button
              onClick={onOpenEmergency}
              className="px-6 py-3.5 rounded-xl bg-[#C8B87E] text-[#1B4326] font-bold text-sm hover:bg-[#F4F1EA] transition-all shadow-md whitespace-nowrap"
            >
              Simulate Crisis Safety Flow
            </button>
          </div>
        </div>
      </section>

      {/* 6. Pattern Diagnostics & Private Encrypted Journal */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Patterns Visualizer */}
          <div className="rounded-3xl bg-[#FFFFFF] border-2 border-[#1B4326] p-8 shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E6F40] mb-2 block">
              60-Second Sensory-Biometric Check-In
            </span>
            <h2 className="text-3xl font-serif text-[#1B4326] font-normal mb-3">
              Detect trends before burnout takes over.
            </h2>
            <p className="text-sm text-[#2B2E2B] leading-relaxed mb-6">
              Track 7-day stress trajectories, energy fluctuations, and primary life triggers (Work, Rent, Family, Screen Time). Our pattern algorithm automatically surfaces your lower-threshold score.
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl bg-[#F4F1EA] border border-[#D8D4C9]">
                <div className="flex justify-between items-center text-xs font-semibold text-[#1B4326] mb-2">
                  <span>Weekly Stress vs Energy Trajectory</span>
                  <span className="text-[#2E6F40]">7-Day Diagnostic</span>
                </div>
                <div className="flex items-end h-20 space-x-2 pt-2">
                  {[
                    { day: 'Mon', stress: 70, energy: 40 },
                    { day: 'Tue', stress: 65, energy: 45 },
                    { day: 'Wed', stress: 80, energy: 30 },
                    { day: 'Thu', stress: 85, energy: 25 },
                    { day: 'Fri', stress: 60, energy: 50 },
                    { day: 'Sat', stress: 40, energy: 75 },
                    { day: 'Sun', stress: 55, energy: 60 }
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex items-end justify-center space-x-1 h-14">
                        <div
                          style={{ height: `${bar.stress}%` }}
                          className="w-2.5 rounded-t bg-[#1B4326]"
                          title={`Stress: ${bar.stress}%`}
                        />
                        <div
                          style={{ height: `${bar.energy}%` }}
                          className="w-2.5 rounded-t bg-[#B9D2B9]"
                          title={`Energy: ${bar.energy}%`}
                        />
                      </div>
                      <span className="text-[10px] text-[#2B2E2B]/70 mt-1">{bar.day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center space-x-4 mt-3 text-[11px] font-medium text-[#2B2E2B]">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded bg-[#1B4326]"></span>
                    <span>Stress Level</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded bg-[#B9D2B9]"></span>
                    <span>Energy Battery</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('checkups')}
              className="w-full py-3 rounded-xl bg-[#1B4326] text-[#F4F1EA] font-semibold text-sm hover:bg-[#2E6F40] transition-all flex items-center justify-center space-x-2"
            >
              <span>Take Today’s 60-Second Check-in</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Private Encrypted Journal & Defusion */}
          <div className="rounded-3xl bg-[#FFFFFF] border-2 border-[#1B4326] p-8 shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E6F40] mb-2 block">
              Client-Side Encrypted Vault
            </span>
            <h2 className="text-3xl font-serif text-[#1B4326] font-normal mb-3">
              Private journaling without surveillance.
            </h2>
            <p className="text-sm text-[#2B2E2B] leading-relaxed mb-6">
              Write freely with contextual prompts built around comparison, imposter syndrome, and emotional overwhelm. Your entries stay locked in your private browser vault with zero public indexing.
            </p>

            <div className="p-5 rounded-2xl bg-[#F4F1EA] border border-[#D8D4C9] mb-6">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#2E6F40] mb-2">
                <Brain className="w-4 h-4" />
                <span>Featured ACT Defusion Prompt:</span>
              </div>
              <p className="text-sm font-serif italic text-[#1B4326] mb-3">
                "What expectation did you carry today that belonged to your parents, your boss, or social media rather than yourself?"
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#2B2E2B]/75 font-medium">
                <span>Prompts update daily</span>
                <span className="text-[#2E6F40] font-bold">100% Client-Side Encryption</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => onNavigate('journal')}
                className="py-2.5 px-4 rounded-xl bg-[#B9D2B9]/60 hover:bg-[#B9D2B9] text-[#1B4326] font-semibold text-xs border border-[#2E6F40]/30 transition-all text-center"
              >
                Open Private Journal
              </button>
              <button
                onClick={() => onNavigate('games')}
                className="py-2.5 px-4 rounded-xl bg-[#F4F1EA] hover:bg-[#D8D4C9]/50 text-[#1B4326] font-semibold text-xs border border-[#D8D4C9] transition-all text-center"
              >
                Play Calm Micro-Games
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#B9D2B9]/30 border border-[#2E6F40]/20 flex items-center space-x-3 text-xs text-[#1B4326]">
              <Lock className="w-5 h-5 text-[#2E6F40] flex-shrink-0" />
              <span>We never train public AI on your personal thoughts or search queries.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Comparison: Generic Wellness Apps vs. Mental Beacon */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2E6F40] mb-2 block">
            THE WELLBEING PARADIGM SHIFT
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif text-[#1B4326] font-normal mb-3">
            Why Mental Beacon is fundamentally different.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Old Way */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D8D4C9] shadow-sm">
            <div className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold mb-4">
              Traditional Mental Health Apps
            </div>
            <ul className="space-y-4 text-xs sm:text-sm text-[#2B2E2B]/90">
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <span>Monetize your anxiety through targeted ads & third-party data tracking.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <span>Superficial 1-to-5 emoji mood logging with zero real nervous system intervention.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <span>Six-week therapy backlogs charging $180–$250 per session out-of-pocket.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <span>No proactive safety circle when spiraling alone at 2:00 AM.</span>
              </li>
            </ul>
          </div>

          {/* Mental Beacon Sanctuary */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border-2 border-[#1B4326] shadow-lg relative overflow-hidden">
            <div className="inline-block px-3 py-1 rounded-full bg-[#B9D2B9] text-[#1B4326] text-xs font-bold mb-4">
              Mental Beacon Sanctuary
            </div>
            <ul className="space-y-4 text-xs sm:text-sm text-[#2B2E2B] font-medium">
              <li className="flex items-start space-x-2.5">
                <span className="text-[#2E6F40] font-bold mt-0.5">✓</span>
                <span><strong>Zero-Ad Commitment</strong>: No Meta pixels, no ad trackers, 100% free youth tier.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-[#2E6F40] font-bold mt-0.5">✓</span>
                <span><strong>Immediate Somatic Relief</strong>: Browser WebAudio brown/pink noise & vagus breath pacers.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-[#2E6F40] font-bold mt-0.5">✓</span>
                <span><strong>Sub-divided Peer Rooms</strong>: Real conversations on rent spikes, career dread, and impostor feeling.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-[#2E6F40] font-bold mt-0.5">✓</span>
                <span><strong>6-Level Proactive Safety Threshold</strong>: Seamless escalation with 988 lifeline & trusted circle.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8. Ethics, Financial Model & Zero-Ad Transparency */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#B9D2B9]/30 border-2 border-[#1B4326] shadow-sm text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E6F40] mb-2 block">
              FINANCIAL SUSTAINABILITY & ETHICAL MODEL
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif text-[#1B4326] font-normal mb-3">
              How is Mental Beacon 100% free for young adults?
            </h2>
            <p className="text-sm text-[#2B2E2B] leading-relaxed mb-4">
              We never sell your data or monetize ads. Mental Beacon is funded via B2B licensing with universities and forward-thinking employers who sponsor our platform to eliminate 6-week campus counseling waitlists.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#1B4326]">
              <span className="px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#D8D4C9]">No Paywalls for Crisis Care</span>
              <span className="px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#D8D4C9]">Zero Data Telemetry Brokering</span>
              <span className="px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#D8D4C9]">1-Click Complete Data Wipe</span>
            </div>
          </div>

          <div className="flex flex-col space-y-3 w-full sm:w-auto">
            <button
              onClick={onOpenTransparency}
              className="px-6 py-3.5 rounded-xl bg-[#FFFFFF] text-[#1B4326] font-semibold text-sm border-2 border-[#1B4326] hover:bg-[#F4F1EA] transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4 text-[#2E6F40]" />
              <span>Data Privacy Center</span>
            </button>
            <button
              onClick={onOpenPro}
              className="px-6 py-3.5 rounded-xl bg-[#1B4326] text-[#F4F1EA] font-semibold text-sm hover:bg-[#2E6F40] transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <span>Our Impact Model</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. Testimonials / Voices of Young Adults */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2E6F40] mb-2 block">
            AUTHENTIC EXPERIENCES
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif text-[#1B4326] font-normal mb-3">
            Voices from inside our peer sanctuary.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D8D4C9] shadow-sm flex flex-col justify-between">
            <p className="text-xs sm:text-sm text-[#2B2E2B] leading-relaxed italic mb-4">
              "Graduating college left me completely stranded. Every friend moved cities and my social feed made me feel like an utter failure. Finding the Quarter-Life room showed me nearly everyone my age is feeling this exact disorientation."
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-[#D8D4C9]">
              <div className="w-8 h-8 rounded-full bg-[#B9D2B9] text-[#1B4326] font-bold text-xs flex items-center justify-center">
                QW
              </div>
              <div>
                <div className="text-xs font-bold text-[#1B4326]">@QuietWanderer24</div>
                <div className="text-[11px] text-[#2B2E2B]/70">Member for 4 months • Age 23</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D8D4C9] shadow-sm flex flex-col justify-between">
            <p className="text-xs sm:text-sm text-[#2B2E2B] leading-relaxed italic mb-4">
              "The Brown Noise generator alone saved my sleep schedule. When my mind loops on Slack messages at 1:00 AM, combining the audio synthesizer with the 4-7-8 breathing pacer shuts down my chest tightness in under five minutes."
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-[#D8D4C9]">
              <div className="w-8 h-8 rounded-full bg-[#B9D2B9] text-[#1B4326] font-bold text-xs flex items-center justify-center">
                OD
              </div>
              <div>
                <div className="text-xs font-bold text-[#1B4326]">@OverthinkingDev</div>
                <div className="text-[11px] text-[#2B2E2B]/70">Junior Software Eng • Age 25</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D8D4C9] shadow-sm flex flex-col justify-between">
            <p className="text-xs sm:text-sm text-[#2B2E2B] leading-relaxed italic mb-4">
              "Having the 6-Level safety threshold configured gives me peace of mind. I added my sister as my Trusted Contact with a pre-written message. Knowing I don't have to explain everything during a panic attack is invaluable."
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-[#D8D4C9]">
              <div className="w-8 h-8 rounded-full bg-[#B9D2B9] text-[#1B4326] font-bold text-xs flex items-center justify-center">
                CR
              </div>
              <div>
                <div className="text-xs font-bold text-[#1B4326]">@CalmRiver</div>
                <div className="text-[11px] text-[#2B2E2B]/70">Graduate Student • Age 27</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Frequently Asked Questions (FAQ) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2E6F40] mb-2 block">
            CLEAR ANSWERS
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif text-[#1B4326] font-normal mb-3">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#FFFFFF] border border-[#D8D4C9] overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between font-serif font-bold text-base sm:text-lg text-[#1B4326] hover:text-[#2E6F40] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#2E6F40] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#2B2E2B]/60 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#2B2E2B] leading-relaxed border-t border-[#D8D4C9]/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. Final Action Banner */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#FFFFFF] border-2 border-[#1B4326] shadow-xl">
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1B4326] font-normal mb-4">
            You don't have to carry modern pressure alone.
          </h2>
          <p className="text-sm sm:text-base text-[#2B2E2B] max-w-2xl mx-auto mb-8 leading-relaxed">
            Join thousands of young adults grounding their nervous systems, finding authentic peer solidarity, and tracking developmental patterns.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('communities')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1B4326] text-[#F4F1EA] font-semibold text-base hover:bg-[#2E6F40] transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <span>Launch Mental Beacon Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('checkups')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#F4F1EA] text-[#1B4326] font-semibold text-base hover:bg-[#B9D2B9]/50 transition-all border-2 border-[#1B4326]"
            >
              <span>Daily Sensory Check-In</span>
            </button>
          </div>
        </div>
      </section>

      {/* 12. Deep Forest Green Footer (--bg-banner-dark) */}
      <footer className="bg-[#1B4326] text-[#F4F1EA] py-14 px-4 sm:px-6 lg:px-8 border-t-2 border-[#1B4326]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-[#F4F1EA]/20">
            {/* Brand column */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#B9D2B9] text-[#1B4326] flex items-center justify-center font-bold">
                  MB
                </div>
                <span className="font-serif font-bold text-lg text-[#F4F1EA]">Mental Beacon</span>
              </div>
              <p className="text-xs text-[#F4F1EA]/80 leading-relaxed mb-4">
                Impact-driven wellbeing and social grounding space engineered for young adults (15–35).
              </p>
              <div className="text-[11px] text-[#C8B87E] font-medium">
                Zero third-party trackers • Client-side encryption
              </div>
            </div>

            {/* Grounding & Tools */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8B87E] mb-3">
                Grounding & Respiration
              </h4>
              <ul className="space-y-2 text-xs text-[#F4F1EA]/80">
                <li>
                  <button onClick={() => onNavigate('calm')} className="hover:text-[#F4F1EA] transition-colors">
                    4-7-8 Deep Relaxation Pacer
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('calm')} className="hover:text-[#F4F1EA] transition-colors">
                    Browser Acoustic Synthesizer
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('calm')} className="hover:text-[#F4F1EA] transition-colors">
                    Box Breathing (4-4-4-4)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('games')} className="hover:text-[#F4F1EA] transition-colors">
                    Zen River Stone Balancer
                  </button>
                </li>
              </ul>
            </div>

            {/* Peer Spaces & Diagnostics */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8B87E] mb-3">
                Sanctuary Modules
              </h4>
              <ul className="space-y-2 text-xs text-[#F4F1EA]/80">
                <li>
                  <button onClick={() => onNavigate('communities')} className="hover:text-[#F4F1EA] transition-colors">
                    6 Sub-divided Peer Rooms
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('checkups')} className="hover:text-[#F4F1EA] transition-colors">
                    Sensory-Biometric Check-ups
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('journal')} className="hover:text-[#F4F1EA] transition-colors">
                    Encrypted Vault Journal
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('chat')} className="hover:text-[#F4F1EA] transition-colors">
                    Beacon AI Companion
                  </button>
                </li>
              </ul>
            </div>

            {/* Safety & Ethics */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8B87E] mb-3">
                Crisis & Ethics
              </h4>
              <ul className="space-y-2 text-xs text-[#F4F1EA]/80">
                <li>
                  <button onClick={onOpenEmergency} className="text-rose-300 hover:text-white font-semibold flex items-center space-x-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Safety Circle & 988 Lifeline</span>
                  </button>
                </li>
                <li>
                  <button onClick={onOpenTransparency} className="hover:text-[#F4F1EA] transition-colors">
                    Data Privacy & Zero-Ad Guarantee
                  </button>
                </li>
                <li>
                  <button onClick={onOpenPro} className="hover:text-[#F4F1EA] transition-colors">
                    Financial Sustainability Model
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('analytics')} className="hover:text-[#F4F1EA] transition-colors">
                    Live Impact Metrics
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#F4F1EA]/70 gap-4">
            <div>
              © 2026 Mental Beacon (MB). Dedicated to youth nervous system health and authentic connection.
            </div>
            <div className="flex items-center space-x-2 text-rose-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
              <span>Crisis Support: Call or text <strong>988</strong> anytime 24/7 (US & Canada).</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
