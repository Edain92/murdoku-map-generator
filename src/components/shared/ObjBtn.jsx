import { isOccupable } from "../../constants/obstacles";

export function ObjBtn({ obstacle, active, disabled, size, emojiSize, onClick }) {
  const isActive = active === obstacle.id;
  const isOcc    = isOccupable(obstacle.id);

  return (
    <button
      title={obstacle.label}
      style={{
        flex: 1,
        height: size,
        border: isActive ? "2px solid #111" : "2px solid #ccc",
        background: isActive
          ? (isOcc ? obstacle.color : "#333")
          : (isOcc ? obstacle.color + "88" : "#f5f5f0"),
        fontSize: Math.max(14, emojiSize * 0.75),
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        outline: isActive ? "2px solid #111" : "none",
        outlineOffset: -4,
        opacity: disabled ? 0.4 : 1,
      }}
      onClick={() => !disabled && onClick && onClick(obstacle.id)}
    >
      {obstacle.emoji}
    </button>
  );
}
