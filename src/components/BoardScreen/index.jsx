import { useState, useRef } from "react";
import { Grid }      from "./Grid";
import { PrepPhase } from "./PrepPhase";
import { GamePhase } from "./GamePhase";
import { SaveModal } from "../SaveModal";
import { useCells }    from "../../hooks/useCells";
import { useRoomDraw } from "../../hooks/useRoomDraw";
import { isBlocker, isOccupable, ALL_OBSTACLES } from "../../constants/obstacles";
import { base } from "../../styles/index.js";

export function BoardScreen({ rows, cols, suspects, numRooms, range, initialRoomLayout, initialCellState, onBack, onSaveConfig }) {
  const [active,        setActive]        = useState(suspects[0]);
  const [prepCollapsed, setPrepCollapsed] = useState(false);
  const [showSave,      setShowSave]      = useState(false);

  const timerRef = useRef(null);

  const isErasing = active === "__erase__";
  const isVictim  = active === "__victim__";
  const isDiscard = active === "__discard__";
  const isObstacle = (a) => ALL_OBSTACLES.some((o) => o.id === a);

  // Hooks
  const {
    cells, reset: resetCells,
    placeObstacle, placeSuspect, placeDiscard, erase,
    placedIds, victimPlaced,
  } = useCells(rows, cols, initialCellState);

  const {
    rooms, roomMode, dragCells,
    gridRef, cellSzRef,
    roomsLeft, startDrag, moveDrag, endDrag,
    undoLastRoom, resetRooms, toggleRoomMode, exitRoomMode,
  } = useRoomDraw(rows, cols, numRooms, initialRoomLayout);

  // Sizing
  const maxW   = Math.min(window.innerWidth - 32, 560);
  const cellSz = Math.max(28, Math.floor((maxW - cols - 3) / cols));
  const btnSz  = Math.max(32, cellSz);
  const emojiSz = Math.max(12, Math.floor(cellSz * 0.50));

  // Press handlers (long press = 450ms)
  const onPressStart = (r, c) => {
    if (roomMode) return;
    if (isObstacle(active)) {
      placeObstacle(r, c, active);
      return;
    }
    timerRef.current = setTimeout(() => {
      if (isErasing)      erase(r, c);
      else if (isDiscard) placeDiscard(r, c);
      else                placeSuspect(r, c, active, isVictim);
    }, 450);
  };
  const onPressEnd = () => clearTimeout(timerRef.current);

  const handleReset = () => { resetCells(); resetRooms(); };

  const handleSave = (name) => {
    onSaveConfig(name, range, rows, cols, numRooms, cells, rooms);
    setShowSave(false);
  };

  // Room legend
  const roomLegend = rooms.length > 0 && (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, width: "100%", maxWidth: 560 }}>
      {rooms.map((rm, i) => (
        <div key={rm.id} style={{ padding: "4px 12px", color: "#fff", fontSize: 10, fontFamily: "monospace", fontWeight: "bold", background: rm.color }}>
          Room {i + 1}
        </div>
      ))}
    </div>
  );

  // Hint
  const hint = (() => {
    if (roomMode)    return "Drag over cells to define the room — release to confirm";
    if (isErasing)   return "Long press to erase";
    if (isDiscard)   return "Long press to discard the cell";
    if (isObstacle(active)) return `Click to place ${ALL_OBSTACLES.find(o => o.id === active)?.label}`;
    if (isVictim)    return "Long press to place the victim";
    return `Long press — placing ${active}`;
  })();

  return (
    <div style={base.screen}>
      <header style={base.header}>
        <div style={base.logo}>MURDOKU</div>
        <div style={base.subtitle}>{rows}x{cols} · {suspects.length} SUSPECTS · {numRooms} ROOMS</div>
      </header>

      <PrepPhase
        collapsed={prepCollapsed}
        onToggle={() => { setPrepCollapsed((v) => !v); if (roomMode) exitRoomMode(); }}
        rooms={rooms}
        roomMode={roomMode}
        roomsLeft={roomsLeft}
        numRooms={numRooms}
        onToggleRoomMode={toggleRoomMode}
        onUndoRoom={undoLastRoom}
        active={active}
        onSetActive={setActive}
        btnSz={btnSz}
        emojiSz={emojiSz}
        onSave={() => setShowSave(true)}
        onReset={handleReset}
        onDone={() => { exitRoomMode(); setPrepCollapsed(true); setActive(suspects[0]); }}
      />

      <GamePhase
        suspects={suspects}
        active={active}
        onSetActive={setActive}
        placedIds={placedIds}
        victimPlaced={victimPlaced}
        btnSz={btnSz}
      />

      <div style={{ fontSize: 11, color: "#aaa", minHeight: 16, width: "100%", maxWidth: 560 }}>
        {hint}
      </div>

      <Grid
        rows={rows} cols={cols}
        cells={cells}
        rooms={rooms} roomMode={roomMode} dragCells={dragCells}
        gridRef={gridRef} cellSzRef={cellSzRef}
        onPressStart={onPressStart}
        onPressEnd={onPressEnd}
        onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
        onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
        onMouseUp={endDrag}
        onMouseLeave={() => { if (roomMode) endDrag(); }}
      />

      {roomLegend}

      <button style={base.backLink} onClick={onBack}>New game</button>

      {showSave && <SaveModal onSave={handleSave} onCancel={() => setShowSave(false)} />}
    </div>
  );
}
