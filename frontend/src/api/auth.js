const API_URL = import.meta.env.VITE_API_URL;

/* ---------------- SYNC SUPABASE (GOOGLE AUTH) ---------------- */

export async function loginWithSupabaseToken(token) {
  const res = await fetch(`${API_URL}/api/sync-supabase`, {
    // 👈 Matching the new path
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Google sync failed");
  }

  const result = await res.json();

  // Return the user object so AuthContext can setUser()
  return result.user;
}

/* ---------------- SIGNUP ---------------- */

export async function signup(data) {
  const res = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.errors?.[0]?.message || "Signup failed");
  }

  const result = await res.json();
  return result.doc;
}

/* ---------------- LOGIN ---------------- */

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: "POST",
    credentials: "include",
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
