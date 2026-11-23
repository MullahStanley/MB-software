import React, { useState } from 'react';

const SLOTS = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];
const PRICES = {
  virtual: { single: 2500, package: 9000 },
  physical: { single: 3000, package: 11000 },
};
const FOCUS_AREAS = ['Anxiety', 'Stress & Burnout', 'Grief & Loss', 'Relationships', 'Personal Growth', 'Other'];

const today = new Date();
today.setHours(0, 0, 0, 0);
const maxDate = new Date(today);
maxDate.setDate(maxDate.getDate() + 30);

function iso(d: Date) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function calendarDays(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

const fmtDateFull = (isoDate: string) =>
  new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(
    new Date(isoDate + 'T00:00:00')
  );

export const Booking: React.FC<{ onGoHome?: () => void }> = ({ onGoHome }) => {
  const [step, setStep] = useState(1);
  const [format, setFormat] = useState<'virtual' | 'physical' | null>(null);
  const [plan, setPlan] = useState<'single' | 'package' | null>(null);
  // scheduling
  const [singleDate, setSingleDate] = useState<string | null>(null);
  const [singleTime, setSingleTime] = useState<string | null>(null);
  const [pkgSlots, setPkgSlots] = useState<{ date: string; time: string }[]>([
    { date: '', time: '' },
    { date: '', time: '' },
    { date: '', time: '' },
    { date: '', time: '' },
  ]);
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  // intake
  const [name, setName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(false);
  const [sessionMode, setSessionMode] = useState<'virtual' | 'physical' | null>(null);
  const [focusArea, setFocusArea] = useState('');
  const [otherFocus, setOtherFocus] = useState('');
  const [prevTherapy, setPrevTherapy] = useState<'yes' | 'no' | null>(null);
  const [notes, setNotes] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  // checkout
  const [policy, setPolicy] = useState(false);
  const [mpesa, setMpesa] = useState('');
  const [policyModal, setPolicyModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ref, setRef] = useState('');

  const price = format && plan ? PRICES[format][plan] : 0;
  const isPhysicalSingle = format === 'physical' && plan === 'single';
  const amountDue = isPhysicalSingle ? price * 0.5 : price;
  const balanceDue = isPhysicalSingle ? price * 0.5 : 0;

  const validateIntake = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Enter your full name.';
    const digits = phone.replace(/[\s()+-]/g, '');
    if (!/^\d{9,13}$/.test(digits)) e.phone = 'Enter a valid phone number.';
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Check your email address.';
    if (!age) e.age = 'You need to be 18 or older to book.';
    if (!focusArea) e.focusArea = 'Select a primary focus area.';
    if (focusArea === 'Other' && otherFocus.trim().length < 2) e.otherFocus = 'Please describe your focus area.';
    if (!prevTherapy) e.prevTherapy = 'Please indicate previous therapy experience.';
    if (emergencyName.trim().length < 2) e.emergencyName = 'Enter emergency contact name.';
    const edigits = emergencyPhone.replace(/[\s()+-]/g, '');
    if (!/^\d{9,13}$/.test(edigits)) e.emergencyPhone = 'Enter a valid phone number.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateScheduling = () => {
    if (plan === 'single') {
      return !!(singleDate && singleTime);
    }
    return pkgSlots.every((s) => s.date && s.time) &&
      new Set(pkgSlots.map((s) => s.date + '|' + s.time)).size === pkgSlots.length;
  };

  const allDates = () => {
    if (plan === 'single') return singleDate ? [{ date: singleDate, time: singleTime! }] : [];
    return pkgSlots;
  };

  const handlePay = () => {
    if (!policy) {
      setErrors((prev) => ({ ...prev, policy: 'Please agree to the Scheduling & Cancellation Policy.' }));
      return;
    }
    const mDigits = (mpesa || phone).replace(/[\s()+-]/g, '');
    if (!/^\d{9,13}$/.test(mDigits)) {
      setErrors((prev) => ({ ...prev, mpesa: 'Enter a valid M-Pesa phone number.' }));
      return;
    }
    setErrors({});
    setRef('MB-' + Math.random().toString(36).slice(2, 7).toUpperCase());
    setStep(5);
  };

  return (
    <main className="flex-1 w-full bg-[#F3EDE1] text-[#1B462A]">
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#1B462A]/70 mb-3 block">Book a session</span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Choose a time that works for you.</h1>

          <div className="bg-white border border-[#1B462A]/20 rounded-md p-6">
            <div className="flex gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <i key={i} className={`flex-1 h-1 rounded ${i < step ? 'bg-[#1B462A]' : 'bg-[#1B462A]/20'}`} />
              ))}
            </div>
            <div className="text-xs uppercase tracking-widest text-[#3F5A47] mb-6">Step {step} of 5</div>

            {/* STEP 1: Session Selection & Payment Terms */}
            {step === 1 && (
              <>
                <h3 className="text-2xl font-bold mb-4">Choose your session</h3>
                <p className="text-[#3F5A47] mb-4">Individual counselling — one-to-one sessions with a professional counsellor.</p>

                <div className="mb-4">
                  <div className="font-bold mb-2">How would you like to meet?</div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(['virtual', 'physical'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => { setFormat(f); setSessionMode(f); }}
                        className={`text-left p-4 rounded-md border-2 ${format === f ? 'border-[#1B462A] bg-[#F3EDE1]' : 'border-[#1B462A]/20'}`}
                      >
                        <div className="font-bold">{f === 'virtual' ? 'Virtual counselling' : 'Physical counselling'}</div>
                        <div className="text-sm text-[#3F5A47]">{f === 'virtual' ? 'From a private place that suits you.' : 'In person, in a professional setting.'}</div>
                        <div className="text-sm font-semibold mt-1">{f === 'virtual' ? 'KES 2,500' : 'KES 3,000'} per session</div>
                      </button>
                    ))}
                  </div>
                </div>

                {format && (
                  <div className="mb-4">
                    <div className="font-bold mb-2">One session or four?</div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {(['single', 'package'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPlan(p)}
                          className={`text-left p-4 rounded-md border-2 ${plan === p ? 'border-[#1B462A] bg-[#F3EDE1]' : 'border-[#1B462A]/20'}`}
                        >
                          <div className="font-bold">{p === 'single' ? 'Single session' : 'Four-session package'}</div>
                          <div className="text-sm text-[#3F5A47]">
                            {p === 'single' ? 'One individual session.' : 'Four individual sessions, for continued support.'}
                          </div>
                          <div className="text-sm font-semibold mt-1">
                            {p === 'single'
                              ? `KES ${PRICES[format].single.toLocaleString('en-KE')}`
                              : `KES ${PRICES[format].package.toLocaleString('en-KE')} (KES ${Math.round(PRICES[format].package / 4).toLocaleString('en-KE')} per session)`}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment terms block */}
                {format && plan && (
                  <div className="bg-[#E8E0CF] border-l-4 border-[#1B462A] p-4 rounded-md mb-4 text-sm">
                    <div className="font-bold mb-1">Payment terms</div>
                    {format === 'virtual' && (
                      <p>Paid in full before your {plan === 'single' ? 'session' : 'package'} is confirmed.</p>
                    )}
                    {format === 'physical' && plan === 'single' && (
                      <p>A 50% deposit secures your appointment. The remaining 50% is payable after your session.</p>
                    )}
                    {format === 'physical' && plan === 'package' && (
                      <p>Payment terms are shown clearly before you complete your purchase.</p>
                    )}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!(format && plan)}
                    className="px-5 py-2 rounded-md bg-[#1B462A] text-[#F3EDE1] font-semibold disabled:opacity-40"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {/* STEP 2: Scheduling */}
            {step === 2 && (
              <>
                <h3 className="text-2xl font-bold mb-4">
                  {plan === 'package' ? 'Choose your 4 session dates & times' : 'Choose an appointment'}
                </h3>

                {plan === 'single' && (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
                          disabled={viewMonth <= new Date(today.getFullYear(), today.getMonth(), 1)}
                          className="px-3 py-1 rounded border border-[#1B462A]/30 disabled:opacity-40"
                        >
                          ‹
                        </button>
                        <span className="font-semibold">{viewMonth.toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}</span>
                        <button
                          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
                          className="px-3 py-1 rounded border border-[#1B462A]/30"
                        >
                          ›
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-xs text-[#3F5A47] mb-1">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                          <div key={d} className="py-1">{d}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays(viewMonth).map((d, i) => {
                          if (!d) return <div key={i} />;
                          const dIso = iso(d);
                          const available = d > today && d.getDay() !== 0 && d <= maxDate;
                          return (
                            <button
                              key={dIso}
                              disabled={!available}
                              onClick={() => { setSingleDate(dIso); setSingleTime(null); }}
                              className={`aspect-square rounded-md text-sm ${
                                singleDate === dIso
                                  ? 'bg-[#1B462A] text-[#F3EDE1]'
                                  : available
                                  ? 'hover:bg-[#B9D2B9]/40'
                                  : 'text-[#1B462A]/30 cursor-not-allowed'
                              }`}
                            >
                              {d.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {singleDate && (
                      <>
                        <h4 className="font-semibold mb-2">Select a time</h4>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                          {SLOTS.map((s) => (
                            <button
                              key={s}
                              onClick={() => setSingleTime(s)}
                              className={`py-2 rounded-md border ${singleTime === s ? 'bg-[#1B462A] text-[#F3EDE1] border-[#1B462A]' : 'border-[#1B462A]/20'}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}

                {plan === 'package' && (
                  <div className="space-y-4 mb-4">
                    {pkgSlots.map((slot, idx) => (
                      <div key={idx} className="border border-[#1B462A]/20 rounded-md p-3">
                        <div className="font-semibold mb-2">Session {idx + 1}</div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <select
                            value={slot.date}
                            onChange={(e) => {
                              const next = [...pkgSlots];
                              next[idx] = { ...next[idx], date: e.target.value };
                              setPkgSlots(next);
                            }}
                            className="w-full px-3 py-2 border border-[#1B462A] rounded-md"
                          >
                            <option value="">Select date</option>
                            {Array.from({ length: 12 }).map((_, i) => {
                              const d = new Date(today);
                              d.setDate(d.getDate() + i + 1);
                              if (d.getDay() === 0) return null;
                              const v = iso(d);
                              return <option key={v} value={v}>{d.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' })}</option>;
                            })}
                          </select>
                          <select
                            value={slot.time}
                            onChange={(e) => {
                              const next = [...pkgSlots];
                              next[idx] = { ...next[idx], time: e.target.value };
                              setPkgSlots(next);
                            }}
                            className="w-full px-3 py-2 border border-[#1B462A] rounded-md"
                          >
                            <option value="">Select time</option>
                            {SLOTS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                    {!validateScheduling() && pkgSlots.some((s) => s.date || s.time) && (
                      <p className="text-sm text-[#1B462A] bg-[#E8E0CF] px-2 py-1 rounded inline-block">
                        Please fill all 4 slots with unique date & time combinations.
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-between">
                  <button onClick={() => setStep(1)} className="px-5 py-2 rounded-md border border-[#1B462A] font-semibold">Back</button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!validateScheduling()}
                    className="px-5 py-2 rounded-md bg-[#1B462A] text-[#F3EDE1] font-semibold disabled:opacity-40"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {/* STEP 3: Intake Questionnaire */}
            {step === 3 && (
              <>
                <h3 className="text-2xl font-bold mb-2">A few details for your care</h3>
                <p className="text-[#3F5A47] mb-4 text-sm">We only ask for what we need to arrange your appointment.</p>
                <div className="space-y-3 mb-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Full name</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-[#1B462A] rounded-md" />
                      {errors.name && <span className="text-sm text-[#1B462A] bg-[#E8E0CF] px-2 py-1 rounded mt-1 inline-block">{errors.name}</span>}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Preferred pronouns</label>
                      <input value={pronouns} onChange={(e) => setPronouns(e.target.value)} placeholder="e.g. she/her" className="w-full px-3 py-2 border border-[#1B462A] rounded-md" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Phone number (M-Pesa enabled)</label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-[#1B462A] rounded-md" />
                      {errors.phone && <span className="text-sm text-[#1B462A] bg-[#E8E0CF] px-2 py-1 rounded mt-1 inline-block">{errors.phone}</span>}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Email address</label>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-[#1B462A] rounded-md" />
                      {errors.email && <span className="text-sm text-[#1B462A] bg-[#E8E0CF] px-2 py-1 rounded mt-1 inline-block">{errors.email}</span>}
                    </div>
                  </div>

                  <label className="flex gap-2 items-start">
                    <input type="checkbox" checked={age} onChange={(e) => setAge(e.target.checked)} className="mt-1" />
                    <span>I confirm that I am 18 or older.</span>
                  </label>
                  {errors.age && <span className="text-sm text-[#1B462A] bg-[#E8E0CF] px-2 py-1 rounded inline-block">{errors.age}</span>}

                  <div>
                    <label className="block font-semibold mb-1">Preferred session mode</label>
                    <div className="flex gap-3">
                      {(['virtual', 'physical'] as const).map((m) => (
                        <label key={m} className={`flex gap-2 items-center p-2 rounded-md border cursor-pointer ${sessionMode === m ? 'border-[#1B462A] bg-[#F3EDE1]' : 'border-[#1B462A]/20'}`}>
                          <input type="radio" name="sessionMode" checked={sessionMode === m} onChange={() => setSessionMode(m)} />
                          <span>{m === 'virtual' ? 'Virtual / Online' : 'Physical / In-Person'}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Primary focus area / reason for seeking therapy</label>
                    <select value={focusArea} onChange={(e) => setFocusArea(e.target.value)} className="w-full px-3 py-2 border border-[#1B462A] rounded-md">
                      <option value="">Select...</option>
                      {FOCUS_AREAS.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                    {errors.focusArea && <span className="text-sm text-[#1B462A] bg-[#E8E0CF] px-2 py-1 rounded mt-1 inline-block">{errors.focusArea}</span>}
                    {focusArea === 'Other' && (
                      <input
                        value={otherFocus}
                        onChange={(e) => setOtherFocus(e.target.value)}
                        placeholder="Please describe"
                        className="w-full px-3 py-2 border border-[#1B462A] rounded-md mt-2"
                      />
                    )}
                    {errors.otherFocus && <span className="text-sm text-[#1B462A] bg-[#E8E0CF] px-2 py-1 rounded mt-1 inline-block">{errors.otherFocus}</span>}
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Previous therapy experience</label>
                    <div className="flex gap-3">
                      {(['yes', 'no'] as const).map((v) => (
                        <label key={v} className={`flex gap-2 items-center p-2 rounded-md border cursor-pointer ${prevTherapy === v ? 'border-[#1B462A] bg-[#F3EDE1]' : 'border-[#1B462A]/20'}`}>
                          <input type="radio" name="prevTherapy" checked={prevTherapy === v} onChange={() => setPrevTherapy(v)} />
                          <span>{v === 'yes' ? 'Yes' : 'No'}</span>
                        </label>
                      ))}
                    </div>
                    {errors.prevTherapy && <span className="text-sm text-[#1B462A] bg-[#E8E0CF] px-2 py-1 rounded mt-1 inline-block">{errors.prevTherapy}</span>}
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Optional notes for your therapist</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 border border-[#1B462A] rounded-md" rows={3} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Emergency contact name</label>
                      <input value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} className="w-full px-3 py-2 border border-[#1B462A] rounded-md" />
                      {errors.emergencyName && <span className="text-sm text-[#1B462A] bg-[#E8E0CF] px-2 py-1 rounded mt-1 inline-block">{errors.emergencyName}</span>}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Emergency contact phone</label>
                      <input value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} className="w-full px-3 py-2 border border-[#1B462A] rounded-md" />
                      {errors.emergencyPhone && <span className="text-sm text-[#1B462A] bg-[#E8E0CF] px-2 py-1 rounded mt-1 inline-block">{errors.emergencyPhone}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep(2)} className="px-5 py-2 rounded-md border border-[#1B462A] font-semibold">Back</button>
                  <button
                    onClick={() => { if (validateIntake()) setStep(4); }}
                    className="px-5 py-2 rounded-md bg-[#1B462A] text-[#F3EDE1] font-semibold"
                  >
                    Review booking
                  </button>
                </div>
              </>
            )}

            {/* STEP 4: Checkout */}
            {step === 4 && (
              <>
                <h3 className="text-2xl font-bold mb-4">Review & payment</h3>
                <div className="border-t border-[#1B462A] divide-y divide-[#1B462A]/10 mb-4">
                  <div className="flex justify-between py-2"><span>Service</span><span className="font-semibold">Individual counselling</span></div>
                  <div className="flex justify-between py-2"><span>Option</span><span className="font-semibold">{format} {plan}</span></div>
                  <div className="flex justify-between py-2"><span>Client</span><span className="font-semibold">{name}</span></div>
                  <div className="flex justify-between py-2"><span>Total Session Fee</span><span className="font-semibold">KES {price.toLocaleString('en-KE')}</span></div>
                  <div className="flex justify-between py-2 font-bold"><span>Due now</span><span>KES {amountDue.toLocaleString('en-KE')}</span></div>
                  {isPhysicalSingle && (
                    <div className="flex justify-between py-2"><span>Balance due at venue</span><span className="font-semibold">KES {balanceDue.toLocaleString('en-KE')}</span></div>
                  )}
                </div>

                <div className="bg-[#E8E0CF] border-l-4 border-[#1B462A] p-4 rounded-md mb-4 text-sm">
                  <div className="font-bold mb-1">Payment terms</div>
                  {format === 'virtual' && <p>Paid in full before your {plan === 'single' ? 'session' : 'package'} is confirmed.</p>}
                  {format === 'physical' && plan === 'single' && <p>A 50% deposit secures your appointment. The remaining 50% is payable after your session.</p>}
                  {format === 'physical' && plan === 'package' && <p>Payment terms shown clearly before purchase.</p>}
                </div>

                {/* Dates */}
                <div className="mb-4">
                  <div className="font-semibold mb-1">Date(s) & Time(s)</div>
                  {allDates().map((s, i) => (
                    <div key={i} className="text-sm text-[#3F5A47]">
                      {plan === 'package' ? `Session ${i + 1}: ` : ''}{fmtDateFull(s.date)}, {s.time}
                    </div>
                  ))}
                </div>

                {/* Policy checkbox */}
                <label className="flex gap-2 items-start mb-2">
                  <input type="checkbox" checked={policy} onChange={(e) => setPolicy(e.target.checked)} className="mt-1" />
                  <span>
                    I have read and agree to the{' '}
                    <button type="button" onClick={() => setPolicyModal(true)} className="underline font-semibold">Scheduling & Cancellation Policy</button>.
                  </span>
                </label>
                {errors.policy && <span className="text-sm text-[#1B462A] bg-[#E8E0CF] px-2 py-1 rounded mt-1 inline-block">{errors.policy}</span>}

                {/* M-Pesa */}
                <div className="mb-4 mt-3">
                  <label className="block font-semibold mb-1">M-Pesa phone number</label>
                  <input value={mpesa || phone} onChange={(e) => setMpesa(e.target.value)} className="w-full px-3 py-2 border border-[#1B462A] rounded-md" />
                  {errors.mpesa && <span className="text-sm text-[#1B462A] bg-[#E8E0CF] px-2 py-1 rounded mt-1 inline-block">{errors.mpesa}</span>}
                </div>

                {/* Retry/rebook notice */}
                <div className="bg-[#ECFDF5] border border-[#059669]/30 text-[#047857] p-3 rounded-md text-sm mb-4">
                  If the M-Pesa STK prompt times out or fails, you can retry payment right here without losing your selected slot, or reach out to rebook at therapy@mentalbeacon.co.ke.
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep(3)} className="px-5 py-2 rounded-md border border-[#1B462A] font-semibold">Back</button>
                  <button
                    onClick={handlePay}
                    className="px-5 py-2 rounded-md bg-[#1B462A] text-[#F3EDE1] font-semibold"
                  >
                    Send M-Pesa request
                  </button>
                </div>
              </>
            )}

            {/* STEP 5: Confirmation */}
            {step === 5 && (
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#059669', color: '#FFFFFF' }}
                >
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
                <p className="text-[#3F5A47] mb-4 text-sm">Your booking has been received. A confirmation has been sent to your email and SMS.</p>

                <div
                  className="mx-auto bg-white border border-[#1B462A]/20 rounded-2xl p-6 text-left"
                  style={{ maxWidth: '560px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                >
                  <div className="divide-y divide-[#1B462A]/10">
                    <div className="flex justify-between py-2"><span>Booking Reference ID</span><span className="font-semibold">{ref}</span></div>
                    <div className="flex justify-between py-2"><span>Session Type & Mode</span><span className="font-semibold">{format} {plan}</span></div>
                    <div className="py-2">
                      <span className="font-semibold block mb-1">Date(s) & Time(s)</span>
                      {allDates().map((s, i) => (
                        <div key={i} className="text-sm text-[#3F5A47]">
                          {plan === 'package' ? `Session ${i + 1}: ` : ''}{fmtDateFull(s.date)}, {s.time}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between py-2"><span>Client Name</span><span className="font-semibold">{name}</span></div>
                    <div className="flex justify-between py-2">
                      <span>Payment Status / Amount Paid</span>
                      <span className="font-semibold">
                        KES {amountDue.toLocaleString('en-KE')} paid
                        {isPhysicalSingle ? ` (balance KES ${balanceDue.toLocaleString('en-KE')} due at venue)` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[#3F5A47] mt-4 text-sm">
                  Need help? Contact us at therapy@mentalbeacon.co.ke
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => { if (onGoHome) onGoHome(); else window.location.href = '/'; }}
                    className="px-5 py-2 rounded-md bg-[#1B462A] text-[#F3EDE1] font-semibold"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Policy modal */}
      {policyModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setPolicyModal(false)}>
          <div className="bg-white rounded-md p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-3">Scheduling & Cancellation Policy</h3>
            <p className="text-[#3F5A47] text-sm mb-4">
              Please arrive on time for your session. Rescheduling is allowed with at least 24 hours notice. Late cancellations may forfeit the deposit. Contact therapy@mentalbeacon.co.ke for changes.
            </p>
            <button onClick={() => setPolicyModal(false)} className="px-5 py-2 rounded-md bg-[#1B462A] text-[#F3EDE1] font-semibold">Close</button>
          </div>
        </div>
      )}
    </main>
  );
};