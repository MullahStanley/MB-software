import React, { useEffect, useRef, useState } from 'react';

interface AsyncImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Load immediately instead of waiting for the viewport. */
  priority?: boolean;
  /** Slow ambient panning for large background photos. */
  drift?: boolean;
}

/**
 * Progressively enhances a photo: a warm placeholder holds the space while the
 * image is fetched and decoded asynchronously, then the photo fades in.
 */
export const AsyncImage: React.FC<AsyncImageProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  priority = false,
  drift = false
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Cached images can finish before React attaches onLoad.
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-[#EAE6DC] ${className}`}>
      <div
        aria-hidden
        className={`absolute inset-0 bg-gradient-to-br from-[#D8D4C9]/70 via-[#EAE6DC] to-[#B9D2B9]/40 transition-opacity duration-1000 ${
          loaded ? 'opacity-0' : 'opacity-100 animate-pulse-slow'
        }`}
      />
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-[opacity,filter,transform] duration-[1400ms] ease-out ${
          loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-105'
        } ${drift ? 'photo-drift' : ''} ${imgClassName}`}
      />
    </div>
  );
};
