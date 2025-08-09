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
