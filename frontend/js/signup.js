const form = document.getElementById('signUpForm');

form.addEventListener('submit', signUpUser);

async function signUpUser(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`${CONFIG.API_BASE}/api/signup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    alert(JSON.stringify(result));

    if (response.ok) {
      window.location.href = 'login.html';
    } else {
      alert(`Signup failed: ${result.detail || response.statusText}`);
    }
  } catch (err) {
    alert("Signup failed: " + err.message);
  }
}
