// Nav.jsx — horizontal mono nav
const { useState: useNavState } = React;

// The nav sticks at top:16px inside a stage padded 24px, so it detaches at 8px
// of scroll. Past that it is floating over content instead of over the hero and
// needs to firm up. React.* rather than the destructured hooks in Chrome.jsx —
// the production build wraps each component in its own IIFE, so those aren't
// in scope here even though they are when Babel runs the sources directly.
function useStuck(threshold = 8) {
  const [stuck, setStuck] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return stuck;
}

// Views are hash routes, so every nav destination already has a URL. Rendering
// them as <a href> rather than <button onClick> costs nothing and hands back the
// things people expect a link to do: middle-click and cmd-click to a new tab,
// right-click to copy the address, the destination in the status bar on hover.
// The hash assignment a click used to make is what the browser does natively on
// following the href, and App's hashchange listener routes it either way.
function navHref(id) { return id === 'hero' ? '#/' : '#/' + id; }

function Nav({ view }) {
  const stuck = useStuck();
  // Whatever view is mounted publishes its $/% switch into Chrome.jsx's slot;
  // the nav hosts it so the control rides the scroll rather than sitting in a
  // panel head the reader has long since scrolled past. Null on views without
  // one. Unguarded because Chrome.jsx always loads first — a hook can't be
  // called conditionally anyway.
  const unit = window.useUnitSlot();
  const NavUnitToggle = window.UnitToggle;
  const items = [
    { id: 'hero', label: 'home' },
    { id: 'book', label: 'book' },
    { id: 'ibkr', label: 'ibkr' },
    { id: 'polymarket', label: 'polymarket' },
    { id: 'politics', label: 'politics' },
    { id: 'thoughts', label: 'thoughts' },
    { id: 'about', label: 'about' },
  ];
  return (
    <nav className={`sz-nav ${stuck ? 'sz-nav-stuck' : ''}`}>
      <a className="sz-brand" href={navHref('hero')}>
        <svg width="22" height="22" viewBox="0 0 64 64" fill="none" aria-hidden>
          <defs>
            <linearGradient id="ng" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#c4b5fd"/>
              <stop offset="0.5" stopColor="#a78bfa"/>
              <stop offset="1" stopColor="#ff4fd8"/>
            </linearGradient>
            <clipPath id="nav-moon">
              <circle cx="32" cy="32" r="24"/>
            </clipPath>
          </defs>
          <circle cx="32" cy="32" r="24" stroke="#a78bfa" strokeWidth="1.5" fill="none"/>
          <g clipPath="url(#nav-moon)" transform="rotate(-15 32 32)">
            <rect x="-8" y="-8" width="40" height="80" fill="url(#ng)"/>
          </g>
        </svg>
        <span>suzerain</span>
        <Cursor />
      </a>
      <div className="sz-nav-items">
        {items.slice(1).map((it) => (
          <a
            key={it.id}
            className={`sz-nav-item ${view === it.id ? 'active' : ''}`}
            href={navHref(it.id)}
            aria-current={view === it.id ? 'page' : undefined}
          >
            {view === it.id && <span className="sz-nav-arrow">→ </span>}
            {it.label}
          </a>
        ))}
      </div>
      {unit && NavUnitToggle && (
        <div className="sz-nav-unit">
          {unit.note && <span className="sz-nav-unit-note">{unit.note}</span>}
          <NavUnitToggle value={unit.value} onChange={unit.onChange}/>
        </div>
      )}
    </nav>
  );
}

window.Nav = Nav;
