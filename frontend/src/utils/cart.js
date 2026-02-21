const CART_KEY = "cart";

/* ---------- Get Cart ---------- */

export function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

/* ---------- Save Cart ---------- */

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* ---------- Add Item ---------- */

export function addToCart(productId, quantity = 1) {
  const cart = getCart();

  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  saveCart(cart);
}

/* ---------- Update Quantity ---------- */

export function updateQuantity(productId, quantity) {
  let cart = getCart();

  cart = cart.map((item) =>
    item.productId === productId ? { ...item, quantity } : item,
  );

  saveCart(cart);
}

/* ---------- Remove Item ---------- */

export function removeFromCart(productId) {
  let cart = getCart();

  cart = cart.filter((item) => item.productId !== productId);

  saveCart(cart);
}

/* ---------- Clear Cart ---------- */

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}
