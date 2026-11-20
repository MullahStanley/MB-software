import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  Wind,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Lock,
  Heart,
  Shield,
  Smile,
  Shuffle,
  Compass,
  Headphones,
  BookOpen,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface LandingPageProps {
  onViewService: (tab?: string) => void;
  onSetUsername?: (name: string) => void;
  onOpenEmergency: () => void;
  onOpenTransparency: () => void;
  onOpenPro: () => void;
}

const NATURE_MONIKERS = [
  'QuietFern',
  'StillCedar',
  'GentleStream',
  'MorningMist',
  'CalmRiver',
  'EarthyPine',
  'OpenHorizon',
  'SilverBirch',
  'WildSage',
  'DuskWanderer'
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onViewService,
  onSetUsername,
  onOpenEmergency,
  onOpenTransparency,
  onOpenPro
}) => {
  // 1. Live Interactive Grounding Widget State
  const [breathActive, setBreathActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCountdown, setBreathCountdown] = useState(4);
  const [audioChime, setAudioChime] = useState(true);

  // Brown noise synthesizer state
  const [brownNoisePlaying, setBrownNoisePlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // 2. Interactive & Engaging Calm Intake Form State
  const [formStep, setFormStep] = useState<number>(1);
  const [selectedFeeling, setSelectedFeeling] = useState<string>('Grounded & Seeking Connection');
  const [selectedSupport, setSelectedSupport] = useState<string>('Daily Calm, Grounding & Breathwork');
  const [userHandle, setUserHandle] = useState<string>('QuietFern');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userIntention, setUserIntention] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 3. FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Breathwork loop
  useEffect(() => {
    let timer: any;
    if (breathActive) {
      timer = setInterval(() => {
        setBreathCountdown((prev) => {
          if (prev <= 1) {
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

  const playSoftTone = (freq: number, dur: number) => {
    if (!audioChime) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(0.035, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  };

  const toggleBrownNoise = () => {
    if (brownNoisePlaying) {
      stopNoise();
      return;
    }
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

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

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);

      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();

      noiseSourceRef.current = source;
      gainNodeRef.current = gain;
      setBrownNoisePlaying(true);
    } catch (e) {
      console.error(e);
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
    setBrownNoisePlaying(false);
  };

  useEffect(() => {
    return () => stopNoise();
  }, []);

  const randomizeHandle = () => {
    const randomName = NATURE_MONIKERS[Math.floor(Math.random() * NATURE_MONIKERS.length)];
    const randomNum = Math.floor(Math.random() * 90 + 10);
    setUserHandle(`${randomName}${randomNum}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Smooth calming simulated save
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      if (onSetUsername && userHandle) {
        onSetUsername(userHandle);
      }
    }, 700);
  };

  const handleCompleteAndEnter = () => {
    if (onSetUsername && userHandle) {
      onSetUsername(userHandle);
    }
    onViewService('service_in_progress');
  };

  return (
    <article className="w-full bg-[#F4F1EA] text-[#2B2E2B] selection:bg-[#B9D2B9] selection:text-[#1B4326]">
      {/* 1. HERO SECTION: Singular, calm & focused */}
      <section className="pt-16 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <span className="text-xs font-bold tracking-widest uppercase text-[#2E6F40] mb-3 block">
          A CALM SANCTUARY FOR MENTAL GROUNDING
        </span>

        <h1 className="text-4xl sm:text-6xl font-serif text-[#1B4326] font-normal tracking-tight leading-[1.18] mb-6">
          A quiet place to breathe, ground, and connect when life feels heavy.
        </h1>

        <p className="text-base sm:text-xl text-[#2B2E2B] leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
          Mental Beacon is an independent mental wellbeing initiative. We provide immediate nervous
          system regulation, reflective clarity, and authentic peer connection—so no one has to carry
          uncertainty, burnout, or modern pressure alone.
        </p>

        {/* Minimal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onViewService('service_in_progress')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] text-base font-semibold transition-all shadow-md hover:shadow flex items-center justify-center space-x-3 group border border-[#1B4326]"
          >
            <span>View our online service</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#join-sanctuary"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FFFFFF] hover:bg-[#B9D2B9]/30 text-[#1B4326] text-base font-semibold transition-all border-2 border-[#1B4326] shadow-sm flex items-center justify-center space-x-2"
          >
            <Heart className="w-5 h-5 text-[#2E6F40]" />
            <span>Join our community</span>
          </a>
        </div>
      </section>

      {/* 2. WHO WE ARE, WHAT WE ARE & WHAT WE AIM TO DO */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#D8D4C9]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-[#2E6F40] mb-2 block">
            OUR PURPOSE & PHILOSOPHY
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1B4326] font-normal">
            Who we are, what we built, and why we are here.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Who We Are */}
          <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#D8D4C9] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#B9D2B9]/60 text-[#1B4326] flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1B4326] mb-3">
                Who We Are
              </h3>
              <p className="text-sm text-[#2B2E2B]/85 leading-relaxed">
                We are an independent collective of peer guides, clinical psychologists, and community advocates. We created Mental Beacon after seeing how modern mental health tools often feel sterile, commercialized, or locked behind six-week waiting queues.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#D8D4C9] text-xs font-semibold text-[#2E6F40]">
              Independent & Human-Centered
            </div>
          </div>

          {/* What We Are */}
          <div className="p-8 rounded-3xl bg-[#FFFFFF] border-2 border-[#1B4326] shadow-md flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#1B4326] text-[#F4F1EA] flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-[#C8B87E]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1B4326] mb-3">
                What Mental Beacon Is
              </h3>
              <p className="text-sm text-[#2B2E2B]/85 leading-relaxed">
                Mental Beacon is a digital sanctuary engineered for physiological and emotional grounding. Not a mood tracker and not a therapist directory, but an authentic space with browser-synthesized audio, vagus nerve pacing, private encrypted vaults, and honest peer rooms.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#D8D4C9] text-xs font-semibold text-[#1B4326]">
              Real Somatic Stabilization
            </div>
          </div>

          {/* What We Aim To Do */}
          <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#D8D4C9] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#B9D2B9]/60 text-[#1B4326] flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1B4326] mb-3">
                What We Aim To Do
              </h3>
              <p className="text-sm text-[#2B2E2B]/85 leading-relaxed">
                Our mission is to bring relief in minutes rather than weeks. We aim to destigmatize real-life dilemmas—from career burnout and decision paralysis to loneliness—while protecting every visitor with a gentle, proactive safety net.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#D8D4C9] text-xs font-semibold text-[#2E6F40]">
              Immediate, Dignified Relief
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE QUIET PILLARS OF OUR ONLINE SERVICE */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#D8D4C9]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-[#2E6F40] mb-2 block">
            HOW THE SERVICE SUPPORTS YOU
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1B4326] font-normal">
            Three core anchors for your wellbeing.
          </h2>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#D8D4C9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F4F1EA] text-[#1B4326] border border-[#D8D4C9] flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6 text-[#2E6F40]" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1B4326] mb-1">
                  1. Somatic Breathwork & Browser Acoustic Synthesizer
                </h3>
                <p className="text-xs sm:text-sm text-[#2B2E2B]/80 leading-relaxed max-w-xl">
                  Down-regulate the sympathetic nervous system on demand. Paced visual guides (4-7-8, Box) combined with pure mathematical brown and pink noise generated directly on your device.
                </p>
              </div>
            </div>
            <button
              onClick={() => onViewService('service_in_progress')}
              className="text-xs font-bold text-[#1B4326] hover:text-[#2E6F40] whitespace-nowrap flex items-center space-x-1"
            >
              <span>Explore Audio Deck</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#D8D4C9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F4F1EA] text-[#1B4326] border border-[#D8D4C9] flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6 text-[#2E6F40]" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1B4326] mb-1">
                  2. Honest Shared-Struggle Peer Rooms
                </h3>
                <p className="text-xs sm:text-sm text-[#2B2E2B]/80 leading-relaxed max-w-xl">
                  Six sub-divided peer spaces dedicated to the real friction of adulthood: career imposter syndrome, decision paralysis, burnout, and loneliness. Share anonymously without social media pretense.
                </p>
              </div>
            </div>
            <button
              onClick={() => onViewService('service_in_progress')}
              className="text-xs font-bold text-[#1B4326] hover:text-[#2E6F40] whitespace-nowrap flex items-center space-x-1"
            >
              <span>Explore Spaces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#D8D4C9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F4F1EA] text-[#1B4326] border border-[#D8D4C9] flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-[#2E6F40]" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1B4326] mb-1">
                  3. Multi-Tier Proactive Safety Circle
                </h3>
                <p className="text-xs sm:text-sm text-[#2B2E2B]/80 leading-relaxed max-w-xl">
                  Support before a crisis occurs. A 6-level lower threshold system that steps in with somatic calm, reaches out to your designated trusted circle, and connects with 24/7 lifeline support.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenEmergency}
              className="text-xs font-bold text-[#1B4326] hover:text-[#2E6F40] whitespace-nowrap flex items-center space-x-1"
            >
              <span>View Safety Model</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Big Central CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => onViewService('service_in_progress')}
            className="px-8 py-3.5 rounded-xl bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] text-sm font-semibold transition-all shadow-sm inline-flex items-center space-x-2"
          >
            <span>View our online service</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. GROUND IN THIS MOMENT: Interactive Calming Teaser */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[#D8D4C9]">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border-2 border-[#1B4326] shadow-lg text-center">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#B9D2B9] text-[#1B4326] inline-block mb-3">
            Ground in 60 Seconds
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#1B4326] font-normal mb-3">
            Pause right here. Experience physical down-regulation.
          </h2>
          <p className="text-xs sm:text-sm text-[#2B2E2B]/80 max-w-lg mx-auto mb-8 leading-relaxed">
            Take one slow breath with our 4-7-8 somatic tranquilizer, or turn on deep brown noise to quiet racing mental chatter.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-6">
            {/* Visual breathing orb */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <div
                className={`absolute rounded-full transition-all duration-1000 border-4 border-[#1B4326] bg-[#B9D2B9]/40 ${
                  breathActive
                    ? breathPhase === 'Inhale'
                      ? 'w-40 h-40 scale-105 shadow-md'
                      : breathPhase === 'Hold'
                      ? 'w-40 h-40 scale-100 shadow-sm'
                      : 'w-24 h-24 scale-95 opacity-80'
                    : 'w-32 h-32 opacity-70'
                }`}
              />
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-base font-serif font-bold text-[#1B4326]">
                  {breathActive ? breathPhase : '4-7-8 Breath'}
                </span>
                <span className="text-2xl font-mono font-bold text-[#2E6F40] mt-0.5">
                  {breathActive ? `${breathCountdown}s` : 'Ready'}
                </span>
              </div>
            </div>

            {/* Quick controls */}
            <div className="flex flex-col items-center sm:items-start space-y-3">
              <button
                onClick={() => {
                  setBreathActive(!breathActive);
                  if (!breathActive) {
                    setBreathPhase('Inhale');
                    setBreathCountdown(4);
                    playSoftTone(440, 0.4);
                  }
                }}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center space-x-2 transition-all ${
                  breathActive
                    ? 'bg-amber-700 text-white'
                    : 'bg-[#1B4326] text-[#F4F1EA] hover:bg-[#2E6F40]'
                }`}
              >
                {breathActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{breathActive ? 'Pause Breath' : 'Begin 4-7-8 Breath'}</span>
              </button>

              <button
                onClick={toggleBrownNoise}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border flex items-center space-x-2 transition-all ${
                  brownNoisePlaying
                    ? 'bg-[#1B4326] text-[#F4F1EA] border-[#1B4326]'
                    : 'bg-[#F4F1EA] text-[#1B4326] border-[#D8D4C9] hover:border-[#1B4326]'
                }`}
              >
                <Volume2 className="w-4 h-4 text-[#2E6F40]" />
                <span>{brownNoisePlaying ? 'Mute Brown Noise' : 'Play Brown Noise'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE & ENGAGING CALM ONBOARDING INTAKE FORM */}
      <section id="join-sanctuary" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[#D8D4C9]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-[#2E6F40] mb-2 block">
            EXPERIENCE MENTAL BEACON
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1B4326] font-normal mb-3">
            Join the community & step into your space.
          </h2>
          <p className="text-sm text-[#2B2E2B]/80 leading-relaxed">
            Tell us where you are at today so we can personalize your sanctuary experience. Information collection is private, unhurried, and calming.
          </p>
        </div>

        <div className="bg-[#FFFFFF] rounded-3xl border-2 border-[#1B4326] shadow-xl p-6 sm:p-10">
          {!formSubmitted ? (
            <form onSubmit={handleFormSubmit} className="space-y-8">
              {/* Progress Pills */}
              <div className="flex items-center justify-between pb-4 border-b border-[#D8D4C9] text-xs">
                <span className="font-bold text-[#1B4326]">
                  {formStep === 1 && "Step 1 of 3: How does your mind feel right now?"}
                  {formStep === 2 && "Step 2 of 3: What presence brings you comfort?"}
                  {formStep === 3 && "Step 3 of 3: Your Invitation & Safe Alias"}
                </span>
                <div className="flex space-x-1.5">
                  {[1, 2, 3].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => setFormStep(step)}
                      className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                        formStep === step
                          ? 'bg-[#1B4326] text-[#F4F1EA]'
                          : formStep > step
                          ? 'bg-[#B9D2B9] text-[#1B4326]'
                          : 'bg-[#F4F1EA] text-[#2B2E2B]/50'
                      }`}
                    >
                      {step}
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 1: Interactive Feeling Selection */}
              {formStep === 1 && (
                <div className="space-y-4">
                  <p className="text-xs font-medium text-[#2B2E2B]/80">
                    Tap the emotional texture that matches your present moment:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        emoji: '☀️',
                        title: 'Grounded & Seeking Connection',
                        desc: 'Feeling centered and wanting to connect meaningfully with others on a shared journey.'
                      },
                      {
                        emoji: '🌱',
                        title: 'Creative Milestones & Growth',
                        desc: 'Starting new chapters, cultivating positive habits, and celebrating small wins daily.'
                      },
                      {
                        emoji: '🌿',
                        title: 'Curious, Reflective & Mindful',
                        desc: 'Exploring intentional living, quiet presence, and deepening self-awareness.'
                      },
                      {
                        emoji: '🌊',
                        title: 'Overthinking & Racing Loops',
                        desc: 'Mental fog, second-guessing decisions, or Sunday evening dread you can\'t shake.'
                      },
                      {
                        emoji: '🍂',
                        title: 'Burnout & Depleted Battery',
                        desc: 'Emotionally drained, low motivation, or feeling constantly behind on everything.'
                      },
                      {
                        emoji: '🌙',
                        title: 'Quiet Loneliness & Isolation',
                        desc: 'Carrying heavy questions without someone to talk to authentically.'
                      }
                    ].map((item, i) => {
                      const isSelected = selectedFeeling === item.title;
                      return (
                        <div
                          key={i}
                          onClick={() => setSelectedFeeling(item.title)}
                          className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                            isSelected
                              ? 'bg-[#B9D2B9]/50 border-[#1B4326] shadow-sm'
                              : 'bg-[#F4F1EA] border-[#D8D4C9] hover:border-[#1B4326]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-serif font-bold text-sm text-[#1B4326] flex items-center gap-2">
                              <span className="text-base">{item.emoji}</span>
                              {item.title}
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-[#1B4326] shrink-0" />}
                          </div>
                          <p className="text-xs text-[#2B2E2B]/75 leading-relaxed">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Support Preference */}
              {formStep === 2 && (
                <div className="space-y-4">
                  <p className="text-xs font-medium text-[#2B2E2B]/80">
                    Which presence calls to you most right now?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        emoji: '✨',
                        title: 'Sharing Encouragement & Peer Solidarity',
                        desc: 'Uplifting others and receiving authentic support in a space free of performance.'
                      },
                      {
                        emoji: '🧘',
                        title: 'Daily Calm, Grounding & Breathwork',
                        desc: '4-7-8 breathing pacer, pure web audio brown/pink noise, and somatic resets.'
                      },
                      {
                        emoji: '📖',
                        title: 'Creative Journaling & Mindful Reflection',
                        desc: 'Contextual prompts to untangle thoughts and write with complete privacy.'
                      },
                      {
                        emoji: '🛡️',
                        title: 'Proactive Safety & Support Circle',
                        desc: 'Configuring low-pressure emergency check-ins with trusted people around you.'
                      }
                    ].map((item, i) => {
                      const isSelected = selectedSupport === item.title;
                      return (
                        <div
                          key={i}
                          onClick={() => setSelectedSupport(item.title)}
                          className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                            isSelected
                              ? 'bg-[#B9D2B9]/50 border-[#1B4326] shadow-sm'
                              : 'bg-[#F4F1EA] border-[#D8D4C9] hover:border-[#1B4326]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-serif font-bold text-sm text-[#1B4326] flex items-center gap-2">
                              <span className="text-base">{item.emoji}</span>
                              {item.title}
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-[#1B4326] shrink-0" />}
                          </div>
                          <p className="text-xs text-[#2B2E2B]/75 leading-relaxed">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="px-5 py-2.5 rounded-xl bg-[#F4F1EA] hover:bg-[#D8D4C9]/40 text-[#2B2E2B] text-xs font-semibold border border-[#D8D4C9]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStep(3)}
                      className="px-6 py-2.5 rounded-xl bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Alias & Invitation Details */}
              {formStep === 3 && (
                <div className="space-y-4">
                  {/* Alias */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-[#1B4326]">
                        Your Community Pseudonym
                      </label>
                      <button
                        type="button"
                        onClick={randomizeHandle}
                        className="text-xs text-[#2E6F40] hover:text-[#1B4326] flex items-center space-x-1 font-medium"
                      >
                        <Shuffle className="w-3 h-3" />
                        <span>Shuffle Alias</span>
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-[#1B4326] font-bold text-sm">@</span>
                      <input
                        type="text"
                        required
                        value={userHandle}
                        onChange={(e) => setUserHandle(e.target.value.replace('@', ''))}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#F4F1EA] border border-[#D8D4C9] text-[#1B4326] font-semibold text-sm focus:outline-none focus:border-[#1B4326]"
                        placeholder="YourCalmAlias"
                      />
                    </div>
                    <p className="text-[11px] text-[#2B2E2B]/70 mt-1">
                      You will participate pseudonymously. No real names or social profiles are required.
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1B4326] mb-1">
                      Email for Access Passkey
                    </label>
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F4F1EA] border border-[#D8D4C9] text-[#2B2E2B] text-sm focus:outline-none focus:border-[#1B4326]"
                      placeholder="you@domain.com"
                    />
                    <p className="text-[11px] text-[#2B2E2B]/70 mt-1">
                      Strict Zero-Ad Policy: We never send marketing emails or sell contact telemetry.
                    </p>
                  </div>

                  {/* Intention Note */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1B4326] mb-1">
                      What are you hoping to find here? (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={userIntention}
                      onChange={(e) => setUserIntention(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F4F1EA] border border-[#D8D4C9] text-[#2B2E2B] text-xs focus:outline-none focus:border-[#1B4326]"
                      placeholder="e.g. Seeking a place to clear my head after work without doomscrolling..."
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-[#D8D4C9]">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="px-5 py-2.5 rounded-xl bg-[#F4F1EA] hover:bg-[#D8D4C9]/40 text-[#2B2E2B] text-xs font-semibold border border-[#D8D4C9]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-7 py-3 rounded-xl bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] text-sm font-semibold transition-all shadow-md flex items-center space-x-2"
                    >
                      <span>{isSubmitting ? 'Confirming...' : 'Complete Invitation & Step Inside'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            /* Calming Confirmation Card */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#B9D2B9] text-[#1B4326] flex items-center justify-center mx-auto border-2 border-[#1B4326] shadow">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#1B4326]">
                Welcome to Mental Beacon, @{userHandle}.
              </h3>
              <p className="text-xs sm:text-sm text-[#2B2E2B]/85 max-w-md mx-auto leading-relaxed">
                Your place in the sanctuary has been established. You are entering with focus on <strong>{selectedFeeling}</strong> and preference for <strong>{selectedSupport}</strong>.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleCompleteAndEnter}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] font-semibold text-sm shadow flex items-center justify-center space-x-2"
                >
                  <span>Enter Online Service Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. MINIMAL FINE PRINT FOOTER */}
      <footer className="bg-[#1B4326] text-[#F4F1EA] py-12 px-4 sm:px-6 lg:px-8 border-t-2 border-[#1B4326]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-[#F4F1EA]/20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#B9D2B9] text-[#1B4326] flex items-center justify-center font-bold">
                MB
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-[#F4F1EA] block">Mental Beacon</span>
                <span className="text-[11px] text-[#C8B87E] block">Human-centered mental wellbeing sanctuary</span>
              </div>
            </div>

            {/* Direct service button in footer */}
            <button
              onClick={() => onViewService('service_in_progress')}
              className="px-5 py-2.5 rounded-xl bg-[#F4F1EA] text-[#1B4326] text-xs font-semibold hover:bg-[#B9D2B9] transition-all"
            >
              View our online service
            </button>
          </div>

          {/* Quiet Fine Print row */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F4F1EA]/70">
            <div>
              © 2026 Mental Beacon. Designed for quiet dignity and nervous system health.
            </div>

            {/* Fine print links */}
            <div className="flex items-center space-x-4 text-[11px]">
              <button
                onClick={onOpenTransparency}
                className="hover:text-[#F4F1EA] transition-colors underline-offset-4 hover:underline"
              >
                Data Privacy & Zero-Ad Guarantee
              </button>
              <span>•</span>
              <button
                onClick={onOpenPro}
                className="hover:text-[#F4F1EA] transition-colors underline-offset-4 hover:underline"
              >
                Sustainability Model
              </button>
              <span>•</span>
              <button
                onClick={onOpenEmergency}
                className="text-rose-300 hover:text-white transition-colors font-medium"
              >
                988 Crisis Lifeline
              </button>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
};
