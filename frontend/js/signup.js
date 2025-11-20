const form = document.getElementById("signUpForm");

async function signUpUser(event, base_path) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const signUpData = Object.fromEntries(formData.entries());

  try {

    const response = await fetch(`${base_path}/api/signup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signUpData),
    });

    const result = await response.json();

    if (response.ok) {
      window.location.href = "login.html";
    } else {
      alert(`Signup failed: ${result.detail || response.statusText}`);
    }
    
  } catch (err) {
    alert("Connection error. Please check your network and try again. Details: "  + err.message);
  }
}

form.addEventListener("submit", (event)=>signUpUser(event, CONFIG.API_BASE));
