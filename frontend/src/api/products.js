const API_BASE = "http://localhost:3000/api";

export async function getAllProducts() {
  const res = await fetch(`${API_BASE}/products`);

  if (!res.ok) throw new Error("Failed to fetch products");

  const data = await res.json();
  return data.docs;
}

export async function getProductBySlug(slug) {
  const res = await fetch(
    `${API_BASE}/products?where[slug][equals]=${slug}`
  )

  if (!res.ok) throw new Error('Failed to fetch product')

  const data = await res.json()
  return data.docs[0]
}