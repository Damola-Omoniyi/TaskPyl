 document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
          username: document.getElementById('username').value,
          password: document.getElementById('password').value
        };

        try {
            const response = await fetch('https://contained-medicaid-robert-gabriel.trycloudflare.com/api/login/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                localStorage.setItem('username', data.username);
                window.location.href = 'index.html';
            } else {
                alert('Login failed');
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    });
