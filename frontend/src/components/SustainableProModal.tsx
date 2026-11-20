import React from 'react';
import { Check, GraduationCap, Heart, Award } from 'lucide-react';
import { Modal } from './ui/Modal';

interface SustainableProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SustainableProModal: React.FC<SustainableProModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="How we stay funded"
      description="Mental Beacon stays free for young adults — here's the model that keeps it that way."
      footer={
        <button type="button" onClick={onClose} className="btn btn-sm btn-outline">
          Close
        </button>
      }
    >
      <div className="space-y-6">
        {/* Thesis */}
        <p className="rounded-lg border border-forest-200 bg-forest-50 p-4 text-sm leading-relaxed text-forest-900">
          <strong className="mb-1 block font-semibold">
            Not a mood tracker, and not a therapist booking directory.
          </strong>
          Mood trackers lead to engagement fatigue after a week, because logging numbers doesn't solve a life
          crisis. Booking directories take a markup on vulnerable moments. Mental Beacon is built around
          peer connection and distress escalation instead — and it stays free at the point of need.
        </p>

        {/* Three pillars */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Free core */}
          <div className="space-y-3 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-forest-700">
              <Heart className="h-4 w-4" aria-hidden="true" />
              <h3 className="text-xs font-semibold uppercase tracking-wider">Free core</h3>
            </div>
            <div className="text-xl font-semibold text-slate-900">
              $0 <span className="text-xs font-normal text-slate-500">/ forever</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-1.5">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                <span>All six communities</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                <span>Full six-level safety escalation</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                <span>Unlimited breathing & soundscapes</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                <span>Private journal & pattern tracking</span>
              </li>
            </ul>
          </div>

          {/* Campus sponsorship */}
          <div className="space-y-3 rounded-xl border border-forest-600 bg-forest-50/50 p-4 ring-1 ring-forest-600/30">
            <div className="flex items-center gap-2 text-forest-700">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              <h3 className="text-xs font-semibold uppercase tracking-wider">Campus sponsorship</h3>
            </div>
            <div className="text-xl font-semibold text-slate-900">
              B2B <span className="text-xs font-normal text-slate-500">/ institutions</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              Colleges and early-career employers license Mental Beacon to replace six-week campus
              counselling waitlists with instant peer and crisis support.
            </p>
            <p className="text-xs font-medium text-forest-700">
              The primary revenue engine — about 80% of operating costs.
            </p>
          </div>

          {/* Optional pro */}
          <div className="space-y-3 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-forest-700">
              <Award className="h-4 w-4" aria-hidden="true" />
              <h3 className="text-xs font-semibold uppercase tracking-wider">Beacon Pro</h3>
            </div>
            <div className="text-xl font-semibold text-slate-900">
              $4.99 <span className="text-xs font-normal text-slate-500">/ month, optional</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-1.5">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                <span>Quarterly pattern reports</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                <span>Offline synthesized sound packs</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                <span>Moderated small-group audio circles</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-slate-500">
          No venture funding, no ads, no data resale. Institutional licensing carries the platform so the
          people who need it most never see a paywall in a crisis.
        </p>
      </div>
    </Modal>
  );
};
