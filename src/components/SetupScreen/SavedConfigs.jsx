import { parseRange } from "../../utils/suspects";
import { base } from "../../styles/index.js";

export function SavedConfigs({ configs, onLoad, onPlay, onDelete }) {
  if (configs.length === 0) return null;

  return (
    <div style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "#aaa", textTransform: "uppercase", paddingTop: 8, borderTop: "1px solid #ddd" }}>
        SAVED CONFIGURATIONS
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {configs.map((cfg) => {
          const susp = parseRange(cfg.range);
          return (
            <div key={cfg.id} style={{ border: "2px solid #111", backgroundColor: "#fff", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: "bold", color: "#111" }}>{cfg.name}</span>
                <button
                  style={{ width: 28, height: 28, border: "1px solid #ccc", background: "none", cursor: "pointer", color: "#aaa", fontSize: 13, fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "center" }}
                  onClick={() => onDelete(cfg.id)}
                >x</button>
              </div>
              <div style={{ fontSize: 10, color: "#888", letterSpacing: "0.1em" }}>
                {cfg.rows}x{cfg.cols} · {cfg.rooms} rooms
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {susp?.map((id) => <span key={id} style={base.chip}>{id}</span>)}
                <span style={{ ...base.chip, background: "#2d6a2d" }}>V</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  style={{ flex: 1, padding: "8px 0", border: "2px solid #111", background: "#f5f5f0", fontFamily: "monospace", fontSize: 10, fontWeight: "bold", letterSpacing: "0.15em", cursor: "pointer", color: "#111" }}
                  onClick={() => onLoad(cfg)}
                >
                  LOAD
                </button>
                <button
                  style={{ flex: 1, padding: "8px 0", border: "none", background: "#111", fontFamily: "monospace", fontSize: 10, fontWeight: "bold", letterSpacing: "0.15em", cursor: "pointer", color: "#f5f5f0" }}
                  onClick={() => susp && onPlay(cfg, susp)}
                >
                  PLAY
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
