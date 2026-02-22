// src/utils/getImageUrl.js
const DEFAULT_BASE_URL = import.meta.env.VITE_API_URL;

export function getImageUrl(source, baseUrl = DEFAULT_BASE_URL) {
  let path = "";

  // 1. Extract path from Product object, Image object, or String
  if (typeof source === "string") {
    path = source;
  } else if (source?.url) {
    // If source is the image object itself
    path = source.url;
  } else if (source?.images?.[0]?.url) {
    // If source is the full product object
    path = source.images[0].url;
  }

  // 2. Return Placeholder if no path found
  if (!path) {
    return "https://via.placeholder.com/600x600?text=No+Image";
  }

  // 3. Absolute URLs (Cloudinary / External)
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // 4. Relative URLs (Legacy Local Storage)
  const normalizedBase = baseUrl?.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
}
