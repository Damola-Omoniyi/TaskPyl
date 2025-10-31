

async function getSummary() {
  const result = await apiFetch("/api/complete-summary/", {method:"GET"});
  if(!result.ok){
    // TODO: Make this more descriptive
    console.error("Failed to get Task Summaries");
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
  console.log(data);
  for (const [taskId, task] of Object.entries(data)) { // taskID seems redundant
  createTaskListItem(task.task_name, task.end_date, task.id);
}
  return;}

function createTaskListItem(taskName, taskDeadline, taskId) {
  let taskListItem = document.createElement("li");
  taskListItem.className = "task-item";
  taskListItem.style = "opacity: 0.6;"

  taskListItem.addEventListener('click', function() {
    localStorage.setItem('taskname', taskName);
    localStorage.setItem('taskId', taskId);
    //alert("display task data");
    //window.location.href = 'taskinfo.html';
    window.location.href = `taskinfo.html?id=${taskId}`;});

  taskListItem.appendChild(createTaskDiv(taskName, taskDeadline));
  taskListItem.appendChild(createTaskButtonDiv(taskName, taskId));
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
  spanName.style="text-decoration: line-through;"
  return spanName;
}

function createTaskSpanDate(taskDeadline){
  let spanDate = document.createElement("span");
  spanDate.className = "task-date";
  spanDate.textContent = formatDate(taskDeadline);
  return spanDate;
}
  

function createTaskButtonDiv(taskName, taskID){
  let buttonDiv = document.createElement("div");
  buttonDiv.className = "task-actions";
  //buttonDiv.appendChild(createEditButton(taskName));
  buttonDiv.appendChild(createCheckButton(taskName, taskID));
  return buttonDiv;
}


function createCheckButton(taskName, taskId){
  let buttonCheck = document.createElement("button");
  buttonCheck.className = "task-action-btn";
  let iconCheck = document.createElement("i");
  iconCheck.className = "fas fa-undo";
  buttonCheck.appendChild(iconCheck);
  buttonCheck.addEventListener('click', (e) => checkTask(e, taskName, taskId));

  return buttonCheck;
}

async function checkTask(e, taskName, taskId){
    e.stopPropagation();
    console.log(taskId);
    alert(`${taskName} completed`);

    const response = await apiFetch(`/api/tasks/${taskId}/complete_task/`, {
        method: "PATCH",
        body: JSON.stringify({})
    });

    if (!response.ok) {
        console.error("Failed to complete task", response.status);
        alert("Failed to mark task complete.");
        return;
    }

    window.location.href = `completetask.html?name=${encodeURIComponent(taskName)}`;
}

