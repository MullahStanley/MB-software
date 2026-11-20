import React from 'react';

interface FlaticonIconProps {
  /** File name inside /public/icons, e.g. "compass.png" */
  name: string;
  className?: string;
}

/**
 * Flaticon PNG rendered as a tintable shape: the PNG's alpha channel is used
 * as a CSS mask and the shape is painted with currentColor, so the icon
 * inherits text color in every state (selected tiles, footer, logo, …).
 * Assets and attribution: see README → "Icon Credits".
 */
export const FlaticonIcon: React.FC<FlaticonIconProps> = ({ name, className = 'h-4 w-4' }) => {
  const url = `url(/icons/${name})`;
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: 'inline-block',
        flexShrink: 0,
        backgroundColor: 'currentColor',
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    />
  );
};
