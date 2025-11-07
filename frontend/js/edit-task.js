const taskData = JSON.parse(localStorage.getItem("taskData"));
console.log(taskData.url);
const endpoint = new URL(taskData.url).pathname;
console.log(endpoint);

document.getElementById('taskName').value = taskData.task_name; 
    document.getElementById('startDate').value = taskData.start_date;
    document.getElementById('deadline').value = taskData.end_date;
    document.getElementById("priority").value = taskData.task_urgency;
    document.getElementById("description").value = taskData.task_description;
    


    
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taskForm");

  // Handle form submit
  form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Map urgency text → DB code
  const urgencyMap = {
    Low: "L",
    Medium: "M",
    High: "H"
  };

  const taskData = {
    task_name: document.getElementById("taskName").value,
    task_description: document.getElementById("description").value,
    task_urgency: urgencyMap[document.getElementById("priority").value], 
    start_date: document.getElementById("startDate").value,
    end_date: document.getElementById("deadline").value,
    task_completed: false, 
    time_spent: 0,        
  };

  try {
    apiFetch(endpoint);
  const result = await apiFetch(endpoint, {
    method: "PATCH",
    body: JSON.stringify(taskData), 
  });

    if (!result.ok) {
      const errorData = await result.json();
      console.error("Task creation failed:", errorData);
      alert("Error creating task: " + JSON.stringify(errorData));
      return;
    }

    const data = await result.json();
    console.log("Task created:", data);

    // Redirect back to task list (or wherever you want)
    window.location.href = "index.html";
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong while creating the task.");
  }
});

});
