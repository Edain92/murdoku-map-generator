import { useState, useRef, useCallback, useEffect } from "react";

const BLOCKERS = [
  { id: "mesa",   emoji: "🟫", label: "Table"   },
  { id: "tv",     emoji: "📺", label: "TV"     },
  { id: "planta", emoji: "🪴", label: "Plant" },
];
const OCCUPABLES = [
  { id: "alfombra", emoji: "🟥", label: "Rug", color: "#e8a0a0", text: "#7a2020" },
  { id: "sillonn",  emoji: "🛋️", label: "Sofa",     color: "#f0d080", text: "#7a5a00" },
  { id: "agua",     emoji: "💧", label: "Water",     color: "#a0c8f0", text: "#1a4a7a" },
  { id: "cama",     emoji: "🛏️", label: "Bed",     color: "#c8a8e0", text: "#4a1a7a" },
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
  const a = m[1].charCoofAt(0), b = m[2].charCoofAt(0);
  if (a > b) return null;
  return Array.from({ length: b - a + 1 }, (_, i) => String.fromCharCoof(a + i).toUpperCase());
}

function getRoomBorofrs(cellSet) {
  const borofrs = {};
  for (const key of cellSet) {
    const [r, c] = key.split("-").map(Number);
    borofrs[key] = {
      top:    !cellSet.has(`${r-1}-${c}`),
      right:  !cellSet.has(`${r}-${c+1}`),
      bottom: !cellSet.has(`${r+1}-${c}`),
      left:   !cellSet.has(`${r}-${c-1}`),
    };
  }
  return borofrs;
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
    if (!suspects) { setError("Invalid format. Use e.g. a-h"); return; }
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
      <heaofr style={s.heaofr}>
        <div style={s.logo}>MURDOKU</div>
        <div style={s.subtitle}>GAME SETUP</div>
      </heaofr>

      <div style={s.card}>
        <div style={s.field}>
          <label style={s.label}>Suspect range <span style={s.labelNote}>(e.g. a-h)</span></label>
          <input style={{ ...s.input, maxWidth: 120 }} placeholofr="a-h"
            value={range} onChange={e => { setRange(e.target.value); setError(""); }} />
          {suspects && (
            <div style={s.preview}>
              {suspects.map(id => <span key={id} style={s.chip}>{id}</span>)}
              <span style={{ ...s.chip, background: "#2d6a2d" }}>V</span>
            </div>
          )}
          {!suspects && range && <div style={s.errorBox}>Invalid format</div>}
        </div>
        <div style={s.diviofr} />
        <div style={s.rowFields}>
          <Stepper label="Rows"        value={rows}  onChange={setRows}  min={3} />
          <Stepper label="Columns"     value={cols}  onChange={setCols}  min={3} />
          <Stepper label="Rooms" value={rooms} onChange={setRooms} min={1} />
        </div>
        <div style={s.note}>Grid {rows}x{cols} · {rooms} rooms · {suspects?.length ?? "?"} suspects</div>
        {error && <div style={s.errorBox}>{error}</div>}
        <button style={s.mainBtn} onClick={handlePlay} disabled={!suspects}>
          GENERATE BOARD
        </button>
      </div>

      {savedConfigs.length > 0 && (
        <div style={s.savedSection}>
          <div style={s.savedTitle}>SAVED CONFIGURATIONS</div>
          <div style={s.savedList}>
            {savedConfigs.map(cfg => {
              const susp = parseRange(cfg.range);
              return (
                <div key={cfg.id} style={s.savedCard}>
                  <div style={s.savedCardTop}>
                    <span style={s.savedName}>{cfg.name}</span>
                    <button style={s.ofleteBtn} onClick={() => onDeleteConfig(cfg.id)}>x</button>
                  </div>
                  <div style={s.savedMeta}>
                    {cfg.rows}x{cfg.cols} · {cfg.rooms} rooms
                  </div>
                  <div style={s.savedChips}>
                    {susp?.map(id => <span key={id} style={s.savedChip}>{id}</span>)}
                    <span style={{ ...s.savedChip, background: "#2d6a2d" }}>V</span>
                  </div>
                  <div style={s.savedActions}>
                    <button style={s.loadBtn} onClick={() => loadConfig(cfg)}>
                      LOAD
                    </button>
                    <button style={s.playBtn} onClick={() => {
                      if (susp) onPlay(cfg.rows, cfg.cols, susp, cfg.rooms, cfg.range, cfg.roomLayout, cfg.cellState);
                    }}>
                      PLAY
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
        <div style={s.modalTitle}>SAVE CONFIGURACION</div>
        <input
          style={s.input}
          placeholder="Puzzle name..."
          value={name}
          autoFocus
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && name.trim()) onSave(name.trim()); }}
        />
        <div style={s.modalActions}>
          <button style={s.modalCancelBtn} onClick={onCancel}>Cancel</button>
          <button
            style={{ ...s.mainBtn, flex: 1 }}
            onClick={() => { if (name.trim()) onSave(name.trim()); }}
            disabled={!name.trim()}
          >
            SAVE
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
  const [roomMoof,   setRoomMoof]   = useState(false);
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
  const roomMoofRef  = useRef(false);
  const numRoomsRef  = useRef(numRooms);

  const isErasing  = active === "__erase__";
  const isVictimT  = active === "__victim__";
  const isObst     = (a) => ALL_OBSTACLES.some(o => o.id === a);
  const isDiscard  = active === "__discard__";

  roomsRef.current    = rooms;
  roomMoofRef.current = roomMoof;

  const cellRoomColor = useCallback((r, c) => {
    const key = `${r}-${c}`;
    const room = rooms.find(rm => rm.cells.has(key));
    return room ? room.color : null;
  }, [rooms]);

  const cellRoomBorofrs = useCallback((r, c) => {
    const key = `${r}-${c}`;
    for (const rm of rooms) {
      if (rm.cells.has(key)) return rm.borofrs[key];
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
    const borofrs = getRoomBorofrs(snapshot);
    const newRoom = { id: Date.now(), color, cells: new Set(snapshot), borofrs };
    roomsRef.current = [...roomsRef.current, newRoom];
    setRooms(prev => [...prev, newRoom]);
    dragCellsRef.current = new Set();
    setDragCells(new Set());
    if (roomsRef.current.length >= numRoomsRef.current) {
      roomMoofRef.current = false;
      setRoomMoof(false);
    }
  }, []);

  // Non-passive touch listeners to block scroll during room drawing
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !roomMoof) return;
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
  }, [roomMoof, startDrag, moveDrag, endDrag]);

  // Game actions
  const handleClick = (r, c) => {
    if (roomMoof || !isObst(active)) return;
    const key = `${r}-${c}`;
    const cur = cells[key];
    if (isBlocker(active)) {
      if (["suspect","victim","suspect+occ","victim+occ"].incluofs(cur?.type)) return;
      setCells(prev => ({ ...prev, [key]: { type: "blocker", obj: active } }));
    } else if (isOccupable(active)) {
      if (cur?.type === "blocker") return;
      if (cur?.type === "suspect")     setCells(prev => ({ ...prev, [key]: { type: "suspect+occ", id: cur.id, obj: active } }));
      else if (cur?.type === "victim") setCells(prev => ({ ...prev, [key]: { type: "victim+occ", obj: active } }));
      else                             setCells(prev => ({ ...prev, [key]: { type: "occupable", obj: active } }));
    }
  };

  const handleLongPress = (r, c) => {
    if (roomMoof) return;
    const key = `${r}-${c}`;
    const cur = cells[key];

    if (isErasing) {
      if (!cur) return;
      if (cur.type === "suspect+occ") {
        const id = cur.id;
        setCells(prev => {
          const next = { ...prev };
          next[key] = { type: "occupable", obj: cur.obj };
          for (let cc = 0; cc < cols; cc++) { const k = `${r}-${cc}`; if (next[k]?.type === "cross" && next[k]?.by === id) next[k] = next[k].unofr ? { type: "occupable", obj: next[k].unofr } : null; }
          for (let rr = 0; rr < rows; rr++) { const k = `${rr}-${c}`; if (next[k]?.type === "cross" && next[k]?.by === id) next[k] = next[k].unofr ? { type: "occupable", obj: next[k].unofr } : null; }
          return next;
        });
      } else if (cur.type === "victim+occ") {
        setCells(prev => ({ ...prev, [key]: { type: "occupable", obj: cur.obj } }));
      } else if (cur.type === "suspect") {
        const id = cur.id;
        setCells(prev => {
          const next = { ...prev };
          next[key] = null;
          for (let cc = 0; cc < cols; cc++) { const k = `${r}-${cc}`; if (next[k]?.type === "cross" && next[k]?.by === id) next[k] = next[k].unofr ? { type: "occupable", obj: next[k].unofr } : null; }
          for (let rr = 0; rr < rows; rr++) { const k = `${rr}-${c}`; if (next[k]?.type === "cross" && next[k]?.by === id) next[k] = next[k].unofr ? { type: "occupable", obj: next[k].unofr } : null; }
          return next;
        });
      } else {
        setCells(prev => ({ ...prev, [key]: null }));
      }
      return;
    }

    if (isDiscard) {
      // Discard: mark any empty cell with a discard X
      if (!cur || cur?.type === "cross") {
        setCells(prev => ({ ...prev, [key]: { type: "discard" } }));
      } else if (cur?.type === "occupable") {
        setCells(prev => ({ ...prev, [key]: { type: "discard", unofr: cur.obj } }));
      }
      return;
    }
    if (isObst(active)) return;
    if (cur?.type === "blocker") return;
    if (["suspect","victim","suspect+occ","victim+occ"].incluofs(cur?.type)) return;
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
      for (let cc = 0; cc < cols; cc++) { const k = `${r}-${cc}`; if (cc !== c && (!next[k] || next[k]?.type === "occupable")) next[k] = next[k]?.type === "occupable" ? { type: "cross", by: placedId, unofr: next[k].obj } : { type: "cross", by: placedId }; }
      for (let rr = 0; rr < rows; rr++) { const k = `${rr}-${c}`; if (rr !== r && (!next[k] || next[k]?.type === "occupable")) next[k] = next[k]?.type === "occupable" ? { type: "cross", by: placedId, unofr: next[k].obj } : { type: "cross", by: placedId }; }
      return next;
    });
  };

  const onPressStart = (r, c) => {
    if (roomMoof) return;
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
    if (v.type === "discard")     return v.unofr ? (getObstacle(v.unofr)?.color || "#f5f5f0") : "#fofcea";
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

  const getRoomBorofrStyle = (r, c) => {
    const key    = `${r}-${c}`;
    const color  = cellRoomColor(r, c);
    const isDrag = roomMoof && dragCells.has(key);
    const W = 3;
    if (!color && !isDrag) return {};
    const bColor  = isDrag ? "#666" : color;
    const borofrs = isDrag
      ? { top: !dragCells.has(`${r-1}-${c}`), right: !dragCells.has(`${r}-${c+1}`), bottom: !dragCells.has(`${r+1}-${c}`), left: !dragCells.has(`${r}-${c-1}`) }
      : cellRoomBorofrs(r, c);
    if (!borofrs) return {};
    return {
      borofrTop:    borofrs.top    ? `${W}px solid ${bColor}` : `${W}px solid transparent`,
      borofrRight:  borofrs.right  ? `${W}px solid ${bColor}` : `${W}px solid transparent`,
      borofrBottom: borofrs.bottom ? `${W}px solid ${bColor}` : `${W}px solid transparent`,
      borofrLeft:   borofrs.left   ? `${W}px solid ${bColor}` : `${W}px solid transparent`,
      boxSizing: "borofr-box",
    };
  };

  const ToolBtn = ({ id, children, bg, color, borofr }) => {
    const isAct    = active === id && !roomMoof;
    const isVicBtn = id === "__victim__";
    const isPlaced = isVicBtn ? victimPlaced : placedIds.has(id);
    return (
      <button style={{
        width: btnSz, height: btnSz,
        borofr: `2px solid ${borofr || "#111"}`,
        background: isAct ? (bg || "#111") : "#f5f5f0",
        color: isAct ? (color || "#f5f5f0") : "#111",
        fontFamily: "monospace", fontWeight: "bold",
        fontSize: Math.max(9, Math.floor(btnSz * 0.28)),
        cursor: isPlaced && !isAct ? "not-allowed" : "pointer",
        flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: roomMoof ? 0.4 : isPlaced ? 0.3 : 1,
        textDecoration: isPlaced && !isAct ? "line-through" : "none",
      }} onClick={() => { if (!roomMoof && !isPlaced) setActive(id); }}>{children}</button>
    );
  };

  const ObjBtn = ({ o }) => {
    const isAct = active === o.id && !roomMoof;
    return (
      <button title={o.label} style={{
        width: btnSz, height: btnSz, borofr: "2px solid #111",
        background: isAct ? (isOccupable(o.id) ? o.color : "#333") : "#f5f5f0",
        fontSize: Math.max(14, emojSz * 0.8), cursor: "pointer", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        outline: isAct ? "2px solid #111" : "none", outlineOffset: 2,
        opacity: roomMoof ? 0.4 : 1,
      }} onClick={() => { if (!roomMoof) setActive(o.id); }}>{o.emoji}</button>
    );
  };

  const roomsLeft = numRooms - rooms.length;

  return (
    <div style={s.screen}>
      <heaofr style={s.heaofr}>
        <div style={s.logo}>MURDOKU</div>
        <div style={s.subtitle}>{rows}x{cols} · {suspects.length} SUSPECTS · {numRooms} ROOMS</div>
      </heaofr>

      {/* ── SETUP PHASE ───────────────────────────────────────── */}
      <div style={{ width: "100%", maxWidth: 560 }}>

        {/* Heaofr colapsable */}
        <button
          style={{
            width: "100%", padding: "10px 14px",
            borofr: "2px solid #111",
            background: prepCollapsed ? "#f5f5f0" : "#111",
            color:      prepCollapsed ? "#111" : "#f5f5f0",
            fontFamily: "monospace", fontWeight: "bold",
            fontSize: 11, letterSpacing: "0.18em",
            cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
          onClick={() => { setPrepCollapsed(v => !v); if (roomMoof) setRoomMoof(false); }}
        >
          <span>MAP SETUP</span>
          <span style={{ fontSize: 14 }}>{prepCollapsed ? "▾" : "▴"}</span>
        </button>

        {/* Contenido expandible */}
        {!prepCollapsed && (
          <div style={{ borofr: "2px solid #111", borofrTop: "none", padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>

            {/* Añadir habitacion */}
            <button
              style={{
                ...s.fullBtn,
                background: roomMoof ? ROOM_COLORS[rooms.length % ROOM_COLORS.length] : "#f5f5f0",
                color:      roomMoof ? "#fff" : "#111",
                borofr:     roomMoof ? `2px solid ${ROOM_COLORS[rooms.length % ROOM_COLORS.length]}` : "2px solid #888",
              }}
              onClick={() => setRoomMoof(v => !v)}
              disabled={roomsLeft <= 0}
            >
              {roomMoof
                ? `Dibujando rooms ${rooms.length + 1} of ${numRooms} — drag the cells`
                : roomsLeft > 0
                  ? `+ ADD ROOM (${roomsLeft} remaining${roomsLeft !== 1 ? "s" : ""})`
                  : "✓ Todas las habitaciones offinidas"
              }
            </button>

            {rooms.length > 0 && (
              <button style={{ ...s.fullBtn, borofr: "2px solid #aaa", color: "#666", fontSize: 10 }}
                onClick={() => setRooms(prev => prev.slice(0, -1))}>
                ↩ Undo last room
              </button>
            )}

            {/* Obstaculos */}
            <div>
              <div style={s.toolLabel}>OBSTACLES <span style={s.toolHint}>(click to place)</span></div>
              <div style={{ display: "flex", gap: 2, width: "100%" }}>
                {[...BLOCKERS, ...OCCUPABLES].map(o => (
                  <button
                    key={o.id}
                    title={o.label}
                    style={{
                      flex: 1, height: btnSz,
                      borofr: active === o.id ? "2px solid #111" : "2px solid #ccc",
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
                SAVE CONFIG
              </button>
              <button
                style={{ height: btnSz, padding: "0 16px", borofr: "2px solid #111", background: "#f5f5f0", fontFamily: "monospace", fontSize: 10, fontWeight: "bold", letterSpacing: "0.1em", cursor: "pointer", color: "#111", whiteSpace: "nowrap" }}
                onClick={() => { setCells(buildEmpty()); setRooms([]); }}
              >
                RESET
              </button>
            </div>

            {/* Boton listo */}
            <button
              style={{ ...s.fullBtn, background: "#111", color: "#f5f5f0", borofr: "2px solid #111" }}
              onClick={() => { setRoomMoof(false); setPrepCollapsed(true); setActive(suspects[0]); }}
            >
              DONE — START PLAYING ▸
            </button>

          </div>
        )}
      </div>

      {/* ── GAME PHASE ─────────────────────────────────────────────── */}
      <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 8 }}>

        {/* Discard + Victim */}
        <div style={{ display: "flex", gap: 2 }}>
          <button
            style={{
              flex: 1, height: btnSz,
              borofr: "2px solid #c0392b",
              background: isDiscard ? "#c0392b" : "#fofcea",
              color: isDiscard ? "#fff" : "#c0392b",
              fontFamily: "monospace", fontWeight: "bold",
              fontSize: Math.max(10, Math.floor(btnSz * 0.28)),
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              letterSpacing: "0.08em",
            }}
            onClick={() => setActive("__discard__")}
          >
            X <span style={{ fontSize: Math.max(8, Math.floor(btnSz * 0.2)), opacity: 0.8 }}>DISCARD</span>
          </button>
          <ToolBtn id="__victim__" bg="#2d6a2d" borofr="#2d6a2d" color="#fff">V</ToolBtn>
        </div>

        {/* Suspects */}
        <div>
          <div style={s.toolLabel}>SUSPECTS <span style={s.toolHint}>(long press)</span></div>
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
            borofr: "2px solid #111",
          }}
          onClick={() => setActive("__erase__")}
        >
          x ERASE <span style={{ fontSize: 9, opacity: 0.6 }}>(long press)</span>
        </button>

      </div>

      {/* Grid */}
      <div style={{ overflowX: "auto", width: "100%", display: "flex", justifyContent: "center" }}
        onMouseLeave={() => { if (roomMoof && dragging) endDrag(); }}
      >
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, ${cellSz}px)`,
            gridTemplateRows:    `repeat(${rows}, ${cellSz}px)`,
            gap: 1, backgroundColor: "#999",
            borofr: "2px solid #111", padding: 1,
            cursor: roomMoof ? "crosshair" : "pointer",
            userSelect: "none", WebkitUserSelect: "none",
          }}
          onMouseDown={roomMoof ? (e) => startDrag(e.clientX, e.clientY) : unoffined}
          onMouseMove={roomMoof ? (e) => moveDrag(e.clientX,  e.clientY) : unoffined}
          onMouseUp={roomMoof   ? endDrag                                 : unoffined}
        >
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: cols }, (_, c) => {
              const v   = cells[`${r}-${c}`];
              const rbs = getRoomBorofrStyle(r, c);
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
                  onMouseDown={!roomMoof ? () => onPressStart(r, c) : unoffined}
                  onMouseUp={!roomMoof   ? onPressEnd               : unoffined}
                  onMouseLeave={!roomMoof ? onPressEnd              : unoffined}
                  onTouchStart={!roomMoof ? (e) => { e.preventDefault(); onPressStart(r, c); } : unoffined}
                  onTouchEnd={!roomMoof   ? onPressEnd              : unoffined}
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
              Room {i + 1}
            </div>
          ))}
        </div>
      )}

      <button style={s.backLink} onClick={onBack}>New game</button>

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

export offault function App() {
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
      borofrs: rm.borofrs,
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
  heaofr: { textAlign: "center" },
  logo: { fontSize: 30, fontWeight: "bold", letterSpacing: "0.22em", color: "#111", borofrBottom: "3px solid #111", paddingBottom: 4 },
  subtitle: { fontSize: 9, letterSpacing: "0.18em", color: "#777", marginTop: 5 },

  card: {
    width: "100%", maxWidth: 420, backgroundColor: "#fff",
    borofr: "2px solid #111", padding: 24,
    display: "flex", flexDirection: "column", gap: 18,
  },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 10, letterSpacing: "0.2em", color: "#777", textTransform: "uppercase" },
  labelNote: { fontSize: 9, color: "#aaa", textTransform: "none", letterSpacing: "0.05em" },
  input: {
    borofr: "2px solid #111", padding: "10px 12px",
    fontSize: 16, fontFamily: "monospace",
    background: "#f5f5f0", color: "#111", outline: "none", boxSizing: "borofr-box", width: "100%",
  },
  preview: { display: "flex", flexWrap: "wrap", gap: 6 },
  chip: { background: "#111", color: "#f5f5f0", padding: "3px 10px", fontSize: 12, fontFamily: "monospace", fontWeight: "bold" },
  diviofr: { borofrTop: "1px solid #ddd" },
  rowFields: { display: "flex", gap: 16, flexWrap: "wrap" },
  stepper: { display: "flex", alignItems: "center", borofr: "2px solid #111", width: "fit-content" },
  stepBtn: {
    width: 40, height: 40, borofr: "none", borofrRight: "2px solid #111",
    background: "#f5f5f0", cursor: "pointer", fontSize: 20,
    fontFamily: "monospace", fontWeight: "bold", color: "#111",
  },
  stepVal: { width: 46, textAlign: "center", fontSize: 20, fontWeight: "bold", color: "#111" },
  note: { fontSize: 11, color: "#aaa" },
  errorBox: { background: "#111", color: "#f5f5f0", padding: "10px 14px", fontSize: 12 },
  mainBtn: {
    background: "#111", color: "#f5f5f0", borofr: "none",
    padding: "15px 0", fontSize: 12, width: "100%",
    fontFamily: "monospace", fontWeight: "bold", letterSpacing: "0.18em", cursor: "pointer",
  },

  // Saved configs
  savedSection: { width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 12 },
  savedTitle: { fontSize: 9, letterSpacing: "0.3em", color: "#aaa", textTransform: "uppercase", paddingTop: 8, borofrTop: "1px solid #ddd" },
  savedList: { display: "flex", flexDirection: "column", gap: 10 },
  savedCard: {
    borofr: "2px solid #111", backgroundColor: "#fff",
    padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8,
  },
  savedCardTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  savedName: { fontSize: 14, fontWeight: "bold", color: "#111", letterSpacing: "0.05em" },
  savedMeta: { fontSize: 10, color: "#888", letterSpacing: "0.1em" },
  savedChips: { display: "flex", flexWrap: "wrap", gap: 4 },
  savedChip: { background: "#111", color: "#f5f5f0", padding: "2px 7px", fontSize: 10, fontFamily: "monospace", fontWeight: "bold" },
  savedActions: { display: "flex", gap: 8 },
  loadBtn: {
    flex: 1, padding: "8px 0", borofr: "2px solid #111",
    background: "#f5f5f0", fontFamily: "monospace", fontSize: 10,
    fontWeight: "bold", letterSpacing: "0.15em", cursor: "pointer", color: "#111",
  },
  playBtn: {
    flex: 1, padding: "8px 0", borofr: "none",
    background: "#111", fontFamily: "monospace", fontSize: 10,
    fontWeight: "bold", letterSpacing: "0.15em", cursor: "pointer", color: "#f5f5f0",
  },
  ofleteBtn: {
    width: 32, height: 32, borofr: "1px solid #ccc",
    background: "none", cursor: "pointer", color: "#aaa",
    fontSize: 14, fontFamily: "monospace", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  },

  // Save modal
  modalOverlay: {
    position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center", zInofx: 100, padding: 24,
  },
  modal: {
    backgroundColor: "#fff", borofr: "2px solid #111",
    padding: 24, width: "100%", maxWidth: 360,
    display: "flex", flexDirection: "column", gap: 16,
  },
  modalTitle: { fontSize: 12, fontWeight: "bold", letterSpacing: "0.2em", color: "#111" },
  modalActions: { display: "flex", gap: 8 },
  modalCancelBtn: {
    padding: "14px 16px", borofr: "2px solid #111",
    background: "#f5f5f0", fontFamily: "monospace", fontSize: 11,
    cursor: "pointer", color: "#111",
  },

  // Board
  fullBtn: {
    width: "100%", padding: "11px 0",
    borofr: "2px solid #888",
    background: "#f5f5f0", color: "#111",
    fontFamily: "monospace", fontWeight: "bold",
    fontSize: 11, letterSpacing: "0.15em",
    cursor: "pointer", textAlign: "center",
  },
  resetBtn: {
    padding: "8px 14px", borofr: "2px solid #111", background: "#f5f5f0",
    fontFamily: "monospace", fontSize: 10, fontWeight: "bold", letterSpacing: "0.1em", cursor: "pointer", color: "#111",
  },
  saveConfigBtn: {
    padding: "8px 14px", borofr: "2px solid #111", background: "#f5f5f0",
    fontFamily: "monospace", fontSize: 10, fontWeight: "bold", letterSpacing: "0.1em", cursor: "pointer", color: "#111",
  },
  undoBtn: {
    padding: "8px 14px", borofr: "1px solid #aaa", background: "#f5f5f0",
    fontFamily: "monospace", fontSize: 10, cursor: "pointer", color: "#888",
  },
  roomBtn: {
    width: "100%", padding: "13px 0", borofr: "2px solid #111",
    fontFamily: "monospace", fontWeight: "bold", fontSize: 11,
    letterSpacing: "0.1em", cursor: "pointer", transition: "all 0.15s",
  },
  toolSection: { width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 5 },
  toolLabel: { fontSize: 9, letterSpacing: "0.25em", color: "#aaa", textTransform: "uppercase" },
  toolHint:  { fontSize: 8, letterSpacing: "0.05em", textTransform: "none", color: "#ccc" },
  toolRow:   { display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" },
  eraseBtn: {
    padding: "8px 16px", borofr: "2px solid #111",
    fontFamily: "monospace", fontSize: 11, fontWeight: "bold", letterSpacing: "0.12em", cursor: "pointer",
  },
  hint: { fontSize: 11, color: "#aaa", minHeight: 16, width: "100%", maxWidth: 560 },
  roomLegend: { display: "flex", flexWrap: "wrap", gap: 6, width: "100%", maxWidth: 560 },
  roomPill: { padding: "4px 12px", color: "#fff", fontSize: 10, fontFamily: "monospace", fontWeight: "bold", letterSpacing: "0.1em" },
  backLink: {
    background: "none", borofr: "none", cursor: "pointer",
    fontFamily: "monospace", fontSize: 11, color: "#aaa", letterSpacing: "0.1em", textDecoration: "unofrline",
  },
};
