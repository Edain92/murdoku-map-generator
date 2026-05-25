import { useState } from "react";
import { isBlocker, isOccupable, getObstacle, ALL_OBSTACLES } from "../constants/obstacles";

function buildEmpty(rows, cols) {
  const m = {};
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      m[`${r}-${c}`] = null;
  return m;
}

export function useCells(rows, cols, initialCellState) {
  const initial = () => {
    if (initialCellState && Object.keys(initialCellState).length > 0) {
      return { ...buildEmpty(rows, cols), ...initialCellState };
    }
    return buildEmpty(rows, cols);
  };

  const [cells, setCells] = useState(initial);

  const reset = () => setCells(buildEmpty(rows, cols));

  // ── obstacle placement (single click) ──────────────────────────────────────

  const placeObstacle = (r, c, obstacleId) => {
    const key = `${r}-${c}`;
    const cur = cells[key];

    if (isBlocker(obstacleId)) {
      if (["suspect", "victim", "suspect+occ", "victim+occ"].includes(cur?.type)) return;
      setCells((prev) => ({ ...prev, [key]: { type: "blocker", obj: obstacleId } }));
      return;
    }

    if (isOccupable(obstacleId)) {
      if (cur?.type === "blocker") return;
      if (cur?.type === "suspect")
        setCells((prev) => ({ ...prev, [key]: { type: "suspect+occ", id: cur.id, obj: obstacleId } }));
      else if (cur?.type === "victim")
        setCells((prev) => ({ ...prev, [key]: { type: "victim+occ", obj: obstacleId } }));
      else
        setCells((prev) => ({ ...prev, [key]: { type: "occupable", obj: obstacleId } }));
    }
  };

  // ── suspect / victim placement (long press) ────────────────────────────────

  const placeSuspect = (r, c, suspectId, isVictim) => {
    const key = `${r}-${c}`;
    const cur = cells[key];

    if (cur?.type === "blocker") return;
    if (["suspect", "victim", "suspect+occ", "victim+occ"].includes(cur?.type)) return;
    if (cur?.type === "cross") return;

    const placedId = isVictim ? "V" : suspectId;

    // Prevent duplicates
    const alreadyPlaced = Object.values(cells).some(
      (v) =>
        (v?.type === "suspect"     && v.id === placedId) ||
        (v?.type === "suspect+occ" && v.id === placedId) ||
        (v?.type === "victim"      && placedId === "V")  ||
        (v?.type === "victim+occ"  && placedId === "V")
    );
    if (alreadyPlaced) return;

    const isOnOcc = cur?.type === "occupable";

    setCells((prev) => {
      const next = { ...prev };
      next[key] = isVictim
        ? isOnOcc ? { type: "victim+occ",  obj: cur.obj } : { type: "victim" }
        : isOnOcc ? { type: "suspect+occ", id: placedId, obj: cur.obj } : { type: "suspect", id: placedId };

      // Cross out row
      for (let cc = 0; cc < cols; cc++) {
        const k = `${r}-${cc}`;
        if (cc !== c && (!next[k] || next[k]?.type === "occupable"))
          next[k] = next[k]?.type === "occupable"
            ? { type: "cross", by: placedId, under: next[k].obj }
            : { type: "cross", by: placedId };
      }
      // Cross out column
      for (let rr = 0; rr < rows; rr++) {
        const k = `${rr}-${c}`;
        if (rr !== r && (!next[k] || next[k]?.type === "occupable"))
          next[k] = next[k]?.type === "occupable"
            ? { type: "cross", by: placedId, under: next[k].obj }
            : { type: "cross", by: placedId };
      }
      return next;
    });
  };

  // ── discard (long press in discard mode) ──────────────────────────────────

  const placeDiscard = (r, c) => {
    const key = `${r}-${c}`;
    const cur = cells[key];
    if (["suspect", "victim", "suspect+occ", "victim+occ"].includes(cur?.type)) return;
    if (!cur || cur?.type === "cross") {
      setCells((prev) => ({ ...prev, [key]: { type: "discard" } }));
    } else if (cur?.type === "occupable") {
      setCells((prev) => ({ ...prev, [key]: { type: "discard", under: cur.obj } }));
    }
  };

  // ── erase (long press in erase mode) ─────────────────────────────────────

  const erase = (r, c) => {
    const key = `${r}-${c}`;
    const cur = cells[key];
    if (!cur) return;

    const removeCrosses = (id) => {
      setCells((prev) => {
        const next = { ...prev };
        next[key] = null;
        for (let cc = 0; cc < cols; cc++) {
          const k = `${r}-${cc}`;
          if (next[k]?.type === "cross" && next[k]?.by === id)
            next[k] = next[k].under ? { type: "occupable", obj: next[k].under } : null;
        }
        for (let rr = 0; rr < rows; rr++) {
          const k = `${rr}-${c}`;
          if (next[k]?.type === "cross" && next[k]?.by === id)
            next[k] = next[k].under ? { type: "occupable", obj: next[k].under } : null;
        }
        return next;
      });
    };

    if (cur.type === "suspect+occ") {
      const id = cur.id;
      setCells((prev) => {
        const next = { ...prev };
        next[key] = { type: "occupable", obj: cur.obj };
        for (let cc = 0; cc < cols; cc++) {
          const k = `${r}-${cc}`;
          if (next[k]?.type === "cross" && next[k]?.by === id)
            next[k] = next[k].under ? { type: "occupable", obj: next[k].under } : null;
        }
        for (let rr = 0; rr < rows; rr++) {
          const k = `${rr}-${c}`;
          if (next[k]?.type === "cross" && next[k]?.by === id)
            next[k] = next[k].under ? { type: "occupable", obj: next[k].under } : null;
        }
        return next;
      });
    } else if (cur.type === "victim+occ") {
      setCells((prev) => ({ ...prev, [key]: { type: "occupable", obj: cur.obj } }));
    } else if (cur.type === "suspect") {
      removeCrosses(cur.id);
    } else if (cur.type === "discard") {
      setCells((prev) => ({
        ...prev,
        [key]: cur.under ? { type: "occupable", obj: cur.under } : null,
      }));
    } else {
      setCells((prev) => ({ ...prev, [key]: null }));
    }
  };

  // ── derived state ─────────────────────────────────────────────────────────

  const placedIds = new Set(
    Object.values(cells)
      .filter((v) => v?.type === "suspect" || v?.type === "suspect+occ")
      .map((v) => v.id)
  );

  const victimPlaced = Object.values(cells).some(
    (v) => v?.type === "victim" || v?.type === "victim+occ"
  );

  // ── cell appearance helpers ───────────────────────────────────────────────

  const getCellBg = (v) => {
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
  };

  const getCellOutline = (v) => {
    if (v?.type === "suspect" || v?.type === "suspect+occ") return "2px solid #111";
    if (v?.type === "victim"  || v?.type === "victim+occ")  return "2px solid #1a4a1a";
    return "none";
  };

  return {
    cells,
    reset,
    placeObstacle,
    placeSuspect,
    placeDiscard,
    erase,
    placedIds,
    victimPlaced,
    getCellBg,
    getCellOutline,
  };
}
