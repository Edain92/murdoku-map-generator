import { useState } from "react";
import { Stepper } from "./Stepper.jsx";
import { SavedConfigs } from "./SavedConfigs.jsx";
import { Logo } from "../shared/Logo.jsx";
import { parseRange } from "../../utils/suspects.js";
import { base, COLOR } from "../../styles/index.js";

export function SetupScreen({ onPlay, configs, onDeleteConfig }) {
  const [range, setRange] = useState("a-h");
  const [rows,  setRows]  = useState(9);
  const [cols,  setCols]  = useState(9);
  const [rooms, setRooms] = useState(6);
  const [error, setError] = useState("");

  const suspects = parseRange(range);

  const handlePlay = () => {
    if (!suspects) { setError("Invalid format. Use e.g. a-h"); return; }
    setError("");
    onPlay({ rows, cols, suspects, numRooms: rooms, range });
  };

  const handleLoad = (cfg) => {
    setRange(cfg.range); setRows(cfg.rows);
    setCols(cfg.cols);   setRooms(cfg.rooms);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlayDirect = (cfg, susp) => {
    onPlay({ rows: cfg.rows, cols: cfg.cols, suspects: susp,
             numRooms: cfg.rooms, range: cfg.range,
             roomLayout: cfg.roomLayout, cellState: cfg.cellState });
  };

  return (
    <div style={base.screen}>
      <header style={base.header}>
        <Logo subtitle="Game Setup" />
      </header>

      <div style={base.card}>
        <div style={base.field}>
          <label style={base.label}>
            Suspect range <span style={base.labelNote}>(e.g. a-h)</span>
          </label>
          <input
            style={{ ...base.input, maxWidth: 120 }}
            placeholder="a-h"
            value={range}
            onChange={(e) => { setRange(e.target.value); setError(""); }}
          />
          {suspects && (
            <div style={base.preview}>
              {suspects.map((id) => <span key={id} style={base.chip}>{id}</span>)}
              <span style={{ ...base.chip, background: COLOR.evidenceGreen }}>V</span>
            </div>
          )}
          {!suspects && range && <div style={base.errorBox}>Invalid format. Use e.g. a-h</div>}
        </div>

        <div style={base.divider} />

        <div style={base.rowFields}>
          <Stepper label="Rows"  value={rows}  onChange={setRows}  min={3} />
          <Stepper label="Cols"  value={cols}  onChange={setCols}  min={3} />
          <Stepper label="Rooms" value={rooms} onChange={setRooms} min={1} />
        </div>
        <div style={base.note}>
          Grid {rows}×{cols} · {rooms} rooms · {suspects?.length ?? "?"} suspects
        </div>

        {error && <div style={base.errorBox}>{error}</div>}

        <button style={base.mainBtn} onClick={handlePlay} disabled={!suspects}>
          GENERATE BOARD
        </button>
      </div>

      <SavedConfigs
        configs={configs}
        onLoad={handleLoad}
        onPlay={handlePlayDirect}
        onDelete={onDeleteConfig}
      />
    </div>
  );
}
