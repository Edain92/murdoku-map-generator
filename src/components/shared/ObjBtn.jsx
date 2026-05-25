import { isOccupable } from "../../constants/obstacles.js";
import { COLOR, BORDER } from "../../styles/tokens.js";

export function ObjBtn({ obstacle, active, disabled, size, emojiSize, onClick }) {
  const isActive = active === obstacle.id;
  const isOcc    = isOccupable(obstacle.id);

  return (
    <button
      title={obstacle.label}
      style={{
        flex: 1, height: size,
        border: isActive ? `2px solid ${COLOR.inkBlack}` : `2px solid #C8C7C4`,
        background: isActive
          ? (isOcc ? obstacle.color : COLOR.inkBlack)
          : (isOcc ? obstacle.color + "99" : COLOR.paperWhite),
        fontSize: Math.max(14, emojiSize * 0.75),
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        outline: isActive ? `2px solid ${COLOR.inkBlack}` : "none",
        outlineOffset: -4,
        opacity: disabled ? 0.4 : 1,
        transition: "border 0.1s",
      }}
      onClick={() => !disabled && onClick?.(obstacle.id)}
    >{obstacle.emoji}</button>
  );
}
