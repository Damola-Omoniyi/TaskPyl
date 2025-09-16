async function loadProgress() {
  /**This loads the progress data so how many tasks have been completed out of the total */
  const result = await apiFetch("/api/tasks/progress/", {method:"GET"});
  if(!result.ok){
    // TODO: Make this more descriptive
    console.error("Failed");
    return "Unable to get task data";
  }
  const data = await result.json();
  document.getElementById("task-progress-bar").value = data.completed;
  document.getElementById("task-progress-bar").max = data.total;
  return `${data.completed}/${data.total}`
}

async function addProgressLabel(id) {
  try {
    document.getElementById(id).textContent = await loadProgress();
  } catch (err) {
    console.error(err);
    document.getElementById(id).textContent = "Error loading progress";
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",  
    day: "numeric",    
    month: "short"     
  });
}

async function getSummary() {
  const result = await apiFetch("/api/summary/", {method:"GET"});
  if(!result.ok){
    // TODO: Make this more descriptive
    console.error("Failed");
    return "Unable to get summary data";
  }
  const data = await result.json();
  // console.log(data);
  return data.results;
}

async function LoadAndRenderTasks(){
  const data = await getSummary()
  if(!data){
    console.error("Unable to get summary");
    return;
  }
  for (const [taskId, task] of Object.entries(data)) {
  createTaskListItem(task.task_name, task.end_date, taskId);
}
  return;}

function createTaskListItem(taskName, taskDeadline, taskId) {
  let taskListItem = document.createElement("li");
  taskListItem.className = "task-item";
  taskListItem.addEventListener('click', function() {
    localStorage.setItem('taskname', taskName);
    localStorage.setItem('taskId', taskId);
    alert("display task data");
      window.location.href = 'taskinfo.html';});
  taskListItem.appendChild(createTaskDiv(taskName, taskDeadline));
  taskListItem.appendChild(createTaskButtonDiv(taskName));
  document.getElementById("Tasks-list").appendChild(taskListItem);
}

function createTaskDiv(taskName, taskDeadline){
  let taskDiv = document.createElement("div");
  taskDiv.className = "task-info";
  taskDiv.appendChild(createTaskSpanDate(taskDeadline));
  taskDiv.appendChild(createTaskSpanName(taskName));
  return taskDiv;
}

function createTaskSpanName(taskName){
  let spanName = document.createElement("span");
  spanName.className = "task-name";
  spanName.textContent = taskName;
  return spanName;
}

function createTaskSpanDate(taskDeadline){
  let spanDate = document.createElement("span");
  spanDate.className = "task-date";
  spanDate.textContent = formatDate(taskDeadline);
  return spanDate;
}
  

function createTaskButtonDiv(taskName){
  let buttonDiv = document.createElement("div");
  buttonDiv.className = "task-actions";
  buttonDiv.appendChild(createEditButton(taskName));
  buttonDiv.appendChild(createCheckButton(taskName));
  return buttonDiv;
}

function createEditButton(taskName){
  let buttonEdit = document.createElement("button");
  buttonEdit.className = "task-action-btn";
  let iconEdit = document.createElement("i");
  iconEdit.className = "far fa-edit";
  buttonEdit.appendChild(iconEdit);
  buttonEdit.addEventListener('click', (e) => editTask(e, taskName));

  return buttonEdit;
}
function createCheckButton(taskName){
  let buttonCheck = document.createElement("button");
  buttonCheck.className = "task-action-btn";
  let iconCheck = document.createElement("i");
  iconCheck.className = "far fa-check-circle";
  buttonCheck.appendChild(iconCheck);
  buttonCheck.addEventListener('click', (e) => completeTask(e, taskName));

  return buttonCheck;
}

function completeTask(e, taskName){
    e.stopPropagation();
    alert(`${taskName} completed`);
}
function editTask(e, taskName){
    e.stopPropagation();
    alert(`${taskName} to be edited`);
}
  
function addTask(){
  window.location.href = "addtask.html";
}
