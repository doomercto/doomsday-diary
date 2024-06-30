'use client';

import { Lacquer } from 'next/font/google';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

const fontLacquer = Lacquer({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: '400',
});

export default function LandingPage() {
  const [showEnter, setShowEnter] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  const [autoPlayFailed, setAutoPlayFailed] = useState(false);

  useEffect(() => {
    (async () => {
      const vid = document.createElement('video');
      vid.src = 'test.mp4';
      vid.autoplay = true;
      vid.muted = true;
      vid.loop = true;
      vid.playsInline = true;
      try {
        await vid.play();
      } catch (err) {
        setAutoPlayFailed(true);
        setShowEnter(true);
      } finally {
        vid.remove();
        vid.srcObject = null;
      }
    })();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowEnter(true);
    }, 3500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!showEnter) return () => {};
    const timeout = setTimeout(() => {
      setShowTitle(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [showEnter]);

  return (
    <div
      className="relative h-svh w-svh"
      onClick={() => setShowEnter(true)}
      onKeyDown={() => setShowEnter(true)}
    >
      <div className="absolute inset-0 z-10">
        {!autoPlayFailed ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            src="background.mp4"
          />
        ) : (
          <Image
            className="h-full w-full object-cover"
            src="/background.png"
            alt="background"
            width={0}
            height={0}
            sizes="100vw"
          />
        )}
      </div>
      <div
        className={cn(
          fontLacquer.variable,
          'absolute inset-0 px-8 overflow-hidden font-sans flex flex-col items-center justify-center z-20 text-center text-slate-200 drop-shadow-[2px_2px_0px_theme(colors.slate.500)]'
        )}
      >
        <div className="mx-auto mt-8 opacity-0" aria-hidden>
          {/* center enter button */}
          The Doomsday Diary
        </div>
        <Link
          className={cn(
            'm-auto opacity-70 hover:opacity-100 cursor-pointer transition-[opacity,transform] ease-out duration-1000 text-5xl md:text-7xl',
            !showEnter && 'opacity-0 pointer-events-none translate-y-16'
          )}
          href="/feed"
        >
          Enter
        </Link>
        <div
          className={cn(
            'mx-auto mb-8 opacity-70 transition-[opacity,transform] ease-out duration-1000 text-3xl md:text-7xl',
            !showTitle && 'opacity-0 translate-y-16'
          )}
        >
          The Doomsday Diary
        </div>
      </div>
    </div>
  );
}
