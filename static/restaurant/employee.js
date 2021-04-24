// Scripts for employee page

// Basically, no need load any menu item modals here and probably no current order either (maybe)


console.log("Loading employee page scripts...")
// What needs to be added AFTER the DOM has loaded?

// Event listeners
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready() // Attaching functions to buttons here
}

function ready() {
    // Add functions to buttons
    let archive_button = document.getElementById('archive-button')
    archive_button.addEventListener('click', archive_orders)

    add_move_button()
}




// Addign the employee specific move todo-->finished order buttons
function add_move_button() {
    console.log("Adding move button")
    let move_buttons = document.getElementsByClassName('fas fa-arrow-right fa-2x')
    for (let i=0; i < move_buttons.length; i++) {
        move_buttons[i].addEventListener('click', function() {
            move_order(event)
        })
    }
}

function move_order(event) {
    // Move order from todo to finished, flag order as finished in the DB
    let to_move_order = event.target.parentElement
    let move_to = document.getElementById('finished-orders-container')
    let change_arrow = event.target
    console.log("ARROW", typeof change_arrow.id)
    change_arrow.className = "fas fa-check fa-2x"
    change_arrow.id = change_arrow.id
    to_move_order.className = "finished-order"
    to_move_order.remove()
    move_to.append(to_move_order)
    // Do a PUT fetch and update the order to "finished=True"
    fetch(`restaurant/${parseInt(change_arrow.id)}`, {
        method: 'PUT',
        body: JSON.stringify({
            order_finished: true
        })
    })
    // to_move_order.removeEventListener('click') // Remove event listener(Ok for now before I get stuck on it)
}


function archive_orders() {
    console.log("Adding archive button")
    // At the end of the night, the manager can 'archive' orders
    archive = document.getElementById('archive-button')
    old_orders = document.getElementsByClassName('fas fa-check fa-2x') // Need to get all the button ids
    let length = old_orders.length
    console.log("ARCHIVE", archive)
    console.log(document.getElementById('6'))
    for (let i = 0; i < length;i++) {
        // console.log(i, length, old_orders)
        // console.log("Order ids", old_orders[i].id, old_orders[i].parentElement)
        // console.log("removing", old_orders.length, old_orders[i].parentElement)
        fetch(`restaurant/${parseInt(old_orders[i].id)}`, {
            method: 'PUT',
            body: JSON.stringify({
                archived: true
            })
        })
        // old_orders[i].parentElement.remove()
    }
    // old_orders.forEach().remove()
    let finished_container = document.getElementById('finished-orders-container')
    finished_container.innerHTML = ''
}

