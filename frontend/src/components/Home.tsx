import React, { useEffect, useState } from 'react';
import { ArrowRight, Download, Instagram, Music2, MessageCircle } from 'lucide-react';

const STATS = [
  { n: '400+', l: 'Community Members' },
  { n: '200+', l: 'Young People Reached' },
  { n: '5+', l: 'Institutional Partners' },
];

const IMPACT = [
  { n: '400+', l: 'Social media followers and growing' },
  { n: '200+', l: 'Young people reached through monthly webinars' },
  { n: '170+', l: 'Students at KCA University Mental Health Week' },
  { n: '150+', l: 'Active WhatsApp wellness community members' },
  { n: '50+', l: 'Young people at in-person events' },
  { n: '40+', l: 'Primary school students via Little Beacons' },
  { n: '8', l: 'Teachers equipped with wellbeing tools' },
  { n: '5+', l: 'Institutional partnerships & collaborations' },
];

const PARTNERS = ['Strathmore University', 'KCA University', 'Encode Hub Africa', 'Kenya Red Cross Society', 'Kenya Methodist University'];

const ARTICLES = [
  { title: 'The Neuroscience of the Quarter-Life Crisis (Ages 18–30)', tag: 'Developmental Psychology' },
  { title: 'The 5-Minute De-escalation Protocol for Acute Overload', tag: 'Somatic Grounding' },
  { title: 'How to Hold Loving Boundaries with Parents', tag: 'Relational Health' },
];

export const Home: React.FC<{ onViewService: (tab?: string) => void; onGoArticles: () => void }> = ({
  onViewService,
  onGoArticles,
}) => {
  const carouselImages = [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=85&auto=format&fit=crop&crop=faces',
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % carouselImages.length), 4000);
    return () => clearInterval(t);
  }, [carouselImages.length]);

  const handleBookTherapy = () => onViewService('booking');
  const handleSupport = () => {
    const el = document.getElementById('support-our-work');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="flex-1 w-full bg-[#F4F1EA] text-[#2B2E2B]">
      {/* HERO */}
      <section className="relative min-h-screen bg-[#1B4326] overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src="/images/misty-sunrise.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B4326] via-[#1B4326]/80 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-soft-in">
            <span className="text-xs font-bold tracking-[0.22em] uppercase text-[#C8B87E] mb-5 block">
              Youth Mental Wellness · Nairobi, Kenya
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif text-white font-light leading-tight mb-6">
              Every young person deserves to <span className="text-[#00bf63] italic">thrive.</span>
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-md mb-8 leading-relaxed">
              Mental Beacon is building the future of youth mental wellness in Kenya — through safe spaces, practical support, and communities where no young person walks alone.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={handleSupport}
                style={{
                  borderRadius: '9999px',
                  fontWeight: 600,
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                }}
                className="px-6 py-3 hover:bg-[#047857] transition-all"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#047857')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
              >
                Support Our Work
              </button>
              <button
                onClick={handleBookTherapy}
                style={{
                  borderRadius: '9999px',
                  fontWeight: 600,
                  backgroundColor: 'transparent',
                  color: '#059669',
                  border: '1.5px solid #059669',
                }}
                className="px-6 py-3 transition-all"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ECFDF5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Book Therapy
              </button>
            </div>
            <div className="flex gap-8 border-t border-white/10 pt-6">
              {STATS.map((s) => (
                <div key={s.l}>
                  <span className="block text-3xl font-serif text-[#00bf63]">{s.n}</span>
                  <span className="text-xs text-white/50">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=85&auto=format&fit=crop&crop=faces"
              alt="Young people in community"
              className="rounded-2xl w-full h-[520px] object-cover opacity-80"
            />
          </div>
        </div>
        <div className="absolute bottom-8 left-6 flex items-center gap-3 text-white/40 text-xs tracking-widest uppercase">
          <span className="w-10 h-px bg-white/30" />
          Scroll to explore
        </div>
      </section>

      {/* PILLARS */}
      <section className="bg-white border-b border-[#D8D4C9]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D8D4C9]">
          {[
            { n: '01', t: 'Awareness', d: 'Breaking stigma and starting conversations that matter — in schools, campuses, and communities across Kenya.' },
            { n: '02', t: 'Access', d: 'Connecting young people to support that is real and affordable — from community programs to subsidized therapy.' },
            { n: '03', t: 'Action', d: 'Building environments, systems, and communities that create lasting change — because awareness alone is not enough.' },
          ].map((p) => (
            <div key={p.n} className="p-10 hover:bg-[#F5FBF7] transition-colors">
              <span className="text-4xl font-serif text-[#D8D4C9] block mb-4">{p.n}</span>
              <h3 className="text-xl font-serif text-[#1B4326] mb-2">{p.t}</h3>
              <p className="text-sm text-[#6b806f] leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT / MISSION */}
      <section className="py-20 px-4 bg-[#F4F1EA]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#1B4326]/70 mb-3 block">Who We Are</span>
            <h2 className="text-3xl font-serif text-[#1B4326] mb-4">We believe awareness alone is not enough.</h2>
            <p className="text-[#3F5A47] leading-relaxed">
              Young people need safe spaces, practical tools, supportive communities, and real access to care. Mental Beacon bridges the gap between knowing mental health matters — and actually being supported through it.
            </p>
            <p className="text-[#3F5A47] leading-relaxed mt-3">
              We are a youth wellness organisation creating environments, experiences, and systems that make mental wellbeing accessible, actionable, and sustainable for young people across Kenya.
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=85&auto=format&fit=crop"
              alt="Mental Beacon in action"
              className="rounded-2xl w-full h-[360px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* IMPACT (preserved) */}
      <section className="bg-[#1B4326] py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-[#00bf63] mb-3 block">Our Impact</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white mb-3">Real reach. Real change.</h2>
          <p className="text-white/50 max-w-md mx-auto mb-10">
            Since we started, Mental Beacon has been showing up — in schools, campuses, communities, and screens.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {IMPACT.map((i) => (
              <div key={i.l} className="bg-white/5 p-6 text-center hover:bg-white/10 transition-colors">
                <span className="block text-3xl font-serif text-[#00bf63] mb-1">{i.n}</span>
                <span className="text-xs text-white/50 leading-snug">{i.l}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2 justify-center">
            {PARTNERS.map((p) => (
              <span key={p} className="px-4 py-2 rounded-full border border-white/10 text-white/60 text-xs">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* AFFORDABLE THERAPY ACCESS PROGRAM (imported from src_index.html) */}
      <section id="support-our-work" className="py-20 px-4 bg-[#F4F1EA]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#1B4326] rounded-2xl overflow-hidden grid md:grid-cols-2">
            <div className="p-10 text-white">
              <span className="text-xs font-bold tracking-widest uppercase text-[#00bf63] mb-3 block">Affordable Therapy Access Program</span>
              <h2 className="text-3xl font-serif text-white mb-4">Professional support shouldn't be out of reach.</h2>
              <p className="text-white/70 leading-relaxed mb-6">
                We believe every young person deserves access to a qualified therapist — regardless of what's in their pocket. Through partnerships with vetted, licensed therapists, we connect young people to one-on-one mental health support at a subsidized rate of <strong className="text-white">Ksh 1,500 per session</strong> — making professional care genuinely within reach.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex gap-3 items-start text-white/70 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#00bf63]/20 text-[#00bf63] flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  You reach out to us through any of our channels.
                </div>
                <div className="flex gap-3 items-start text-white/70 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#00bf63]/20 text-[#00bf63] flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  We match you with the right therapist for your needs.
                </div>
                <div className="flex gap-3 items-start text-white/70 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#00bf63]/20 text-[#00bf63] flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                  You access professional support at a rate that works for you.
                </div>
              </div>
              <button
                onClick={handleBookTherapy}
                className="px-6 py-3 rounded-full bg-[#C8B87E] text-[#1B4326] font-semibold hover:bg-[#e8c96e] transition-all"
              >
                Book a Session
              </button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=85&auto=format&fit=crop"
                alt="Affordable therapy access for young people"
                className="w-full h-full object-cover min-h-[320px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FREE RESOURCES */}
      <section className="bg-[#1B4326] py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#00bf63] mb-3 block">Free Resources</span>
            <h3 className="text-2xl font-serif text-white mb-3">Tools to support your journey.</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Download our free workbooks — crafted with care to help you reflect, reset, and move forward with intention. No cost. No catch.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { title: '2025 Year-End Reflection Workbook', href: 'https://drive.google.com/file/d/1xz9-Agta3vHqYyWFVK9OZO-HGOzCbnDH/view?usp=sharing' },
              { title: 'Q1 2026 Reflection Workbook', href: 'https://drive.google.com/file/d/1Dk-Yd7VEw7bQPejMmaZM-U4x8DYYZPE2/view?usp=sharing' },
            ].map((r) => (
              <a
                key={r.title}
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#C8B87E] flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-[#1B4326]" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{r.title}</div>
                  <div className="text-white/40 text-xs">Free Download · PDF</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* VOICES & RESOURCES (preserved) */}
      <section className="py-20 px-4 bg-[#F4F1EA]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#2E6F40] mb-2 block">Voices & Resources</span>
              <h2 className="text-3xl font-serif text-[#1B4326]">Perspectives that move us forward.</h2>
            </div>
            <button onClick={onGoArticles} className="text-sm font-semibold text-[#1B4326] hover:text-[#2E6F40]">
              View all articles →
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {ARTICLES.map((a) => (
              <button
                key={a.title}
                onClick={onGoArticles}
                className="text-left p-6 rounded-2xl bg-white border border-[#D8D4C9] hover:border-[#1B4326] hover:shadow-md transition-all"
              >
                <span className="text-xs font-bold tracking-widest uppercase text-[#C8B87E] mb-2 block">{a.tag}</span>
                <h3 className="text-lg font-serif text-[#1B4326]">{a.title}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY / SOCIAL */}
      <section className="bg-[#1B4326] py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif text-white mb-4">Our community is where the conversation continues.</h2>
            <p className="text-white/60 mb-8">
              Join our WhatsApp group, follow us on social media, and become part of a growing movement of young people choosing their mental wellness.
            </p>
            <div className="space-y-3">
              {[
                { name: 'WhatsApp Community', handle: 'Join our wellness community group', href: 'https://chat.whatsapp.com/GgJNI3MDJIcC2olzxNkqAr?mode=gi_t', icon: MessageCircle },
                { name: 'Instagram', handle: '@mental.beacon.ke', href: 'https://www.instagram.com/mental.beacon.ke/', icon: Instagram },
                { name: 'TikTok', handle: '@mental.beacon.ke', href: 'https://www.tiktok.com/@mentalbeacon.ke', icon: Music2 },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:translate-x-1 transition-all"
                  >
                    <Icon className="w-6 h-6 text-[#00bf63]" />
                    <div>
                      <div className="text-white font-medium">{s.name}</div>
                      <div className="text-white/40 text-xs">{s.handle}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=85&auto=format&fit=crop"
              alt="Community"
              className="rounded-2xl w-full h-[420px] object-cover"
            />
            <div className="absolute top-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
              <span className="block text-3xl font-serif text-[#1B4326]">150+</span>
              <span className="text-xs text-[#6b806f]">Active WhatsApp members</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};