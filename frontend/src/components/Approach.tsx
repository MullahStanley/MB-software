import React from 'react';

export const Approach: React.FC = () => {
  return (
    <main className="flex-1 w-full bg-[#F3EDE1] text-[#1B462A]">
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#1B462A]/70 mb-3 block">Our Approach</span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">A more connected way to care for mental wellness.</h1>
          <p className="text-lg text-[#3F5A47] max-w-2xl">
            Mental wellness is part of how we live, relate, grow and move through the world. We are building services, spaces, programmes and pathways that help people access support in ways that feel relevant to their lives.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#1B462A]/70 mb-3 block">More than a moment of support</span>
            <h2 className="text-3xl font-bold mb-4">Mental wellness deserves more than a single point of access.</h2>
          </div>
          <div className="space-y-3 text-[#3F5A47]">
            <p>For many people, mental wellness support is something they only think about when life becomes difficult.</p>
            <p>But wellbeing is shaped by much more than one moment — by our relationships, environments, communities and opportunities.</p>
            <p><strong className="text-[#1B462A]">We believe support should be easier to find, easier to understand and more connected to the realities of everyday life.</strong></p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#1B462A]/70 mb-3 block">The bigger picture</span>
          <h2 className="text-3xl font-bold mb-4">Mental wellness, connected.</h2>
          <p className="text-[#3F5A47] max-w-2xl mb-8">
            We are building an ecosystem that brings together different ways of accessing mental wellness support, across the people and environments that shape our lives.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: 'Support that meets people where they are', d: 'Mental wellness support should be accessible through different pathways, depending on what people need.' },
              { t: 'Environments that make wellbeing possible', d: 'Our homes, schools, campuses, workplaces and communities all influence our mental wellbeing.' },
              { t: 'Infrastructure that connects the experience', d: 'We are building the services, systems and experiences that make support more accessible, consistent and connected.' },
            ].map((p) => (
              <div key={p.t} className="p-6 rounded-xl border border-[#1B462A]/20 bg-white">
                <h3 className="text-lg font-bold text-[#1B462A] mb-2">{p.t}</h3>
                <p className="text-sm text-[#3F5A47] leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xl font-bold text-[#1B462A]">One vision. Different pathways. A more connected approach to mental wellness.</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#1B462A]/70 mb-3 block">How we think about mental wellness</span>
          <h2 className="text-3xl font-bold mb-8">Care should be human. Access should be easier.</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { t: 'Human', d: 'Mental wellness support should begin with understanding people and their experiences.' },
              { t: 'Connected', d: 'Wellbeing is shaped by relationships, environments and the systems around us.' },
              { t: 'Accessible', d: 'We want to make it easier for people to understand their options and find appropriate support.' },
              { t: 'Intentional', d: 'Meaningful mental wellness infrastructure takes thoughtful design, professional care and responsibility.' },
            ].map((p) => (
              <div key={p.t} className="p-6 border-t-2 border-[#1B462A]">
                <h3 className="text-2xl font-bold text-[#1B462A] mb-2">{p.t}</h3>
                <p className="text-[#3F5A47]">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
