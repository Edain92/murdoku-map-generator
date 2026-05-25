/**
 * Parses a letter range string (e.g. "a-h") into an array of uppercase letters.
 * Returns null if the format is invalid.
 */
export function parseRange(raw) {
  const m = raw.trim().toLowerCase().match(/^([a-z])-([a-z])$/);
  if (!m) return null;
  const a = m[1].charCodeAt(0);
  const b = m[2].charCodeAt(0);
  if (a > b) return null;
  return Array.from({ length: b - a + 1 }, (_, i) =>
    String.fromCharCode(a + i).toUpperCase()
  );
}
