import React, { useState } from 'react';
import { ShieldCheck, Download, Trash2, Lock, EyeOff, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api';

interface TransparencyCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransparencyCenter: React.FC<TransparencyCenterProps> = ({ isOpen, onClose }) => {
  const [clearing, setClearing] = useState(false);
  const [clearMessage, setClearMessage] = useState<string | null>(null);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FFFFFF] rounded-2xl max-w-2xl w-full border-2 border-[#1B4326] shadow-2xl overflow-hidden my-8">
        <div className="p-6 bg-[#1B4326] text-[#F4F1EA] border-b border-[#1B4326] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF]/15 text-[#C8B87E] border border-[#C8B87E]/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#F4F1EA]">Transparent Data Architecture</h2>
              <p className="text-xs text-[#F4F1EA]/80">Your psychological safety requires absolute data sovereignty</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#F4F1EA]/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-[#FFFFFF] text-[#2B2E2B]">
          {/* Plain-English Commitments */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#F4F1EA] border border-[#D8D4C9] space-y-1">
              <EyeOff className="w-4 h-4 text-[#2E6F40]" />
              <span className="font-bold text-xs text-[#1B4326] block">No Ad Networks</span>
              <p className="text-[11px] text-[#2B2E2B]/80">Zero Meta, Google, or TikTok tracking pixels. We never sell behavior.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F4F1EA] border border-[#D8D4C9] space-y-1">
              <Lock className="w-4 h-4 text-[#2E6F40]" />
              <span className="font-bold text-xs text-[#1B4326] block">Client Pseudonymity</span>
              <p className="text-[11px] text-[#2B2E2B]/80">Community posts are decoupled from real identities and emails.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F4F1EA] border border-[#D8D4C9] space-y-1">
              <FileText className="w-4 h-4 text-[#2E6F40]" />
              <span className="font-bold text-xs text-[#1B4326] block">Export Anytime</span>
              <p className="text-[11px] text-[#2B2E2B]/80">Full GDPR/CCPA data export in standardized machine-readable JSON.</p>
            </div>
          </div>

          {/* Detailed Policy Text */}
          <div className="bg-[#F4F1EA] p-4 rounded-xl border border-[#D8D4C9] text-xs text-[#2B2E2B] space-y-3">
            <h3 className="font-serif font-bold text-[#1B4326] text-sm">How Mental Beacon (MB) Handles Your Information:</h3>
            <p>
              1. <strong>Check-up Patterns:</strong> Biometric and stress ratings are stored to help you recognize recurring burnout triggers and activate protective lower threshold protocols.
            </p>
            <p>
              2. <strong>Emergency Contacts:</strong> Stored locally and on your isolated tenant. They are only queried when you explicitly request reach-out assistance or your distress triggers Level 6.
            </p>
            <p>
              3. <strong>Community Posts:</strong> Shared publicly under your pseudonymous username to build peer solidarity and map frequent young-adult obstacles.
            </p>
          </div>

          {clearMessage && (
            <div className="p-3 rounded-lg bg-[#B9D2B9]/50 border border-[#2E6F40]/40 text-[#1B4326] text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#2E6F40]" />
              <span>{clearMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleExportData}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] text-xs font-semibold shadow"
            >
              <Download className="w-4 h-4" />
              <span>Download My Complete Data (JSON)</span>
            </button>

            <button
              onClick={handleClearData}
              disabled={clearing}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 text-xs font-semibold"
            >
              <Trash2 className="w-4 h-4" />
              <span>{clearing ? 'Wiping...' : 'Permanently Wipe My Patterns'}</span>
            </button>
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
