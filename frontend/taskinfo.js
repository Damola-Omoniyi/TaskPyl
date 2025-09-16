  const timeDisplay = document.getElementById('timeSpent');
  const toggleBtn = document.getElementById('toggleTimerBtn');

    let timer = null;
    let secondsElapsed = 0;
    let running = false;

    function formatTime(sec) {
      const hrs = String(Math.floor(sec / 3600)).padStart(2, '0');
      const mins = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
      const secs = String(sec % 60).padStart(2, '0');
      return `${hrs}:${mins}:${secs}`;
    }

    function updateTimer() {
      secondsElapsed++;
      timeDisplay.textContent = formatTime(secondsElapsed);
    }

    toggleBtn.addEventListener('click', () => {
      if (!running) {
        timer = setInterval(updateTimer, 1000);
        toggleBtn.textContent = 'Pause';
        running = true;
      } else {
        clearInterval(timer);
        toggleBtn.textContent = 'Resume';
        running = false;
      }
    });

    async function fetchTask() {
      const username = localStorage.getItem('username');
      const taskname = localStorage.getItem('taskname');

      if (!username) {
        alert("No username found in localStorage.");
        window.location.href = 'login.html';
        return;
      }

      if (!taskname) {
        alert("No task found in localStorage.");
        window.location.href = 'index.html';
        return;
      }

      const taskData = { username: username, taskname: taskname };

      try {
        const response = await fetch(`${CONFIG.API_BASE}/api/task`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify(taskData),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        // Update DOM with task data
        document.getElementById('taskName').textContent = data.name || 'N/A';
        document.getElementById('urgency').textContent = data.urgency || 'N/A';
        document.getElementById('startDate').textContent = data.start_date || 'N/A';
        document.getElementById('deadline').textContent = data.end_date || 'N/A';
        document.getElementById('description').textContent = data.description || 'No description provided.';

        // If backend sent time_spent in seconds, populate and pause timer
        if (typeof data.time_spent === 'number') {
          secondsElapsed = data.time_spent;
          timeDisplay.textContent = formatTime(secondsElapsed);
        }

      } catch (error) {
        console.error("Error fetching task:", error);
        alert("Failed to load task info.");
      }
    }

   
    window.addEventListener('DOMContentLoaded', fetchTask);
  
async function fetchTaskAPi(taskId){
    const result = await apiFetch(`/api/tasks/${taskId}/`, {method:"GET"});
    console.log(result.json());
    return;
}
const taskId = localStorage.getItem('taskId');
fetchTaskAPi(`1`)
