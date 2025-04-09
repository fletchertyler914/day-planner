import { useEffect, useRef, RefObject } from 'react';

export function useScrollToBottom<T extends HTMLElement = HTMLDivElement>(): [
  RefObject<T>,
  RefObject<T>
] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      // Clean up any existing observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Create new observer
      observerRef.current = new MutationObserver(() => {
        end.scrollIntoView({ behavior: 'smooth' });
      });

      observerRef.current.observe(container, {
        childList: true,
        subtree: true,
      });
    }

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []); // Remove unnecessary dependencies since refs are stable

  return [containerRef as RefObject<T>, endRef as RefObject<T>];
}
