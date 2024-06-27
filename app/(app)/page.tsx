'use client';

import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';

import PostForm from '@/components/post-form';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="">
      <div className="h-[calc(100svh-4rem)] flex flex-col items-center">
        <h1 className="m-auto text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome
        </h1>
        <Button
          className="h-fit mb-4"
          variant="ghost"
          onClick={() => {
            contentRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="flex flex-col items-center">
            <div>Enter</div>
            <ChevronDown className="w-6 h-6 motion-safe:animate-bounce relative -bottom-1" />
          </div>
        </Button>
      </div>
      <div
        ref={contentRef}
        className="min-h-[calc(100svh-4rem)] py-20 flex items-center"
      >
        <PostForm
          className="m-auto w-96 md:w-[36rem] lg:w-[48rem] max-w-[90svw]"
          onPost={() => {
            router.push('/feed');
          }}
        />
      </div>
    </div>
  );
}
