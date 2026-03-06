// ImageHelper.js – offline mode: no backend image serving
export function getImageURL(path) {
  if (!path) return null;
  // If it's already a full data URL or absolute URL, return as-is
  if (path.startsWith("data:") || path.startsWith("http")) return path;
  // Offline: return null so UI falls back to placeholder icons
  return null;
}
