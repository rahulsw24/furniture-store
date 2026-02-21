export function getImageUrl(product, baseUrl) {
  const url = product.images?.[0]?.url;
  if (!url) return "https://via.placeholder.com/600x600?text=No+Image";
  return url.startsWith("http") ? url : baseUrl + url;
}
