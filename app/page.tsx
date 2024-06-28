import { Lacquer } from 'next/font/google';
import Link from 'next/link';

import { cn } from '@/lib/utils';

const fontLacquer = Lacquer({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: '400',
});

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      <div className="absolute h-svh w-svh">
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
          'font-sans h-svh w-svh flex flex-col items-center justify-center'
        )}
      >
        <div className="h-[60vh] max-sm:hidden" />
        <Link
          className="m-auto text-5xl text-slate-200 drop-shadow-[2px_2px_0px_theme(colors.slate.500)] opacity-80 hover:opacity-100 cursor-pointer"
          href="/feed"
        >
          Enter
        </Link>
      </div>
    </div>
  );
}
