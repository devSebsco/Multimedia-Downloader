import { useState, useEffect } from 'react';
import { translations, type Lang } from '../i18n/translations';

const STORAGE_KEY = 'linkfetch-lang';
const EVENT_NAME  = 'lang-change';

function getCurrentLang(): Lang {
  if (typeof document === 'undefined') return 'es';
  return (document.documentElement.getAttribute('data-lang') as Lang) ?? 'es';
}

export function useLanguage() {
  const [lang, setLang] = useState<Lang>('es');

  useEffect(() => {
    setLang(getCurrentLang());

    function onLangChange(e: Event) {
      const newLang = (e as CustomEvent<Lang>).detail;
      setLang(newLang);
    }

    window.addEventListener(EVENT_NAME, onLangChange);
    return () => window.removeEventListener(EVENT_NAME, onLangChange);
  }, []);

  const t = translations[lang];

  return { lang, t };
}
