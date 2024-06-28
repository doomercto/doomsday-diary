'use client';

import { Lacquer } from 'next/font/google';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const fontLacquer = Lacquer({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: '400',
});

export default function LandingPage() {
  const [showEnter, setShowEnter] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowEnter(true);
    }, 4000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className="relative h-svh w-svh"
      onClick={() => setShowEnter(true)}
      onKeyDown={() => setShowEnter(true)}
    >
      <div className="absolute inset-0 z-10">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src="background.mp4"
        />
      </div>
      <div
        className={cn(
          fontLacquer.variable,
          'absolute inset-0 font-sans flex flex-col items-center justify-center z-20'
        )}
      >
        <div className="h-[60vh] max-sm:hidden" />
        <Link
          className={cn(
            'm-auto text-5xl md:text-7xl text-slate-200 drop-shadow-[2px_2px_0px_theme(colors.slate.500)] opacity-70 hover:opacity-100 cursor-pointer transition-all ease-out duration-1000',
            !showEnter && 'opacity-0 pointer-events-none translate-y-16'
          )}
          href="/feed"
        >
          Enter
        </Link>
      </div>
    </div>
  );
}
