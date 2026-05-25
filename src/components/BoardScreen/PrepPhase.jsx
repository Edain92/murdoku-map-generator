import { ALL_OBSTACLES } from "../../constants/obstacles.js";
import { ROOM_COLORS }   from "../../constants/rooms.js";
import { ObjBtn }        from "../shared/ObjBtn.jsx";
import { base, COLOR, BORDER } from "../../styles/index.js";

export function PrepPhase({
  collapsed, onToggle,
  rooms, roomMode, roomsLeft, numRooms,
  onToggleRoomMode, onUndoRoom,
  active, onSetActive,
  btnSz, emojiSz,
  onSave, onReset, onDone,
}) {
  return (
    <div style={{ width: "100%", maxWidth: 560 }}>

      {/* Collapsible header */}
      <button
        style={{
          width: "100%", padding: "10px 16px",
          border: BORDER.mid,
          background: collapsed ? COLOR.paperWhite : COLOR.inkBlack,
          color:      collapsed ? COLOR.inkBlack    : COLOR.paperWhite,
          fontFamily: "'Courier New', monospace",
          fontWeight: "bold",
          fontSize: 10, letterSpacing: "0.22em",
          cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
        onClick={onToggle}
      >
        <span>MAP SETUP</span>
        <span style={{ fontSize: 13 }}>{collapsed ? "▾" : "▴"}</span>
      </button>

      {!collapsed && (
        <div style={{ border: BORDER.mid, borderTop: "none", padding: 10, display: "flex", flexDirection: "column", gap: 8, background: "#FAFAF8" }}>

          {/* Add room */}
          <button
            style={{
              ...base.fullBtn,
              background: roomMode ? ROOM_COLORS[rooms.length % ROOM_COLORS.length] : COLOR.paperWhite,
              color:      roomMode ? "#FFFFFF" : COLOR.inkBlack,
              border:     roomMode
                ? `2px solid ${ROOM_COLORS[rooms.length % ROOM_COLORS.length]}`
                : `2px solid ${COLOR.detectiveGray}`,
            }}
            onClick={onToggleRoomMode}
            disabled={roomsLeft <= 0}
          >
            {roomMode
              ? `Drawing room ${rooms.length + 1} of ${numRooms} — drag the cells`
              : roomsLeft > 0
                ? `+ ADD ROOM  (${roomsLeft} remaining)`
                : "✓ All rooms defined"
            }
          </button>

          {rooms.length > 0 && (
            <button
              style={{ ...base.fullBtn, border: `2px solid ${COLOR.detectiveGray}`, color: COLOR.detectiveGray, fontSize: 10 }}
              onClick={onUndoRoom}
            >
              ↩ Undo last room
            </button>
          )}

          {/* Obstacles */}
          <div>
            <div style={base.toolLabel}>
              OBSTACLES <span style={base.toolHint}>(click to place)</span>
            </div>
            <div style={{ display: "flex", gap: 2, width: "100%" }}>
              {ALL_OBSTACLES.map((o) => (
                <ObjBtn key={o.id} obstacle={o} active={active} size={btnSz} emojiSize={emojiSz} onClick={onSetActive} />
              ))}
            </div>
          </div>

          {/* Save + Reset */}
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ ...base.fullBtn, flex: 1 }} onClick={onSave}>
              SAVE CONFIG
            </button>
            <button
              style={{ height: btnSz, padding: "0 16px", border: BORDER.mid, background: COLOR.paperWhite, fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: "bold", cursor: "pointer", color: COLOR.inkBlack, whiteSpace: "nowrap" }}
              onClick={onReset}
            >
              RESET
            </button>
          </div>

          <button
            style={{ ...base.fullBtn, background: COLOR.inkBlack, color: COLOR.paperWhite, border: BORDER.mid }}
            onClick={onDone}
          >
            DONE — START PLAYING ▸
          </button>

        </div>
      )}
    </div>
  );
}
