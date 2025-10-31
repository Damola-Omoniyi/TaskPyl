async function loadProgress() {
  /**This loads the progress data so how many tasks have been completed out of the total */
  const result = await apiFetch("/api/tasks/progress/", { method: "GET" });
  if (!result.ok) {
    // TODO: Make this more descriptive
    console.error("Failed");
    return "Unable to get task data";
  }
  const data = await result.json();
  // Set the progress bar
  // TODO: Separate loading the progress bar into it's own function
  document.getElementById("task-progress-bar").value = data.completed;
  document.getElementById("task-progress-bar").max = data.total;
  return `${data.completed}/${data.total} Tasks Completed`;
}

async function addProgressLabel(id) {
  try {
    document.getElementById(id).textContent = await loadProgress();
  } catch (err) {
    console.error(err);
    document.getElementById(id).textContent = "Error loading progress";
  }
}

async function getSummary() {
  const result = await apiFetch("/api/summary/", { method: "GET" });
  if (!result.ok) {
    // TODO: Make this more descriptive
    console.error("Failed to get Task Summaries");
    return "Unable to get summary data";
  }
  const data = await result.json();
  console.log(data);
  return data;
}

async function LoadAndRenderTasks() {
  const data = await getSummary();
 /* const data1 = {
    0: {
      id: 14,
      user: "Malik",
      task_name: "Finish lab write up",
      end_date: "2025-10-13",
    },
    1: {
      id: 15,
      user: "Malik",
      task_name: "Complete Math Homework",
      end_date: "2025-10-13",
    },
    2: { id: 16, user: "Malik", task_name: "dd", end_date: "2025-10-13" },
  };
  if (!data) {
    console.error("Unable to get summary");
    return;
  }*/
  //console.log(data);
  for (const [taskId, task] of Object.entries(data)) {
    // taskID seems redundant
    createTaskListItem(task.task_name, task.end_date, task.id);
  }
  return;
}

function createTaskListItem(taskName, taskDeadline, taskId) {
    console.log("bitch");

  let taskListItem = document.createElement("div");
  taskListItem.className = "task-card";

  taskListItem.addEventListener("click", function () {
    localStorage.setItem("taskname", taskName);
    localStorage.setItem("taskId", taskId);
    //alert("display task data");
    window.location.href = `task.html?id=${taskId}`;
  });
  
  let taskInfoDiv= document.createElement("div");
  taskInfoDiv.className = "task-info";
  taskListItem.appendChild(taskInfoDiv);

  let Name = document.createElement("p");
  Name.className = "task-name";
  Name.textContent = taskName;

  let taskDate = document.createElement("p");
  taskDate.textContent = formatDate(taskDeadline);
  taskInfoDiv.appendChild(Name);
  taskInfoDiv.appendChild(taskDate);

const btn = document.createElement("button");
btn.className = "complete-btn";
btn.id="complete-task-btn";
btn.innerHTML = '<i class="fas fa-check"></i>';
taskListItem.appendChild(btn);
document.querySelector("main").appendChild(taskListItem);

}






async function checkTask(e, taskName, taskId) {
  e.stopPropagation();
  console.log(taskId);
  alert(`${taskName} completed`);

  const response = await apiFetch(`/api/tasks/${taskId}/complete_task/`, {
    method: "PATCH",
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    console.error("Failed to complete task", response.status);
    alert("Failed to mark task complete.");
    return;
  }

  window.location.href = `completetask.html?name=${encodeURIComponent(
    taskName
  )}`;
}

function editTask(e, taskName) {
  e.stopPropagation();
  alert(`${taskName} to be edited`);
}

function addTask() {
  window.location.href = "add-task.html";
}

addProgressLabel("task-progress-text");
LoadAndRenderTasks();
//document.getElementById('complete-task-btn').addEventListener('click', window.location.href="completedtasks.html")
document.getElementById("add-task-btn").addEventListener("click", addTask);

