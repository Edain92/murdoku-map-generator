import { getObstacle } from "../../constants/obstacles.js";
import { COLOR } from "../../styles/index.js";

export function Cell({ value, cellSize, fontSz, emojiSz, borderStyle, onPressStart, onPressEnd }) {
  return (
    <div
      style={{
        width: cellSize, height: cellSize,
        backgroundColor: getCellBg(value),
        display: "flex", alignItems: "center", justifyContent: "center",
        WebkitTouchCallout: "none",
        ...(getCellOutline(value) ? { outline: getCellOutline(value), outlineOffset: -3 } : {}),
        ...borderStyle,
      }}
      onMouseDown={onPressStart}
      onMouseUp={onPressEnd}
      onMouseLeave={onPressEnd}
      onTouchStart={(e) => { e.preventDefault(); onPressStart(); }}
      onTouchEnd={onPressEnd}
    >
      {getCellContent(value, fontSz, emojiSz)}
    </div>
  );
}

function getCellBg(v) {
  if (!v) return COLOR.paperWhite;
  if (v.type === "suspect")     return "#FFFFFF";
  if (v.type === "victim")      return COLOR.evidenceGreen;
  if (v.type === "cross")       return "#E6E5E2";
  if (v.type === "blocker")     return "#D4D0C8";
  if (v.type === "discard")     return v.under ? (getObstacle(v.under)?.color || COLOR.paperWhite) : "#F9ECEB";
  if (v.type === "occupable")   return getObstacle(v.obj)?.color || COLOR.paperWhite;
  if (v.type === "suspect+occ") return getObstacle(v.obj)?.color || COLOR.paperWhite;
  if (v.type === "victim+occ")  return COLOR.evidenceGreen;
  return COLOR.paperWhite;
}

function getCellOutline(v) {
  if (v?.type === "suspect" || v?.type === "suspect+occ") return `2px solid ${COLOR.inkBlack}`;
  if (v?.type === "victim"  || v?.type === "victim+occ")  return `2px solid #2E5229`;
  return null;
}

function getCellContent(v, fontSz, emojiSz) {
  if (!v) return null;
  if (v.type === "suspect" || v.type === "suspect+occ")
    return <span style={{ fontWeight: "bold", fontSize: fontSz, fontFamily: "'Courier New', monospace", color: COLOR.inkBlack }}>{v.id}</span>;
  if (v.type === "victim" || v.type === "victim+occ")
    return <span style={{ fontWeight: "bold", fontSize: fontSz, fontFamily: "'Courier New', monospace", color: "#FFFFFF" }}>V</span>;
  if (v.type === "cross")
    return <span style={{ fontSize: fontSz * 1.2, color: "#AAAAА7", fontFamily: "monospace" }}>×</span>;
  if (v.type === "discard")
    return <span style={{ fontSize: fontSz * 1.2, color: COLOR.bloodRed, fontWeight: "bold", fontFamily: "monospace" }}>×</span>;
  if (v.type === "blocker")
    return <span style={{ fontSize: emojiSz, lineHeight: 1 }}>{getObstacle(v.obj)?.emoji}</span>;
  if (v.type === "occupable")
    return <span style={{ fontSize: emojiSz * 0.65, opacity: 0.5 }}>{getObstacle(v.obj)?.emoji}</span>;
  return null;
}
