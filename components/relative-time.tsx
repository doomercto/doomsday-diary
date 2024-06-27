import { useEffect, useState } from 'react';

import { getRelativeTime } from '@/lib/utils';

export default function RelativeTime({
  date: time,
  updateFrequency = 1000 * 60,
}: {
  date: string;
  updateFrequency?: number;
}) {
  const [relativeTime, setRelativeTime] = useState<string>(
    getRelativeTime(time)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(time));
    }, updateFrequency);

    return () => clearInterval(interval);
  }, [time, updateFrequency]);

  return <span>{relativeTime}</span>;
}
