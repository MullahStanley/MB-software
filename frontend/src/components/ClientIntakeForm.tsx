import React, { useState } from 'react';
import { api } from '../api';

const HEAR_OPTIONS = [
  'Instagram',
  'Facebook',
  'TikTok',
  'LinkedIn',
  'Google Search',
  'MB Care Website',
  'Friend or family member',
  'Corporate or institutional referral',
  'Event or outreach programme',
  'Other:',
];

const PAYMENT_ARRANGEMENTS = [
  'Paying per individual session.',
  'Purchasing a package of multiple sessions.',
  'I would like to understand the available options before deciding.',
];

const STEP1_DESC = `Welcome! You’re taking the first step towards professional mental health support. Deciding to reach out for counseling isn't always easy and we commend you for choosing to take ownership of your mental health. This form helps us understand your needs and match you with the right therapist. All information is confidential and only shared with your assigned therapist. Please answer as honestly as you can.
Before you proceed to fill the Initial Client Intake form, you are required to read and sign the INFORMED CONSENT section of this form. Feel free to reach out to us if you have any questions.

Tel: 0796192656
Email: mentalbeacon.ke@gmail.com`;

const STEP2_DESC = `We would love to know how you discovered Mental Beacon! Your response helps us understand how people learn about MB Care and enables us to improve our outreach, strengthen our communication channels and reach more individuals who may benefit from our services.

Thank you for helping us grow and improve.`;

const STEP3_DESC = `At Mental Beacon, we aim to make accessing our services as convenient and straightforward as possible. The information in this section helps us understand your preferred payment arrangements and whether you require further information about our service fees and available packages.

This allows us to provide the necessary guidance and make the administrative process easier for you.`;

const STEP4_DESC = `Your privacy and trust are important to us at Mental Beacon. This section allows us to establish how we may communicate with you and obtain your permission to collect and process your personal information for the purposes explained in our privacy notice.

We may also ask whether you would like to receive updates about our programmes, events and services. This is entirely optional and will not affect your access to MB Care services.

We encourage you to review our privacy notice before proceeding.`;

export const ClientIntakeForm: React.FC<{ onGoHome?: () => void; onGoBooking?: () => void }> = ({
  onGoHome,
  onGoBooking,
}) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [brings, setBrings] = useState('');
  const [prevTherapy, setPrevTherapy] = useState('');
  const [selfHarm, setSelfHarm] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // Step 2
  const [hearAbout, setHearAbout] = useState('');
  const [otherHear, setOtherHear] = useState('');
  const [referredBy, setReferredBy] = useState('');

  // Step 3
  const [reviewedFees, setReviewedFees] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentArrangement, setPaymentArrangement] = useState('');

  // Step 4
  const [consentContact, setConsentContact] = useState('');
  const [readPrivacy, setReadPrivacy] = useState('');
  const [consentProcess, setConsentProcess] = useState('');
  const [updates, setUpdates] = useState('');

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Enter a valid email address.';
      if (fullName.trim().length < 2) e.fullName = 'Enter your full name.';
      if (!dob) e.dob = 'Enter your date of birth.';
      const digits = phone.replace(/[\s()+-]/g, '');
      if (!/^\d{9,13}$/.test(digits)) e.phone = 'Enter a valid phone number.';
      if (location.trim().length < 2) e.location = 'Enter your county of residence.';
      if (brings.trim().length < 2) e.brings = 'Please describe what brings you to therapy.';
      if (!prevTherapy) e.prevTherapy = 'Please select an option.';
      if (!selfHarm) e.selfHarm = 'Please select an option.';
      if (emergencyName.trim().length < 2) e.emergencyName = 'Enter an emergency contact name.';
      if (relationship.trim().length < 2) e.relationship = 'Enter your relationship to the contact.';
      if (emergencyPhone.trim()) {
        const ed = emergencyPhone.replace(/[\s()+-]/g, '');
        if (!/^\d{9,13}$/.test(ed)) e.emergencyPhone = 'Enter a valid phone number.';
      }
    }
    if (s === 2) {
      if (!hearAbout) e.hearAbout = 'Please select an option.';
      if (hearAbout === 'Other:' && otherHear.trim().length < 2) e.otherHear = 'Please specify.';
    }
    if (s === 3) {
      if (!reviewedFees) e.reviewedFees = 'Please select an option.';
      if (!additionalInfo) e.additionalInfo = 'Please select an option.';
      if (!paymentMethod) e.paymentMethod = 'Please select a payment method.';
      if (!paymentArrangement) e.paymentArrangement = 'Please select a payment arrangement.';
    }
    if (s === 4) {
      if (!consentContact) e.consentContact = 'Please select an option.';
      if (!readPrivacy) e.readPrivacy = 'Please select an option.';
      if (!consentProcess) e.consentProcess = 'Please select an option.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setSubmitting(true);
    setSubmitError('');
    const payload = {
      email,
      fullName,
      preferredName,
      dob,
      phone,
      location,
      brings,
      prevTherapy,
      selfHarm,
      emergencyName,
      relationship,
      emergencyPhone,
      hearAbout: hearAbout === 'Other:' ? `Other: ${otherHear}` : hearAbout,
      referredBy,
      reviewedFees,
      additionalInfo,
      paymentMethod,
      paymentArrangement,
      consentContact,
      readPrivacy,
      consentProcess,
      updates,
    };
    try {
      await api.submitIntake(payload);
      setStep(5);
    } catch (err) {
      setSubmitError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const RadioGroup = ({
    name,
    value,
    onChange,
    options,
    error,
  }: {
    name: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
    error?: string;
  }) => (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 text-[#1B4326]">
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="accent-[#1B4326]"
          />
          <span>{opt}</span>
        </label>
      ))}
      {error && <span className="text-sm text-[#1B4326] bg-[#E8E0CF] px-2 py-1 rounded inline-block">{error}</span>}
    </div>
  );

  const Field = ({
    label,
    required,
    children,
    error,
  }: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
    error?: string;
  }) => (
    <div className="space-y-1">
      <label className="block font-semibold text-[#1B4326]">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {error && <span className="text-sm text-[#1B4326] bg-[#E8E0CF] px-2 py-1 rounded inline-block">{error}</span>}
    </div>
  );

  const inputCls = 'w-full px-3 py-2 border border-[#1B4326] rounded-md bg-white text-[#1B4326]';

  return (
    <main className="flex-1 w-full bg-[#F3EDE1] text-[#1B4326]">
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Mental Beacon: Affordable Therapy Network - Client Intake Form</h1>

          {step <= 4 && (
            <>
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <i key={i} className={`flex-1 h-1 rounded ${i < step ? 'bg-[#1B4326]' : 'bg-[#1B4326]/20'}`} />
                ))}
              </div>
              <div className="text-xs uppercase tracking-widest text-[#3F5A47] mb-6">Step {step} of 4</div>
            </>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="bg-white border border-[#1B4326]/20 rounded-md p-6">
              <h2 className="text-xl font-bold mb-2">MB Care - Client Registration Form</h2>
              <p className="text-[#3F5A47] text-sm whitespace-pre-line mb-4">{STEP1_DESC}</p>

              <div className="space-y-4">
                <Field label="Email" required error={errors.email}>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Full name" required error={errors.fullName}>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Preferred name">
                  <input type="text" value={preferredName} onChange={(e) => setPreferredName(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Date of Birth" required error={errors.dob}>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputCls} placeholder="Month, day, year" />
                </Field>
                <Field label="Phone Number" required error={errors.phone}>
                  <div className="flex">
                    <span className="px-3 py-2 border border-r-0 border-[#1B4326] rounded-l-md bg-[#E8E0CF] text-[#1B4326]">(+254)</span>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-[#1B4326] rounded-r-md bg-white text-[#1B4326]" />
                  </div>
                </Field>
                <Field label="Location (County of Residence)" required error={errors.location}>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls} />
                </Field>
                <Field label="What brings you to therapy at this time?" required error={errors.brings}>
                  <textarea value={brings} onChange={(e) => setBrings(e.target.value)} className={inputCls} rows={4} />
                </Field>
                <Field label="Have you previously attended therapy or counseling?" required error={errors.prevTherapy}>
                  <RadioGroup name="prevTherapy" value={prevTherapy} onChange={setPrevTherapy} options={['Yes', 'No']} error={errors.prevTherapy} />
                </Field>
                <Field label="Are you currently experiencing thoughts of harming yourself or others?" required error={errors.selfHarm}>
                  <RadioGroup name="selfHarm" value={selfHarm} onChange={setSelfHarm} options={['Yes', 'No']} error={errors.selfHarm} />
                </Field>
                <Field label="Emergency contact name" required error={errors.emergencyName}>
                  <input type="text" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Relationship to you" required error={errors.relationship}>
                  <input type="text" value={relationship} onChange={(e) => setRelationship(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Phone number" error={errors.emergencyPhone}>
                  <input type="tel" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} className={inputCls} />
                </Field>
              </div>

              <div className="flex justify-end mt-6">
                <button onClick={handleNext} className="px-5 py-2 rounded-md bg-[#1B4326] text-[#F3EDE1] font-semibold">
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="bg-white border border-[#1B4326]/20 rounded-md p-6">
              <h2 className="text-xl font-bold mb-2">Client Referral and Marketing Information</h2>
              <p className="text-[#3F5A47] text-sm whitespace-pre-line mb-4">{STEP2_DESC}</p>

              <div className="space-y-4">
                <Field label="How did you first hear about MB Care?" required error={errors.hearAbout}>
                  <RadioGroup name="hearAbout" value={hearAbout} onChange={setHearAbout} options={HEAR_OPTIONS} error={errors.hearAbout} />
                  {hearAbout === 'Other:' && (
                    <input
                      type="text"
                      value={otherHear}
                      onChange={(e) => setOtherHear(e.target.value)}
                      placeholder="Other:"
                      className={`${inputCls} mt-2`}
                    />
                  )}
                  {errors.otherHear && <span className="text-sm text-[#1B4326] bg-[#E8E0CF] px-2 py-1 rounded inline-block">{errors.otherHear}</span>}
                </Field>
                <Field label="If you were referred to MB Care, who referred you?">
                  <input type="text" value={referredBy} onChange={(e) => setReferredBy(e.target.value)} className={inputCls} />
                </Field>
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(1)} className="px-5 py-2 rounded-md border border-[#1B4326] font-semibold">Back</button>
                <button onClick={handleNext} className="px-5 py-2 rounded-md bg-[#1B4326] text-[#F3EDE1] font-semibold">Next</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="bg-white border border-[#1B4326]/20 rounded-md p-6">
              <h2 className="text-xl font-bold mb-2">Payment and Administrative Preferences</h2>
              <p className="text-[#3F5A47] text-sm whitespace-pre-line mb-4">{STEP3_DESC}</p>

              <div className="space-y-4">
                <Field label="Have you reviewed MB Care's service fees?" required error={errors.reviewedFees}>
                  <RadioGroup name="reviewedFees" value={reviewedFees} onChange={setReviewedFees} options={['Yes', 'No']} error={errors.reviewedFees} />
                </Field>
                <Field label="Would you like additional information about our pricing and payment arrangements?" required error={errors.additionalInfo}>
                  <RadioGroup name="additionalInfo" value={additionalInfo} onChange={setAdditionalInfo} options={['Yes', 'No']} error={errors.additionalInfo} />
                </Field>
                <Field label="Which payment method would you prefer to use?" required error={errors.paymentMethod}>
                  <RadioGroup name="paymentMethod" value={paymentMethod} onChange={setPaymentMethod} options={['M-Pesa', 'Bank transfer']} error={errors.paymentMethod} />
                </Field>
                <Field label="Which payment arrangement would you be interested in?" required error={errors.paymentArrangement}>
                  <RadioGroup name="paymentArrangement" value={paymentArrangement} onChange={setPaymentArrangement} options={PAYMENT_ARRANGEMENTS} error={errors.paymentArrangement} />
                </Field>
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(2)} className="px-5 py-2 rounded-md border border-[#1B4326] font-semibold">Back</button>
                <button onClick={handleNext} className="px-5 py-2 rounded-md bg-[#1B4326] text-[#F3EDE1] font-semibold">Next</button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="bg-white border border-[#1B4326]/20 rounded-md p-6">
              <h2 className="text-xl font-bold mb-2">Communication & Consent</h2>
              <p className="text-[#3F5A47] text-sm whitespace-pre-line mb-4">{STEP4_DESC}</p>

              <div className="space-y-4">
                <Field label="Do you consent to MB Care contacting you regarding your registration, inquiries and requested services?" required error={errors.consentContact}>
                  <RadioGroup name="consentContact" value={consentContact} onChange={setConsentContact} options={['Yes', 'No']} error={errors.consentContact} />
                </Field>
                <Field label="Have you read and understood MB Care's privacy notice?" required error={errors.readPrivacy}>
                  <RadioGroup name="readPrivacy" value={readPrivacy} onChange={setReadPrivacy} options={['Yes', 'No']} error={errors.readPrivacy} />
                </Field>
                <Field label="Do you consent to MB Care collecting and processing your personal information for the purposes outlined in the privacy notice?" required error={errors.consentProcess}>
                  <RadioGroup name="consentProcess" value={consentProcess} onChange={setConsentProcess} options={['Yes', 'No']} error={errors.consentProcess} />
                </Field>
                <Field label="Would you like to receive updates about MB Care's programmes, events and other services?">
                  <RadioGroup name="updates" value={updates} onChange={setUpdates} options={['Yes', 'No']} />
                </Field>
              </div>

              {submitError && <p className="text-sm text-red-600 mt-3">{submitError}</p>}

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(3)} className="px-5 py-2 rounded-md border border-[#1B4326] font-semibold">Back</button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-5 py-2 rounded-md bg-[#1B4326] text-[#F3EDE1] font-semibold disabled:opacity-40"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5 confirmation */}
          {step === 5 && (
            <div className="bg-white border border-[#1B4326]/20 rounded-md p-6 text-center">
              <p className="whitespace-pre-line text-[#1B4326] text-left mb-4">
                Thank you for choosing MB Care!

                We appreciate you taking the time to complete our registration form.

                Your information has been successfully submitted. To proceed with scheduling your appointment, kindly visit our booking platform using the link below:
              </p>
              <div className="mb-4">
                <button
                  onClick={() => (onGoBooking ? onGoBooking() : (window.location.href = '/'))}
                  className="px-6 py-3 rounded-full bg-[#1B4326] text-[#F3EDE1] font-semibold"
                >
                  Book an appointment
                </button>
              </div>
              <p className="whitespace-pre-line text-[#1B4326] text-left">
                At Mental Beacon, we are committed to making mental health and wellness support more accessible.

                We look forward to having you with us!

                Mental Beacon | MB Care
              </p>
              <div className="mt-6">
                <button
                  onClick={() => (onGoHome ? onGoHome() : (window.location.href = '/'))}
                  className="px-5 py-2 rounded-md border border-[#1B4326] font-semibold"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
