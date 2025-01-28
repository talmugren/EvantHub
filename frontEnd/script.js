const calendarContainer = document.querySelector('.calendar');
const monthYearHeader = document.getElementById('month-year');

let currentDate = new Date();

function renderCalendar(date) {
    calendarContainer.innerHTML = '';
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate(); // Days in the previous month

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    // Add days of the week headers
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = day;
        calendarContainer.appendChild(dayDiv);
    });

    // Fill in days from the previous month
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('date', 'inactive-day');
        dayDiv.textContent = prevMonthDays - i;
        calendarContainer.appendChild(dayDiv);
    }

    // Add the days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('date');
        if (isCurrentMonth && day === today.getDate()) {
            dayDiv.classList.add('today');
        }
        dayDiv.textContent = day;

        // Add event listener for adding notes
        dayDiv.addEventListener('click', () => {
            const userText = prompt(`Add notes for ${month + 1}/${day}/${year}:`);
            if (userText) {
                const note = document.createElement('span');
                note.textContent = userText;
                note.style.fontSize = '0.8rem';
                note.style.marginTop = '5px';
                dayDiv.appendChild(note);
            }
        });

        calendarContainer.appendChild(dayDiv);
    }

    // Fill in days from the next month
    const totalDaysRendered = firstDayOfMonth + daysInMonth;
    const remainingDays = 35 - totalDaysRendered; 
    for (let i = 1; i <= remainingDays; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('date', 'inactive-day');
        dayDiv.textContent = i;
        calendarContainer.appendChild(dayDiv);
    }

    // Update the month-year header
    monthYearHeader.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar(currentDate);
}

function goToToday() {
    currentDate = new Date();
    renderCalendar(currentDate);
}

document.getElementById("go-to-today").addEventListener("click", goToToday);

// Initial render
renderCalendar(currentDate);


function openForm() {
    window.open("CreateEvent.html","_blank");
  }
  
  function closeForm() {
    window.close();
    window.location.href="calendar.html";
  }
