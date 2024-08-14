'use client';

import { useState } from 'react';
import { Lacquer } from 'next/font/google';
import { Clock, TrendingUp } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import PostForm from '@/components/post-form';
import {
  Accordion,
  AccordionButtonTrigger,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSubtleTrigger,
} from '@/components/ui/select';

import type { ReactNode } from 'react';

const lacquer = Lacquer({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
});

export default function FeedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [accordionValue, setAccordionValue] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = pathname === '/feed/top' ? 'top' : 'latest';

  return (
    <div className="p-4 md:p-10 md:pt-6 lg:pt-8 max-w-6xl 2xl:max-w-7xl w-full self-center">
      <h1
        className={cn(
          lacquer.className,
          'text-center font-semibold text-3xl min-[375px]:text-4xl md:text-5xl pb-4 md:pb-6'
        )}
      >
        The Doomsday Diary
      </h1>
      <h2 className="px-4 pb-4">
        Welcome to the Doomsday Diary — where the DOOMER community turns gloom
        into something greater. Whether you&apos;re here to vent, laugh, or
        learn, you&apos;re in the right place.
      </h2>
      <h2 className="px-4 pb-4">
        Share your own story below, read and react to others, or explore the
        &apos;About&apos; tab to learn more about how you can tap into the
        onchain economy.
      </h2>
      <Accordion
        type="single"
        value={accordionValue}
        onValueChange={setAccordionValue}
        collapsible
      >
        <AccordionItem className="border-b-0" value="post-form">
          <AccordionButtonTrigger>Post something</AccordionButtonTrigger>
          <AccordionContent className="p-1 md:p-2">
            <PostForm
              onPost={() => {
                setAccordionValue('');
              }}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Select
        value={currentPage}
        onValueChange={newValue => {
          router.push(newValue === 'latest' ? '/feed' : `/feed/${newValue}`);
        }}
      >
        <SelectSubtleTrigger className="ml-4 text-muted-foreground">
          {currentPage === 'latest' && (
            <>
              <Clock className="h-4 w-4" />
              Latest
            </>
          )}
          {currentPage === 'top' && (
            <>
              <TrendingUp className="h-4 w-4" />
              Top
            </>
          )}
        </SelectSubtleTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="top">Top</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {children}
    </div>
  );
}
