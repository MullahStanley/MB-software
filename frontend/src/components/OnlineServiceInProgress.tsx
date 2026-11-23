import React from 'react';
import {
  Compass,
  Wind,
  BookOpen,
  Activity,
  MessageSquareHeart,
  Clock,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { AsyncImage } from './AsyncImage';

interface OnlineServiceInProgressProps {
  onBackToOverview: () => void;
  onGoToForm: () => void;
  onOpenEmergency: () => void;
  onExplorePrototype?: (tab: string) => void;
}

export const OnlineServiceInProgress: React.FC<OnlineServiceInProgressProps> = ({
  onBackToOverview,
  onGoToForm,
  // onOpenEmergency and onExplorePrototype are kept in the interface for future use
  // but are not rendered in the current user-facing version.
  // onOpenEmergency,
  // onExplorePrototype,
}) => {
  const upcomingFeatures = [
    {
      title: 'Sub-divided Peer Communities',
      desc: 'Focused rooms for career transitions, overthinking, and shared life milestones with anonymous handles.',
      icon: Compass,
      status: 'In Development',
    },
    {
      title: 'Browser Acoustic Synthesizer & Breathwork',
      desc: 'Real-time mathematical brown & pink noise generation paired with somatic vagus nerve breathing pacers.',
      icon: Wind,
      status: 'In Development',
    },
    {
      title: 'Private Encrypted Journal Vault',
      desc: 'Zero-knowledge, client-side encrypted personal reflections with cognitive defusion prompts.',
      icon: BookOpen,
      status: 'In Development',
    },
    {
      title: 'Sensory-Biometric Pattern Diagnostics',
      desc: '60-second daily check-ins tracking 7-day stress trajectories and restorative energy balance.',
      icon: Activity,
      status: 'In Development',
    },
    {
      title: 'Beacon Companion & Micro-Games',
      desc: 'CBT/ACT-informed perspective linked to check-in scores, plus Zen pebble balancing and cloud dissolvers.',
      icon: MessageSquareHeart,
      status: 'In Development',
    },
  ];

  return (
    <article className="relative isolate min-h-screen bg-[#F4F1EA] text-[#2B2E2B] flex flex-col overflow-hidden selection:bg-[#B9D2B9] selection:text-[#1B4326]">
      {/* A quiet forest in progress, blended into the cream canvas */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px]">
        <AsyncImage
          src="/images/forest-trail.jpg"
          alt=""
          priority
          className="h-full w-full"
          imgClassName="opacity-30 saturate-[0.75]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4F1EA]/65 via-[#F4F1EA]/85 to-[#F4F1EA]" />
        <div className="absolute inset-0 bg-[#B9D2B9] opacity-20 mix-blend-color" />
      </div>

      {/* Main Notice Body — no inner header; the global Navbar handles navigation */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center text-center">

        {/* Status Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#B9D2B9] text-[#1B4326] text-xs font-bold mb-6 border border-[#2E6F40]/30 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-[#1B4326]" />
          <span>Service Launch in Progress</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-serif text-[#1B4326] font-normal tracking-tight leading-tight max-w-2xl mb-6">
          Our online service & community backend are currently in development.
        </h1>

        <p className="text-base sm:text-lg text-[#2B2E2B]/85 max-w-2xl leading-relaxed mb-10 font-normal">
          We are thoughtfully building our privacy-first peer backend, acoustic synthesis decks, and wellbeing tools. The complex community features will be launched at a later date — but you can join our founding community right now.
        </p>

        {/* Primary Action Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full sm:w-auto">
          <button
            onClick={onGoToForm}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] font-semibold text-sm shadow-md transition-all flex items-center justify-center space-x-2 border border-[#1B4326]"
          >
            <Heart className="w-4 h-4 text-[#C8B87E]" />
            <span>Join the Founding Community</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onBackToOverview}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#FFFFFF] hover:bg-[#B9D2B9]/30 text-[#1B4326] font-semibold text-sm border-2 border-[#1B4326] transition-all shadow-sm flex items-center justify-center"
          >
            Return to Landing Page
          </button>
        </div>

        {/* Feature Roadmap Preview */}
        <div className="w-full text-left">
          <div className="flex items-center justify-between pb-3 border-b border-[#D8D4C9] mb-6">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#1B4326]">
                What is Being Prepared for Launch
              </h2>
              <p className="text-xs text-[#2B2E2B]/70">
                Core architecture currently undergoing stability and clinical grounding review
              </p>
            </div>
            <span className="text-xs font-semibold text-[#2E6F40] bg-[#B9D2B9]/40 px-2.5 py-1 rounded-full border border-[#2E6F40]/30 shrink-0 ml-4">
              Roadmap Preview
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {upcomingFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#D8D4C9] shadow-sm flex items-start space-x-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F4F1EA] border border-[#D8D4C9] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#2E6F40]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-serif font-bold text-sm text-[#1B4326]">
                        {feat.title}
                      </h3>
                      <span className="text-[10px] font-bold text-[#2E6F40] bg-[#B9D2B9]/50 px-2 py-0.5 rounded-full shrink-0 ml-2">
                        {feat.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#2B2E2B]/75 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/*
           * ─────────────────────────────────────────────────────────────────
           * DEVELOPER SANDBOX (commented out — not user-facing)
           * To re-enable: uncomment the JSX block below and pass
           * onExplorePrototype from App.tsx via the component props.
           * ─────────────────────────────────────────────────────────────────
           *
           * <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D8D4C9] text-center space-y-3">
           *   <span className="text-xs font-bold uppercase tracking-wider text-[#2E6F40] block">
           *     Internal Development Sandbox
           *   </span>
           *   <p className="text-xs text-[#2B2E2B]/80 max-w-lg mx-auto">
           *     Authorized developers: inspect standalone prototype workspaces below.
           *   </p>
           *   <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-[#D8D4C9] mt-3">
           *     {[
           *       { label: 'Communities Feed', key: 'communities' },
           *       { label: 'Breath & Sounds', key: 'calm' },
           *       { label: 'Private Journal', key: 'journal' },
           *       { label: 'Sensory Check-up', key: 'checkups' },
           *       { label: 'Articles Deck', key: 'articles' },
           *       { label: 'Calm Games', key: 'games' },
           *       { label: 'Beacon Companion', key: 'chat' },
           *       { label: 'Impact Analytics', key: 'analytics' },
           *     ].map((item) => (
           *       <button
           *         key={item.key}
           *         onClick={() => onExplorePrototype?.(item.key)}
           *         className="p-2 rounded-lg bg-[#F4F1EA] hover:bg-[#B9D2B9]/50 text-[#1B4326] text-xs font-semibold border border-[#D8D4C9] transition-all"
           *       >
           *         {item.label}
           *       </button>
           *     ))}
           *   </div>
           * </div>
           */}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1B4326] text-[#F4F1EA] py-8 px-4 sm:px-6 text-xs border-t-2 border-[#1B4326]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[#F4F1EA]/70">
          <div>
            © 2026 MB CARE • Mental Beacon Wellbeing Initiative
          </div>
          <button
            onClick={onBackToOverview}
            className="hover:text-white underline underline-offset-4"
          >
            ← Back to Overview
          </button>
        </div>
      </footer>
    </article>
  );
};
