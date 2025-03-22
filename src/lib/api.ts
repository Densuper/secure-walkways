const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function login(username: string, password: string) {
  const res = await fetch(\`\${API_BASE_URL}/api/auth/login\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
}

export async function register(username: string, password: string, role: string) {
  const res = await fetch(\`\${API_BASE_URL}/api/auth/register\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Register failed");
  return data;
}
