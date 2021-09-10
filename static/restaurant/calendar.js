// Merge calendar and revised calendar to one file
// Followed PortEXE's excellent calendar tutorial when making the calculator, link: https://youtu.be/m9OSBJaQTlM
let nav = 0;
let clicked = null;
const calendar = document.getElementById('reservation-calendar')
const current_page = window.location.pathname;
// Modals
const reservation_modal = document.getElementById('reservation-modal') // MAKING reservations
// const show_reservation_modal = document.getElementById('show-reservation-modal') // SHOWING reservations (employee)
const back_drop = document.getElementById('modal-backdrop') // BOTH

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']


// Seperate customer and employee pages

if (current_page == '/restaurant/employee_reservations') {
    console.log("EMPLOYEE")
} else {
    console.log("CUSTOMER")
}

function open_modal(date) {
    clicked = date

    back_drop.style.display = 'block'

    // Seperate modals for employee/cust.
    if (current_page == '/restaurant/employee_reservations') {
        find_reservations(date)
        console.log("Employee")
        let show_reservation_modal = document.getElementById('show-reservations-modal')
        let span = document.getElementsByClassName('reservation-close')[0];
        show_reservation_modal.style.display = 'block'
        span.onclick = close_modal;
    } else {
        console.log("Regular")
        reservation_modal.style.display = 'block';
    }
}

function close_modal() {

    if (current_page == '/restaurant/employee_reservations') {
        let reservation_details = document.getElementById('show-reservations');
        let show_reservation_modal = document.getElementById('show-reservations-modal')
        show_reservation_modal.style.display = 'none'
        reservation_modal.style.display = 'none';
        reservation_details.innerHTML = '';
    } else {
        reservation_modal.style.display = 'none'
    }
    back_drop.style.display = 'none'
    clicked = null;
    load()
}


function find_reservations(date) {
    // Get reservations for a given date
    let reservation_container = document.getElementById('show-reservations')
    
    fetch(`/restaurant/reservations/${date}`)
    .then(response => response.json())
    .then(reservations => {
        if (reservations != undefined) {
            // console.log(reservations)
            let num_reservations = reservations.length;
            if (num_reservations === 0) {
                let div = document.createElement('div')
                div.classList.add('reservation-detail')
                div.innerHTML = 'No reservations'
                reservation_container.append(div)
            }
            for (let i = 0; i < num_reservations; i++) {
                let div = document.createElement('div')
                div.classList.add('reservation-detail')
                if (reservations[i].completed == true) {
                    div.classList.add('reservation-clicked')
                } else {
                    div.onclick = function() {
                        finished_reservation(reservations[i].id)
                        div.classList.add('reservation-clicked')
                    }
                }
                div.innerHTML = `Name: ${reservations[i].name} Time: ${reservations[i].reservation_time} Party: ${reservations[i].party_size} Phone#:${reservations[i].customer_phone}`
                reservation_container.append(div)
            }
        }
    })
}

function finished_reservation(reservation_id) {
    // Mark a reservation as completed
    fetch(`/restaurant/reservation/${parseInt(reservation_id)}`, {
        method: 'PUT',
        body: JSON.stringify({
            completed: true
        })
    })
}


function load() {
    // This loads the calender, which is the same for both users
    const dt = new Date()

    if (nav != 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1) // (4, 1, year?)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
    document.getElementById('month-display').innerText = `${dt.toLocaleDateString('en-us', {month: 'long'})} ${year}`
    calendar.innerHTML = '';

    for (let i = 0; i < paddingDays + daysInMonth; i++) {
        const day_square = document.createElement('div');
        const day_string = `${year}-${month + 1}-${i - paddingDays}`
        day_square.classList.add('day')

        if (i >= paddingDays) {
            day_square.innerText = i - paddingDays + 1;
            // Add plus button to employee page
            if (current_page == '/restaurant/employee_reservations') {
                let plus_button = document.createElement('i')
                plus_button.className = 'fas fa-plus'
                plus_button.onclick = function () {
                    clicked = day_string;
                    reservation_modal.style.display = 'block';
                    back_drop.style.display = 'block';
                    event.stopPropagation()
                }
                // plus_button.addEventListener('click', make_reservation) // Need to make it seperately clickable
                day_square.append(plus_button)
            }
            if (i - paddingDays + 1 === day && nav === 0) {
                day_square.id = 'current-day';
            }
            if (i - paddingDays + 1 < day && nav <= 0 || nav < 0) {
                day_square.classList.add("past-date")
                if (current_page == '/restaurant/employee_reservations') {
                    let child = day_square.children
                    child[0].remove()
                }
            } else {
                day_square.addEventListener('click', () => open_modal(day_string))
            }
        } else {
            day_square.classList.add('padding')
        }
        calendar.appendChild(day_square)
    }
}

function make_reservation(event) {

    let customer_name = document.getElementById('reservation-name-input')
    let party_size = document.getElementById('reservation-num-people')
    let reservation_time = document.getElementById('reservation-time-input')
    let customer_phone = document.getElementById('reservation-phone-input')
    let reservation_date = clicked
    console.log(customer_name.value, party_size.value, reservation_time.value, customer_phone.value, reservation_date)

    if (!customer_name.value && !party_size.value && !reservation_time.value && !customer_phone.value) {
        alert("You must enter all information")
    } else {
        alert("Thank you for your reservation!")
        // Fetch here
        fetch('/restaurant/customer_reservation', {
            method: 'POST',
            body: JSON.stringify({
                name: customer_name.value,
                party_size: party_size.value,
                reservation_time: reservation_time.value,
                reservation_date: clicked,
                customer_phone: customer_phone.value
            })
        })
        // Clear fields and close modal
        customer_name.value = ''
        party_size.value = ''
        reservation_time.value = ''
        customer_phone.value = ''
        close_modal()
    }
}

function buttons() {
    // Calendar Buttons
    document.getElementById('next-button').addEventListener('click', () => {
        nav++;
        load();
    })
    document.getElementById('back-button').addEventListener('click', () => {
        nav--;
        load();
    })

    // Modal buttons
    document.getElementById('reservation-button').addEventListener('click', make_reservation)
    document.getElementById('reservation-cancel-button').addEventListener('click', close_modal)

}

buttons();
load();
