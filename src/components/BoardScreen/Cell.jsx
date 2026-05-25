import { getObstacle } from "../../constants/obstacles";

export function Cell({ value, cellSize, fontSz, emojiSz, borderStyle, onPressStart, onPressEnd }) {
  const bg = getCellBg(value);
  const outline = getCellOutline(value);

  return (
    <div
      style={{
        width: cellSize,
        height: cellSize,
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        WebkitTouchCallout: "none",
        ...(outline ? { outline, outlineOffset: -3 } : {}),
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
  if (!v) return "#f5f5f0";
  if (v.type === "suspect")     return "#ffffff";
  if (v.type === "victim")      return "#2d6a2d";
  if (v.type === "cross")       return "#e8e8e4";
  if (v.type === "blocker")     return "#d8d3c8";
  if (v.type === "discard")     return v.under ? (getObstacle(v.under)?.color || "#f5f5f0") : "#fdecea";
  if (v.type === "occupable")   return getObstacle(v.obj)?.color || "#f5f5f0";
  if (v.type === "suspect+occ") return getObstacle(v.obj)?.color || "#f5f5f0";
  if (v.type === "victim+occ")  return "#2d6a2d";
  return "#f5f5f0";
}

function getCellOutline(v) {
  if (v?.type === "suspect" || v?.type === "suspect+occ") return "2px solid #111";
  if (v?.type === "victim"  || v?.type === "victim+occ")  return "2px solid #1a4a1a";
  return null;
}

function getCellContent(v, fontSz, emojiSz) {
  if (!v) return null;
  if (v.type === "suspect" || v.type === "suspect+occ")
    return <span style={{ fontWeight: "bold", fontSize: fontSz, fontFamily: "monospace", color: "#111" }}>{v.id}</span>;
  if (v.type === "victim" || v.type === "victim+occ")
    return <span style={{ fontWeight: "bold", fontSize: fontSz, fontFamily: "monospace", color: "#fff" }}>V</span>;
  if (v.type === "cross")
    return <span style={{ fontSize: fontSz * 1.3, color: "#bbb" }}>x</span>;
  if (v.type === "discard")
    return <span style={{ fontSize: fontSz * 1.3, color: "#c0392b", fontWeight: "bold" }}>x</span>;
  if (v.type === "blocker")
    return <span style={{ fontSize: emojiSz, lineHeight: 1 }}>{getObstacle(v.obj)?.emoji}</span>;
  if (v.type === "occupable")
    return <span style={{ fontSize: emojiSz * 0.65, opacity: 0.45 }}>{getObstacle(v.obj)?.emoji}</span>;
  return null;
}
