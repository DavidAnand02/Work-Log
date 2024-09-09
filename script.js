// DOM Elements
const landingPage = document.getElementById('landing-page');
const calendarBody = document.getElementById('calendar-body');
const currentMonthElement = document.getElementById('current-month');
let currentDate = new Date(); // Use current date for initialization

// Show the main page directly
function showMainPage() {
    landingPage.style.display = 'block';
    generateCalendar();
}

// Update the calendar view for a specific month and year
function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get the first and last day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Display the month and year
    currentMonthElement.innerText = `${firstDay.toLocaleString('default', { month: 'long' })} ${year}`;

    calendarBody.innerHTML = '';  // Clear the current calendar

    // Add day names (Monday to Sunday)
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.innerText = day;
        calendarBody.appendChild(dayHeader);
    });

    // Calculate the day of the week the first day of the month falls on
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert from Sun-Sat to Mon-Sun

    // Add empty days for the first week
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarBody.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.innerHTML = `<div class="day-header">${day}</div><div class="work-block-container"></div>`;

        const workBlockContainer = dayElement.querySelector('.work-block-container');
        for (let block = 0; block < 16; block++) {
            const workBlock = document.createElement('div');
            workBlock.className = 'work-block';

            // Load any saved color data
            const workData = JSON.parse(localStorage.getItem('workData')) || {};
            const dayKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
            const blockKey = `${block}`;
            const savedData = workData[dayKey] ? workData[dayKey][blockKey] : null;
            workBlock.style.backgroundColor = savedData ? savedData.color : 'black';

            workBlock.onclick = () => toggleBlockColor(day, block, workBlock);

            workBlockContainer.appendChild(workBlock);
        }

        calendarBody.appendChild(dayElement);
    }
}

// Toggle block color between black and default
function toggleBlockColor(day, block, blockElement) {
    const currentColor = blockElement.style.backgroundColor;
    const newColor = currentColor === 'black' ? '' : 'black';
    blockElement.style.backgroundColor = newColor;

    // Save the color data
    saveBlockColor(day, block, newColor);
}

// Save work block color data for a specific day and block in local storage
function saveBlockColor(day, block, color) {
    let workData = JSON.parse(localStorage.getItem('workData')) || {};

    const dayKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    if (!workData[dayKey]) {
        workData[dayKey] = {};
    }

    workData[dayKey][block] = { color };

    localStorage.setItem('workData', JSON.stringify(workData));
}

// Button event listeners for navigation
document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
});

// Initialize the page
showMainPage();
