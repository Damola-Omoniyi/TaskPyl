const taskData = JSON.parse(localStorage.getItem("taskData"));
console.log(taskData.url);
console.log(taskData);
const endpoint = taskData.url.replace("http://127.0.0.1:8000", "");
document.getElementById('taskName').value = taskData.task_name; 
    // Set today's date as the default for start date
    document.getElementById('startDate').value = taskData.start_date;
    
    // Set deadline to tomorrow by default
    document.getElementById('deadline').value = taskData.end_date;
    
    // Urgency selection
    const urgencyButtons = document.querySelectorAll('.urgency-btn');
    const urgencyInput = document.getElementById('urgency');
    
    // Set Medium as default selected
    urgencyButtons[1].classList.add('selected');
    urgencyInput.value = taskData.task_urgency;
    
    urgencyButtons.forEach(button => {
      button.addEventListener('click', () => {
        urgencyButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        urgencyInput.value = button.getAttribute('data-value');
      });
    });

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
    task_urgency: urgencyMap[document.getElementById("urgency").value], 
    start_date: document.getElementById("startDate").value,
    end_date: document.getElementById("deadline").value,
    task_completed: false, // default since it’s a new task
    time_spent: 0,         // or whatever default you want
  };

  try {
    apiFetch(endpoint);
  const result = await apiFetch(endpoint, {
    method: "PUT",
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
