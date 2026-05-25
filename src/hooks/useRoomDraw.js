import { useState, useRef, useCallback, useEffect } from "react";
import { getRoomBorders } from "../utils/rooms";
import { ROOM_COLORS } from "../constants/rooms";

export function useRoomDraw(rows, cols, numRooms, initialRoomLayout) {
  const buildInitialRooms = () => {
    if (initialRoomLayout?.length > 0) {
      return initialRoomLayout.map((rm) => ({
        ...rm,
        cells: new Set(rm.cells),
      }));
    }
    return [];
  };

  const [rooms,     setRooms]     = useState(buildInitialRooms);
  const [roomMode,  setRoomMode]  = useState(false);
  const [dragCells, setDragCells] = useState(new Set());

  const gridRef      = useRef(null);
  const cellSzRef    = useRef(40);
  const draggingRef  = useRef(false);
  const dragCellsRef = useRef(new Set());
  const roomsRef     = useRef(rooms);
  const roomModeRef  = useRef(false);
  const numRoomsRef  = useRef(numRooms);

  // Keep refs in sync with state
  roomsRef.current   = rooms;
  roomModeRef.current = roomMode;

  const posToCell = useCallback(
    (clientX, clientY) => {
      const grid = gridRef.current;
      if (!grid) return null;
      const rect = grid.getBoundingClientRect();
      const sz = cellSzRef.current + 1;
      const c = Math.floor((clientX - rect.left - 1) / sz);
      const r = Math.floor((clientY - rect.top  - 1) / sz);
      if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
      return { r, c };
    },
    [rows, cols]
  );

  const startDrag = useCallback(
    (clientX, clientY) => {
      const cell = posToCell(clientX, clientY);
      if (!cell) return;
      draggingRef.current  = true;
      dragCellsRef.current = new Set([`${cell.r}-${cell.c}`]);
      setDragCells(new Set([`${cell.r}-${cell.c}`]));
    },
    [posToCell]
  );

  const moveDrag = useCallback(
    (clientX, clientY) => {
      if (!draggingRef.current) return;
      const cell = posToCell(clientX, clientY);
      if (!cell) return;
      const key = `${cell.r}-${cell.c}`;
      if (!dragCellsRef.current.has(key)) {
        dragCellsRef.current = new Set([...dragCellsRef.current, key]);
        setDragCells(new Set(dragCellsRef.current));
      }
    },
    [posToCell]
  );

  const endDrag = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const snapshot = dragCellsRef.current;
    if (snapshot.size === 0) { setDragCells(new Set()); return; }

    const color   = ROOM_COLORS[roomsRef.current.length % ROOM_COLORS.length];
    const borders = getRoomBorders(snapshot);
    const newRoom = { id: Date.now(), color, cells: new Set(snapshot), borders };

    roomsRef.current = [...roomsRef.current, newRoom];
    setRooms((prev) => [...prev, newRoom]);
    dragCellsRef.current = new Set();
    setDragCells(new Set());

    if (roomsRef.current.length >= numRoomsRef.current) {
      roomModeRef.current = false;
      setRoomMode(false);
    }
  }, []);

  const undoLastRoom = () => setRooms((prev) => prev.slice(0, -1));
  const resetRooms   = () => setRooms([]);
  const toggleRoomMode = () => setRoomMode((v) => !v);
  const exitRoomMode   = () => setRoomMode(false);

  // Block page scroll on mobile while drawing rooms
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !roomMode) return;

    const onTouchStart = (e) => { e.preventDefault(); const t = e.touches[0]; startDrag(t.clientX, t.clientY); };
    const onTouchMove  = (e) => { e.preventDefault(); const t = e.touches[0]; moveDrag(t.clientX,  t.clientY); };
    const onTouchEnd   = (e) => { e.preventDefault(); endDrag(); };

    grid.addEventListener("touchstart", onTouchStart, { passive: false });
    grid.addEventListener("touchmove",  onTouchMove,  { passive: false });
    grid.addEventListener("touchend",   onTouchEnd,   { passive: false });

    return () => {
      grid.removeEventListener("touchstart", onTouchStart);
      grid.removeEventListener("touchmove",  onTouchMove);
      grid.removeEventListener("touchend",   onTouchEnd);
    };
  }, [roomMode, startDrag, moveDrag, endDrag]);

  return {
    rooms,
    roomMode,
    dragCells,
    gridRef,
    cellSzRef,
    roomsLeft: numRooms - rooms.length,
    startDrag,
    moveDrag,
    endDrag,
    undoLastRoom,
    resetRooms,
    toggleRoomMode,
    exitRoomMode,
  };
}
