import React from 'react';
import { Sparkles, Check, GraduationCap, Building2, Heart, Shield, X, Award } from 'lucide-react';

interface SustainableProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SustainableProModal: React.FC<SustainableProModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-700 shadow-2xl overflow-hidden my-8">
        <div className="p-6 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Impact & Financial Sustainability Model</h2>
              <p className="text-xs text-slate-400">
                How Mental Beacon stays free for youth while generating durable operational revenue
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">✕</button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Ethical Thesis */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
            <strong className="block text-sm text-amber-300 font-bold mb-1">
              Why We Are NOT A Mood Tracker & NOT A Booking Directory:
            </strong>
            Mood trackers lead to engagement fatigue after 7 days because logging numbers does not solve life crises. Therapist booking directories exploit vulnerable moments with hefty markups. <strong>Mental Beacon is an impact-driven social grounding and distress escalation ecosystem.</strong>
          </div>

          {/* 3 Pillars of Financial Sustainability */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1: Free Forever Core */}
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-teal-400">
                <Heart className="w-4 h-4" />
                <h3 className="font-bold text-xs text-white uppercase tracking-wider">Free Core Tier</h3>
              </div>
              <div className="text-xl font-extrabold text-white">$0 <span className="text-xs text-slate-400 font-normal">/ forever</span></div>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-start space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>All 6 sub-divided communities</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>Full 6-level lower threshold emergency escalation</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>Unlimited visual breathing & audio noise</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>Private encrypted journal & basic patterns</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2: University & Employer Sponsorship (B2B SaaS) */}
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 space-y-3 ring-1 ring-indigo-500/30">
              <div className="flex items-center space-x-2 text-indigo-400">
                <GraduationCap className="w-4 h-4" />
                <h3 className="font-bold text-xs text-white uppercase tracking-wider">Campus Sponsorship</h3>
              </div>
              <div className="text-xl font-extrabold text-indigo-200">B2B Institutional <span className="text-xs text-slate-400 font-normal">/ campus</span></div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Colleges and early-career employers license Mental Beacon to replace broken 6-week campus counseling waitlists with instant peer & crisis safety.
              </p>
              <div className="text-[11px] text-indigo-300 font-medium pt-1">
                Primary sustainable revenue engine (~80% of operating capital).
              </div>
            </div>

            {/* Pillar 3: Optional Beacon Pro */}
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-amber-400">
                <Award className="w-4 h-4" />
                <h3 className="font-bold text-xs text-white uppercase tracking-wider">Beacon Pro</h3>
              </div>
              <div className="text-xl font-extrabold text-white">$4.99 <span className="text-xs text-slate-400 font-normal">/ mo (Optional)</span></div>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-start space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Quarterly neuro-developmental pattern reports</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>High-bitrate offline synthesized sound packs</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Moderated small-group audio circles</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
