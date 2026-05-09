import { API } from "../config/config";

export function getImageURL(path) {
  if (!path) return null;
  // If it's already a full data URL or absolute URL, return as-is
  if (path.startsWith("data:") || path.startsWith("http")) return path;

  // Prepend backend base URL. The backend serves static files from /public
  // Assuming path is like "public/images/..." or "/public/images/..."
  const baseURL = API.replace("/api/v1", ""); // Get base URL like http://localhost:3000
  
  // Ensure path starts with a slash if it doesn't
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  
  return `${baseURL}${normalizedPath}`;
}
