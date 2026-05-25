import { base } from "../../styles/index.js";

export function Stepper({ label, value, onChange, min = 2, max = 20 }) {
  return (
    <div style={base.field}>
      <label style={base.label}>{label}</label>
      <div style={base.stepper}>
        <button style={base.stepBtn} onClick={() => onChange((v) => Math.max(min, v - 1))}>
          -
        </button>
        <span style={base.stepVal}>{value}</span>
        <button style={{ ...base.stepBtn, borderRight: "none" }} onClick={() => onChange((v) => Math.min(max, v + 1))}>
          +
        </button>
      </div>
    </div>
  );
}
