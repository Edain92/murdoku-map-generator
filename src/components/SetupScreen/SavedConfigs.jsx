import { parseRange }        from "../../utils/suspects.js";
import { base, COLOR, FONT } from "../../styles/index.js";

export function SavedConfigs({ configs, onLoad, onPlay, onDelete }) {
  if (configs.length === 0) return null;
  return (
    <div style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 9, letterSpacing: "0.32em", color: COLOR.detectiveGray, textTransform: "uppercase", paddingTop: 10, borderTop: `1px solid #C8C7C4`, fontFamily: FONT.mono }}>
        Saved Configurations
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {configs.map((cfg) => {
          const susp = parseRange(cfg.range);
          return (
            <div key={cfg.id} style={{ border: `2px solid ${COLOR.inkBlack}`, backgroundColor: "#FFFFFF", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: "bold", color: COLOR.inkBlack, fontFamily: FONT.mono }}>{cfg.name}</span>
                <button style={{ width: 26, height: 26, border: `1px solid #C8C7C4`, background: "none", cursor: "pointer", color: COLOR.detectiveGray, fontSize: 13, fontFamily: FONT.mono, display: "flex", alignItems: "center", justifyContent: "center" }}
                  onClick={() => onDelete(cfg.id)}>×</button>
              </div>
              <div style={{ fontSize: 10, color: COLOR.detectiveGray, letterSpacing: "0.12em", fontFamily: FONT.mono }}>
                {cfg.rows}×{cfg.cols} · {cfg.rooms} rooms
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {susp?.map((id) => <span key={id} style={base.chip}>{id}</span>)}
                <span style={{ ...base.chip, background: COLOR.evidenceGreen }}>V</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ flex: 1, padding: "8px 0", border: `2px solid ${COLOR.inkBlack}`, background: COLOR.paperWhite, fontFamily: FONT.mono, fontSize: 10, fontWeight: "bold", letterSpacing: "0.15em", cursor: "pointer", color: COLOR.inkBlack }}
                  onClick={() => onLoad(cfg)}>LOAD</button>
                <button style={{ flex: 1, padding: "8px 0", border: "none", background: COLOR.inkBlack, fontFamily: FONT.mono, fontSize: 10, fontWeight: "bold", letterSpacing: "0.15em", cursor: "pointer", color: COLOR.paperWhite }}
                  onClick={() => susp && onPlay(cfg, susp)}>PLAY</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
