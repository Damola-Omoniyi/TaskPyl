let task_data;
async function fetchTasks() {
  const username = localStorage.getItem('username');
  if (!username) {
    alert("No username found in localStorage.");
     window.location.href = 'login.html';
    return;}

  const taskData = { username: username };

  try {
    const response = await fetch(`${CONFIG.API_BASE}/api/dashboard/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    tasks = document.getElementById("tasks");
    console.log(data);
    // TODO: Use the data to update your dashboard UI here
   for (const [key, values] of Object.entries(data)) {
    
  if (values.name) {
    const task_li = document.createElement("li");

    let isFirst = true; //  Flag to detect the first entry
    let counter = 0;
    for (const [innerKey, value] of Object.entries(values)) {
    classNames = ["task-title", "task-info", "task-info start-date", "task-info end-date"];
      if (typeof value === "boolean") continue; // Skip booleans
      const item = document.createElement("span");
      item.className = classNames[counter];
      if (isFirst) {
        const name = document.createElement("a");
        name.href = "taskinfo.html";
        name.textContent = value;
        name.addEventListener("click", function (event) {
         event.preventDefault()
        localStorage.setItem('taskname', value)
        window.location.href = 'taskinfo.html';} )
        item.appendChild(name);
        isFirst = false; // Make sure only the first one gets this
      } else {
        item.textContent = value;
        if (counter >2){ item.dataset.date = value;
                          console.log("i ran");}
      }
      task_li.appendChild(item);
      counter += 1;
    }

    tasks.appendChild(task_li);
  }
}

    const status = document.getElementById("completion-status")
    status.textContent =data.completion_status;
  } catch (err) {
    alert("Failed to fetch tasks: " + err.message);
  }
}
