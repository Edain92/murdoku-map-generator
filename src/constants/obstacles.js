export const BLOCKERS = [
  { id: "table",  emoji: "🟫", label: "Table" },
  { id: "tv",     emoji: "📺", label: "TV"    },
  { id: "plant",  emoji: "🪴", label: "Plant" },
];

export const OCCUPABLES = [
  { id: "rug",    emoji: "🟥", label: "Rug",   color: "#e8a0a0", text: "#7a2020" },
  { id: "sofa",   emoji: "🛋️", label: "Sofa",  color: "#f0d080", text: "#7a5a00" },
  { id: "water",  emoji: "💧", label: "Water", color: "#a0c8f0", text: "#1a4a7a" },
  { id: "bed",    emoji: "🛏️", label: "Bed",   color: "#c8a8e0", text: "#4a1a7a" },
];

export const ALL_OBSTACLES = [...BLOCKERS, ...OCCUPABLES];

export const getObstacle = (id) => ALL_OBSTACLES.find((o) => o.id === id);
export const isBlocker   = (id) => BLOCKERS.some((o) => o.id === id);
export const isOccupable = (id) => OCCUPABLES.some((o) => o.id === id);
