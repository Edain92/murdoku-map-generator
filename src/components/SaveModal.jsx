import { useState } from "react";
import { base, COLOR, FONT } from "../styles/index.js";

export function SaveModal({ onSave, onCancel }) {
  const [name, setName] = useState("");
  return (
    <div style={base.modalOverlay}>
      <div style={base.modal}>
        <div style={{ fontSize: 11, fontWeight: "bold", letterSpacing: "0.22em", color: COLOR.inkBlack, fontFamily: FONT.mono }}>
          SAVE CONFIGURATION
        </div>
        <input
          style={base.input}
          placeholder="Puzzle name..."
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) onSave(name.trim()); }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{ padding: "13px 16px", border: `2px solid ${COLOR.inkBlack}`, background: COLOR.paperWhite, fontFamily: FONT.mono, fontSize: 11, cursor: "pointer", color: COLOR.inkBlack }}
            onClick={onCancel}
          >Cancel</button>
          <button
            style={{ ...base.mainBtn, flex: 1 }}
            onClick={() => { if (name.trim()) onSave(name.trim()); }}
            disabled={!name.trim()}
          >SAVE</button>
        </div>
      </div>
    </div>
  );
}
