document.getElementById('loginForm').addEventListener('submit', login);

async function login(event) {
  event.preventDefault();

  const data = {
    username: document.getElementById('username').value,
    password: document.getElementById('password').value,
  };

  try {
    const response = await fetch(`${CONFIG.API_BASE}/api/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();

      localStorage.setItem('username', data.username);
      localStorage.setItem('access', result.access);
      localStorage.setItem('refresh', result.refresh);

      scheduleTokenRefresh(result.refresh, (newAccess) => {
        localStorage.setItem('access', newAccess);
      });

      window.location.href = 'index.html';
    } else {
      alert('Login failed');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
}
