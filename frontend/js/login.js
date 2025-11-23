async function loginUser(event, base_path) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const loginData = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`${base_path}/api/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });
    const result = await response.json();
    if (response.ok) {
      localStorage.setItem("username", loginData.username);
      localStorage.setItem("access", result.access);
      localStorage.setItem("refresh", result.refresh);

      window.location.href = "index.html";
    } else {
      alert(`Login failed: ${result.detail || response.statusText}`);
    }
  } catch (err) {
    console.error("Login failed with connection error:", err);
    alert(
      "Connection error. Please check your network and try again. Details: " +
      err.message
    );
  }
}

const form = document.getElementById("loginForm");
form.addEventListener("submit", (event) => loginUser(event, CONFIG.API_BASE));
