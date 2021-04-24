let nav = 0;
let clicked = null;

const calendar = document.getElementById('reservation-calendar')

// Modals
const reservation_modal = document.getElementById('reservation-modal')
const show_reservation_modal = document.getElementById('show-reservations-modal')
const back_drop = document.getElementById('modal-backdrop')

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function open_modal(date) {
    clicked = date
    let span_close = document.getElementsByClassName('reservation-close')[0];
    if (window.location.pathname === '/restaurant/employee_reservations') {
        find_reservations(date)
        show_reservation_modal.style.display = 'block';
    } else{
        reservation_modal.style.display = 'block'
    }

    back_drop.style.display = 'block'
    span_close.onclick = close_modal
}

function close_modal() {
    let reservation_details = document.getElementById('show-reservations')
    show_reservation_modal.style.display = 'none';
    reservation_modal.style.display = 'none'
    back_drop.style.display = 'none'
    clicked = null;
    reservation_details.innerHTML = '';
    load();
}


// Depending on the page, load different js functions

if (window.location.pathname == '/restaurant/employee_reservations') {
    console.log("Employee reservations")
    load();

} else {
    console.log("Regular calendar")
    load();
}

function find_reservations(date) {
    // Fetch request to get reservations for event date
    let reservation_container = document.getElementById('show-reservations')
    let test = 1;
    fetch(`/restaurant/reservations/${date}`)
    .then(response => response.json())
    .then(reservations => {
        console.log(reservations)
        if (reservations != undefined) {
            let num_reservations = reservations.length;
            if (num_reservations === 0) {
                let div = document.createElement('div')
                div.classList.add('reservation-detail')
                div.innerHTML = 'No reservations'
                reservation_container.append(div)
            }
            for (let i = 0; i < num_reservations; i++) {
                // Add to 'show-reservations' the res. information
                let div = document.createElement('div')
                div.classList.add('reservation-detail')
                div.innerHTML = `Name: ${reservations[i].name} Time: ${reservations[i].reservation_time} Party: ${reservations[i].party_size} Phone#:${reservations[i].customer_phone}`
                reservation_container.append(div)

            }
        }
    })
}

function load() {
    console.log("Regular")
    const dt = new Date();

    if (nav != 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
    console.log("PADDING DAYS:", paddingDays, dateString)

    document.getElementById('month-display').innerText = `${dt.toLocaleDateString('en-us', {month: 'long'})} ${year}`

    calendar.innerHTML = '';

    for (let i = 0; i < paddingDays + daysInMonth; i++) {
        const day_square = document.createElement('div');
        // const day_string = `${month + 1}-${i - paddingDays}-${year}`
        const day_string = `${year}-${month + 1}-${i - paddingDays}`
        day_square.classList.add('day')

        if (i > paddingDays) {
            console.log(i, daysInMonth, paddingDays, firstDayOfMonth, dateString)
            day_square.innerText = i - paddingDays;
            let plus_button = document.createElement('i')
            plus_button.className = "fas fa-plus"
            plus_button.addEventListener('click', make_reservation)
            day_square.append(plus_button)
            if (i - paddingDays === day && nav === 0) {
                day_square.id = 'current day'
            }

            day_square.addEventListener('click', () => open_modal(day_string))
        } else {
            console.log("PADDING!")
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
        restvation_time = ''
        customer_phone = ''
        close_modal()
    }
}
// function load_employee() {
//     console.log("Employee calendar")
// }

// load()