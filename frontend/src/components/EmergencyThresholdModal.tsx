import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Phone, 
  Mail, 
  UserPlus, 
  Trash2, 
  Send, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  FileText, 
  HeartHandshake, 
  X,
  Radio,
  Clock
} from 'lucide-react';
import { api, TrustedContact, AlertLog } from '../api';

interface EmergencyThresholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLevel?: number;
  initialSource?: string;
  onNavigateTab: (tab: string) => void;
}

export const EmergencyThresholdModal: React.FC<EmergencyThresholdModalProps> = ({
  isOpen,
  onClose,
  activeLevel = 4,
  initialSource = 'manual',
  onNavigateTab
}) => {
  const [currentLevel, setCurrentLevel] = useState<number>(activeLevel);
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [logs, setLogs] = useState<AlertLog[]>([]);
  const [dispatchNotice, setDispatchNotice] = useState<string | null>(null);

  // Add Contact Form State
  const [showAddContact, setShowAddContact] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCurrentLevel(activeLevel);
      loadEmergencyData();
    }
  }, [isOpen, activeLevel]);

  const loadEmergencyData = async () => {
    try {
      const [cList, lList] = await Promise.all([
        api.getContacts(),
        api.getAlertLogs()
      ]);
      setContacts(cList);
      setLogs(lList);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || (!newPhone.trim() && !newEmail.trim())) return;

    try {
      const created = await api.addContact({
        name: newName.trim(),
        relationship: newRelationship.trim() || 'Trusted Friend',
        phone: newPhone.trim(),
        email: newEmail.trim(),
        notes: newNotes.trim(),
        canAutoAlert: true
      });
      setContacts([...contacts, created]);
      setNewName('');
      setNewRelationship('');
      setNewPhone('');
      setNewEmail('');
      setNewNotes('');
      setShowAddContact(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await api.deleteContact(id);
      setContacts(contacts.filter(c => c.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerLevel = async (lvl: number) => {
    setCurrentLevel(lvl);
    try {
      const res = await api.triggerThresholdLevel(lvl, 'safety_modal');
      loadEmergencyData();
      if (lvl === 6) {
        setDispatchNotice(`Simulated SOS alert dispatched to ${contacts.length} trusted contacts.`);
      } else {
        setDispatchNotice(`Lower threshold Level ${lvl} active.`);
      }
      setTimeout(() => setDispatchNotice(null), 6000);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-700 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Emergency Threshold & Trusted Circle</span>
              </h2>
              <p className="text-xs text-slate-400">
                Multi-level safety escalation when distress reaches acute limits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dispatch Notification Toast */}
        {dispatchNotice && (
          <div className="bg-rose-900/60 border-y border-rose-600/50 px-6 py-2.5 flex items-center space-x-2 text-xs text-rose-200">
            <Radio className="w-4 h-4 animate-ping text-rose-400" />
            <span className="font-semibold">{dispatchNotice}</span>
          </div>
        )}

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Level Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              6-Tier Lower Threshold Escalation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { lvl: 1, label: 'L1: Community', desc: 'Join peer group' },
                { lvl: 2, label: 'L2: Articles', desc: 'Grounding guide' },
                { lvl: 3, label: 'L3: Breath/Audio', desc: 'Somatic calm' },
                { lvl: 4, label: 'L4: Prompt Reachout', desc: 'Suggested text' },
                { lvl: 5, label: 'L5: MB Specialist', desc: 'Youth helplines' },
                { lvl: 6, label: 'L6: Auto-Alert', desc: 'SOS to contacts' },
              ].map((item) => {
                const isActive = currentLevel === item.lvl;
                return (
                  <button
                    key={item.lvl}
                    type="button"
                    onClick={() => handleTriggerLevel(item.lvl)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isActive
                        ? item.lvl >= 5
                          ? 'bg-rose-500/20 border-rose-500 text-rose-200 ring-1 ring-rose-500 shadow-md'
                          : item.lvl >= 3
                          ? 'bg-amber-500/20 border-amber-500 text-amber-200 ring-1 ring-amber-500 shadow-md'
                          : 'bg-teal-500/20 border-teal-500 text-teal-200 ring-1 ring-teal-500 shadow-md'
                        : 'bg-slate-850/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-xs block">{item.label}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level Details View */}
          <div className="bg-slate-850 rounded-xl p-5 border border-slate-800 space-y-4">
            {currentLevel === 1 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-teal-400">
                  <Compass className="w-5 h-5" />
                  <h3 className="font-bold text-sm text-white">Level 1: Prompt to Join an Authentic Peer Community</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When you feel initial isolation or stress creep, connecting with peers who have walked the same path prevents shame and cognitive spiraling.
                </p>
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('communities');
                    }}
                    className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
                  >
                    Explore Sub-divided Communities
                  </button>
                </div>
              </div>
            )}

            {currentLevel === 2 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-teal-400">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-bold text-sm text-white">Level 2: Suggested Psychoeducational Articles</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Recommended for moderate cognitive fatigue. Learn the neuroscience of quarter-life transitions and how to reset an overloaded nervous system.
                </p>
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('articles');
                    }}
                    className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
                  >
                    Read Cortisol Reset & Life Guides
                  </button>
                </div>
              </div>
            )}

            {currentLevel === 3 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Radio className="w-5 h-5" />
                  <h3 className="font-bold text-sm text-white">Level 3: Visual Breathing & Brown/White Noise Calming</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Before logical thinking works, downregulate sympathetic nervous arousal with real-time synthesized brown noise and guided 4-7-8 breathwork.
                </p>
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('calm');
                    }}
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
                  >
                    Open Calming Audio & Breath Guide
                  </button>
                </div>
              </div>
            )}

            {currentLevel === 4 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-amber-400">
                  <HeartHandshake className="w-5 h-5" />
                  <h3 className="font-bold text-sm text-white">Level 4: Suggest Reaching Out to Trusted Contacts</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You do not have to explain everything. We generated a gentle, low-pressure message you can copy and text right now:
                </p>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-700 text-xs text-slate-200 italic">
                  "Hey, things have been feeling heavy and loud today. No need to fix anything, but could use a quick low-pressure text or chat when you have 5 minutes."
                </div>
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-400 block mb-2">One-tap Reach Out:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {contacts.map((c) => (
                      <a
                        key={c.id}
                        href={`sms:${c.phone}?body=Hey%2C%20feeling%20a%20bit%20overwhelmed%20today%2C%20would%20love%20a%20quick%20check-in.`}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs hover:border-teal-400"
                      >
                        <div>
                          <span className="font-bold text-white block">{c.name}</span>
                          <span className="text-[11px] text-slate-400">{c.relationship} • {c.phone}</span>
                        </div>
                        <Send className="w-4 h-4 text-teal-400" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentLevel === 5 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                  <h3 className="font-bold text-sm text-white">Level 5: Recommend MB Specialist & 24/7 Professional Resources</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When stress exceeds everyday coping, connecting with a professional counselor or 24/7 anonymous crisis responder provides critical grounding:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs">
                    <span className="font-bold text-white block">Crisis Text Line (Free & Confidential)</span>
                    <span className="text-teal-400 font-mono block mt-1">Text HOME to 741741</span>
                    <span className="text-[11px] text-slate-400 block mt-1">24/7 texting with a trained crisis counselor</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs">
                    <span className="font-bold text-white block">988 Suicide & Crisis Lifeline</span>
                    <span className="text-teal-400 font-mono block mt-1">Call or Text 988</span>
                    <span className="text-[11px] text-slate-400 block mt-1">24/7 free support across the US & Canada</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs">
                    <span className="font-bold text-white block">The Trevor Project (LGBTQ+ Youth)</span>
                    <span className="text-teal-400 font-mono block mt-1">1-866-488-7386 or Text START to 678-678</span>
                    <span className="text-[11px] text-slate-400 block mt-1">Specialized young adult advocates</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs">
                    <span className="font-bold text-white block">MB Specialist Referral Concierge</span>
                    <span className="text-teal-400 font-mono block mt-1">support@mentalbeacon.org</span>
                    <span className="text-[11px] text-slate-400 block mt-1">Matched sliding-scale youth therapists</span>
                  </div>
                </div>
              </div>
            )}

            {currentLevel === 6 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-rose-400">
                  <Radio className="w-5 h-5 animate-pulse" />
                  <h3 className="font-bold text-sm text-white">Level 6: Safe Automated Messaging Dispatched to Trusted Contacts</h3>
                </div>
                <p className="text-xs text-rose-200 leading-relaxed font-medium">
                  Your safety protocol has dispatched a gentle, automated alert to your designated emergency contacts, asking them to check in on you.
                </p>
                <div className="p-3 bg-slate-950 rounded-lg border border-rose-900/60 text-xs space-y-1">
                  <span className="text-slate-400 block font-semibold">Simulated Dispatch Output:</span>
                  <p className="text-slate-300 italic">
                    "[MB Safety Protocol] Gentle alert: Your contact triggered their Level 6 distress threshold on Mental Beacon. Please give them a warm call or check-in."
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold pt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Notified: {contacts.map(c => c.name).join(', ')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Trusted Contacts Management */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Your Configured Trusted Contacts</h3>
                <p className="text-xs text-slate-400">
                  People you trust to be notified when you reach Level 4 or Level 6 distress
                </p>
              </div>
              <button
                onClick={() => setShowAddContact(!showAddContact)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700"
              >
                <UserPlus className="w-3.5 h-3.5 text-teal-400" />
                <span>{showAddContact ? 'Cancel' : 'Add Contact'}</span>
              </button>
            </div>

            {/* Add Contact Form */}
            {showAddContact && (
              <form onSubmit={handleAddContact} className="p-4 rounded-xl bg-slate-950 border border-slate-700 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Smith"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-slate-900 text-xs px-2.5 py-1.5 rounded border border-slate-700 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Relationship</label>
                    <input
                      type="text"
                      placeholder="e.g. Roommate, Sibling, Partner"
                      value={newRelationship}
                      onChange={(e) => setNewRelationship(e.target.value)}
                      className="w-full bg-slate-900 text-xs px-2.5 py-1.5 rounded border border-slate-700 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-slate-900 text-xs px-2.5 py-1.5 rounded border border-slate-700 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="contact@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full bg-slate-900 text-xs px-2.5 py-1.5 rounded border border-slate-700 text-slate-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Grounding Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Knows how to help me ground when sensory overload hits."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full bg-slate-900 text-xs px-2.5 py-1.5 rounded border border-slate-700 text-slate-200"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
                  >
                    Save Trusted Contact
                  </button>
                </div>
              </form>
            )}

            {/* Contacts Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contacts.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-white">{c.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
                        {c.relationship}
                      </span>
                    </div>
                    {c.phone && (
                      <span className="flex items-center text-[11px] text-slate-400">
                        <Phone className="w-3 h-3 mr-1 text-slate-500" />
                        {c.phone}
                      </span>
                    )}
                    {c.email && (
                      <span className="flex items-center text-[11px] text-slate-400">
                        <Mail className="w-3 h-3 mr-1 text-slate-500" />
                        {c.email}
                      </span>
                    )}
                    {c.notes && (
                      <p className="text-[10px] text-slate-500 italic mt-1">{c.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteContact(c.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Remove Contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Audit / Alert History Logs */}
          {logs.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Recent Safety Logs
              </span>
              <div className="space-y-1.5 max-h-28 overflow-y-auto">
                {logs.slice(0, 5).map((l) => (
                  <div key={l.id} className="text-[11px] p-2 rounded bg-slate-950/80 border border-slate-800 flex justify-between items-center text-slate-300">
                    <div className="flex items-center space-x-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        l.level >= 5 ? 'bg-rose-500/20 text-rose-300' : 'bg-teal-500/20 text-teal-300'
                      }`}>
                        Level {l.level}
                      </span>
                      <span className="truncate max-w-[280px]">{l.message}</span>
                    </div>
                    <span className="text-slate-500 text-[10px] font-mono">
                      {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Mental Beacon Safety Protocol is designed with zero commercial tracking.
          </span>
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
