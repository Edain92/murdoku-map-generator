export function ToolBtn({ id, active, disabled, children, bg, color, border, size, onClick }) {
  const isActive = active === id;
  return (
    <button
      style={{
        width:  size,
        height: size,
        border: `2px solid ${border || "#111"}`,
        background: isActive ? (bg || "#111") : "#f5f5f0",
        color:      isActive ? (color || "#f5f5f0") : "#111",
        fontFamily: "monospace",
        fontWeight: "bold",
        fontSize: Math.max(9, Math.floor(size * 0.28)),
        cursor: disabled ? "not-allowed" : "pointer",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.3 : 1,
        textDecoration: disabled ? "line-through" : "none",
      }}
      onClick={() => !disabled && onClick && onClick(id)}
    >
      {children}
    </button>
  );
}
