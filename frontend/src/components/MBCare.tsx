import React from 'react';

const TOPICS = [
  'Stress and emotional overwhelm',
  'Anxiety and worry',
  'Relationships and communication',
  'Boundaries and self-worth',
  'Life transitions and uncertainty',
  'Family and interpersonal challenges',
  'Personal growth and self-understanding',
];

export const MBCare: React.FC<{ onBook: () => void; onGoHome: () => void; onIntake?: () => void }> = ({ onBook, onGoHome, onIntake }) => {
  return (
    <main className="flex-1 w-full bg-[#F3EDE1] text-[#1B462A]">
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#1B462A]/70 mb-3 block">MB Care by Mental Beacon</span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">You don&apos;t have to figure everything out on your own.</h1>
            <p className="text-[#3F5A47] mb-6">
              Life can bring questions, changes, pressure and emotions that are difficult to navigate alone. MB Care offers professional individual counselling for young adults who want a space to understand themselves, work through challenges and explore what moving forward could look like.
            </p>
            <p className="text-[#3F5A47] mb-6">You don&apos;t have to wait until everything feels overwhelming to seek support.</p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={onBook} className="px-6 py-3 rounded-md bg-[#1B462A] text-[#F3EDE1] font-semibold hover:opacity-90">
                Book a Counselling Session
              </button>
              <button onClick={onGoHome} className="px-6 py-3 rounded-md border border-[#1B462A] text-[#1B462A] font-semibold hover:bg-[#1B462A] hover:text-[#F3EDE1]">
                Learn About Mental Beacon
              </button>
            </div>
          </div>
          <div className="aspect-[4/4.6] rounded-md overflow-hidden">
            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=85&auto=format&fit=crop" alt="Counselling session" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#1B462A]/70 mb-3 block">A space for you</span>
            <h2 className="text-3xl font-bold mb-4">Sometimes, it helps to have someone who can help you make sense of things.</h2>
          </div>
          <div className="space-y-3 text-[#3F5A47]">
            <p>Counselling offers an opportunity to pause and explore what you are experiencing in a supportive, professional setting.</p>
            <p>At MB Care, sessions are centred around your experiences, concerns and goals.</p>
            <p>You may be navigating a particular challenge, trying to understand a recurring pattern, working through a relationship experience or simply wanting to develop greater self-awareness.</p>
            <p><strong className="text-[#1B462A]">Whatever brings you to counselling, the process begins with understanding you.</strong></p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#1B462A]/70 mb-3 block">What brings people to counselling?</span>
          <h2 className="text-3xl font-bold mb-4">Your experience doesn&apos;t have to fit into one category.</h2>
          <p className="text-[#3F5A47] mb-6">People seek counselling for different reasons. Some are working through a specific challenge. Others want support in understanding themselves and their lives more clearly.</p>
          <p className="text-sm text-[#3F5A47] mb-2">Topics may include:</p>
          <ul className="grid md:grid-cols-2 gap-2 border-t border-[#1B462A]/20 pt-4">
            {TOPICS.map((t) => (
              <li key={t} className="flex gap-2 items-baseline py-2 border-b border-[#1B462A]/10">
                <span className="w-2 h-2 rounded-full bg-[#1B462A] flex-shrink-0" />
                <span className="font-medium">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#F3EDE1]">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#1B462A]/70 mb-3 block">Not ready to commit?</span>
          <h2 className="text-3xl font-bold mb-4">Book a free 5-minute discovery call now</h2>
          <p className="text-[#3F5A47] mb-6 max-w-2xl mx-auto">If you are not ready to commit to sessions without understanding MB Care as an option, you can book a free 5-minute discovery call to ask questions and learn more.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="tel:+254796192656" className="px-6 py-3 rounded-md border border-[#1B462A] text-[#1B462A] font-semibold hover:bg-[#1B462A] hover:text-[#F3EDE1]">Book a free 5-minute discovery call</a>
            <button onClick={onBook} className="px-6 py-3 rounded-md bg-[#1B462A] text-[#F3EDE1] font-semibold hover:opacity-90">Book a session</button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#1B462A]/70 mb-3 block">Your session</span>
          <h2 className="text-3xl font-bold mb-8">A space to talk, reflect and work through what matters to you.</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-[#1B462A] rounded-md p-6 bg-white">
              <h3 className="text-xl font-bold mb-2">Virtual counselling</h3>
              <p className="text-[#3F5A47] mb-4">Access individual counselling from a location that feels comfortable and private.</p>
              <div className="text-3xl font-bold mb-2">KES 2,500 <span className="text-base font-normal">per session</span></div>
              <p className="text-sm text-[#3F5A47] mb-4"><strong>Payment:</strong> Full payment is required before the virtual session is confirmed.</p>
              <button onClick={onBook} className="px-5 py-2 rounded-md bg-[#1B462A] text-[#F3EDE1] font-semibold">Book a Virtual Session</button>
            </div>
            <div className="border border-[#1B462A] rounded-md p-6 bg-[#F3EDE1]">
              <h3 className="text-xl font-bold mb-2">Physical counselling</h3>
              <p className="text-[#3F5A47] mb-4">Meet with a counsellor in person in a professional setting.</p>
              <div className="text-3xl font-bold mb-2">KES 3,000 <span className="text-base font-normal">per session</span></div>
              <p className="text-sm text-[#3F5A47] mb-4"><strong>Payment:</strong> A 50% deposit is required to secure your appointment.</p>
              <button onClick={onBook} className="px-5 py-2 rounded-md bg-[#1B462A] text-[#F3EDE1] font-semibold">Book a Physical Session</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#F3EDE1]">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#1B462A]/70 mb-3 block">Continued support</span>
          <h2 className="text-3xl font-bold mb-4">Make space for more than one conversation.</h2>
          <p className="text-[#3F5A47] mb-6">Counselling can involve exploring experiences over time. Our four-session packages offer an option for people who would like to plan for continued support.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-[#1B462A] rounded-md p-6 bg-white">
              <h3 className="text-xl font-bold mb-2">Virtual package</h3>
              <p className="text-[#3F5A47] mb-2">Four individual sessions</p>
              <div className="text-3xl font-bold mb-2">KES 9,000</div>
              <button onClick={onBook} className="px-5 py-2 rounded-md bg-[#1B462A] text-[#F3EDE1] font-semibold">Choose Virtual Package</button>
            </div>
            <div className="border border-[#1B462A] rounded-md p-6 bg-[#F3EDE1]">
              <h3 className="text-xl font-bold mb-2">Physical package</h3>
              <p className="text-[#3F5A47] mb-2">Four individual sessions</p>
              <div className="text-3xl font-bold mb-2">KES 11,000</div>
              <button onClick={onBook} className="px-5 py-2 rounded-md bg-[#1B462A] text-[#F3EDE1] font-semibold">Choose Physical Package</button>
            </div>
          </div>
          <p className="text-sm text-[#3F5A47] mt-4">Payment terms are shown clearly before you complete your purchase.</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#1B462A]/70 mb-3 block">Frequently asked questions</span>
          <h2 className="text-3xl font-bold mb-6">Good questions to have.</h2>
          <p className="text-[#3F5A47] mb-6 text-sm">Still wondering about something? Write to us at <a href="mailto:therapy@mentalbeacon.co.ke" className="underline font-semibold">therapy@mentalbeacon.co.ke</a>.</p>
          <div className="space-y-3">
            {[
              ['Do I need to be experiencing a serious mental health problem to attend counselling?', 'No. People seek counselling for many different reasons, including stress, relationships, life transitions, emotional challenges and personal growth.'],
              ['Is counselling confidential?', 'Counselling is conducted with respect for your privacy. Your counsellor will explain confidentiality and its professional and legal limits before or during your initial session.'],
              ['What if I don\'t know what to talk about?', 'That\'s completely okay. Your counsellor can help you begin and explore what feels important to you.'],
              ['Can I attend counselling virtually?', 'Yes. MB Care offers virtual individual counselling.'],
              ['How much does a session cost?', 'Virtual individual counselling costs KES 2,500 per session. Physical individual counselling costs KES 3,000 per session.'],
              ['How do I pay?', 'Virtual sessions require full payment before confirmation. Physical sessions require a 50% deposit, with the remaining balance payable after the session.'],
              ['Can I reschedule my appointment?', 'Please refer to our rescheduling and cancellation policy before completing your booking.'],
              ['How do I book?', 'Choose your preferred session, select an available appointment, complete the short booking form and follow the payment instructions.'],
            ].map(([q, a]) => (
              <details key={q} className="border-b border-[#1B462A]/20 py-3">
                <summary className="font-bold cursor-pointer list-none">{q}</summary>
                <p className="text-[#3F5A47] mt-2">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
