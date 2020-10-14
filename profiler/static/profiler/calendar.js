const date = new Date();
function renderCalendar() {
    const monthDays = document.querySelector('.days');
    monthDays.innerHTML = '';
    // Gets the last day of a month (being 1 the first, and 0 the last day of the previous month)
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    // Gets the last day of the previous month
    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    // Gets the index of the first day of the current month, being 0 for Sunday
    const firstDayIndex  = date.getDay();
    // Gets the index of the last day of the current month
    const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
    // Gets the ammount of next days for the last week displayed
    const nextDays = 7 - lastDayIndex - 1;
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    // Change current Month in the header
    document.querySelector('.date h1').innerHTML = `${months[date.getMonth()]} ${date.getFullYear()}`;
    // Change current date in the header
    document.querySelector('.date p').innerHTML = new Date().toDateString();

    let days = "";
    // Create a div for every previous day
    for (let x = firstDayIndex; x > 0; x--) {
        days += `<a href="day/${new Date(date.getFullYear(), date.getMonth(), x).getTime() / 1000}"><div class="prev-date">${prevLastDay - x + 1}</div></a>`;
    }
    // Create a div for every day
    for (let i = 1; i <= lastDay; i++) {
        // Highlight current day with class "today"
        if (i === new Date().getDate() && date.getMonth() === new Date().getMonth()) {
            days += `<a href="day/${new Date(date.getFullYear(), date.getMonth(), i).getTime() / 1000}"><div class="today">${i}</div></a>`
        } else {
        days += `<a href="day/${new Date(date.getFullYear(), date.getMonth(), i).getTime() / 1000}"><div>${i}</div></a>`;
        }
    }
    // Create a div for every next day
    for (let j = 1; j <= nextDays; j++) {
        days += `<a href="day/${new Date(date.getFullYear(), date.getMonth(), j).getTime() / 1000}"><div class="next-date">${j}</div></a>`;
    }
    
    monthDays.innerHTML = days; // Write them in the days div
    /*monthDays.querySelectorAll('div').forEach(function(day) {day.addEventListener('click', function() {
        let fetch_date = new Date(date.getFullYear(), date.getMonth(), this.innerHTML).getTime() / 1000;
        console.log(fetch_date);
        fetch(`day/${fetch_date}`)
        })
    })*/
};

// Add event listener for the next and previous month buttons
document.querySelector('.prev').addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});
document.querySelector('.next').addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});
renderCalendar();