'use client';

import { useState } from 'react';

import PostForm from '@/components/post-form';
import PostList from '@/components/post-list';
import {
  Accordion,
  AccordionButtonTrigger,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';

export default function Feed() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [accordionValue, setAccordionValue] = useState<string>('');
  return (
    <div className="p-4 md:p-10 md:pt-8 max-w-6xl 2xl:max-w-7xl w-full self-center">
      <h1 className="text-center font-semibold text-3xl md:text-4xl pb-4 md:pb-6">
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
                setRefreshKey(oldKey => oldKey + 1);
                setAccordionValue('');
              }}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <PostList key={refreshKey} />
    </div>
  );
}
