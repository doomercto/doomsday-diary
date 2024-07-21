import { useMemo, useState } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';

import { Button } from './ui/button';

export default function TruncatedText({
  text,
  truncate,
}: {
  text: string;
  truncate: boolean;
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [expanded, setExpanded] = useState(false);

  const truncatedText = useMemo(() => {
    let newText = text;
    const splitText = text.split('\n');
    const allowedLines = splitText.reduce((acc, line, index) => {
      if (index > acc) {
        return acc;
      }
      if (line.length === 0) {
        if (index > 0 && splitText[index - 1].length > 0) {
          return acc + 1;
        }
        return acc + 0.5;
      }
      return acc;
    }, 7);
    if (splitText.length > allowedLines) {
      newText = splitText.slice(0, allowedLines).join('\n');
    }
    if (!isDesktop && newText.length > 800) {
      newText = newText.slice(0, 800);
    }
    return newText;
  }, [text, isDesktop]);

  const isTruncated = truncate && !expanded && truncatedText !== text;

  const textToDisplay = useMemo(
    () =>
      (isTruncated ? `${truncatedText}…` : text)
        .split('\n')
        .map((line, index) => (
          <p className="max-w-full" key={index}>
            {line}
          </p>
        )),
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
