
// Get the API base URL from environment variables with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;

// Log the API base URL for debugging purposes
console.log('API Base URL used by api.ts:', API_BASE_URL);

export async function login(username: string, password: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.message || "Login failed");
    
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function register(username: string, password: string, role: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });
    
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.message || "Register failed");
    
    return data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
}

// Add more API functions as needed for your application
export async function fetchWalks() {
  try {
    const token = localStorage.getItem('secureWalkToken');
    
    const res = await fetch(`${API_BASE_URL}/api/walks`, {
      headers: { 
        "Authorization": `Bearer ${token}`
      }
    });
    
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.message || "Failed to fetch walks");
    
    return data;
  } catch (error) {
    console.error("Fetch walks error:", error);
    throw error;
  }
}

export async function fetchWalkDetails(walkId: string) {
  try {
    const token = localStorage.getItem('secureWalkToken');
    
    const res = await fetch(`${API_BASE_URL}/api/walk-details/${walkId}`, {
      headers: { 
        "Authorization": `Bearer ${token}`
      }
    });
    
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.message || "Failed to fetch walk details");
    
    return data;
  } catch (error) {
    console.error("Fetch walk details error:", error);
    throw error;
  }
}
