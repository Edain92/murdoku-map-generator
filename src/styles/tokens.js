// ── Design tokens ─────────────────────────────────────────────────────────────

export const COLOR = {
  paperWhite:    "#F2F1EE",
  inkBlack:      "#111111",
  detectiveGray: "#5A5A57",
  bloodRed:      "#C6453D",
  evidenceGreen: "#4B7A43",

  // Obstacle fills (muted/desaturated)
  rug:   "#D98B8B",
  bed:   "#D8C79E",
  water: "#A9C7DF",
  sofa:  "#C9B3D9",
};

export const FONT = {
  mono: "'Courier New', Courier, monospace",
  // Serif noir — loaded via Google Fonts in index.html
  serif: "'Playfair Display', Georgia, serif",
};

export const BORDER = {
  heavy: `3px solid ${COLOR.inkBlack}`,
  mid:   `2px solid ${COLOR.inkBlack}`,
  light: `1px solid ${COLOR.inkBlack}`,
  muted: `1px solid #C8C7C4`,
  dashed:`2px dashed #C8C7C4`,
};
