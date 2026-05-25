import { ToolBtn } from "../shared/ToolBtn";
import { base } from "../../styles/index.js";

export function GamePhase({ suspects, active, onSetActive, placedIds, victimPlaced, btnSz }) {
  return (
    <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 8 }}>

      {/* Discard + Victim */}
      <div style={{ display: "flex", gap: 2 }}>
        <button
          style={{
            flex: 1, height: btnSz,
            border: "2px solid #c0392b",
            background: active === "__discard__" ? "#c0392b" : "#fdecea",
            color:      active === "__discard__" ? "#fff"    : "#c0392b",
            fontFamily: "monospace", fontWeight: "bold",
            fontSize: Math.max(10, Math.floor(btnSz * 0.28)),
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            letterSpacing: "0.08em",
          }}
          onClick={() => onSetActive("__discard__")}
        >
          X <span style={{ fontSize: Math.max(8, Math.floor(btnSz * 0.2)), opacity: 0.8 }}>DISCARD</span>
        </button>
        <ToolBtn
          id="__victim__"
          active={active}
          disabled={victimPlaced && active !== "__victim__"}
          size={btnSz}
          bg="#2d6a2d"
          border="#2d6a2d"
          color="#fff"
          onClick={onSetActive}
        >
          V
        </ToolBtn>
      </div>

      {/* Suspects */}
      <div>
        <div style={base.toolLabel}>
          SUSPECTS <span style={base.toolHint}>(long press to place)</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {suspects.map((id) => (
            <ToolBtn
              key={id}
              id={id}
              active={active}
              disabled={placedIds.has(id) && active !== id}
              size={btnSz}
              onClick={onSetActive}
            >
              {id}
            </ToolBtn>
          ))}
        </div>
      </div>

      {/* Erase */}
      <button
        style={{
          ...base.fullBtn,
          background: active === "__erase__" ? "#111" : "#f5f5f0",
          color:      active === "__erase__" ? "#f5f5f0" : "#111",
          border: "2px solid #111",
        }}
        onClick={() => onSetActive("__erase__")}
      >
        x ERASE <span style={{ fontSize: 9, opacity: 0.6 }}>(long press)</span>
      </button>

    </div>
  );
}
