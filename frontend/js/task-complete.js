async function loadProgress() {

const result = await apiFetch("/api/tasks/progress/", { method: "GET" });
  if (!result.ok) {
    console.error("Failed");
    return "Unable to get task data";
  }
  const data = await result.json();
  document.getElementById("tasks-completed").textContent = data.completed;
  document.getElementById("tasks-remaining").textContent = data.total - data.completed;
  return `${data.completed}/${data.total} Tasks Completed`;
}


loadProgress()

const params = new URLSearchParams(window.location.search)
const taskName = params.get("name")
document.getElementById("completed-task-name").textContent = taskName;

function addTask() {
  window.location.href = "add-task.html";
}
document.getElementById("add-task-btn").addEventListener("click", addTask);
