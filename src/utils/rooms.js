/**
 * For each cell in a room (Set of "r-c" strings), computes which of its
 * 4 sides are on the exterior boundary of the room.
 */
export function getRoomBorders(cellSet) {
  const borders = {};
  for (const key of cellSet) {
    const [r, c] = key.split("-").map(Number);
    borders[key] = {
      top:    !cellSet.has(`${r - 1}-${c}`),
      right:  !cellSet.has(`${r}-${c + 1}`),
      bottom: !cellSet.has(`${r + 1}-${c}`),
      left:   !cellSet.has(`${r}-${c - 1}`),
    };
  }
  return borders;
}

/**
 * Returns the border CSS style object for a room cell.
 * Width W applied only to exterior sides; transparent on interior ones.
 */
export function getRoomBorderStyle(r, c, rooms, dragCells, roomMode, W = 3) {
  const key      = `${r}-${c}`;
  const isDrag   = roomMode && dragCells.has(key);
  const room     = rooms.find((rm) => rm.cells.has(key));
  const color    = isDrag ? "#666" : room?.color;

  if (!color) return {};

  const borders = isDrag
    ? {
        top:    !dragCells.has(`${r - 1}-${c}`),
        right:  !dragCells.has(`${r}-${c + 1}`),
        bottom: !dragCells.has(`${r + 1}-${c}`),
        left:   !dragCells.has(`${r}-${c - 1}`),
      }
    : room?.borders[key];

  if (!borders) return {};

  return {
    borderTop:    borders.top    ? `${W}px solid ${color}` : `${W}px solid transparent`,
    borderRight:  borders.right  ? `${W}px solid ${color}` : `${W}px solid transparent`,
    borderBottom: borders.bottom ? `${W}px solid ${color}` : `${W}px solid transparent`,
    borderLeft:   borders.left   ? `${W}px solid ${color}` : `${W}px solid transparent`,
    boxSizing: "border-box",
  };
}
