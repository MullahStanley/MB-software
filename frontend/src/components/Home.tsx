import React, { useEffect, useState } from 'react';
import { ArrowRight, Download, ExternalLink, Instagram, Music2, MessageCircle, X } from 'lucide-react';

const STATS = [
  { n: '400+', l: 'Community Members' },
  { n: '200+', l: 'Young People Reached' },
  { n: '5+', l: 'Institutional Partners' },
];

const ARTICLES = [
  {
    title: 'Social Media vs Reality',
    tag: 'Community · Digital Wellness',
    author: 'By Dylan David',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=85&auto=format&fit=crop',
    excerpt: 'The highlight reel we see online is rarely the full picture. A reflection on how social media shapes our self-perception, self-worth, and mental health — and what we can do about it.',
    content: [
      'The way humans socialize, communicate, and view their surroundings has been greatly influenced by social networks.',
      'Social media platforms such as Instagram, TikTok, Facebook, and X (formerly Twitter) have created a global space where people share their lives and daily experiences regardless of geographical distance.',
      'While this connectivity has brought many benefits, it has also introduced a subtle but profound challenge—the growing disconnects between social media and reality.',
      'This contrast, though often unnoticed, plays a major role in shaping how individuals perceive their mental health, their self-worth, and the world around them.',
      'At the core of this issue is selective presentation.',
      'Social media encourages users to display only the best versions of their lives.',
      'Images are filtered, captions are carefully crafted, and moments are chosen to create an appealing image.',
      'Online spaces are therefore filled with vacations, achievements, celebrations, and aesthetically pleasing content.',
      'What is often left out are the struggles, failures, disappointments, and ordinary moments that make up everyday life.',
      'This creates an illusion of perfection, making it seem as though everyone else is constantly happy, successful, and fulfilled.',
      'For many individuals, especially young people, this curated reality leads to harmful comparisons.',
      'It becomes easy to measure one’s life against the seemingly perfect lives of others. A student may compare their academic journey to someone celebrating achievements online, while a young professional may feel left behind when seeing peers reach career milestones.',
      'Even aspects such as lifestyle, relationships, and physical appearance become points of comparison.',
      'Over time, this can lead to feelings of inadequacy, insecurity, and dissatisfaction.',
      'In reality, however, everyone faces challenges—these are simply not shown online.',
      'Another major impact of social media on mental health is the culture of validation.',
      'In the digital world, approval is often measured through likes, comments, shares, and followers.',
      'These metrics have become a form of digital currency, influencing how individuals perceive their value and acceptance in society.',
      'Receiving many likes can create temporary happiness and confidence, while low engagement can trigger self-doubt and anxiety.',
      'This creates a cycle where individuals depend on external validation rather than internal self-worth.',
      'This dependence can be harmful because it shifts self-esteem from within to outside approval.',
      'Instead of valuing themselves based on personal growth, achievements, or character, individuals begin to rely on how others react to their online presence.',
      'This often leads to pressure to maintain a certain image, post regularly, and keep up with trends.',
      'In some cases, people may even change their behavior , opinions, or appearance just to gain acceptance, moving further away from their true selves.',
      'The contrast between social media and reality also affects body image and self-perception.',
      'Many platforms are filled with images of people who appear flawless, often due to filters, editing tools, or professional photography.',
      'These images promote unrealistic beauty standards that are difficult to achieve naturally.',
      'As individuals compare themselves to these idealized images, they may feel dissatisfied with their own appearance.',
      'This dissatisfaction can lead to serious consequences such as low self-esteem, anxiety, and unhealthy habits like extreme dieting or overexercising.',
      'In some cases, it can result in a distorted body image, where individuals struggle to see themselves accurately.',
      'This pressure is particularly overwhelming for young people who are still developing their identity and self-worth.',
      'It is important to remember that many of the images seen online are not real but carefully constructed representations.',
      'Beyond comparison and self-image, excessive use of social media can also lead to mental fatigue and emotional exhaustion.',
      'The human brain is not designed to process the constant flow of information encountered through endless scrolling.',
      'News updates, personal stories, advertisements, and trending content are consumed rapidly, often without time for reflection.',
      'This overload can lead to stress, reduced concentration, and a feeling of being overwhelmed.',
      'Another psychological effect linked to social media use is the fear of missing out (FOMO).',
      'Seeing others participate in exciting activities, social events, or achievements can create the impression that one is being left behind.',
      'This feeling can lead to anxiety and dissatisfaction, even when one’s own life is stable.',
      'The constant awareness of others’ activities makes it difficult to fully appreciate the present moment.',
      'Social media also affects real-life relationships.',
      'While these platforms are designed to connect people, excessive use can reduce meaningful face-to-face interactions.',
      'Communication through screens often lacks emotional depth, tone, and presence.',
      'As a result, individuals may begin to feel lonely or isolated despite being constantly connected online.',
      'Despite these challenges, social media is not entirely negative.',
      'When used responsibly, it can be a powerful tool for learning, networking, self-expression, and raising awareness, especially on issues like mental health.',
      'Many individuals and organizations use social media to share authentic experiences and create supportive communities where people feel understood and less alone.',
      'The key lies in developing a healthy and balanced relationship with social media.',
      'This begins with awareness—understanding that what is seen online is often curated and does not reflect reality.',
      'Choosing to follow positive, authentic, and growth-oriented content can reduce negative comparisons.',
      'Setting boundaries, such as limiting screen time and taking breaks, can also improve mental well-being.',
      'Engaging in real-life activities like hobbies, exercise, and spending time with loved ones provides a deeper sense of fulfillment.',
      'In addition, building self-worth from within rather than relying on external validation is essential.',
      'Education also plays a vital role in addressing the hidden impact of social media.',
      'Teaching individuals, especially young people, about the difference between online representation and real life can help them navigate digital spaces responsibly.',
      'Open discussions about mental health can further reduce stigma and promote a supportive environment.',
      'In conclusion, social media and reality are fundamentally different, yet their contrast has a significant impact on mental health.',
      'While social media presents a polished and idealized version of life, reality is more complex, imperfect, and authentic.',
      'If not managed carefully, this gap can lead to comparison, low self-esteem, anxiety, and emotional exhaustion.',
      'However, by using social media mindfully, setting boundaries, and focusing on real-life experiences, individuals can protect their mental well-being.',
      'Ultimately, true happiness and self-worth come from personal growth, genuine relationships, and self-acceptance—not from the filtered images seen online.',
    ],
    bg: '#1B4326',
    color: '#fff',
  },
  {
    title: 'The Pressure to Have Your Life Figured Out in Your 20s',
    tag: 'Community · Twenties',
    author: 'By Prachi Ramesh',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=85&auto=format&fit=crop',
    excerpt: 'Nobody told us the map would be blank. An honest conversation about expectations, timelines, and the grace of figuring it out at your own pace.',
    content: [
      'May is Mental Health Awareness Month, but for many of us, awareness doesn’t come from posters or campaign it comes from the quiet panic at 2 a.m. when you start wondering if you’re already falling behind in life.',
      'If you’re in your late teens or early twenties, chances are you’ve felt it: that constant, heavy pressure to have everything figured out.',
      'Your career.',
      'Your passions.',
      'Your purpose.',
      'Your future.',
      'It can feel like there’s a silent deadline hanging over your head, and somehow everyone else got the memo except you.',
      'Social media doesn’t help.',
      'Every scroll is another reminder someone landing their “dream internship,” someone starting a business, someone graduating early, someone who just seems like they know exactly where they’re going.',
      'It creates this illusion that there’s a clear path, and that if you haven’t found yours yet, you’re doing something wrong.',
      'But here’s the truth we don’t talk about enough: most people don’t have it figured out.',
      'Not at 20.',
      'Not at 25.',
      'Sometimes not even at 30 or beyond.',
      'The problem is that we’ve been taught to treat life like a straight line begins with school, degree, career, success.',
      'But real life isn’t linear.',
      'It’s messy.',
      'It’s confusing.',
      'It involves changing your mind, starting over, feeling lost, and trying again.',
      'That’s not failure, that’s growth.',
      'For students especially, the pressure can feel intense.',
      'You’re expected to make decisions now that will shape your entire future.',
      'Pick the “right” course.',
      'Choose the “right” career.',
      'Make the “right” moves.',
      'But how are you supposed to know what’s right when you’re still discovering who you are?',
      'It’s okay to not know.',
      'Honestly, it’s okay to feel a bit lost sometimes.',
      'It often looks like everyone around you has their whole life scripted out, but the truth is, most people are just winging it too.',
      'If you’re doubting your choices or feel like you need to change direction, that isn’t a sign of failure it’s a sign of growth.',
      'It means you’re actually paying attention to who you are and what makes you happy, rather than just following a map someone else drew for you.',
      'You don’t just feel lost, you feel like you’re the problem.',
      'Like you’re not doing enough, not good enough, not moving fast enough.',
      'That internal voice can be brutal.',
      'But that voice isn’t always telling the truth.',
      'Sometimes it’s shaped by family expectations, societal expectations, even your own unrealistic standards.',
      'Sometimes it’s comparing your behind-the-scenes to someone else’s highlight reel.',
      'And sometimes it’s just fear of wasting time, fear of making the wrong choice, fear of not becoming who you thought you’d be.',
      'You’re allowed to take your time.',
      'Your twenties are not a deadline, they’re a period of exploration. A time to try things, mess up, learn, unlearn, and grow.',
      'You’re not supposed to have all the answers right now.',
      'You’re supposed to ask questions.',
      'And if you’re someone who’s currently feeling this pressure, who feels like they’re falling behind or not doing enough, you’re not alone in that feeling. A lot of people are carrying the same weight, even if they don’t say it out loud.',
      'Maybe what we need isn’t to “figure everything out,” but to redefine what progress looks like.',
      'Getting through a tough week, learning what you don\'t want, taking a break when you\'re stressed, asking for help when things feel heavy, or trying something new even if it doesn\'t work out are all ways to make progress.',
      'These things matter, even if they don’t always look impressive from the outside.',
      'The weight you’re feeling exists because you care about your future, and that’s a good thing.',
      'But remember: life isn\'t a race.',
      'You aren\'t "behind" because there is no universal finish line.',
      'Give yourself the grace to figure things out at your own speed.',
      'You’re doing better than you think.',
      'You\'re allowed to take your time and navigate this journey at your own pace, without comparing yourself to others.',
      'This Mental Health Awareness Month, maybe the conversation shouldn’t just be about coping but also about changing the expectations that are hurting us in the first place.',
      'You don’t need to have your life figured out right now.',
      'You just need to keep going, one step at a time, at your own pace.',
      'And that is more than enough.',
    ],
    bg: '#F3EDE1',
    color: '#1B4326',
  },
  {
    title: 'Why the Quiet Student Might Need the Most Help',
    tag: 'Community · Education',
    author: 'By Noela Ramoni',
    img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=85&auto=format&fit=crop',
    excerpt: 'The loud ones make their needs known. But the quiet ones? They’re often suffering in a silence we mistake for peace. An important read for every parent, guardian, and teacher.',
    content: [
      'The loud ones.',
      'We\'ll find them in every home and classroom.',
      'They make their needs known, passionately.',
      'They are demanding, vibrant and transparent.',
      'You know exactly when they are hungry, when they are hurting, and when they are thriving.',
      'Their emotions are the weather—impossible to ignore.',
      'And then we have the quiet ones, wale wapole.',
      'They are the ‘easy’ children.',
      'They smile when you joke, they smile even when hurt, when things are too much they become more quiet but we won\'t know *juu Hivo ndio Anakuanga” That\'s how they are.',
      'We never have to worry about them.',
      'When they stay in their room we won\'t worry because he\'s always been like that.',
      'When he refuses to meet people it\'s because he\'s shy.',
      'When he sleeps too much, we\'ll find a reason for that.',
      'If he eats too little,or his eyes turn blood shot, we\'ll say he\'s not having enough sleep.',
      'The cost of ambition, he has lots to catch up on.',
      'But all those and more could be a sign of something deeper.',
      'Something more than a personality trait.',
      'When the loud one acts out it\'s a sign for intervention and we know where to start.',
      'When a student goes silent….. perhaps we won\'t even notice.',
      'They\'ll internalise their fears and stress until it becomes burnout or turns into depression which could be easily dismissed as being tired.',
      'This will also manifest in academic fallout later in life.',
      'Only then will it be serious.',
      'Because why is our perfect son, perfect daughter not bringing home perfect grades when nothing has changed.',
      'But something did shift,only that no one noticed.',
      'To support these children we\'ll need to stop using their traits as an excuse for every behaviour.',
      'Create time to sit with your child,even if it\'s for parallel play.',
      'Presence and observation can help see what they refuse to communicate.',
      'Validate the person,not the grade.',
      'We can get so caught up on the good things they do that we tie their value to their results.',
      'Praise their character,input and their presence. A quiet child can often feel they\'re a burden.',
      'Create safe spaces for them to vent so they don\'t feel they\'re being too much.',
      'As a parent, a guardian,watch out for the early signs.',
      'Any shift in behaviour,tone or schedule.',
      'The child who had a strict bedtime so it wouldn\'t affect her studies now stays up late?',
      'The one who would wake up early now wants to sleep in late every single day?',
      'Talk to a professional.',
      'Those who tailor their services for your children\'s needs;whose mission is to ensure no child suffers in silence since they\'re good at hiding it. mentalbeacon offers safe counselling spaces, parent and teacher workshops and stress management Coaching.',
      'Tailored services ensure that not only the children are catered for but the adults are well equipped to care for them.',
      'If we want to show up for our quiet children, we\'ll have to pay attention to what they are not saying and learn how to read between the lines,or the silence.',
    ],
    bg: '#E8F5EC',
    color: '#1B4326',
  },
];

const PARTNERS = ['Strathmore University', 'KCA University', 'Encode Hub Africa', 'Kenya Red Cross Society', 'Kenya Methodist University'];

export const Home: React.FC<{ onViewService: (tab?: string) => void; onGoArticles: () => void }> = ({
  onViewService,
  onGoArticles,
}) => {
  const [activeBlog, setActiveBlog] = useState<number | null>(null);

  useEffect(() => {
    if (activeBlog === null) return;
    const handleClickOutside = (event: Event) => {
      if (!((event.target as HTMLElement).closest('.blog-modal'))) {
        setActiveBlog(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchend', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    };
  }, [activeBlog]);

  const closeModal = () => setActiveBlog(null);

  const carouselImages = [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=85&auto=format&fit=crop&crop=faces',
  ];
  const [idx, setIdx] = useState(0);
  const [partnerIdx, setPartnerIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % carouselImages.length), 4000);
    return () => clearInterval(t);
  }, [carouselImages.length]);

  useEffect(() => {
    const t = setInterval(() => setPartnerIdx((i) => (i + 1) % PARTNERS.length), 2500);
    return () => clearInterval(t);
  }, []);

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
              MENTAL BEACON
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif text-white font-light leading-tight mb-6">
              A more connected way to care for mental wellness.
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-md mb-8 leading-relaxed">
              Mental wellness is part of how we live, relate, grow and move through the world. At Mental Beacon, we're building the services, spaces, programmes and pathways that help people access mental wellness support in ways that feel relevant to their lives.
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
          <span className="w-10 h-px bg-white/30" /> Scroll to explore
        </div>
      </section>

      {/* PILLARS */}
      <section className="bg-white border-b border-[#D8D4C9]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D8D4C9]">
          {[{
            n: '01',
            t: 'Support that meets people where they are',
            d: 'Mental wellness support should be accessible through different pathways, depending on what people need and what works for them.',
          }, {
            n: '02',
            t: 'Environments that make wellbeing possible',
            d: "We recognise that people don't live in isolation. Our homes, schools, campuses, workplaces and communities all influence our mental wellbeing.",
          }, {
            n: '03',
            t: 'Infrastructure that connects the experience',
            d: "We're building the services, systems and experiences that help make mental wellness support more accessible, consistent and connected.",
          }].map((p) => (
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
            <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#1B4326]/70 mb-3 block">
              More than a moment of support
            </span>
            <h2 className="text-3xl font-serif text-[#1B4326] mb-4">
              Mental wellness deserves more than a single point of access.
            </h2>
            <p className="text-[#3F5A47] leading-relaxed">
              For many people, mental wellness support is something they only think about when life becomes difficult. But wellbeing is shaped by much more than one moment.
            </p>
            <p className="text-[#3F5A47] leading-relaxed mt-3">
              It's shaped by our relationships, our environments, our communities, our opportunities and the support available to us. Mental Beacon is building a more connected approach — one that makes mental wellness part of the way people live, learn, work, relate and grow.
            </p>
            <p className="text-[#3F5A47] leading-relaxed mt-3 font-semibold">
              We believe support should be easier to find, easier to understand and more connected to the realities of everyday life.
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

      {/* PEOPLE FIRST (from second_template) */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#1B4326]/70 mb-3 block">People first</span>
            <h2 className="text-3xl font-serif text-[#1B4326] mb-4">Because real life doesn't happen in isolation.</h2>
            <p className="text-[#3F5A47] leading-relaxed">
              Mental wellness is shaped by the lives we live and the environments we move through. We're especially interested in the experiences of young adults navigating identity, relationships, education, work, family expectations and the uncertainty of becoming.
            </p>
            <p className="text-[#3F5A47] leading-relaxed mt-3">
              But our vision extends beyond individuals. We believe mental wellness support should also be accessible through the communities and institutions that shape people's everyday lives.
            </p>
            <p className="text-[#3F5A47] leading-relaxed mt-3 font-semibold">
              We want to help build a world where accessing mental wellness support feels more natural, more informed and less out of reach.
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=85&auto=format&fit=crop"
              alt="Community"
              className="rounded-2xl w-full h-[360px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* APPROACH (from second_template) */}
      <section className="py-20 px-4 bg-[#F4F1EA]">
        <div className="max-w-6xl mx-auto">
          <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#1B4326]/70 mb-3 block">How we think about mental wellness</span>
          <h2 className="text-3xl font-serif text-[#1B4326] mb-8">Care should be human. Access should be easier.</h2>
          <div className="grid md:grid-cols-2 gap-4 border-t border-[#1B4326]/20 pt-6">
            {[{
              t: 'Human',
              d: 'We believe mental wellness support should begin with understanding people and their experiences.',
            }, {
              t: 'Connected',
              d: 'We recognise that wellbeing is shaped by relationships, environments and the systems around us.',
            }, {
              t: 'Accessible',
              d: 'We want to make it easier for people to understand their options and find appropriate support.',
            }, {
              t: 'Intentional',
              d: 'We believe meaningful mental wellness infrastructure takes thoughtful design, professional care and a commitment to doing things responsibly.',
            }].map((a) => (
              <div key={a.t} className="py-4 border-b border-[#1B4326]/10">
                <h3 className="text-xl font-serif text-[#1B4326] mb-1">{a.t}</h3>
                <p className="text-sm text-[#3F5A47] leading-relaxed">{a.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AFFORDABLE THERAPY ACCESS PROGRAM */}
      <section id="support-our-work" className="py-20 px-4 bg-[#F4F1EA]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#1B4326] rounded-2xl overflow-hidden grid md:grid-cols-2">
            <div className="p-10 text-white">
              <span className="text-xs font-bold tracking-widest uppercase text-[#00bf63] mb-3 block">Affordable Therapy Access Program</span>
              <h2 className="text-3xl font-serif text-white mb-4">Professional support shouldn't be out of reach.</h2>
              <p className="text-white/70 leading-relaxed mb-6">
                We believe every young person deserves access to a qualified therapist — regardless of what's in their pocket. Through partnerships with vetted, licensed therapists, we connect young people to one-on-one mental health support at a subsidized rate of <strong className="text-white">Ksh 1,500 per session</strong> — making professional care genuinely within reach.
              </p>
              <p className="text-white/70 leading-relaxed mb-6">
                Our flexible pricing options ensure that cost is never a barrier to getting the support you need. We offer sliding scale rates based on income, package deals for multiple sessions, and limited free spots for those in greatest need.
              </p>
              <p className="text-white/70 leading-relaxed font-semibold">
                Contact us to discuss which option works best for your situation.
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
          <div>
            {[[
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
            ))]}
          </div>
        </div>
      </section>

      {/* VOICES & RESOURCES - blog cards that open individual mini pages */}
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
              <article
                key={a.title}
                onClick={() => setActiveBlog(ARTICLES.indexOf(a))}
                className="cursor-pointer rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ background: a.bg, color: a.color }}
              >
                <img src={a.img} alt={a.title} className="w-full h-[180px] object-cover opacity-80" />
                <div className="p-7 flex-1 flex flex-col">
                  <span className="text-xs font-bold tracking-widest uppercase mb-2 opacity-80">{a.tag}</span>
                  <h3 className="text-xl font-serif mb-2 leading-tight">{a.title}</h3>
                  <p className="text-sm leading-relaxed flex-1 opacity-80">{a.excerpt}</p>
                  <div className="mt-5 text-xs font-semibold tracking-wide opacity-90">{a.author} →</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Individual blog mini-pages */}
      {activeBlog !== null && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="blog-modal relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-white/95 backdrop-blur border-b border-[#1B4326]/10">
              <span className="text-xs font-bold tracking-widest uppercase text-[#2E6F40]">Voices & Resources</span>
              <button
                onClick={closeModal}
                aria-label="Close article"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#1B4326] hover:bg-[#B9D2B9]/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <article
              key={ARTICLES[activeBlog].title}
              className="p-8"
              style={{ background: ARTICLES[activeBlog].bg, color: ARTICLES[activeBlog].color }}
            >
              <img
                src={ARTICLES[activeBlog].img}
                alt={ARTICLES[activeBlog].title}
                className="w-full h-[250px] object-cover mb-6 rounded-xl"
              />
              <span className="text-xs font-bold tracking-widest uppercase mb-2 opacity-80">
                {ARTICLES[activeBlog].tag}
              </span>
              <h3 className="text-2xl font-serif mb-4 leading-tight">
                {ARTICLES[activeBlog].title}
              </h3>
              <p className="text-base leading-relaxed mb-6 opacity-80">
                {ARTICLES[activeBlog].excerpt}
              </p>
              {/* Full content section */}
              {ARTICLES[activeBlog].content.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed mb-4 opacity-90">{paragraph}</p>
              ))}
              <div className="text-xs font-semibold tracking-wide opacity-90">
                {ARTICLES[activeBlog].author}
              </div>
            </article>
          </div>
        </div>
      )}

      {/* COMMUNITY / SOCIAL */}
      <section className="bg-[#1B4326] py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif text-white mb-4">
              Our community is where the conversation continues.
            </h2>
            <p className="text-white/60 mb-8">
              Join our WhatsApp group, follow us on social media, and become part of a growing movement of young people choosing their mental wellness.
            </p>
            <div className="space-y-3">
              {[{
                name: 'WhatsApp Community',
                handle: 'Join our wellness community group',
                href: 'https://chat.whatsapp.com/GgJNI3MDJIcC2olzxNkqAr?mode=gi_t',
                icon: MessageCircle,
              }, {
                name: 'Instagram',
                handle: '@mental.beacon.ke',
                href: 'https://www.instagram.com/mental.beacon.ke/',
                icon: Instagram,
              }, {
                name: 'TikTok',
                handle: '@mental.beacon.ke',
                href: 'https://www.tiktok.com/@mentalbeacon.ke',
                icon: Music2,
              }].map((s) => {
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

      {/* PARTNERS CAROUSEL */}
      <section className="py-16 px-4 bg-[#F4F1EA]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest uppercase text-[#2E6F40] mb-2 block">
              Organisations & Institutions We've Worked With
            </span>
            <h2 className="text-3xl font-serif text-[#1B4326]">Our partners & collaborators.</h2>
          </div>
          <div className="overflow-hidden">
            <div className="flex gap-6 transition-transform duration-700" style={{ transform: `translateX(-${partnerIdx * 240}px)` }}>
              {[...PARTNERS, ...PARTNERS].map((p, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-[#D8D4C9] shadow-sm min-w-[220px] flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#1B4326] text-[#F4F1EA] flex items-center justify-center font-bold text-sm">
                    {p.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                  </div>
                  <span className="text-sm font-semibold text-[#1B4326]">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};