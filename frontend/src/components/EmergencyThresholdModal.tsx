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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FFFFFF] rounded-2xl max-w-3xl w-full border-2 border-[#1B4326] shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#1B4326] text-[#F4F1EA] border-b border-[#1B4326] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF]/15 text-[#C8B87E] border border-[#C8B87E]/30 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#F4F1EA] flex items-center space-x-2">
                <span>Emergency Threshold & Trusted Circle</span>
              </h2>
              <p className="text-xs text-[#F4F1EA]/80">
                Multi-level safety escalation when distress reaches acute limits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#F4F1EA]/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dispatch Notification Toast */}
        {dispatchNotice && (
          <div className="bg-rose-50 border-y border-rose-300 px-6 py-2.5 flex items-center space-x-2 text-xs text-rose-900">
            <Radio className="w-4 h-4 animate-ping text-rose-600" />
            <span className="font-semibold">{dispatchNotice}</span>
          </div>
        )}

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-[#FFFFFF] text-[#2B2E2B]">
          {/* Level Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-[#2E6F40] uppercase tracking-wider mb-2">
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
                          ? 'bg-rose-100 border-rose-600 text-rose-900 font-bold shadow-sm'
                          : item.lvl >= 3
                          ? 'bg-amber-100 border-amber-600 text-amber-900 font-bold shadow-sm'
                          : 'bg-[#B9D2B9] border-[#1B4326] text-[#1B4326] font-bold shadow-sm'
                        : 'bg-[#F4F1EA] border-[#D8D4C9] text-[#2B2E2B]/80 hover:text-[#1B4326] hover:border-[#1B4326]'
                    }`}
                  >
                    <span className="font-bold text-xs block">{item.label}</span>
                    <span className="text-[10px] text-[#2B2E2B]/70 block truncate">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level Details View */}
          <div className="bg-[#F4F1EA] rounded-xl p-5 border border-[#D8D4C9] space-y-4">
            {currentLevel === 1 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[#1B4326]">
                  <Compass className="w-5 h-5 text-[#2E6F40]" />
                  <h3 className="font-serif font-bold text-base text-[#1B4326]">Level 1: Prompt to Join an Authentic Peer Community</h3>
                </div>
                <p className="text-xs text-[#2B2E2B] leading-relaxed">
                  When you feel initial isolation or stress creep, connecting with peers who have walked the same path prevents shame and cognitive spiraling.
                </p>
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('communities');
                    }}
                    className="px-4 py-2 rounded-lg bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] text-xs font-semibold"
                  >
                    Explore Sub-divided Communities
                  </button>
                </div>
              </div>
            )}

            {currentLevel === 2 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[#1B4326]">
                  <FileText className="w-5 h-5 text-[#2E6F40]" />
                  <h3 className="font-serif font-bold text-base text-[#1B4326]">Level 2: Suggested Psychoeducational Articles</h3>
                </div>
                <p className="text-xs text-[#2B2E2B] leading-relaxed">
                  Recommended for moderate cognitive fatigue. Learn the neuroscience of quarter-life transitions and how to reset an overloaded nervous system.
                </p>
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('articles');
                    }}
                    className="px-4 py-2 rounded-lg bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] text-xs font-semibold"
                  >
                    Read Cortisol Reset & Life Guides
                  </button>
                </div>
              </div>
            )}

            {currentLevel === 3 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-amber-800">
                  <Radio className="w-5 h-5 text-amber-700" />
                  <h3 className="font-serif font-bold text-base text-[#1B4326]">Level 3: Visual Breathing & Brown/White Noise Calming</h3>
                </div>
                <p className="text-xs text-[#2B2E2B] leading-relaxed">
                  Before logical thinking works, downregulate sympathetic nervous arousal with real-time synthesized brown noise and guided 4-7-8 breathwork.
                </p>
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('calm');
                    }}
                    className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold"
                  >
                    Open Calming Audio & Breath Guide
                  </button>
                </div>
              </div>
            )}

            {currentLevel === 4 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-amber-800">
                  <HeartHandshake className="w-5 h-5 text-amber-700" />
                  <h3 className="font-serif font-bold text-base text-[#1B4326]">Level 4: Suggest Reaching Out to Trusted Contacts</h3>
                </div>
                <p className="text-xs text-[#2B2E2B] leading-relaxed">
                  You do not have to explain everything. We generated a gentle, low-pressure message you can copy and text right now:
                </p>
                <div className="p-3 bg-[#FFFFFF] rounded-lg border border-[#D8D4C9] text-xs text-[#2B2E2B] italic">
                  "Hey, things have been feeling heavy and loud today. No need to fix anything, but could use a quick low-pressure text or chat when you have 5 minutes."
                </div>
                <div className="pt-2">
                  <span className="text-xs font-semibold text-[#1B4326] block mb-2">One-tap Reach Out:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {contacts.map((c) => (
                      <a
                        key={c.id}
                        href={`sms:${c.phone}?body=Hey%2C%20feeling%20a%20bit%20overwhelmed%20today%2C%20would%20love%20a%20quick%20check-in.`}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D8D4C9] text-xs hover:border-[#1B4326]"
                      >
                        <div>
                          <span className="font-bold text-[#1B4326] block">{c.name}</span>
                          <span className="text-[11px] text-[#2B2E2B]/70">{c.relationship} • {c.phone}</span>
                        </div>
                        <Send className="w-4 h-4 text-[#2E6F40]" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentLevel === 5 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-rose-700">
                  <ShieldAlert className="w-5 h-5" />
                  <h3 className="font-serif font-bold text-base text-rose-900">Level 5: Recommend MB Specialist & 24/7 Professional Resources</h3>
                </div>
                <p className="text-xs text-[#2B2E2B] leading-relaxed">
                  When stress exceeds everyday coping, connecting with a professional counselor or 24/7 anonymous crisis responder provides critical grounding:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#D8D4C9] text-xs">
                    <span className="font-bold text-[#1B4326] block">Crisis Text Line (Free & Confidential)</span>
                    <span className="text-[#2E6F40] font-mono block mt-1">Text HOME to 741741</span>
                    <span className="text-[11px] text-[#2B2E2B]/70 block mt-1">24/7 texting with a trained crisis counselor</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#D8D4C9] text-xs">
                    <span className="font-bold text-[#1B4326] block">988 Suicide & Crisis Lifeline</span>
                    <span className="text-rose-700 font-mono block mt-1">Call or Text 988</span>
                    <span className="text-[11px] text-[#2B2E2B]/70 block mt-1">24/7 free support across the US & Canada</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#D8D4C9] text-xs">
                    <span className="font-bold text-[#1B4326] block">The Trevor Project (LGBTQ+ Youth)</span>
                    <span className="text-[#2E6F40] font-mono block mt-1">1-866-488-7386 or Text START to 678-678</span>
                    <span className="text-[11px] text-[#2B2E2B]/70 block mt-1">Specialized young adult advocates</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#D8D4C9] text-xs">
                    <span className="font-bold text-[#1B4326] block">MB Specialist Referral Concierge</span>
                    <span className="text-[#2E6F40] font-mono block mt-1">support@mentalbeacon.co.ke</span>
                    <span className="text-[11px] text-[#2B2E2B]/70 block mt-1">Matched sliding-scale youth therapists</span>
                  </div>
                </div>
              </div>
            )}

            {currentLevel === 6 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-rose-700">
                  <Radio className="w-5 h-5 animate-pulse" />
                  <h3 className="font-serif font-bold text-base text-rose-900">Level 6: Safe Automated Messaging Dispatched to Trusted Contacts</h3>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed font-medium">
                  Your safety protocol has dispatched a gentle, automated alert to your designated emergency contacts, asking them to check in on you.
                </p>
                <div className="p-3 bg-[#FFFFFF] rounded-lg border border-rose-300 text-xs space-y-1">
                  <span className="text-[#2B2E2B]/80 block font-semibold">Simulated Dispatch Output:</span>
                  <p className="text-[#2B2E2B] italic">
                    "[MB Safety Protocol] Gentle alert: Your contact triggered their Level 6 distress threshold on Mental Beacon. Please give them a warm call or check-in."
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-[#2E6F40] font-semibold pt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Notified: {contacts.map(c => c.name).join(', ')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Trusted Contacts Management */}
          <div className="space-y-4 pt-2 border-t border-[#D8D4C9]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1B4326]">Your Configured Trusted Contacts</h3>
                <p className="text-xs text-[#2B2E2B]/80">
                  People you trust to be notified when you reach Level 4 or Level 6 distress
                </p>
              </div>
              <button
                onClick={() => setShowAddContact(!showAddContact)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#F4F1EA] hover:bg-[#B9D2B9]/50 text-[#1B4326] text-xs font-semibold border border-[#D8D4C9]"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#2E6F40]" />
                <span>{showAddContact ? 'Cancel' : 'Add Contact'}</span>
              </button>
            </div>

            {/* Add Contact Form */}
            {showAddContact && (
              <form onSubmit={handleAddContact} className="p-4 rounded-xl bg-[#F4F1EA] border border-[#D8D4C9] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#2B2E2B] mb-1">Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Smith"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-[#FFFFFF] text-xs px-2.5 py-1.5 rounded border border-[#D8D4C9] text-[#2B2E2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#2B2E2B] mb-1">Relationship</label>
                    <input
                      type="text"
                      placeholder="e.g. Roommate, Sibling, Partner"
                      value={newRelationship}
                      onChange={(e) => setNewRelationship(e.target.value)}
                      className="w-full bg-[#FFFFFF] text-xs px-2.5 py-1.5 rounded border border-[#D8D4C9] text-[#2B2E2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#2B2E2B] mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-[#FFFFFF] text-xs px-2.5 py-1.5 rounded border border-[#D8D4C9] text-[#2B2E2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#2B2E2B] mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="contact@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full bg-[#FFFFFF] text-xs px-2.5 py-1.5 rounded border border-[#D8D4C9] text-[#2B2E2B]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#2B2E2B] mb-1">Grounding Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Knows how to help me ground when sensory overload hits."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full bg-[#FFFFFF] text-xs px-2.5 py-1.5 rounded border border-[#D8D4C9] text-[#2B2E2B]"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] text-xs font-semibold"
                  >
                    Save Trusted Contact
                  </button>
                </div>
              </form>
            )}

            {/* Contacts Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contacts.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl bg-[#F4F1EA] border border-[#D8D4C9] flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-[#1B4326]">{c.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#B9D2B9] text-[#1B4326] border border-[#2E6F40]/30 font-semibold">
                        {c.relationship}
                      </span>
                    </div>
                    {c.phone && (
                      <span className="flex items-center text-[11px] text-[#2B2E2B]/80">
                        <Phone className="w-3 h-3 mr-1 text-[#2E6F40]" />
                        {c.phone}
                      </span>
                    )}
                    {c.email && (
                      <span className="flex items-center text-[11px] text-[#2B2E2B]/80">
                        <Mail className="w-3 h-3 mr-1 text-[#2E6F40]" />
                        {c.email}
                      </span>
                    )}
                    {c.notes && (
                      <p className="text-[10px] text-[#2B2E2B]/70 italic mt-1">{c.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteContact(c.id)}
                    className="text-[#2B2E2B]/50 hover:text-rose-600 p-1"
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
            <div className="pt-2 border-t border-[#D8D4C9]">
              <span className="text-xs font-bold text-[#2E6F40] uppercase tracking-wider block mb-2">
                Recent Safety Logs
              </span>
              <div className="space-y-1.5 max-h-28 overflow-y-auto">
                {logs.slice(0, 5).map((l) => (
                  <div key={l.id} className="text-[11px] p-2 rounded bg-[#F4F1EA] border border-[#D8D4C9] flex justify-between items-center text-[#2B2E2B]">
                    <div className="flex items-center space-x-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        l.level >= 5 ? 'bg-rose-100 text-rose-800' : 'bg-[#B9D2B9] text-[#1B4326]'
                      }`}>
                        Level {l.level}
                      </span>
                      <span className="truncate max-w-[280px]">{l.message}</span>
                    </div>
                    <span className="text-[#2B2E2B]/60 text-[10px] font-mono">
                      {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F4F1EA] border-t border-[#D8D4C9] flex items-center justify-between">
          <span className="text-[11px] text-[#2B2E2B]/70">
            Mental Beacon Safety Protocol is designed with zero commercial tracking.
          </span>
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
