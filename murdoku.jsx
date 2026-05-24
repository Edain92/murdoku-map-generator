import { useState, useRef, useCallback, useEffect } from "react";

const BLOCKERS = [
  { id: "mesa",   emoji: "🟫", label: "Mesa"   },
  { id: "tv",     emoji: "📺", label: "TV"     },
  { id: "planta", emoji: "🪴", label: "Planta" },
];
const OCCUPABLES = [
  { id: "alfombra", emoji: "🟥", label: "Alfombra", color: "#e8a0a0", text: "#7a2020" },
  { id: "sillonn",  emoji: "🛋️", label: "Sofa",     color: "#f0d080", text: "#7a5a00" },
  { id: "agua",     emoji: "💧", label: "Agua",     color: "#a0c8f0", text: "#1a4a7a" },
  { id: "cama",     emoji: "🛏️", label: "Cama",     color: "#c8a8e0", text: "#4a1a7a" },
];
const ALL_OBSTACLES = [...BLOCKERS, ...OCCUPABLES];


const ROOM_COLORS = [
  "#e63946","#2a9d8f","#e9c46a","#6a4c93","#f4a261",
  "#457b9d","#2dc653","#e76f51","#0096c7","#bc6c25",
];

const STORAGE_KEY = "murdoku-configs";

function getObstacle(id) { return ALL_OBSTACLES.find(o => o.id === id); }
function isBlocker(id)   { return BLOCKERS.some(o => o.id === id); }
function isOccupable(id) { return OCCUPABLES.some(o => o.id === id); }

function parseRange(raw) {
  const m = raw.trim().toLowerCase().match(/^([a-z])-([a-z])$/);
  if (!m) return null;
  const a = m[1].charCodeAt(0), b = m[2].charCodeAt(0);
  if (a > b) return null;
  return Array.from({ length: b - a + 1 }, (_, i) => String.fromCharCode(a + i).toUpperCase());
}

function getRoomBorders(cellSet) {
  const borders = {};
  for (const key of cellSet) {
    const [r, c] = key.split("-").map(Number);
    borders[key] = {
      top:    !cellSet.has(`${r-1}-${c}`),
      right:  !cellSet.has(`${r}-${c+1}`),
      bottom: !cellSet.has(`${r+1}-${c}`),
      left:   !cellSet.has(`${r}-${c-1}`),
    };
  }
  return borders;
}

// Storage helpers
async function loadConfigs() {
  try {
    const res = await window.storage.get(STORAGE_KEY);
    return res ? JSON.parse(res.value) : [];
  } catch { return []; }
}
async function saveConfigs(configs) {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(configs));
  } catch(e) { console.error("Storage error", e); }
}

// ── SetupScreen ───────────────────────────────────────────────────────────────

function SetupScreen({ onPlay, savedConfigs, onDeleteConfig }) {
  const [range, setRange] = useState("a-h");
  const [rows,  setRows]  = useState(9);
  const [cols,  setCols]  = useState(9);
  const [rooms, setRooms] = useState(6);
  const [error, setError] = useState("");

  const suspects = parseRange(range);

  const handlePlay = () => {
    if (!suspects) { setError("Formato incorrecto. Usa p.ej. a-h"); return; }
    setError("");
    onPlay(rows, cols, suspects, rooms, range);
  };

  const loadConfig = (cfg) => {
    setRange(cfg.range);
    setRows(cfg.rows);
    setCols(cfg.cols);
    setRooms(cfg.rooms);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Stepper = ({ label, value, onChange, min=2, max=20 }) => (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <div style={s.stepper}>
        <button style={s.stepBtn} onClick={() => onChange(v => Math.max(min, v-1))}>-</button>
        <span style={s.stepVal}>{value}</span>
        <button style={s.stepBtn} onClick={() => onChange(v => Math.min(max, v+1))}>+</button>
      </div>
    </div>
  );

  return (
    <div style={s.screen}>
      <header style={s.header}>
        <div style={s.logo}>MURDOKU</div>
        <div style={s.subtitle}>CONFIGURAR PARTIDA</div>
      </header>

      <div style={s.card}>
        <div style={s.field}>
          <label style={s.label}>Rango de sospechosos <span style={s.labelNote}>(ej: a-h)</span></label>
          <input style={{ ...s.input, maxWidth: 120 }} placeholder="a-h"
            value={range} onChange={e => { setRange(e.target.value); setError(""); }} />
          {suspects && (
            <div style={s.preview}>
              {suspects.map(id => <span key={id} style={s.chip}>{id}</span>)}
              <span style={{ ...s.chip, background: "#2d6a2d" }}>V</span>
            </div>
          )}
          {!suspects && range && <div style={s.errorBox}>Formato incorrecto</div>}
        </div>
        <div style={s.divider} />
        <div style={s.rowFields}>
          <Stepper label="Filas"        value={rows}  onChange={setRows}  min={3} />
          <Stepper label="Columnas"     value={cols}  onChange={setCols}  min={3} />
          <Stepper label="Habitaciones" value={rooms} onChange={setRooms} min={1} />
        </div>
        <div style={s.note}>Cuadricula {rows}x{cols} · {rooms} hab. · {suspects?.length ?? "?"} sospechosos</div>
        {error && <div style={s.errorBox}>{error}</div>}
        <button style={s.mainBtn} onClick={handlePlay} disabled={!suspects}>
          GENERAR TABLERO
        </button>
      </div>

      {savedConfigs.length > 0 && (
        <div style={s.savedSection}>
          <div style={s.savedTitle}>CONFIGURACIONES GUARDADAS</div>
          <div style={s.savedList}>
            {savedConfigs.map(cfg => {
              const susp = parseRange(cfg.range);
              return (
                <div key={cfg.id} style={s.savedCard}>
                  <div style={s.savedCardTop}>
                    <span style={s.savedName}>{cfg.name}</span>
                    <button style={s.deleteBtn} onClick={() => onDeleteConfig(cfg.id)}>x</button>
                  </div>
                  <div style={s.savedMeta}>
                    {cfg.rows}x{cfg.cols} · {cfg.rooms} hab.
                  </div>
                  <div style={s.savedChips}>
                    {susp?.map(id => <span key={id} style={s.savedChip}>{id}</span>)}
                    <span style={{ ...s.savedChip, background: "#2d6a2d" }}>V</span>
                  </div>
                  <div style={s.savedActions}>
                    <button style={s.loadBtn} onClick={() => loadConfig(cfg)}>
                      CARGAR
                    </button>
                    <button style={s.playBtn} onClick={() => {
                      if (susp) onPlay(cfg.rows, cfg.cols, susp, cfg.rooms, cfg.range, cfg.roomLayout, cfg.cellState);
                    }}>
                      JUGAR
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── SaveModal ─────────────────────────────────────────────────────────────────

function SaveModal({ onSave, onCancel }) {
  const [name, setName] = useState("");
  return (
    <div style={s.modalOverlay}>
      <div style={s.modal}>
        <div style={s.modalTitle}>GUARDAR CONFIGURACION</div>
        <input
          style={s.input}
          placeholder="Nombre del puzzle..."
          value={name}
          autoFocus
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && name.trim()) onSave(name.trim()); }}
        />
        <div style={s.modalActions}>
          <button style={s.modalCancelBtn} onClick={onCancel}>Cancelar</button>
          <button
            style={{ ...s.mainBtn, flex: 1 }}
            onClick={() => { if (name.trim()) onSave(name.trim()); }}
            disabled={!name.trim()}
          >
            GUARDAR
          </button>
        </div>
      </div>
    </div>
  );
}

// ── BoardScreen ───────────────────────────────────────────────────────────────

function BoardScreen({ rows, cols, suspects, numRooms, range, onBack, onSaveConfig, initialRoomLayout, initialCellState }) {
  const buildEmpty = () => {
    const m = {};
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        m[`${r}-${c}`] = null;
    return m;
  };

  const buildInitial = () => {
    if (initialCellState && Object.keys(initialCellState).length > 0) {
      // Fill missing keys with null
      const m = buildEmpty();
      return { ...m, ...initialCellState };
    }
    return buildEmpty();
  };
  const [cells,      setCells]      = useState(buildInitial);
  const [active,     setActive]     = useState(suspects[0]);
  const buildInitialRooms = () => {
    if (initialRoomLayout && initialRoomLayout.length > 0) {
      return initialRoomLayout.map(rm => ({
        ...rm,
        cells: new Set(rm.cells),
      }));
    }
    return [];
  };
  const [rooms,      setRooms]      = useState(buildInitialRooms);
  const [roomMode,   setRoomMode]   = useState(false);
  const [dragging,   setDragging]   = useState(false);
  const [dragCells,  setDragCells]  = useState(new Set());
  const [showSave,      setShowSave]      = useState(false);
  const [prepCollapsed, setPrepCollapsed] = useState(false);

  const timerRef     = useRef(null);
  const gridRef      = useRef(null);
  const cellSzRef    = useRef(40);
  const draggingRef  = useRef(false);
  const dragCellsRef = useRef(new Set());
  const roomsRef     = useRef([]);
  const roomModeRef  = useRef(false);
  const numRoomsRef  = useRef(numRooms);

  const isErasing  = active === "__erase__";
  const isVictimT  = active === "__victim__";
  const isObst     = (a) => ALL_OBSTACLES.some(o => o.id === a);
  const isDiscard  = active === "__discard__";

  roomsRef.current    = rooms;
  roomModeRef.current = roomMode;

  const cellRoomColor = useCallback((r, c) => {
    const key = `${r}-${c}`;
    const room = rooms.find(rm => rm.cells.has(key));
    return room ? room.color : null;
  }, [rooms]);

  const cellRoomBorders = useCallback((r, c) => {
    const key = `${r}-${c}`;
    for (const rm of rooms) {
      if (rm.cells.has(key)) return rm.borders[key];
    }
    return null;
  }, [rooms]);

  const maxW   = Math.min(window.innerWidth - 32, 560);
  const cellSz = Math.max(28, Math.floor((maxW - cols - 3) / cols));
  cellSzRef.current = cellSz;
  const fontSz = Math.max(8,  Math.floor(cellSz * 0.30));
  const emojSz = Math.max(12, Math.floor(cellSz * 0.50));
  const btnSz  = Math.max(32, cellSz);

  // Drag handlers (ref-based for stable DOM listeners)
  const startDrag = useCallback((clientX, clientY) => {
    const grid = gridRef.current;
    if (!grid) return;
    const rect = grid.getBoundingClientRect();
    const sz = cellSzRef.current + 1;
    const c = Math.floor((clientX - rect.left - 1) / sz);
    const r = Math.floor((clientY - rect.top  - 1) / sz);
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    draggingRef.current  = true;
    dragCellsRef.current = new Set([`${r}-${c}`]);
    setDragging(true);
    setDragCells(new Set([`${r}-${c}`]));
  }, [rows, cols]);

  const moveDrag = useCallback((clientX, clientY) => {
    if (!draggingRef.current) return;
    const grid = gridRef.current;
    if (!grid) return;
    const rect = grid.getBoundingClientRect();
    const sz = cellSzRef.current + 1;
    const c = Math.floor((clientX - rect.left - 1) / sz);
    const r = Math.floor((clientY - rect.top  - 1) / sz);
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    const key = `${r}-${c}`;
    if (!dragCellsRef.current.has(key)) {
      dragCellsRef.current = new Set([...dragCellsRef.current, key]);
      setDragCells(new Set(dragCellsRef.current));
    }
  }, [rows, cols]);

  const endDrag = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    const snapshot = dragCellsRef.current;
    if (snapshot.size === 0) { setDragCells(new Set()); return; }
    const color   = ROOM_COLORS[roomsRef.current.length % ROOM_COLORS.length];
    const borders = getRoomBorders(snapshot);
    const newRoom = { id: Date.now(), color, cells: new Set(snapshot), borders };
    roomsRef.current = [...roomsRef.current, newRoom];
    setRooms(prev => [...prev, newRoom]);
    dragCellsRef.current = new Set();
    setDragCells(new Set());
    if (roomsRef.current.length >= numRoomsRef.current) {
      roomModeRef.current = false;
      setRoomMode(false);
    }
  }, []);

  // Non-passive touch listeners to block scroll during room drawing
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

  // Game actions
  const handleClick = (r, c) => {
    if (roomMode || !isObst(active)) return;
    const key = `${r}-${c}`;
    const cur = cells[key];
    if (isBlocker(active)) {
      if (["suspect","victim","suspect+occ","victim+occ"].includes(cur?.type)) return;
      setCells(prev => ({ ...prev, [key]: { type: "blocker", obj: active } }));
    } else if (isOccupable(active)) {
      if (cur?.type === "blocker") return;
      if (cur?.type === "suspect")     setCells(prev => ({ ...prev, [key]: { type: "suspect+occ", id: cur.id, obj: active } }));
      else if (cur?.type === "victim") setCells(prev => ({ ...prev, [key]: { type: "victim+occ", obj: active } }));
      else                             setCells(prev => ({ ...prev, [key]: { type: "occupable", obj: active } }));
    }
  };

  const handleLongPress = (r, c) => {
    if (roomMode) return;
    const key = `${r}-${c}`;
    const cur = cells[key];

    if (isErasing) {
      if (!cur) return;
      if (cur.type === "suspect+occ") {
        const id = cur.id;
        setCells(prev => {
          const next = { ...prev };
          next[key] = { type: "occupable", obj: cur.obj };
          for (let cc = 0; cc < cols; cc++) { const k = `${r}-${cc}`; if (next[k]?.type === "cross" && next[k]?.by === id) next[k] = next[k].under ? { type: "occupable", obj: next[k].under } : null; }
          for (let rr = 0; rr < rows; rr++) { const k = `${rr}-${c}`; if (next[k]?.type === "cross" && next[k]?.by === id) next[k] = next[k].under ? { type: "occupable", obj: next[k].under } : null; }
          return next;
        });
      } else if (cur.type === "victim+occ") {
        setCells(prev => ({ ...prev, [key]: { type: "occupable", obj: cur.obj } }));
      } else if (cur.type === "suspect") {
        const id = cur.id;
        setCells(prev => {
          const next = { ...prev };
          next[key] = null;
          for (let cc = 0; cc < cols; cc++) { const k = `${r}-${cc}`; if (next[k]?.type === "cross" && next[k]?.by === id) next[k] = next[k].under ? { type: "occupable", obj: next[k].under } : null; }
          for (let rr = 0; rr < rows; rr++) { const k = `${rr}-${c}`; if (next[k]?.type === "cross" && next[k]?.by === id) next[k] = next[k].under ? { type: "occupable", obj: next[k].under } : null; }
          return next;
        });
      } else {
        setCells(prev => ({ ...prev, [key]: null }));
      }
      return;
    }

    if (isDiscard) {
      // Discard: mark any non-suspect, non-victim cell with a discard X
      if (!cur || cur?.type === "cross") {
        setCells(prev => ({ ...prev, [key]: { type: "discard" } }));
      } else if (cur?.type === "occupable") {
        setCells(prev => ({ ...prev, [key]: { type: "discard", under: cur.obj } }));
      }
      return;
    }
    if (isObst(active)) return;
    if (cur?.type === "blocker") return;
    if (["suspect","victim","suspect+occ","victim+occ"].includes(cur?.type)) return;
    if (cur?.type === "cross") return;

    const placedId = isVictimT ? "V" : active;
    const alreadyPlaced = Object.values(cells).some(v =>
      (v?.type === "suspect"     && v.id === placedId) ||
      (v?.type === "suspect+occ" && v.id === placedId) ||
      (v?.type === "victim"      && placedId === "V")  ||
      (v?.type === "victim+occ"  && placedId === "V")
    );
    if (alreadyPlaced) return;

    const isOnOcc = cur?.type === "occupable";
    setCells(prev => {
      const next = { ...prev };
      next[key] = isVictimT
        ? (isOnOcc ? { type: "victim+occ",  obj: cur.obj } : { type: "victim" })
        : (isOnOcc ? { type: "suspect+occ", id: placedId, obj: cur.obj } : { type: "suspect", id: placedId });
      for (let cc = 0; cc < cols; cc++) { const k = `${r}-${cc}`; if (cc !== c && (!next[k] || next[k]?.type === "occupable")) next[k] = next[k]?.type === "occupable" ? { type: "cross", by: placedId, under: next[k].obj } : { type: "cross", by: placedId }; }
      for (let rr = 0; rr < rows; rr++) { const k = `${rr}-${c}`; if (rr !== r && (!next[k] || next[k]?.type === "occupable")) next[k] = next[k]?.type === "occupable" ? { type: "cross", by: placedId, under: next[k].obj } : { type: "cross", by: placedId }; }
      return next;
    });
  };

  const onPressStart = (r, c) => {
    if (roomMode) return;
    if (isObst(active)) { handleClick(r, c); return; }
    timerRef.current = setTimeout(() => handleLongPress(r, c), 450);
  };
  const onPressEnd = () => clearTimeout(timerRef.current);

  // Placed suspects
  const placedIds = new Set(
    Object.values(cells)
      .filter(v => v?.type === "suspect" || v?.type === "suspect+occ")
      .map(v => v.id)
  );
  const victimPlaced = Object.values(cells).some(v => v?.type === "victim" || v?.type === "victim+occ");

  // Cell appearance
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

  const getCellContent = (v) => {
    if (!v) return null;
    if (v.type === "suspect" || v.type === "suspect+occ")
      return <span style={{ fontWeight: "bold", fontSize: fontSz, fontFamily: "monospace", color: "#111" }}>{v.id}</span>;
    if (v.type === "victim" || v.type === "victim+occ")
      return <span style={{ fontWeight: "bold", fontSize: fontSz, fontFamily: "monospace", color: "#fff" }}>V</span>;
    if (v.type === "cross")
      return <span style={{ fontSize: fontSz * 1.3, color: "#bbb" }}>x</span>;
    if (v.type === "discard")
      return <span style={{ fontSize: fontSz * 1.3, color: "#c0392b", fontWeight: "bold" }}>x</span>;
    if (v.type === "blocker")
      return <span style={{ fontSize: emojSz, lineHeight: 1 }}>{getObstacle(v.obj)?.emoji}</span>;
    if (v.type === "occupable")
      return <span style={{ fontSize: emojSz * 0.65, opacity: 0.45 }}>{getObstacle(v.obj)?.emoji}</span>;
    return null;
  };

  const getRoomBorderStyle = (r, c) => {
    const key    = `${r}-${c}`;
    const color  = cellRoomColor(r, c);
    const isDrag = roomMode && dragCells.has(key);
    const W = 3;
    if (!color && !isDrag) return {};
    const bColor  = isDrag ? "#666" : color;
    const borders = isDrag
      ? { top: !dragCells.has(`${r-1}-${c}`), right: !dragCells.has(`${r}-${c+1}`), bottom: !dragCells.has(`${r+1}-${c}`), left: !dragCells.has(`${r}-${c-1}`) }
      : cellRoomBorders(r, c);
    if (!borders) return {};
    return {
      borderTop:    borders.top    ? `${W}px solid ${bColor}` : `${W}px solid transparent`,
      borderRight:  borders.right  ? `${W}px solid ${bColor}` : `${W}px solid transparent`,
      borderBottom: borders.bottom ? `${W}px solid ${bColor}` : `${W}px solid transparent`,
      borderLeft:   borders.left   ? `${W}px solid ${bColor}` : `${W}px solid transparent`,
      boxSizing: "border-box",
    };
  };

  const ToolBtn = ({ id, children, bg, color, border }) => {
    const isAct    = active === id && !roomMode;
    const isVicBtn = id === "__victim__";
    const isPlaced = isVicBtn ? victimPlaced : placedIds.has(id);
    return (
      <button style={{
        width: btnSz, height: btnSz,
        border: `2px solid ${border || "#111"}`,
        background: isAct ? (bg || "#111") : "#f5f5f0",
        color: isAct ? (color || "#f5f5f0") : "#111",
        fontFamily: "monospace", fontWeight: "bold",
        fontSize: Math.max(9, Math.floor(btnSz * 0.28)),
        cursor: isPlaced && !isAct ? "not-allowed" : "pointer",
        flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: roomMode ? 0.4 : isPlaced ? 0.3 : 1,
        textDecoration: isPlaced && !isAct ? "line-through" : "none",
      }} onClick={() => { if (!roomMode && !isPlaced) setActive(id); }}>{children}</button>
    );
  };

  const ObjBtn = ({ o }) => {
    const isAct = active === o.id && !roomMode;
    return (
      <button title={o.label} style={{
        width: btnSz, height: btnSz, border: "2px solid #111",
        background: isAct ? (isOccupable(o.id) ? o.color : "#333") : "#f5f5f0",
        fontSize: Math.max(14, emojSz * 0.8), cursor: "pointer", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        outline: isAct ? "2px solid #111" : "none", outlineOffset: 2,
        opacity: roomMode ? 0.4 : 1,
      }} onClick={() => { if (!roomMode) setActive(o.id); }}>{o.emoji}</button>
    );
  };

  const roomsLeft = numRooms - rooms.length;

  return (
    <div style={s.screen}>
      <header style={s.header}>
        <div style={s.logo}>MURDOKU</div>
        <div style={s.subtitle}>{rows}x{cols} · {suspects.length} SOSPECHOSOS · {numRooms} HABITACIONES</div>
      </header>

      {/* ── FASE PREPARACION ───────────────────────────────────────── */}
      <div style={{ width: "100%", maxWidth: 560 }}>

        {/* Header colapsable */}
        <button
          style={{
            width: "100%", padding: "10px 14px",
            border: "2px solid #111",
            background: prepCollapsed ? "#f5f5f0" : "#111",
            color:      prepCollapsed ? "#111" : "#f5f5f0",
            fontFamily: "monospace", fontWeight: "bold",
            fontSize: 11, letterSpacing: "0.18em",
            cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
          onClick={() => { setPrepCollapsed(v => !v); if (roomMode) setRoomMode(false); }}
        >
          <span>PREPARACION DEL MAPA</span>
          <span style={{ fontSize: 14 }}>{prepCollapsed ? "▾" : "▴"}</span>
        </button>

        {/* Contenido expandible */}
        {!prepCollapsed && (
          <div style={{ border: "2px solid #111", borderTop: "none", padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>

            {/* Añadir habitacion */}
            <button
              style={{
                ...s.fullBtn,
                background: roomMode ? ROOM_COLORS[rooms.length % ROOM_COLORS.length] : "#f5f5f0",
                color:      roomMode ? "#fff" : "#111",
                border:     roomMode ? `2px solid ${ROOM_COLORS[rooms.length % ROOM_COLORS.length]}` : "2px solid #888",
              }}
              onClick={() => setRoomMode(v => !v)}
              disabled={roomsLeft <= 0}
            >
              {roomMode
                ? `Dibujando hab. ${rooms.length + 1} de ${numRooms} — arrastra las celdas`
                : roomsLeft > 0
                  ? `+ ANADIR HABITACION (${roomsLeft} restante${roomsLeft !== 1 ? "s" : ""})`
                  : "✓ Todas las habitaciones definidas"
              }
            </button>

            {rooms.length > 0 && (
              <button style={{ ...s.fullBtn, border: "2px solid #aaa", color: "#666", fontSize: 10 }}
                onClick={() => setRooms(prev => prev.slice(0, -1))}>
                ↩ Deshacer ultima habitacion
              </button>
            )}

            {/* Obstaculos */}
            <div>
              <div style={s.toolLabel}>OBSTACULOS <span style={s.toolHint}>(click para colocar)</span></div>
              <div style={{ display: "flex", gap: 2, width: "100%" }}>
                {[...BLOCKERS, ...OCCUPABLES].map(o => (
                  <button
                    key={o.id}
                    title={o.label}
                    style={{
                      flex: 1, height: btnSz,
                      border: active === o.id ? "2px solid #111" : "2px solid #ccc",
                      background: active === o.id
                        ? (isOccupable(o.id) ? o.color : "#333")
                        : (isOccupable(o.id) ? o.color + "88" : "#f5f5f0"),
                      fontSize: Math.max(14, emojSz * 0.75),
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      outline: active === o.id ? "2px solid #111" : "none", outlineOffset: -4,
                    }}
                    onClick={() => setActive(o.id)}
                  >{o.emoji}</button>
                ))}
              </div>
            </div>

            {/* Guardar + Reset */}
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...s.fullBtn, flex: 1 }} onClick={() => setShowSave(true)}>
                GUARDAR CONFIG
              </button>
              <button
                style={{ height: btnSz, padding: "0 16px", border: "2px solid #111", background: "#f5f5f0", fontFamily: "monospace", fontSize: 10, fontWeight: "bold", letterSpacing: "0.1em", cursor: "pointer", color: "#111", whiteSpace: "nowrap" }}
                onClick={() => { setCells(buildEmpty()); setRooms([]); }}
              >
                RESET
              </button>
            </div>

            {/* Boton listo */}
            <button
              style={{ ...s.fullBtn, background: "#111", color: "#f5f5f0", border: "2px solid #111" }}
              onClick={() => { setRoomMode(false); setPrepCollapsed(true); setActive(suspects[0]); }}
            >
              LISTO — EMPEZAR A JUGAR ▸
            </button>

          </div>
        )}
      </div>

      {/* ── FASE JUEGO ─────────────────────────────────────────────── */}
      <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 8 }}>

        {/* Descarte + Victima */}
        <div style={{ display: "flex", gap: 2 }}>
          <button
            style={{
              flex: 1, height: btnSz,
              border: "2px solid #c0392b",
              background: isDiscard ? "#c0392b" : "#fdecea",
              color: isDiscard ? "#fff" : "#c0392b",
              fontFamily: "monospace", fontWeight: "bold",
              fontSize: Math.max(10, Math.floor(btnSz * 0.28)),
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              letterSpacing: "0.08em",
            }}
            onClick={() => setActive("__discard__")}
          >
            X <span style={{ fontSize: Math.max(8, Math.floor(btnSz * 0.2)), opacity: 0.8 }}>DESCARTAR</span>
          </button>
          <ToolBtn id="__victim__" bg="#2d6a2d" border="#2d6a2d" color="#fff">V</ToolBtn>
        </div>

        {/* Sospechosos */}
        <div>
          <div style={s.toolLabel}>SOSPECHOSOS <span style={s.toolHint}>(manten pulsado)</span></div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {suspects.map(id => <ToolBtn key={id} id={id}>{id}</ToolBtn>)}
          </div>
        </div>

        {/* Borrar */}
        <button
          style={{
            ...s.fullBtn,
            background: active === "__erase__" ? "#111" : "#f5f5f0",
            color:      active === "__erase__" ? "#f5f5f0" : "#111",
            border: "2px solid #111",
          }}
          onClick={() => setActive("__erase__")}
        >
          x BORRAR <span style={{ fontSize: 9, opacity: 0.6 }}>(manten pulsado)</span>
        </button>

      </div>

      {/* Grid */}
      <div style={{ overflowX: "auto", width: "100%", display: "flex", justifyContent: "center" }}
        onMouseLeave={() => { if (roomMode && dragging) endDrag(); }}
      >
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, ${cellSz}px)`,
            gridTemplateRows:    `repeat(${rows}, ${cellSz}px)`,
            gap: 1, backgroundColor: "#999",
            border: "2px solid #111", padding: 1,
            cursor: roomMode ? "crosshair" : "pointer",
            userSelect: "none", WebkitUserSelect: "none",
          }}
          onMouseDown={roomMode ? (e) => startDrag(e.clientX, e.clientY) : undefined}
          onMouseMove={roomMode ? (e) => moveDrag(e.clientX,  e.clientY) : undefined}
          onMouseUp={roomMode   ? endDrag                                 : undefined}
        >
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: cols }, (_, c) => {
              const v   = cells[`${r}-${c}`];
              const rbs = getRoomBorderStyle(r, c);
              return (
                <div
                  key={`${r}-${c}`}
                  style={{
                    width: cellSz, height: cellSz,
                    backgroundColor: getCellBg(v),
                    display: "flex", alignItems: "center", justifyContent: "center",
                    WebkitTouchCallout: "none",
                    ...(v?.type === "suspect" || v?.type === "suspect+occ" ? { outline: "2px solid #111", outlineOffset: -3 } : {}),
                    ...(v?.type === "victim"  || v?.type === "victim+occ"  ? { outline: "2px solid #1a4a1a", outlineOffset: -3 } : {}),
                    ...rbs,
                  }}
                  onMouseDown={!roomMode ? () => onPressStart(r, c) : undefined}
                  onMouseUp={!roomMode   ? onPressEnd               : undefined}
                  onMouseLeave={!roomMode ? onPressEnd              : undefined}
                  onTouchStart={!roomMode ? (e) => { e.preventDefault(); onPressStart(r, c); } : undefined}
                  onTouchEnd={!roomMode   ? onPressEnd              : undefined}
                >
                  {getCellContent(v)}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Room legend */}
      {rooms.length > 0 && (
        <div style={s.roomLegend}>
          {rooms.map((rm, i) => (
            <div key={rm.id} style={{ ...s.roomPill, background: rm.color }}>
              Hab. {i + 1}
            </div>
          ))}
        </div>
      )}

      <button style={s.backLink} onClick={onBack}>Nueva partida</button>

      {showSave && (
        <SaveModal
          onSave={(name) => { onSaveConfig(name, range, rows, cols, numRooms, cells, rooms); setShowSave(false); }}
          onCancel={() => setShowSave(false)}
        />
      )}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [game,         setGame]        = useState(null);
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    loadConfigs().then(cfgs => {
      setSavedConfigs(cfgs);
      setStorageReady(true);
    });
  }, []);

  const handleSaveConfig = async (name, range, rows, cols, numRooms, cells, rooms) => {
    // Serialize rooms: convert Set to Array for JSON
    const roomsSerialized = rooms.map(rm => ({
      id: rm.id,
      color: rm.color,
      cells: Array.from(rm.cells),
      borders: rm.borders,
    }));
    // Serialize cells: only non-null values
    const cellsSerialized = Object.fromEntries(
      Object.entries(cells).filter(([, v]) => v !== null)
    );
    const newCfg = {
      id: Date.now(), name, range, rows, cols,
      rooms: numRooms,
      roomLayout: roomsSerialized,
      cellState: cellsSerialized,
    };
    const updated = [...savedConfigs, newCfg];
    setSavedConfigs(updated);
    await saveConfigs(updated);
  };

  const handleDeleteConfig = async (id) => {
    const updated = savedConfigs.filter(c => c.id !== id);
    setSavedConfigs(updated);
    await saveConfigs(updated);
  };

  if (!storageReady) {
    return (
      <div style={{ ...s.screen, justifyContent: "center" }}>
        <div style={s.logo}>MURDOKU</div>
      </div>
    );
  }

  if (game) {
    return (
      <BoardScreen
        rows={game.rows} cols={game.cols}
        suspects={game.suspects} numRooms={game.rooms}
        range={game.range}
        onBack={() => setGame(null)}
        onSaveConfig={handleSaveConfig}
        initialRoomLayout={game.roomLayout}
        initialCellState={game.cellState}
      />
    );
  }

  return (
    <SetupScreen
      savedConfigs={savedConfigs}
      onDeleteConfig={handleDeleteConfig}
      onPlay={(r, c, susp, rooms, range, roomLayout, cellState) =>
        setGame({ rows: r, cols: c, suspects: susp, rooms, range, roomLayout, cellState })
      }
    />
  );
}

// ── styles ────────────────────────────────────────────────────────────────────

const s = {
  screen: {
    minHeight: "100vh", backgroundColor: "#f5f5f0",
    fontFamily: "'Courier New', Courier, monospace",
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "24px 16px 48px", gap: 12,
  },
  header: { textAlign: "center" },
  logo: { fontSize: 30, fontWeight: "bold", letterSpacing: "0.22em", color: "#111", borderBottom: "3px solid #111", paddingBottom: 4 },
  subtitle: { fontSize: 9, letterSpacing: "0.18em", color: "#777", marginTop: 5 },

  card: {
    width: "100%", maxWidth: 420, backgroundColor: "#fff",
    border: "2px solid #111", padding: 24,
    display: "flex", flexDirection: "column", gap: 18,
  },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 10, letterSpacing: "0.2em", color: "#777", textTransform: "uppercase" },
  labelNote: { fontSize: 9, color: "#aaa", textTransform: "none", letterSpacing: "0.05em" },
  input: {
    border: "2px solid #111", padding: "10px 12px",
    fontSize: 16, fontFamily: "monospace",
    background: "#f5f5f0", color: "#111", outline: "none", boxSizing: "border-box", width: "100%",
  },
  preview: { display: "flex", flexWrap: "wrap", gap: 6 },
  chip: { background: "#111", color: "#f5f5f0", padding: "3px 10px", fontSize: 12, fontFamily: "monospace", fontWeight: "bold" },
  divider: { borderTop: "1px solid #ddd" },
  rowFields: { display: "flex", gap: 16, flexWrap: "wrap" },
  stepper: { display: "flex", alignItems: "center", border: "2px solid #111", width: "fit-content" },
  stepBtn: {
    width: 40, height: 40, border: "none", borderRight: "2px solid #111",
    background: "#f5f5f0", cursor: "pointer", fontSize: 20,
    fontFamily: "monospace", fontWeight: "bold", color: "#111",
  },
  stepVal: { width: 46, textAlign: "center", fontSize: 20, fontWeight: "bold", color: "#111" },
  note: { fontSize: 11, color: "#aaa" },
  errorBox: { background: "#111", color: "#f5f5f0", padding: "10px 14px", fontSize: 12 },
  mainBtn: {
    background: "#111", color: "#f5f5f0", border: "none",
    padding: "15px 0", fontSize: 12, width: "100%",
    fontFamily: "monospace", fontWeight: "bold", letterSpacing: "0.18em", cursor: "pointer",
  },

  // Saved configs
  savedSection: { width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 12 },
  savedTitle: { fontSize: 9, letterSpacing: "0.3em", color: "#aaa", textTransform: "uppercase", paddingTop: 8, borderTop: "1px solid #ddd" },
  savedList: { display: "flex", flexDirection: "column", gap: 10 },
  savedCard: {
    border: "2px solid #111", backgroundColor: "#fff",
    padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8,
  },
  savedCardTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  savedName: { fontSize: 14, fontWeight: "bold", color: "#111", letterSpacing: "0.05em" },
  savedMeta: { fontSize: 10, color: "#888", letterSpacing: "0.1em" },
  savedChips: { display: "flex", flexWrap: "wrap", gap: 4 },
  savedChip: { background: "#111", color: "#f5f5f0", padding: "2px 7px", fontSize: 10, fontFamily: "monospace", fontWeight: "bold" },
  savedActions: { display: "flex", gap: 8 },
  loadBtn: {
    flex: 1, padding: "8px 0", border: "2px solid #111",
    background: "#f5f5f0", fontFamily: "monospace", fontSize: 10,
    fontWeight: "bold", letterSpacing: "0.15em", cursor: "pointer", color: "#111",
  },
  playBtn: {
    flex: 1, padding: "8px 0", border: "none",
    background: "#111", fontFamily: "monospace", fontSize: 10,
    fontWeight: "bold", letterSpacing: "0.15em", cursor: "pointer", color: "#f5f5f0",
  },
  deleteBtn: {
    width: 32, height: 32, border: "1px solid #ccc",
    background: "none", cursor: "pointer", color: "#aaa",
    fontSize: 14, fontFamily: "monospace", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  },

  // Save modal
  modalOverlay: {
    position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24,
  },
  modal: {
    backgroundColor: "#fff", border: "2px solid #111",
    padding: 24, width: "100%", maxWidth: 360,
    display: "flex", flexDirection: "column", gap: 16,
  },
  modalTitle: { fontSize: 12, fontWeight: "bold", letterSpacing: "0.2em", color: "#111" },
  modalActions: { display: "flex", gap: 8 },
  modalCancelBtn: {
    padding: "14px 16px", border: "2px solid #111",
    background: "#f5f5f0", fontFamily: "monospace", fontSize: 11,
    cursor: "pointer", color: "#111",
  },

  // Board
  fullBtn: {
    width: "100%", padding: "11px 0",
    border: "2px solid #888",
    background: "#f5f5f0", color: "#111",
    fontFamily: "monospace", fontWeight: "bold",
    fontSize: 11, letterSpacing: "0.15em",
    cursor: "pointer", textAlign: "center",
  },
  resetBtn: {
    padding: "8px 14px", border: "2px solid #111", background: "#f5f5f0",
    fontFamily: "monospace", fontSize: 10, fontWeight: "bold", letterSpacing: "0.1em", cursor: "pointer", color: "#111",
  },
  saveConfigBtn: {
    padding: "8px 14px", border: "2px solid #111", background: "#f5f5f0",
    fontFamily: "monospace", fontSize: 10, fontWeight: "bold", letterSpacing: "0.1em", cursor: "pointer", color: "#111",
  },
  undoBtn: {
    padding: "8px 14px", border: "1px solid #aaa", background: "#f5f5f0",
    fontFamily: "monospace", fontSize: 10, cursor: "pointer", color: "#888",
  },
  roomBtn: {
    width: "100%", padding: "13px 0", border: "2px solid #111",
    fontFamily: "monospace", fontWeight: "bold", fontSize: 11,
    letterSpacing: "0.1em", cursor: "pointer", transition: "all 0.15s",
  },
  toolSection: { width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 5 },
  toolLabel: { fontSize: 9, letterSpacing: "0.25em", color: "#aaa", textTransform: "uppercase" },
  toolHint:  { fontSize: 8, letterSpacing: "0.05em", textTransform: "none", color: "#ccc" },
  toolRow:   { display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" },
  eraseBtn: {
    padding: "8px 16px", border: "2px solid #111",
    fontFamily: "monospace", fontSize: 11, fontWeight: "bold", letterSpacing: "0.12em", cursor: "pointer",
  },
  hint: { fontSize: 11, color: "#aaa", minHeight: 16, width: "100%", maxWidth: 560 },
  roomLegend: { display: "flex", flexWrap: "wrap", gap: 6, width: "100%", maxWidth: 560 },
  roomPill: { padding: "4px 12px", color: "#fff", fontSize: 10, fontFamily: "monospace", fontWeight: "bold", letterSpacing: "0.1em" },
  backLink: {
    background: "none", border: "none", cursor: "pointer",
    fontFamily: "monospace", fontSize: 11, color: "#aaa", letterSpacing: "0.1em", textDecoration: "underline",
  },
};
