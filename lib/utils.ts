import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ClassValue } from 'clsx';
import type { MutableRefObject, Ref } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const timeunits: ReadonlyMap<Intl.RelativeTimeFormatUnit, number> = new Map([
  ['year', 24 * 60 * 60 * 1000 * 365],
  ['month', (24 * 60 * 60 * 1000 * 365) / 12],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000],
  ['second', 1000],
]);

const locale = new Intl.DateTimeFormat().resolvedOptions().locale;

const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

export function getRelativeTime(timestamp: string) {
  const date = Date.parse(timestamp);
  const elapsed = date - new Date().getTime();

  for (const [unit, duration] of timeunits) {
    if (Math.abs(elapsed) > duration) {
      return rtf.format(Math.round(elapsed / duration), unit);
    }
  }
  return rtf.format(0, 'second');
}

export function getErrorMessage(error: any, defaultMessage?: string) {
  let errorMessage = '';
  if (error?.message) {
    errorMessage ||= error.message;
  }
  if (typeof error === 'string') {
    errorMessage ||= error;
  }
  return errorMessage || defaultMessage || 'An unexpected error occurred';
}

export function mergeRefs<T>(...refs: Array<Ref<T>>) {
  return (value: T) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref) {
        (ref as MutableRefObject<T | null>).current = value;
      }
    });
  };
}
