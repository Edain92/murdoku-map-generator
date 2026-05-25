import { COLOR, FONT } from "../../styles/tokens.js";

export function ToolBtn({ id, active, disabled, children, bg, color, border, size, onClick }) {
  const isActive = active === id;
  return (
    <button
      style={{
        width: size, height: size,
        border: `2px solid ${border || COLOR.inkBlack}`,
        background: isActive ? (bg || COLOR.inkBlack) : COLOR.paperWhite,
        color:      isActive ? (color || COLOR.paperWhite) : COLOR.inkBlack,
        fontFamily: FONT.mono,
        fontWeight: "bold",
        fontSize: Math.max(9, Math.floor(size * 0.28)),
        cursor: disabled ? "not-allowed" : "pointer",
        flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: disabled ? 0.25 : 1,
        textDecoration: disabled ? "line-through" : "none",
        transition: "background 0.1s, color 0.1s",
      }}
      onClick={() => !disabled && onClick?.(id)}
    >{children}</button>
  );
}
