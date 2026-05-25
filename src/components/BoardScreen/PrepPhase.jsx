import { BLOCKERS, OCCUPABLES, ALL_OBSTACLES } from "../../constants/obstacles";
import { ROOM_COLORS } from "../../constants/rooms";
import { ObjBtn } from "../shared/ObjBtn";
import { base } from "../../styles/index.js";

export function PrepPhase({
  collapsed, onToggle,
  rooms, roomMode, roomsLeft, numRooms,
  onToggleRoomMode, onUndoRoom,
  active, onSetActive,
  btnSz, emojiSz,
  onSave, onReset,
  onDone,
}) {
  return (
    <div style={{ width: "100%", maxWidth: 560 }}>

      {/* Collapsible header */}
      <button
        style={{
          width: "100%", padding: "10px 14px",
          border: "2px solid #111",
          background: collapsed ? "#f5f5f0" : "#111",
          color:      collapsed ? "#111"     : "#f5f5f0",
          fontFamily: "monospace", fontWeight: "bold",
          fontSize: 11, letterSpacing: "0.18em",
          cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
        onClick={onToggle}
      >
        <span>MAP SETUP</span>
        <span style={{ fontSize: 14 }}>{collapsed ? "▾" : "▴"}</span>
      </button>

      {/* Expandable content */}
      {!collapsed && (
        <div style={{ border: "2px solid #111", borderTop: "none", padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>

          {/* Add room button */}
          <button
            style={{
              ...base.fullBtn,
              background: roomMode ? ROOM_COLORS[rooms.length % ROOM_COLORS.length] : "#f5f5f0",
              color:      roomMode ? "#fff" : "#111",
              border:     roomMode
                ? `2px solid ${ROOM_COLORS[rooms.length % ROOM_COLORS.length]}`
                : "2px solid #888",
            }}
            onClick={onToggleRoomMode}
            disabled={roomsLeft <= 0}
          >
            {roomMode
              ? `Drawing room ${rooms.length + 1} of ${numRooms} — drag the cells`
              : roomsLeft > 0
                ? `+ ADD ROOM (${roomsLeft} remaining)`
                : "✓ All rooms defined"
            }
          </button>

          {rooms.length > 0 && (
            <button
              style={{ ...base.fullBtn, border: "2px solid #ccc", color: "#888", fontSize: 10 }}
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
                <ObjBtn
                  key={o.id}
                  obstacle={o}
                  active={active}
                  size={btnSz}
                  emojiSize={emojiSz}
                  onClick={onSetActive}
                />
              ))}
            </div>
          </div>

          {/* Save + Reset */}
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ ...base.fullBtn, flex: 1 }} onClick={onSave}>
              SAVE CONFIG
            </button>
            <button
              style={{ height: btnSz, padding: "0 16px", border: "2px solid #111", background: "#f5f5f0", fontFamily: "monospace", fontSize: 10, fontWeight: "bold", cursor: "pointer", color: "#111", whiteSpace: "nowrap" }}
              onClick={onReset}
            >
              RESET
            </button>
          </div>

          {/* Done button */}
          <button
            style={{ ...base.fullBtn, background: "#111", color: "#f5f5f0", border: "2px solid #111" }}
            onClick={onDone}
          >
            DONE — START PLAYING ▸
          </button>

        </div>
      )}
    </div>
  );
}
