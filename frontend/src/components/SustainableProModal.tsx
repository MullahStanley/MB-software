import React from 'react';
import { Sparkles, Check, GraduationCap, Building2, Heart, Shield, X, Award } from 'lucide-react';

interface SustainableProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SustainableProModal: React.FC<SustainableProModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FFFFFF] rounded-2xl max-w-3xl w-full border-2 border-[#1B4326] shadow-2xl overflow-hidden my-8">
        <div className="p-6 bg-[#1B4326] text-[#F4F1EA] border-b border-[#1B4326] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF]/15 text-[#C8B87E] border border-[#C8B87E]/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#F4F1EA]">Impact & Financial Sustainability Model</h2>
              <p className="text-xs text-[#F4F1EA]/80">
                How Mental Beacon stays free for youth while generating durable operational revenue
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#F4F1EA]/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-[#FFFFFF] text-[#2B2E2B]">
          {/* Ethical Thesis */}
          <div className="p-4 rounded-xl bg-[#B9D2B9]/30 border border-[#2E6F40]/30 text-xs text-[#1B4326] leading-relaxed">
            <strong className="block text-sm text-[#1B4326] font-serif font-bold mb-1">
              Why We Are NOT A Mood Tracker & NOT A Booking Directory:
            </strong>
            Mood trackers lead to engagement fatigue after 7 days because logging numbers does not solve life crises. Therapist booking directories exploit vulnerable moments with hefty markups. <strong>Mental Beacon is an impact-driven social grounding and distress escalation ecosystem.</strong>
          </div>

          {/* 3 Pillars of Financial Sustainability */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1: Free Forever Core */}
            <div className="p-4 rounded-xl bg-[#F4F1EA] border border-[#D8D4C9] space-y-3">
              <div className="flex items-center space-x-2 text-[#2E6F40]">
                <Heart className="w-4 h-4" />
                <h3 className="font-bold text-xs text-[#1B4326] uppercase tracking-wider">Free Core Tier</h3>
              </div>
              <div className="text-xl font-serif font-extrabold text-[#1B4326]">$0 <span className="text-xs text-[#2B2E2B]/70 font-sans font-normal">/ forever</span></div>
              <ul className="text-xs text-[#2B2E2B] space-y-2">
                <li className="flex items-start space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2E6F40] shrink-0 mt-0.5" />
                  <span>All 6 sub-divided communities</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2E6F40] shrink-0 mt-0.5" />
                  <span>Full 6-level lower threshold emergency escalation</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2E6F40] shrink-0 mt-0.5" />
                  <span>Unlimited visual breathing & audio noise</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2E6F40] shrink-0 mt-0.5" />
                  <span>Private encrypted journal & basic patterns</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2: University & Employer Sponsorship (B2B SaaS) */}
            <div className="p-4 rounded-xl bg-[#FFFFFF] border-2 border-[#1B4326] space-y-3 shadow-sm">
              <div className="flex items-center space-x-2 text-[#1B4326]">
                <GraduationCap className="w-4 h-4 text-[#2E6F40]" />
                <h3 className="font-bold text-xs text-[#1B4326] uppercase tracking-wider">Campus Sponsorship</h3>
              </div>
              <div className="text-xl font-serif font-extrabold text-[#1B4326]">B2B Institutional <span className="text-xs text-[#2B2E2B]/70 font-sans font-normal">/ campus</span></div>
              <p className="text-xs text-[#2B2E2B] leading-relaxed">
                Colleges and early-career employers license Mental Beacon to replace broken 6-week campus counseling waitlists with instant peer & crisis safety.
              </p>
              <div className="text-[11px] text-[#2E6F40] font-semibold pt-1">
                Primary sustainable revenue engine (~80% of operating capital).
              </div>
            </div>

            {/* Pillar 3: Optional Beacon Pro */}
            <div className="p-4 rounded-xl bg-[#F4F1EA] border border-[#D8D4C9] space-y-3">
              <div className="flex items-center space-x-2 text-amber-700">
                <Award className="w-4 h-4" />
                <h3 className="font-bold text-xs text-[#1B4326] uppercase tracking-wider">Beacon Pro</h3>
              </div>
              <div className="text-xl font-serif font-extrabold text-[#1B4326]">$4.99 <span className="text-xs text-[#2B2E2B]/70 font-sans font-normal">/ mo (Optional)</span></div>
              <ul className="text-xs text-[#2B2E2B] space-y-2">
                <li className="flex items-start space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2E6F40] shrink-0 mt-0.5" />
                  <span>Quarterly neuro-developmental pattern reports</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2E6F40] shrink-0 mt-0.5" />
                  <span>High-bitrate offline synthesized sound packs</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2E6F40] shrink-0 mt-0.5" />
                  <span>Moderated small-group audio circles</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#F4F1EA] border-t border-[#D8D4C9] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
