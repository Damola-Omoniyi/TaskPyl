    let task_data;
    async function fetchTasks() {
  const username = localStorage.getItem('username');
  if (!username) {
    alert("No username found in localStorage.");
     window.location.href = 'login.html';
    return;}

  const taskData = { username: username };

  try {
    const response = await fetch("https://contained-medicaid-robert-gabriel.trycloudflare.com/api/dashboard/", {
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
        window.location.href = 'task-info.html';} )
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
window.addEventListener('DOMContentLoaded', fetchTasks);
const overlay = document.getElementById('calendar-overlay');
  const calendarTitle = document.getElementById('calendar-title');
  const calendarBody = document.getElementById('calendar-body');
  const closeBtn = document.querySelector('#calendar-popup .close-btn');

  // Helper: Generate calendar for a given date (year, month, day highlighted)
  function generateCalendar(year, month, highlightDay) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekDay = firstDay.getDay(); // 0=Sun,6=Sat
    const totalDays = lastDay.getDate();

    calendarTitle.textContent = firstDay.toLocaleString('default', { month: 'long', year: 'numeric' });

    calendarBody.innerHTML = '';

    let dayCount = 1;
    for(let week = 0; week < 6; week++) {
      let tr = document.createElement('tr');

      for(let d=0; d<7; d++) {
        let td = document.createElement('td');

        if(week === 0 && d < startWeekDay) {
          td.classList.add('empty');
          td.textContent = '';
        } else if(dayCount > totalDays) {
          td.classList.add('empty');
          td.textContent = '';
        } else {
          td.textContent = dayCount;
          if(dayCount === highlightDay) {
            td.classList.add('highlight');
          }
          dayCount++;
        }

        tr.appendChild(td);
      }
      calendarBody.appendChild(tr);

      if(dayCount > totalDays) break; // stop adding empty rows after month ends
    }
  }

  // Show calendar overlay on date click
  function onDateClick(e) {
    const dateStr = e.target.getAttribute('data-date');
    if(!dateStr) return;
    const [year, month, day] = dateStr.split('-').map(Number);

    generateCalendar(year, month - 1, day);
    overlay.style.display = 'flex';
  }

  // Close overlay on close button or clicking outside popup
  closeBtn.addEventListener('click', () => overlay.style.display = 'none');
  overlay.addEventListener('click', (e) => {
    if(e.target === overlay) overlay.style.display = 'none';
  });

  // Attach click listeners to all date elements
  document.querySelectorAll('.task-info.start-date, .task-info.end-date').forEach(el => {
    el.addEventListener('click', onDateClick);
  });
