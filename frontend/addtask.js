
const username = localStorage.getItem('username');
    const form = document.getElementById('task');

    form.addEventListener('submit', async(event) => {
      event.preventDefault();
      const taskData = {
        taskName: document.getElementById('taskName').value,
        startDate: document.getElementById('startDate').value,
        deadline: document.getElementById('deadline').value,
        urgency: document.getElementById('urgency').value,
        description: document.getElementById('description').value,
        username: username
      };

      try {
        const response = await fetch(`${CONFIG.API_BASE}/api/create-task/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify(taskData)
        });

        const result = await response.json();
        alert(JSON.stringify(result));

        if (response.ok){
          window.location.href = 'index.html';
        }

        alert("Task created successfully: " + JSON.stringify(result));
      } catch(err) {
        alert("Task creation failed: " + err.message);
      }
    });

