async function apiFetch(endpoint, options = {}) {
  const accessToken = localStorage.getItem("access");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  const response = await fetch(`${CONFIG.API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  return response;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function scheduleTokenRefresh(refreshToken, setAccessToken) {
  // Refresh 1 min before expiry (adjust as needed)
  const interval = 4 * 60 * 1000;
  setInterval(async () => {
    const res = await fetch("/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (res.ok) {
      const data = await res.json();
      setAccessToken(data.access);
    } else {
      // Refresh failed → force logout
    }
  }, interval);
}
