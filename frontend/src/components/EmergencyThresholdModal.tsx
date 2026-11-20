import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Phone, 
  Mail, 
  UserPlus, 
  Trash2, 
  Send, 
  CheckCircle2, 
  Compass, 
  FileText, 
  HeartHandshake, 
  Radio
} from 'lucide-react';
import { api, TrustedContact, AlertLog } from '../api';
import { Modal } from './ui/Modal';

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
        relationship: newRelationship.trim() || 'Trusted friend',
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
      await api.triggerThresholdLevel(lvl, 'safety_modal');
      loadEmergencyData();
      if (lvl === 6) {
        setDispatchNotice(`Simulated SOS alert dispatched to ${contacts.length} trusted contacts.`);
      } else {
        setDispatchNotice(`Level ${lvl} support active.`);
      }
      setTimeout(() => setDispatchNotice(null), 6000);
    } catch (e) {
      console.error(e);
    }
  };

  const levelTone = (lvl: number) => {
    if (lvl >= 5) return 'rose';
    if (lvl >= 3) return 'amber';
    return 'forest';
  };

  const activeTone = levelTone(currentLevel);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Safety circle"
      description="Step-up support, from a gentle nudge to contacting people you trust."
      footer={
        <>
          <span className="mr-auto hidden text-[11px] text-slate-500 sm:block">
            Safety tools are never used for advertising or tracking.
          </span>
          <button type="button" onClick={onClose} className="btn btn-sm btn-outline">
            Close
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Dispatch notification */}
        {dispatchNotice && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-700" role="status">
            <Radio className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{dispatchNotice}</span>
          </div>
        )}

        {/* Level selector */}
        <div>
          <span className="eyebrow mb-2 block">Six levels of support</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { lvl: 1, label: 'L1 · Community', desc: 'Join a peer group' },
              { lvl: 2, label: 'L2 · Guides', desc: 'Grounding reading' },
              { lvl: 3, label: 'L3 · Breath & sound', desc: 'Somatic calm' },
              { lvl: 4, label: 'L4 · Reach out', desc: 'Suggested text' },
              { lvl: 5, label: 'L5 · Helplines', desc: '24/7 professionals' },
              { lvl: 6, label: 'L6 · Auto-alert', desc: 'SOS to contacts' },
            ].map((item) => {
              const isActive = currentLevel === item.lvl;
              const tone = levelTone(item.lvl);
              const activeClasses =
                tone === 'rose'
                  ? 'border-rose-500 bg-rose-50 text-rose-800'
                  : tone === 'amber'
                  ? 'border-amber-500 bg-amber-50 text-amber-800'
                  : 'border-forest-600 bg-forest-50 text-forest-900';
              return (
                <button
                  key={item.lvl}
                  type="button"
                  onClick={() => handleTriggerLevel(item.lvl)}
                  aria-pressed={isActive}
                  className={`rounded-lg border p-2.5 text-left transition-colors ${
                    isActive ? activeClasses : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs font-semibold">{item.label}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-slate-500">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Level details */}
        <div className={`rounded-lg border p-4 sm:p-5 ${
          activeTone === 'rose' ? 'border-rose-200 bg-rose-50/50' :
          activeTone === 'amber' ? 'border-amber-200 bg-amber-50/50' :
          'border-forest-200 bg-forest-50/50'
        }`}>
          {currentLevel === 1 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-forest-700">
                <Compass className="h-5 w-5" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-900">Join an authentic peer community</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                When isolation or stress first creeps in, connecting with peers who have walked the same path
                prevents shame from spiralling.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateTab('communities');
                }}
                className="btn btn-sm btn-primary"
              >
                Explore communities
              </button>
            </div>
          )}

          {currentLevel === 2 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-forest-700">
                <FileText className="h-5 w-5" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-900">Read a grounding guide</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                Recommended for moderate cognitive fatigue — short reads on quarter-life transitions and
                resetting an overloaded nervous system.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateTab('articles');
                }}
                className="btn btn-sm btn-primary"
              >
                Open the guides
              </button>
            </div>
          )}

          {currentLevel === 3 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-700">
                <Radio className="h-5 w-5" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-900">Breathing & sound calming</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                Before logical thinking works, downregulate the nervous system first — guided breath pacing
                and locally synthesized brown noise.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateTab('calm');
                }}
                className="btn btn-sm btn-primary"
              >
                Open breathing & sound
              </button>
            </div>
          )}

          {currentLevel === 4 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-700">
                <HeartHandshake className="h-5 w-5" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-900">Reach out to someone you trust</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                You don't have to explain everything. Here's a gentle, low-pressure message you can copy and
                send right now:
              </p>
              <p className="rounded-lg border border-slate-200 bg-white p-3 text-sm italic text-slate-700">
                “Hey, things have been feeling heavy and loud today. No need to fix anything — but I could use
                a quick low-pressure text or chat when you have five minutes.”
              </p>

              {contacts.length > 0 && (
                <div>
                  <span className="mb-2 block text-xs font-semibold text-slate-600">One-tap reach out</span>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {contacts.map((c) => (
                      <a
                        key={c.id}
                        href={`sms:${c.phone}?body=Hey%2C%20feeling%20a%20bit%20overwhelmed%20today%2C%20would%20love%20a%20quick%20check-in.`}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2.5 text-sm transition-colors hover:border-forest-400"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-slate-900">{c.name}</span>
                          <span className="block truncate text-xs text-slate-500">{c.relationship} · {c.phone}</span>
                        </span>
                        <Send className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentLevel === 5 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-700">
                <ShieldAlert className="h-5 w-5" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-900">24/7 professional resources</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                When stress exceeds everyday coping, a trained counsellor or crisis responder can provide
                critical grounding — free and confidential:
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                  <span className="block font-semibold text-slate-900">988 Suicide & Crisis Lifeline</span>
                  <span className="mt-0.5 block font-mono text-sm font-semibold text-rose-600">Call or text 988</span>
                  <span className="mt-1 block text-xs text-slate-500">24/7 free support across the US & Canada</span>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                  <span className="block font-semibold text-slate-900">Crisis Text Line</span>
                  <span className="mt-0.5 block font-mono text-sm font-semibold text-rose-600">Text HOME to 741741</span>
                  <span className="mt-1 block text-xs text-slate-500">24/7 texting with a trained counsellor</span>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                  <span className="block font-semibold text-slate-900">The Trevor Project (LGBTQ+ youth)</span>
                  <span className="mt-0.5 block font-mono text-xs font-semibold text-rose-600">1-866-488-7386 · text START to 678-678</span>
                  <span className="mt-1 block text-xs text-slate-500">Specialized young-adult advocates</span>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                  <span className="block font-semibold text-slate-900">MB specialist referral</span>
                  <span className="mt-0.5 block font-mono text-xs font-semibold text-forest-700">support@mentalbeacon.org</span>
                  <span className="mt-1 block text-xs text-slate-500">Matched sliding-scale youth therapists</span>
                </div>
              </div>
            </div>
          )}

          {currentLevel === 6 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-700">
                <Radio className="h-5 w-5" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-900">Alert dispatched to your trusted contacts</h3>
              </div>
              <p className="text-sm font-medium leading-relaxed text-rose-700">
                Your safety protocol has sent a gentle, automated alert to your designated contacts, asking
                them to check in on you.
              </p>
              <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-3 text-sm">
                <span className="block text-xs font-semibold text-slate-500">Dispatched message</span>
                <p className="italic text-slate-700">
                  “[MB safety protocol] Gentle alert: someone you're trusted by has asked for a check-in.
                  A warm call or message would mean a lot.”
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-forest-700">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Notified: {contacts.map(c => c.name).join(', ') || 'no contacts configured yet'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Trusted contacts management */}
        <section className="space-y-4 border-t border-slate-200 pt-5" aria-labelledby="contacts-heading">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 id="contacts-heading" className="text-sm font-semibold">Trusted contacts</h3>
              <p className="text-xs text-slate-500">
                People you want notified when you reach level 4 or 6 distress.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddContact(!showAddContact)}
              className="btn btn-sm btn-outline shrink-0"
            >
              <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{showAddContact ? 'Cancel' : 'Add contact'}</span>
            </button>
          </div>

          {/* Add contact form */}
          {showAddContact && (
            <form onSubmit={handleAddContact} className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1 block text-xs font-medium text-slate-700">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="e.g. Jordan Smith"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="field"
                  />
                </div>
                <div>
                  <label htmlFor="contact-relationship" className="mb-1 block text-xs font-medium text-slate-700">Relationship</label>
                  <input
                    id="contact-relationship"
                    type="text"
                    placeholder="e.g. roommate, sibling, partner"
                    value={newRelationship}
                    onChange={(e) => setNewRelationship(e.target.value)}
                    className="field"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="mb-1 block text-xs font-medium text-slate-700">Phone</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="field"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1 block text-xs font-medium text-slate-700">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="contact@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="field"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-notes" className="mb-1 block text-xs font-medium text-slate-700">Grounding note</label>
                <input
                  id="contact-notes"
                  type="text"
                  placeholder="e.g. knows how to help me ground when sensory overload hits."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="field"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn btn-sm btn-primary">
                  Save contact
                </button>
              </div>
            </form>
          )}

          {/* Contact cards */}
          {contacts.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">
              No trusted contacts yet. Add someone you'd want a check-in from on a hard day.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {contacts.map((c) => (
                <div key={c.id} className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 bg-white p-3.5">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-slate-900">{c.name}</span>
                      <span className="chip shrink-0">{c.relationship}</span>
                    </div>
                    {c.phone && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Phone className="h-3 w-3 text-slate-400" aria-hidden="true" />
                        {c.phone}
                      </span>
                    )}
                    {c.email && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Mail className="h-3 w-3 text-slate-400" aria-hidden="true" />
                        {c.email}
                      </span>
                    )}
                    {c.notes && (
                      <p className="text-xs italic text-slate-500">{c.notes}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteContact(c.id)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                    title="Remove contact"
                    aria-label={`Remove contact ${c.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Alert history */}
        {logs.length > 0 && (
          <section className="border-t border-slate-200 pt-4" aria-labelledby="logs-heading">
            <h3 id="logs-heading" className="eyebrow mb-2">Recent safety logs</h3>
            <div className="max-h-32 space-y-1.5 overflow-y-auto">
              {logs.slice(0, 5).map((l) => (
                <div key={l.id} className="flex items-center justify-between gap-2 rounded border border-slate-100 bg-slate-50 p-2 text-xs text-slate-600">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      l.level >= 5 ? 'bg-rose-100 text-rose-700' : 'bg-forest-100 text-forest-800'
                    }`}>
                      Level {l.level}
                    </span>
                    <span className="truncate">{l.message}</span>
                  </div>
                  <time className="shrink-0 font-mono text-[10px] text-slate-400">
                    {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </time>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Modal>
  );
};
