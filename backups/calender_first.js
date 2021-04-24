

if (window.location.pathname == '/restaurant/employee_reservations') {
    console.log("Emplyoree reserverations")
}

let nav = 0;
let clicked = null;
// No need events for this calender

const calendar = document.getElementById('reservation-calendar')

// Instead of an 'event modal', create a 'reservation modal'
const new_reservation_modal = document.getElementById('reservation-modal')

const back_drop = document.getElementById('modal-backdrop')
// End modal declarations

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Modal Function
function open_modal(date) {
    clicked = date

    new_reservation_modal.style.display = 'block';

    back_drop.style.display = 'block';
}

function close_modal() {
    new_reservation_modal.style.display = 'none'
    back_drop.style.display = 'none'
    clicked = null;
    load()
}


function load() {
    const dt = new Date();

    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth()
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
    document.getElementById('month_display').innerText = `${dt.toLocaleDateString('en-us', {month: 'long'})} ${year}`

    calendar.innerHTML = '';

    for (let i = 0; i <= paddingDays + daysInMonth; i++) {
        const day_square = document.createElement('div')
        const day_string = `${month + 1}/${i - paddingDays}/${year}`
        day_square.classList.add('day');
        // day_square.id = `${month + 1}-${i - paddingDays}-${year}`

        if (i > paddingDays) {
            console.log(i)
            day_square.innerText = i - paddingDays;

            if (i - paddingDays === day && nav === 0) {
                day_square.id = 'current-day'
            }

            day_square.addEventListener('click', () => open_modal(day_string))
        } else {
            console.log("PADDING?")
            day_square.classList.add('padding')
        }
        calendar.appendChild(day_square)
    }
}

function make_reservation(event) {

    // let confirm_reservation = document.getElementById('reservation-button')
    let customer_name = document.getElementById('reservation-name-input')
    let party_size = document.getElementById('reservation-num-people')
    let reservation_time = document.getElementById('reservation-time-input')
    let customer_phone = document.getElementById('reservation-phone-input')
    let reservation_date = clicked
    // let confirm_alert = alert("Reservation confirmed!")
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

function buttons() {
    // Calender Buttons
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

buttons()
load()
