import React, { useState } from 'react';
import { ShieldCheck, Download, Trash2, Lock, EyeOff, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../api';
import { Modal } from './ui/Modal';

interface TransparencyCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransparencyCenter: React.FC<TransparencyCenterProps> = ({ isOpen, onClose }) => {
  const [clearing, setClearing] = useState(false);
  const [clearMessage, setClearMessage] = useState<string | null>(null);

  const handleExportData = () => {
    window.open('/api/analytics/export-user-data', '_blank');
  };

  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to permanently erase all check-ins, journal entries, and chat records?')) {
      return;
    }
    try {
      setClearing(true);
      const res = await api.clearUserData();
      setClearMessage(res.message);
      setTimeout(() => setClearMessage(null), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setClearing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Data privacy"
      description="Your psychological safety requires real data sovereignty — here's exactly how ours works."
      maxWidth="max-w-2xl"
      footer={
        <button type="button" onClick={onClose} className="btn btn-sm btn-outline">
          Close
        </button>
      }
    >
      <div className="space-y-6">
        {/* Plain-english commitments */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1 rounded-lg border border-slate-200 bg-slate-50 p-3.5">
            <EyeOff className="h-4 w-4 text-forest-600" aria-hidden="true" />
            <span className="block text-xs font-semibold text-slate-900">No ad networks</span>
            <p className="text-xs leading-relaxed text-slate-500">
              Zero Meta, Google or TikTok pixels. We never sell behaviour.
            </p>
          </div>
          <div className="space-y-1 rounded-lg border border-slate-200 bg-slate-50 p-3.5">
            <Lock className="h-4 w-4 text-forest-600" aria-hidden="true" />
            <span className="block text-xs font-semibold text-slate-900">Anonymous by default</span>
            <p className="text-xs leading-relaxed text-slate-500">
              Community posts are decoupled from your real identity and email.
            </p>
          </div>
          <div className="space-y-1 rounded-lg border border-slate-200 bg-slate-50 p-3.5">
            <FileText className="h-4 w-4 text-forest-600" aria-hidden="true" />
            <span className="block text-xs font-semibold text-slate-900">Export anytime</span>
            <p className="text-xs leading-relaxed text-slate-500">
              Full GDPR/CCPA export in standard machine-readable JSON.
            </p>
          </div>
        </div>

        {/* Detailed policy */}
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <h3 className="text-sm font-semibold text-slate-900">How Mental Beacon handles your information</h3>
          <p>
            <strong className="font-semibold">Check-in patterns:</strong> your stress and energy ratings are
            stored only so you can see recurring burnout triggers — and so protective support can kick in
            automatically.
          </p>
          <p>
            <strong className="font-semibold">Emergency contacts:</strong> stored on your isolated account.
            They're only used when you explicitly ask for reach-out help, or when you trigger level 6.
          </p>
          <p>
            <strong className="font-semibold">Community posts:</strong> shared under your anonymous handle to
            build peer solidarity and map the obstacles young adults actually face.
          </p>
        </div>

        {clearMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-forest-200 bg-forest-50 p-3 text-sm text-forest-800" role="status">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{clearMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row">
          <button
            type="button"
            onClick={handleExportData}
            className="btn btn-primary flex-1"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Download my data (JSON)</span>
          </button>

          <button
            type="button"
            onClick={handleClearData}
            disabled={clearing}
            className="btn flex-1 border border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            <span>{clearing ? 'Wiping…' : 'Permanently wipe my data'}</span>
          </button>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-forest-600" aria-hidden="true" />
          No ad tracking, ever — the full policy is one screen because it's genuinely simple.
        </p>
      </div>
    </Modal>
  );
};
