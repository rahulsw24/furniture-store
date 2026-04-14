const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

export async function getAllProducts() {
  const res = await fetch(`${API_BASE}/products`);

  if (!res.ok) throw new Error("Failed to fetch products");

  const data = await res.json();
  return data.docs;
}

export async function getProductBySlug(slug) {
  const res = await fetch(
    `${API_BASE}/products?where[slug][equals]=${slug}&depth=4`,
  );

  if (!res.ok) throw new Error("Failed to fetch product");

  const data = await res.json();
  return data.docs[0];
}
