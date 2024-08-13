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

  const currentPage = pathname === '/feed/top' ? 'top' : 'recent';

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
          router.push(`/feed/${newValue}`);
        }}
      >
        <SelectSubtleTrigger className="ml-4 text-muted-foreground">
          {currentPage === 'recent' && (
            <>
              <Clock className="h-4 w-4" />
              Recent
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
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="top">Top</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {children}
    </div>
  );
}
