import { useMemo, useState } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';

import { Button } from './ui/button';

export default function TruncatedText({ text }: { text: string }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [expanded, setExpanded] = useState(false);

  const truncatedText = useMemo(() => {
    let newText = text;
    const splitText = text.split('\n');
    if (splitText.length > 8) {
      newText = splitText.slice(0, 8).join('\n');
    }
    if (!isDesktop && newText.length > 1024) {
      newText = newText.slice(0, 1024);
    }
    return newText;
  }, [text, isDesktop]);

  const isTruncated = !expanded && truncatedText !== text;

  const textToDisplay = useMemo(
    () =>
      (isTruncated ? `${truncatedText}…` : text)
        .split('\n')
        .map((line, index) => <p key={index}>{line}</p>),
    [isTruncated, truncatedText, text]
  );

  return (
    <div className="gap-2 flex flex-col items-start">
      {textToDisplay}
      {(isTruncated || expanded) && (
        <Button
          variant="link"
          className="text-blue-500 dark:text-blue-400 h-8 p-0"
          onClick={() => setExpanded(!expanded)}
        >
          Show {expanded ? 'less' : 'more'}
        </Button>
      )}
    </div>
  );
}
