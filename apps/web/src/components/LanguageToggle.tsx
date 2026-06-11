import { useLanguage } from '../hooks/useLanguage';
import { applyLanguage } from '../i18n/applyLanguage';
import type { Lang } from '../i18n/translations';

export default function LanguageToggle() {
  const { lang } = useLanguage();

  function toggle() {
    const next: Lang = lang === 'es' ? 'en' : 'es';
    applyLanguage(next);
  }

  return (
    <button
      onClick={toggle}
      title={lang === 'es' ? 'Cambiar idioma a Inglés' : 'Switch to Spanish'}
      aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      style={{
        width: '44px',
        height: '44px',
        border: '1.5px solid var(--border-strong)',
        background: 'transparent',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontFamily: '"Space Mono", monospace',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        transition: 'background 0.2s, color 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-card)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
      }}
    >
      {lang === 'es' ? 'ES' : 'EN'}
    </button>
  );
}
