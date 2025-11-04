
const urgencyMap = {
  L: ["Low ","urgency-low "],
  M: ["Medium", "urgency-medium"],
  H: ["High", "urgency-high"]
};


function loadTaskLabels(taskData) {
  // const taskData = JSON.parse(localStorage.getItem("taskData"));
  //console.log(taskData.task_name);
  document.getElementById('task-name').textContent = taskData.task_name;
  document.getElementById('start-date').textContent = formatDate(taskData.start_date);
  document.getElementById('deadline').textContent = formatDate(taskData.end_date);
  document.getElementById('urgency').textContent = urgencyMap[taskData.task_urgency][0]; 
  document.getElementById('urgency').className = urgencyMap[taskData.task_urgency][1]; 

  console.log( urgencyMap[taskData.task_urgency] );
  document.getElementById('description').textContent = taskData.task_description;


   document.querySelector('.complete-btn').addEventListener('click', async function() {
   console.log(taskId);
    alert(`${taskData.task_name} completed`);

    const response = await apiFetch(`/api/tasks/${taskId}/complete_task/`, {
        method: "PATCH",
        body: JSON.stringify({})
    });

    if (!response.ok) {
        console.error("Failed to complete task", response.status);
        alert("Failed to mark task complete.");
        return;
    }

    window.location.href = `completetask.html?name=${encodeURIComponent(taskData.task_name)}`;
    });

    document.querySelector('.delete-btn').addEventListener('click', async function() {
      const response = await apiFetch(`/api/tasks/${taskId}/`, {method:"DELETE"});
      if (!response.ok){
        console.error("could not delete task server issue maybe")
        alert("failed");
        return;
      }
      alert(`${taskData.task_name} has been deleted` );  
      window.location.href = `index.html`;
    });

    document.querySelector('.edit-btn').addEventListener('click', function() {
      alert('Edit task functionality would open here.');
      window.location.href = `edit-task.html`;

    });
}

async function fetchTaskAPi(taskId){
    const result = await apiFetch(`/api/tasks/${taskId}/`, {method:"GET"});
    const data = await result.json();
    console.log(data);
    localStorage.setItem("taskData", JSON.stringify(data));
    loadTaskLabels(data);
    return data;
}


const params = new URLSearchParams(window.location.search);
const taskId = params.get('id');
if (taskId) {
  fetchTaskAPi(taskId);
}