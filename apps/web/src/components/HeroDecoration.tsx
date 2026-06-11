import { useState, useEffect } from 'react';

export default function HeroDecoration() {
  const [showAudio, setShowAudio] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowAudio((prev) => !prev);
    }, 5030);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="hero-deco-wrapper"
      style={{ width: '400px', height: '520px', flexShrink: 0 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 650"
        width="400"
        height="520"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <style>{`
            .lf-canvas       { fill: transparent; }
            .lf-back-card    { fill: #ffffff; filter: drop-shadow(0px 8px 18px rgba(0,0,0,0.07)); }
            .lf-front-flap   { fill: #e0e0e0; filter: drop-shadow(0px -4px 12px rgba(0,0,0,0.07)); }
            .lf-middle-tab   { fill: #cbcbcb; }
            .lf-icon-fill    { fill: #5f5f5f; }
            .lf-icon-stroke  { stroke: #5f5f5f; fill: none; stroke-linecap: round; stroke-linejoin: round; }
            .lf-icon-muted   { stroke: #9a9a9a; fill: none; stroke-linecap: round; }
            .lf-grid-line    { stroke: #d8d8d8; stroke-width: 1; fill: none; }

            /* CONTROL DE ANIMACIÓN SEGURO Y OBLIGATORIO */
            .animate-layer {
              transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
            }
            .layer-visible {
              opacity: 1 !important;
              visibility: visible !important;
            }
            .layer-hidden {
              opacity: 0 !important;
              visibility: hidden !important;
            }

            :root[data-theme="dark"] .lf-back-card  { fill: #252525; filter: drop-shadow(0px 8px 18px rgba(0,0,0,0.35)); }
            :root[data-theme="dark"] .lf-front-flap { fill: #1c1c1c; filter: drop-shadow(0px -4px 12px rgba(0,0,0,0.35)); }
            :root[data-theme="dark"] .lf-middle-tab { fill: #2a2a2a; }
            :root[data-theme="dark"] .lf-icon-fill  { fill: #a0a0a0; }
            :root[data-theme="dark"] .lf-icon-stroke{ stroke: #a0a0a0; }
            :root[data-theme="dark"] .lf-icon-muted { stroke: #555555; }
            :root[data-theme="dark"] .lf-grid-line  { stroke: #2a2a2a; }
          `}</style>

          <pattern id="lf-grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" className="lf-grid-line" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" className="lf-canvas" />

        <rect x="30" y="20" width="140" height="200" fill="url(#lf-grid)" opacity="0.7" />

        <path d="M 170 590 L 460 590" stroke="var(--border)" strokeWidth="1.5" fill="none" />
        <path d="M 460 230 L 460 590" stroke="var(--border)" strokeWidth="1.5" fill="none" />

        <path d="M 65 210 L 95 210 L 95 350 L 65 350 Z" className="lf-middle-tab" />
        <path d="M 410 250 L 435 250 L 435 380 L 410 350 Z" className="lf-middle-tab" />

        <path d="M 100 65 L 320 65 L 415 160 L 415 400 L 100 400 Z" className="lf-back-card" />

        <g transform="translate(114, 80)" className="lf-icon-stroke" style={{ strokeWidth: '1.6' }}>
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
        </g>

        {/* ================= CAPA AUDIO ================= */}
        <g className={`animate-layer ${showAudio ? 'layer-visible' : 'layer-hidden'}`}>
          <g strokeWidth="9" className="lf-icon-stroke">
            <path d="M 195 240 A 53 53 0 0 1 305 240" />
            <line x1="195" y1="240" x2="195" y2="250" strokeWidth="7" />
            <line x1="305" y1="240" x2="305" y2="250" strokeWidth="7" />
          </g>
          <rect x="185" y="248" width="18" height="48" rx="5" className="lf-icon-fill" />
          <rect x="297" y="248" width="18" height="48" rx="5" className="lf-icon-fill" />

          <g strokeWidth="3.5" className="lf-icon-stroke">
            <line x1="194" y1="330" x2="194" y2="334" />
            <line x1="202" y1="326" x2="202" y2="338" />
            <line x1="210" y1="320" x2="210" y2="344" />
            <line x1="218" y1="325" x2="218" y2="339" />
            <line x1="226" y1="312" x2="226" y2="352" />
            <line x1="234" y1="322" x2="234" y2="342" />
            <line x1="242" y1="305" x2="242" y2="359" />
            <line x1="250" y1="324" x2="250" y2="340" /> 
            <line x1="258" y1="305" x2="258" y2="359" />
            <line x1="266" y1="322" x2="266" y2="342" />
            <line x1="274" y1="312" x2="274" y2="352" />
            <line x1="282" y1="325" x2="282" y2="339" />
            <line x1="290" y1="320" x2="290" y2="344" />
            <line x1="298" y1="326" x2="298" y2="338" />
            <line x1="306" y1="330" x2="306" y2="334" />
          </g>
        </g>

        {/* CAPA VIDEO */}
        <g className={`animate-layer ${!showAudio ? 'layer-visible' : 'layer-hidden'}`}>
          <g className="lf-icon-stroke" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="180" y="190" width="140" height="140" rx="18" fill="none" />
            
            <line x1="180" y1="234" x2="320" y2="234" />
            
            <line x1="215" y1="190" x2="240" y2="234" strokeWidth="7" />
            <line x1="260" y1="190" x2="285" y2="234" strokeWidth="7" />
            
            <path d="M 228,257 L 274,282 L 228,307 Z" className="lf-icon-fill" strokeWidth="6" />
          </g>
        </g>

        <path d="M 40 345 L 130 345 L 160 375 L 420 375 L 455 410 L 455 550 L 420 585 L 75 585 L 40 550 Z"
          className="lf-front-flap" />

        <g strokeWidth="11" className="lf-icon-stroke">
          <line x1="247" y1="425" x2="247" y2="515" />
          <path d="M 207 475 L 247 515 L 287 475" />
        </g>

        <g className="lf-icon-fill">
          <rect x="375" y="542" width="13" height="13" rx="2" />
          <rect x="397" y="542" width="13" height="13" rx="2" />
          <rect x="419" y="542" width="13" height="13" rx="2" />
        </g>
      </svg>
    </div>
  );
}