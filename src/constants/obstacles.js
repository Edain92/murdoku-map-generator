import { COLOR } from "../styles/tokens.js";

export const BLOCKERS = [
  { id: "table",  emoji: "🟫", label: "Table" },
  { id: "tv",     emoji: "📺", label: "TV"    },
  { id: "plant",  emoji: "🪴", label: "Plant" },
];

export const OCCUPABLES = [
  { id: "rug",   emoji: "🟥", label: "Rug",   color: COLOR.rug,   text: "#6B2020" },
  { id: "sofa",  emoji: "🛋️", label: "Sofa",  color: COLOR.sofa,  text: "#4A2A6A" },
  { id: "water", emoji: "💧", label: "Water", color: COLOR.water, text: "#1A3A5A" },
  { id: "bed",   emoji: "🛏️", label: "Bed",   color: COLOR.bed,   text: "#5A4A2A" },
];

export const ALL_OBSTACLES = [...BLOCKERS, ...OCCUPABLES];

export const getObstacle = (id) => ALL_OBSTACLES.find((o) => o.id === id);
export const isBlocker   = (id) => BLOCKERS.some((o) => o.id === id);
export const isOccupable = (id) => OCCUPABLES.some((o) => o.id === id);
