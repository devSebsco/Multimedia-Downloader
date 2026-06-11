import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const current = (document.documentElement.getAttribute('data-theme') as Theme) ?? 'light';
    setTheme(current);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const current = (document.documentElement.getAttribute('data-theme') as Theme) ?? 'light';
      setTheme(current);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return { theme };
}
