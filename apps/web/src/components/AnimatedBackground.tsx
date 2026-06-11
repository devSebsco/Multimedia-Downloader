export default function AnimatedBackground() {
  const symbols = ['♩','♪','♫','♬','𝄞','▶','📽','⬇','♩','♪','♫','▶','📽','♬','𝄞','♩','♪','♫','♬','▶','📽','⬇','𝄞','♩','♪','♫','♬','▶','📽','♩','♪','♫','♬','𝄞','▶','📽','⬇','♩','♪','♫','♬','𝄞','▶','📽','⬇'];

  const items = symbols.map((sym, i) => ({
    symbol: sym,
    left: `${(i * 8.2 + 1.5) % 98}%`,
    size: `${0.8 + (i % 5) * 0.35}rem`,
    duration: `${10 + (i % 8) * 2}s`,
    delay: `${-(i * 1.3) % 18}s`,
    mobileHide: i >= 12,
  }));

  return (
    <div style={{
      position: 'fixed', inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
    }} aria-hidden="true">
      {items.map((item, i) => (
        <span
          key={i}
          className={`bg-symbol${item.mobileHide ? ' hide-mobile' : ''}`}
          style={{
            left: item.left,
            top: '-10vh',
            fontSize: item.size,
            animationDuration: item.duration,
            animationDelay: item.delay,
          }}
        >
          {item.symbol}
        </span>
      ))}

      <style>{`
        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
