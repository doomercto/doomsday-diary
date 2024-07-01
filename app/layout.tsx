import { Inter as FontSans } from 'next/font/google';

import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';

import './globals.css';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const fontSans = FontSans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'The Doomsday Diary',
  description:
    'The Doomsday Diary by $DOOMER: Share your doom stories and learn from others in our onchain forum. Connect, empathize, and grow with the community. Embrace the doom and be part of something unique with $DOOMER.',
  openGraph: {
    title: 'The Doomsday Diary',
    description:
      'The Doomsday Diary by $DOOMER: Share your doom stories and learn from others in our onchain forum. Connect, empathize, and grow with the community. Embrace the doom and be part of something unique with $DOOMER.',
    url: 'https://diary.doomercto.xyz',
    siteName: 'The Doomsday Diary',
    images: [
      {
        url: 'https://diary.doomercto.xyz/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Doomsday Diary',
    description:
      'The Doomsday Diary by $DOOMER: Share your doom stories and learn from others in our onchain forum. Connect, empathize, and grow with the community. Embrace the doom and be part of something unique with $DOOMER.',
    images: ['https://diary.doomercto.xyz/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(fontSans.variable, 'font-sans')}>
        <ThemeProvider attribute="class" forcedTheme="dark">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
