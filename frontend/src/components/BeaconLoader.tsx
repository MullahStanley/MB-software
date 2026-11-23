import React from 'react';

interface BeaconLoaderProps {
  label?: string;
}

/** Calm fallback shown while a screen's code and data arrive asynchronously. */
export const BeaconLoader: React.FC<BeaconLoaderProps> = ({
  label = 'Preparing your space'
}) => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-[60vh] w-full flex-col items-center justify-center px-6 py-24 text-center animate-soft-in"
  >
    <div className="relative flex h-24 w-24 items-center justify-center">
      <span className="absolute inset-0 rounded-full bg-[#B9D2B9]/45 animate-breathe-in-out" />
      <span className="absolute inset-4 rounded-full border border-[#2E6F40]/30 bg-[#FFFFFF]/70" />
      <span className="relative h-3 w-3 rounded-full bg-[#1B4326]" />
    </div>
    <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-[#2E6F40]">
      {label}
    </p>
    <div className="mt-3 flex space-x-1.5" aria-hidden>
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="h-1.5 w-1.5 rounded-full bg-[#B9D2B9] animate-pulse"
          style={{ animationDelay: `${dot * 220}ms` }}
        />
      ))}
    </div>
    <span className="sr-only">{label}</span>
  </div>
);
