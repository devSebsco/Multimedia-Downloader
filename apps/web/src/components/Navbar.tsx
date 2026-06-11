import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

export default function Navbar() {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: '64px',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(0.75rem, 5vw, 3rem)',
        transition: 'background-color 0s ease, border-color 0s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="0"  y="0"  width="12" height="12" fill="currentColor" opacity="0.9"/>
          <rect x="16" y="0"  width="12" height="12" fill="currentColor" opacity="0.5"/>
          <rect x="0"  y="16" width="12" height="12" fill="currentColor" opacity="0.5"/>

          <g transform="translate(16, 16)" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
            <path d="M 2,8.5 L 2,10.5 L 10,10.5 L 10,8.5" fill="none" />
            <line x1="6" y1="1.5" x2="6" y2="7.5" />
            <path d="M 3,4.5 L 6,7.5 L 9,4.5" fill="none" />
          </g>
        </svg>
        <span style={{
          fontFamily: '"Black Ops One", cursive',
          fontSize: '1.1rem',
          letterSpacing: '0.05em',
          color: 'var(--text-primary)',
        }}>
          LINKFETCH
        </span>
      </div>

      <div className="nav-toggles" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <style>{`
        @media (max-width: 360px) {
          header { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
          .nav-toggles { gap: 4px !important; }
        }
      `}</style>
    </header>
  );
}
