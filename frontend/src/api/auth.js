const API_URL = import.meta.env.VITE_API_URL;

/* ---------------- SIGNUP ---------------- */

export async function signup(data) {
  const res = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    credentials: "include", // IMPORTANT for cookies
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.errors?.[0]?.message || "Signup failed");
  }

  const result = await res.json();

  // Payload returns { user, token }
  return result.doc;
}

/* ---------------- LOGIN ---------------- */

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: "POST",
    credentials: "include", // REQUIRED for session cookie
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.errors?.[0]?.message || "Invalid credentials");
  }

  const result = await res.json();

  return result.user;
}

/* ---------------- LOGOUT ---------------- */

export async function logout() {
  await fetch(`${API_URL}/api/users/logout`, {
    method: "POST",
    credentials: "include",
  });
}

/* ---------------- CURRENT USER ---------------- */

export async function getMe() {
  const res = await fetch(`${API_URL}/api/users/me`, {
    credentials: "include",
  });

  if (!res.ok) return null;

  const data = await res.json();

  return data.user;
}
