import { useRef } from "react";
import { Cell } from "./Cell";
import { getRoomBorderStyle } from "../../utils/rooms";

export function Grid({ rows, cols, cells, rooms, roomMode, dragCells, gridRef, cellSzRef, onPressStart, onPressEnd, onMouseDown, onMouseMove, onMouseUp, onMouseLeave }) {
  const maxW   = Math.min(window.innerWidth - 32, 560);
  const cellSz = Math.max(28, Math.floor((maxW - cols - 3) / cols));
  if (cellSzRef) cellSzRef.current = cellSz;

  const fontSz  = Math.max(8,  Math.floor(cellSz * 0.30));
  const emojiSz = Math.max(12, Math.floor(cellSz * 0.50));

  return (
    <div
      style={{ overflowX: "auto", width: "100%", display: "flex", justifyContent: "center" }}
      onMouseLeave={onMouseLeave}
    >
      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${cellSz}px)`,
          gridTemplateRows:    `repeat(${rows}, ${cellSz}px)`,
          gap: 1,
          backgroundColor: "#999",
          border: "2px solid #111",
          padding: 1,
          cursor: roomMode ? "crosshair" : "pointer",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
        onMouseDown={roomMode ? onMouseDown : undefined}
        onMouseMove={roomMode ? onMouseMove : undefined}
        onMouseUp={roomMode   ? onMouseUp   : undefined}
      >
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => {
            const value       = cells[`${r}-${c}`];
            const borderStyle = getRoomBorderStyle(r, c, rooms, dragCells, roomMode);
            return (
              <Cell
                key={`${r}-${c}`}
                value={value}
                cellSize={cellSz}
                fontSz={fontSz}
                emojiSz={emojiSz}
                borderStyle={borderStyle}
                onPressStart={!roomMode ? () => onPressStart(r, c) : () => {}}
                onPressEnd={!roomMode ? onPressEnd : () => {}}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
