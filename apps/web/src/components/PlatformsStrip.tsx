const PLATFORMS = [
  {
    name: 'YouTube',
    svg: (
      <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    svg: (
      <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    svg: (
      <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    name: 'X',
    svg: (
      <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.726-8.84L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    svg: (
      <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'SoundCloud',
    svg: (
      <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
        <path d="M11.5 17.5h.5c.3 0 .5-.2.5-.5V8.8c0-.3-.2-.5-.5-.5h-.5c-.3 0-.5.2-.5.5V17c0 .3.2.5.5.5zm-2 0h.5c.3 0 .5-.2.5-.5V9.5c0-.3-.2-.5-.5-.5h-.5c-.3 0-.5.2-.5.5V17c0 .3.2.5.5.5zm-2 0h.5c.3 0 .5-.2.5-.5v-6.5c0-.3-.2-.5-.5-.5h-.5c-.3 0-.5.2-.5.5V17c0 .3.2.5.5.5zm-2 0h.5c.3 0 .5-.2.5-.5v-5c0-.3-.2-.5-.5-.5h-.5c-.3 0-.5.2-.5.5V17c0 .3.2.5.5.5zm-2 0h.5c.3 0 .5-.2.5-.5v-3.5c0-.3-.2-.5-.5-.5h-.5c-.3 0-.5.2-.5.5V17c0 .3.2.5.5.5zm-2 0h.5c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5h-.5c-.3 0-.5.2-.5.5V17c0 .3.2.5.5.5z"/>
        <path d="M13.5 17.5h5.3c1.77 0 3.2-1.43 3.2-3.2 0-1.52-1.06-2.8-2.5-3.12V11c0-2.2-1.8-4-4-4-.72 0-1.39.2-1.97.53-.02.15-.03.31-.03.47v10.15z"/>
      </svg>
    ),
  },
];
import { useLanguage } from '../hooks/useLanguage';

export default function PlatformsStrip() {
  const { t } = useLanguage();
  return (
    <section style={{
      width: '100%',
      padding: '4rem clamp(0.75rem, 5vw, 3rem) 2rem',
      backgroundColor: 'var(--bg-primary)',
    }}>
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border)',

        padding: '2.5rem 2rem',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <p style={{
          fontFamily: '"Black Ops One", cursive',
          fontSize: '1.1rem',
          letterSpacing: '0.12em',
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: '0.5rem',
          textTransform: 'uppercase',
        }}>
          {t.platformsTitle}
        </p>

        <p style={{
          fontFamily: '"Space Mono", monospace',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginBottom: '2rem',
        }}>
          {t.platformsSubtitle}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {PLATFORMS.map((p, i) => (
            <div
              key={p.name}
              style={{
                flex: '1 1 0',
                minWidth: '80px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                padding: '0.75rem 1.25rem',
                borderRight: i < PLATFORMS.length - 1
                  ? '1px solid var(--border)'
                  : 'none',
              }}
              className="platform-item"
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.3)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                }}
              >
                {p.svg}
              </div>

              <span style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}>
                {p.name}
              </span>
            </div>
          ))}
        </div>

        <style>{`
          @media (max-width: 640px) {
            .platform-item {
              flex: 1 1 calc(33.33% - 2px) !important;
              min-width: 0 !important;
              padding: 0.75rem 0.5rem !important;
              border: 1px solid var(--border) !important;
              margin: -0.5px !important;
            }
            .platform-item span { white-space: normal !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
