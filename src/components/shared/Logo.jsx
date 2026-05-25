import { COLOR, FONT } from "../../styles/tokens.js";

/**
 * Murdoku Studio logo.
 * The "O" in MURDOKU is rendered as a magnifier lens with a mini grid inside.
 * The rest of the wordmark uses Playfair Display (serif noir).
 */
export function Logo({ subtitle }) {
  const INK   = COLOR.inkBlack;
  const RED   = COLOR.bloodRed;
  const SERIF = "'Playfair Display', Georgia, serif";
  const MONO  = FONT.mono;

  return (
    <div style={{ textAlign: "center", userSelect: "none" }}>
      <svg
        viewBox="0 0 320 64"
        width="320"
        height="64"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Murdoku Studio"
        style={{ display: "block", margin: "0 auto" }}
      >
        {/* ── MURD ── */}
        <text
          x="0" y="52"
          fontFamily={SERIF}
          fontWeight="900"
          fontSize="52"
          fill={INK}
          letterSpacing="1"
        >
          MURD
        </text>

        {/* ── O as magnifier lens ── */}
        {/* Outer lens ring */}
        <circle cx="163" cy="30" r="22" fill="#FFFFFF" stroke={INK} strokeWidth="4" />

        {/* Inner mini grid (3×3) — the deduction grid inside the lens */}
        {[0,1,2].map(row =>
          [0,1,2].map(col => (
            <rect
              key={`${row}-${col}`}
              x={152 + col * 7.5}
              y={19  + row * 7.5}
              width="7" height="7"
              fill="none"
              stroke={INK}
              strokeWidth="0.8"
              opacity="0.35"
            />
          ))
        )}

        {/* Red X in center cell of grid */}
        <text
          x="163" y="35"
          textAnchor="middle"
          fontFamily={MONO}
          fontWeight="bold"
          fontSize="10"
          fill={RED}
          opacity="0.9"
        >x</text>

        {/* Magnifier handle */}
        <line
          x1="180" y1="46"
          x2="192" y2="58"
          stroke={INK}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* ── KU ── */}
        <text
          x="200" y="52"
          fontFamily={SERIF}
          fontWeight="900"
          fontSize="52"
          fill={INK}
          letterSpacing="1"
        >
          KU
        </text>
      </svg>

      {/* STUDIO wordmark below */}
      <div style={{
        fontFamily: MONO,
        fontSize: 10,
        letterSpacing: "0.55em",
        color: COLOR.detectiveGray,
        marginTop: 4,
        textTransform: "uppercase",
        paddingLeft: "0.55em", // optical center for letter-spacing
      }}>
        STUDIO
      </div>

      {subtitle && (
        <div style={{
          fontFamily: MONO,
          fontSize: 9,
          letterSpacing: "0.28em",
          color: COLOR.detectiveGray,
          marginTop: 8,
          textTransform: "uppercase",
          opacity: 0.7,
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
