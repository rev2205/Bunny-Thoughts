/**
 * Original SVG bunny illustration for the site header.
 * Completely original — not based on any copyrighted character.
 */
export default function BunnyIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 125"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Bunny Thoughts mascot"
    >
      {/* Left ear */}
      <ellipse cx="32" cy="34" rx="11" ry="26" fill="#f0f0f0" stroke="#d4bfbf" strokeWidth="1.5" />
      <ellipse cx="32" cy="36" rx="5.5" ry="19" fill="#f9c8d0" />

      {/* Right ear */}
      <ellipse cx="68" cy="34" rx="11" ry="26" fill="#f0f0f0" stroke="#d4bfbf" strokeWidth="1.5" />
      <ellipse cx="68" cy="36" rx="5.5" ry="19" fill="#f9c8d0" />

      {/* Head */}
      <ellipse cx="50" cy="86" rx="34" ry="30" fill="#f8f8f8" stroke="#d4bfbf" strokeWidth="1.5" />

      {/* Eyes */}
      <circle cx="39" cy="78" r="5" fill="#2d2d4e" />
      <circle cx="61" cy="78" r="5" fill="#2d2d4e" />

      {/* Eye shine */}
      <circle cx="41" cy="76" r="2" fill="#fff" />
      <circle cx="63" cy="76" r="2" fill="#fff" />

      {/* Nose */}
      <ellipse cx="50" cy="89" rx="4" ry="3" fill="#f9a8b0" />

      {/* Mouth */}
      <path d="M46 92 Q50 95 54 92" stroke="#d4bfbf" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Whiskers left */}
      <line x1="18" y1="87" x2="43" y2="89" stroke="#ccc" strokeWidth="0.8" />
      <line x1="18" y1="91" x2="43" y2="91" stroke="#ccc" strokeWidth="0.8" />

      {/* Whiskers right */}
      <line x1="57" y1="89" x2="82" y2="87" stroke="#ccc" strokeWidth="0.8" />
      <line x1="57" y1="91" x2="82" y2="91" stroke="#ccc" strokeWidth="0.8" />

      {/* Cheeks */}
      <ellipse cx="29" cy="93" rx="8" ry="4" fill="#ffccd5" opacity="0.45" />
      <ellipse cx="71" cy="93" rx="8" ry="4" fill="#ffccd5" opacity="0.45" />
    </svg>
  );
}
