import { useEffect, useState } from 'react';

export default function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    function handleVisibilityChange() {
      setIsVisible(document.visibilityState === 'visible');
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isVisible;
}
