import React from 'react';
import { ArrowRight, Compass, HeartHandshake, Sparkles } from 'lucide-react';
import { AsyncImage } from './AsyncImage';

interface VisionGalleryProps {
  onViewService: (tab?: string) => void;
}

const VIGNETTES = [
  {
    key: 'goals',
    eyebrow: 'Our Goals',
    title: 'Relief in minutes, not weeks.',
    body:
      'Every part of Mental Beacon is designed to meet a heavy moment as it happens — a breath pacer, a private page to think on, a room of people who understand the weight without needing the whole story.',
    note: 'Grounding that is available the moment you need it',
    photo: '/images/forest-path.jpg',
    alt: 'A sunlit path winding through a quiet green forest',
    Icon: Compass
  },
  {
    key: 'projects',
    eyebrow: 'Our Projects',
    title: 'Built with people, not just for them.',
    body:
      'Founding community members shape the peer rooms, the journal prompts, the soundscapes, and the safety thresholds. These are living projects, refined slowly and honestly with the people who use them.',
    note: 'Peer rooms • Private journal vault • Breath & sound deck',
    photo: '/images/friends.jpg',
    alt: 'A row of friends sitting close together, looking out at the sea',
    Icon: HeartHandshake
  },
  {
    key: 'vision',
    eyebrow: 'Our Vision',
    title: 'A world where asking for support is ordinary.',
    body:
      'We imagine mental care that feels as natural as calling a friend — free of stigma, waiting queues, and commercial pressure. A quiet beacon that stays lit for whoever needs it next.',
    note: 'Free, private, and open to everyone',
    photo: '/images/canopy.jpg',
    alt: 'Layered mountain ridges fading into a soft dawn sky',
    Icon: Sparkles
  }
];

/**
 * Photo-led story panels: goals, projects, and vision. Each image is washed
 * with the site's sage/cream palette so it blends into the paper-like canvas.
 */
export const VisionGallery: React.FC<VisionGalleryProps> = ({ onViewService }) => (
  <section
    aria-labelledby="vision-gallery-heading"
    className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-[#D8D4C9]"
  >
    <div className="max-w-6xl mx-auto">
      <div className="max-w-2xl mb-12 sm:mb-16">
        <span className="text-xs font-bold tracking-widest uppercase text-[#2E6F40] mb-2 block">
          Our goals, projects &amp; vision
        </span>
        <h2
          id="vision-gallery-heading"
          className="text-3xl sm:text-4xl font-serif text-[#1B4326] font-normal leading-tight"
        >
          The quiet landscape we are building toward.
        </h2>
        <p className="mt-4 text-sm sm:text-base text-[#2B2E2B]/80 leading-relaxed">
          Three horizons guide everything we make: immediate relief, shared ownership,
          and a future where support is never a last resort.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {VIGNETTES.map((vignette, index) => {
          const Icon = vignette.Icon;
          return (
            <article
              key={vignette.key}
              className="group animate-page-in overflow-hidden rounded-3xl border border-[#D8D4C9] bg-[#FFFFFF] shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#2E6F40]/40 hover:shadow-lg"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="relative h-52 sm:h-56">
                <AsyncImage
                  src={vignette.photo}
                  alt={vignette.alt}
                  className="h-full w-full"
                  imgClassName="saturate-[0.82] contrast-[0.97] transition-transform duration-[1600ms] ease-out group-hover:scale-105"
                />
                {/* Wash the photo into the cream/sage palette */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#F4F1EA] via-[#F4F1EA]/20 to-transparent"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[#2E6F40] opacity-[0.16] mix-blend-color"
                />
                <span className="absolute bottom-4 left-5 inline-flex items-center gap-1.5 rounded-full border border-[#1B4326]/15 bg-[#F4F1EA]/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1B4326] backdrop-blur-sm transition-colors duration-500 group-hover:bg-[#F4F1EA]">
                  <Icon className="w-3 h-3 text-[#2E6F40]" />
                  {vignette.eyebrow}
                </span>
              </div>

              <div className="p-6 pt-4">
                <h3 className="text-xl font-serif font-bold text-[#1B4326] leading-snug">
                  {vignette.title}
                </h3>
                <p className="mt-2.5 text-sm text-[#2B2E2B]/80 leading-relaxed">
                  {vignette.body}
                </p>
                <div className="mt-5 border-t border-[#D8D4C9] pt-3 text-[11px] font-semibold text-[#2E6F40]">
                  {vignette.note}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={() => onViewService('service_in_progress')}
          className="group inline-flex items-center space-x-2 rounded-xl bg-[#1B4326] px-7 py-3.5 text-sm font-semibold text-[#F4F1EA] shadow-sm transition-all duration-500 hover:bg-[#2E6F40] hover:shadow-md"
        >
          <span>See what we are building</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  </section>
);
