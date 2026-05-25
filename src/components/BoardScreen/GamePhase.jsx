import { ToolBtn } from "../shared/ToolBtn.jsx";
import { base, COLOR, BORDER, FONT } from "../../styles/index.js";

export function GamePhase({ suspects, active, onSetActive, placedIds, victimPlaced, btnSz }) {
  return (
    <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 8 }}>

      {/* Discard + Victim */}
      <div style={{ display: "flex", gap: 2 }}>
        <button
          style={{
            flex: 1, height: btnSz,
            border: `2px solid ${COLOR.bloodRed}`,
            background: active === "__discard__" ? COLOR.bloodRed : "#FBF0EF",
            color:      active === "__discard__" ? "#FFFFFF"      : COLOR.bloodRed,
            fontFamily: FONT.mono,
            fontWeight: "bold",
            fontSize: Math.max(10, Math.floor(btnSz * 0.28)),
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            letterSpacing: "0.1em",
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
          bg={COLOR.evidenceGreen}
          border={COLOR.evidenceGreen}
          color="#FFFFFF"
          onClick={onSetActive}
        >V</ToolBtn>
      </div>

      {/* Suspects */}
      <div>
        <div style={base.toolLabel}>
          SUSPECTS <span style={base.toolHint}>(long press to place)</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {suspects.map((id) => (
            <ToolBtn
              key={id} id={id} active={active}
              disabled={placedIds.has(id) && active !== id}
              size={btnSz}
              onClick={onSetActive}
            >{id}</ToolBtn>
          ))}
        </div>
      </div>

      {/* Erase */}
      <button
        style={{
          ...base.fullBtn,
          background: active === "__erase__" ? COLOR.inkBlack : COLOR.paperWhite,
          color:      active === "__erase__" ? COLOR.paperWhite : COLOR.inkBlack,
          border: BORDER.mid,
        }}
        onClick={() => onSetActive("__erase__")}
      >
        × ERASE <span style={{ fontSize: 9, opacity: 0.5, marginLeft: 4 }}>(long press)</span>
      </button>

    </div>
  );
}
