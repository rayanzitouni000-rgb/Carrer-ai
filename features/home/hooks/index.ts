import { useEffect, useState } from 'react';

export function useAnimatedCounter(target: number, duration = 1400, delay = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frameId: number;
    const timeout = setTimeout(() => {
      const start = Date.now();

      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) {
          frameId = requestAnimationFrame(tick);
        }
      };

      frameId = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frameId);
    };
  }, [target, duration, delay]);

  return value;
}

export function useGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour,';
  if (hour < 18) return 'Bon après-midi,';
  return 'Bonsoir,';
}
