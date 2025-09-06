  const form = document.getElementById('myform');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${CONFIG.API_BASE}/api/signup/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            alert(JSON.stringify(result));

            if (response.ok){
              window.location.href = 'login.html';
            }
        } catch (err) {
            alert("Signup failed: " + err.message);
        }
    });
