import type { Lang } from './translations';

const STORAGE_KEY = 'linkfetch-lang';
const EVENT_NAME  = 'lang-change';

export function applyLanguage(lang: Lang): void {
  document.documentElement.setAttribute('data-lang', lang);
  localStorage.setItem(STORAGE_KEY, lang);
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: lang }));
}
