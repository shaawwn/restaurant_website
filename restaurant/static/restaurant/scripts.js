// W3 Reference sites
// https://www.w3schools.com/howto/howto_css_modal_images.asp
// https://www.w3schools.com/howto/howto_css_modals.asp
// NOTES

// Incrementing item quantity in shopping cart 33 minute mark (https://www.youtube.com/watch?v=YeFzkC2awTM&t=29s)
// Import functions


// ----------------------------------------Storage 
if (!sessionStorage.getItem('order')) {
    let order = {'items': [], 'price': []}
    sessionStorage.setItem('order', JSON.stringify(order))
}

// Get price
get_price()
add_move_button()
load_modals()
// ---------------------------------------DOM LOADED
document.addEventListener('DOMContentLoaded', function() {

    // Add modal and modal listeners
    login()
    // register()
    add_modal()

    // Get menu item names
    menu_names = get_menu_names()
    let numItems = menu_names.length;

    // Add menu modal items
    for (let counter = 0; counter < numItems; counter++) {
        const modal = document.getElementById(`${menu_names[counter]}_modal`)
        const img = document.getElementById(`${menu_names[counter]}`)
        const modal_image = document.getElementsByName(`img${counter}`)
        img.onclick = function() {
            modal.style.display = "block";
        }
    }
    let order_button = document.getElementsByClassName('btn btn-primary btn-order')[0]
    order_button.addEventListener('click', customer_details) // Adding () will call the function, no () means the function WILL be called when pressed

    // Add Move order button
    // let move_button = document.getElementsByClassName('fas fa-arrow-right fa-2x').forEach(item => item.addEventListener('click', function() {
    //     console.log("Adding button")
    //     move_button()
    // }))

    
})
// load_modals()

// ---------------------------------------- Functions


function check_quantity() {
    let quantity_input = document.getElementsByClassName('quantity-input')
    // console.log("CQ", quantity_input)
    for (let i = 0; i < quantity_input.length; i++) {
        let input = quantity_input[i]
        // console.log("INPUT", input, input.value)
        input.addEventListener('change', quantity_change)
    }
}

function quantity_change(event) {
    // console.log("Checking quantity...")
    let input = event.target
    let item_name = input.parentElement.parentElement.parentElement.innerText.split("\n")[0].trim()
    let order = JSON.parse(sessionStorage.getItem('order'))
    let key = Object.keys(order.items[0])[0]
    let item_price = document.getElementsByClassName('price')
    let total_price = document.getElementById('order_price')
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    } 
    for (let i = 0; i < order.items.length; i++) {
        if (order.items[i][key] === item_name) {
            // Change quantity
            order.items[i].quantity = input.value
            sessionStorage.setItem('order', JSON.stringify(order))

            // Update the price in the order window
            let new_price = parseFloat(order.items[i].price) * input.value
            item_price[i].innerHTML = new_price
            total_price.innerHTML = `$${display_price()}`
            return
        }
    }

}

function remove_button() {
    let rem_button = document.getElementsByClassName('btn remove-btn');
    for (let i = 0; i < rem_button.length; i++) {
        rem_button[i].addEventListener('click', remove_item)
    }
}
function remove_item(event) {
    // Removes item from order
    let button_clicked = event.target
    let total_price = document.getElementById('order_price')
    let item = button_clicked.parentElement.parentElement.parentElement.innerText.split("\n")[0]
    let order = JSON.parse(sessionStorage.getItem('order'))
    let key = Object.keys(order.items[0])[0]
    let index = 0
    for (let i = 0; i < order.items.length; i++) {
        // console.log(order.items[i][key], item)
        if (order.items[i][key] === item.trim()) {
            index = order.items.indexOf(order.items[i])
            button_clicked.parentElement.parentElement.parentElement.remove() // Moved to inside loop instead of end
            total_price.innerHTML = `$${display_price()}`
            break
        }
    }
    order.items.splice(index, 1)
    sessionStorage.setItem('order', JSON.stringify(order))
    total_price.innerHTML = `$${display_price()}`
}

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
    // Move order from todo to finished
    let to_move_order = event.target.parentElement
    let move_to = document.getElementById('finished-orders-container')
    let change_arrow = event.target
    change_arrow.className = "fas fa-check fa-2x"
    to_move_order.remove()
    move_to.append(to_move_order)
    to_move_order.removeEventListener('click')
}
// --------------------------------------- MODAL FUNCTIONS

function load_modals() {
    let current_order_link = document.getElementById('current-order')
    let employee_login = document.getElementById('login')
    current_order_link.addEventListener('click', function() {
        // console.log("CURRENT ORDER PRESSED")
        current_order()
    })
    // employee_login.addEventListener('click', function() {
    //     login()
    // })
        // Add order modal event listeners for all order buttons (REDUNDANT NO NEED)
        // Copy of above if needed
}

// Add modal for all images
function add_modal() {
    menu_names = get_menu_names()
    let numItems = menu_names.length;
    for (let counter = 0; counter < numItems; counter++) {
        const modal = document.createElement('div')
        modal.setAttribute('id', `${menu_names[counter]}_modal`)
        modal.setAttribute('class', 'modal')

        // Create close button
        const span = document.createElement('span')
        span.setAttribute('class', 'close')
        span.innerHTML = '&times;';
        span.onclick = function() {
            modal.style.display = "none";
        }
        // Create images
        const img = document.createElement('img')
        img.setAttribute('id', `img${counter}`)
        img.setAttribute('src', `/images/static/${menu_names[counter]}.jpg`)

        img.setAttribute('class', 'modal-content');

        // Add to modal
        modal.append(span)
        modal.append(img)

        // Add to container-menu
        document.getElementsByClassName('container-menu')[0].append(modal)
    }
}

// Display Current Order Modal
function current_order() {
    document.getElementById('order-modal-table').innerHTML = '';
    display_current_order()
    const modal = document.getElementById(`order_modal`)
    const span = document.getElementsByClassName('close')[0];
    // const current_order = document.getElementById('current-order');
    modal.style.display = 'block'
    span.onclick = function() {
        modal.style.display = 'none';
        document.getElementById('order-modal-table').innerHTML = '';
    }
    check_quantity()
    remove_button()
}

// Display Customer information Modal (Maybe remove)
function customer_details() {
    // console.log("Hitting Button")
    // modal.style.display = 'block'
    let modal = document.getElementById('confirm_order_modal')
    let span = document.getElementsByClassName('confirm-order-close')[0]
    // let button = document.getElementsByClassName('btn btn-primary btn-order')[0]
    let order = JSON.parse(sessionStorage.getItem('order'))
    // console.log("ORDER ITEMS", JSON.parse(order.items))
    modal.style.display = 'block'
    let input = document.getElementById('confirm-order-button')
    // Fetch request to server to post the order, as a javascript array
    input.onclick = function() {
        console.log("Fetching order", `${order.items}`)
        fetch('/restaurant/customer_order', {
            method: 'POST',
            body: JSON.stringify({
                name: document.getElementById('customer-name').value,
                phone: document.getElementById('customer-phone').value,
                order
            })
        })
        console.log("Fetched order")
        // Clear the box (Add class to table row, then set the contents of the row to '')
    }
    span.onclick = function() {
        modal.style.display = 'none'
    }

    
}

function login() {
    console.log("Hitting Button")
    const modal = document.getElementById('login_modal')
    const span = document.getElementsByClassName('login-close')[0]
    const login = document.getElementById('login')
    console.log("Right before onclick")
    login.onclick = function() {
        modal.style.display = 'block';
    }
    span.onclick = function () {
        modal.style.display = 'none'
    }

}




// ------------------------------------------------ MENU ITEMS

// Add items to order, called form inside the page
function add_item_to_order(id, price) {
    // console.log(id.id)
    let get_order = JSON.parse(sessionStorage.getItem('order'))
    let display_order = document.querySelector('order_modal');
    let ordered_items = []
    let item_objects = []

    let item_name = id.id
    let quantity = 1; // Increment quantity instead if item in order already
    let item_price = price
    // Create an order item when clicking add order
    item = {
        'name': item_name,
        'quantity': quantity,
        'price': item_price
    }

    for (let i = 0;i < get_order.items.length;i++) {
        if (get_order.items[i].name==id.id) {
            get_order.items[i].quantity = parseInt(get_order.items[i].quantity) + 1;
            sessionStorage.setItem('order', JSON.stringify(get_order))
            current_order()
            return
        } else {
            ordered_items.push(get_order.items[i].name)
            item_objects.push(get_order.items[i])
        }
    }

    // console.log("Adding item to order...")
    // When clicking 'order' on a menu item, it should add that item to the menu-modal which users can view\
    // Order needs to be persistent and editable during a session

    let item_names = ordered_items.name
    let ordered_quantity = document.getElementsByClassName("quantity")

    // Create a row to add new item to table
    row = document.createElement('tr')

    // Push new item to current order (Console.log to check)
    get_order.items.push(item)
    sessionStorage.setItem('order', JSON.stringify(get_order))

    order_table = document.getElementsByClassName('table')[0]
    order_table.append(row)
    current_order()
}


function display_current_order() {
    // Get elements from current order and place inside current order modal
    let current_order = document.getElementById('order-modal-table')
    let get_order = JSON.parse(sessionStorage.getItem('order'))
    let total_price = 0
    let column_headers = ['item_name', 'quantity', 'price']
    for (let i = 0; i< get_order.items.length;i++) {
        // Loop through orders with index i
        // Get the length of the order object
        let keys = Object.keys(get_order.items[i])
        let length = Object.keys(get_order.items[i]).length
        // Create a row to hold each order
        let row = document.createElement('tr')

        // This loops through the keys for every order
        for (let counter = 0; counter < length; counter++) {
            // Checks if they is quantity (because it needs to hold an input field)
            if (keys[counter] === 'quantity') {
                
                // Call function to create quantity cell
                let column = quantity_cell(get_order.items[i][keys[counter]])
                row.append(column)

            } else if (keys[counter] === 'price') {
                
                // Multiply price by quantity
                let column = price_cell(get_order.items[i][keys[counter]], get_order.items[i].quantity, total_price)
                total_price += column[1]
                row.append(column[0])

            } else {

                // Else create the cell to hold order data
                let column = document.createElement('td')
                column.setAttribute('class', column_headers[counter])
                column.innerHTML = get_order.items[i][keys[counter]]
                row.append(column)
            }
        }

        // Add row to table
        current_order.append(row)
    }
    // Add total_price to overall table
    let total_order_price = document.getElementById('order_price')
    total_order_price.innerHTML = `$${total_price.toFixed(2)}`
    // display_price()
}


// Create table rows
function quantity_cell(item_quantity) {
    // Create the table quantity cell

    let column = document.createElement('td')
    let column_div = document.createElement('div')
    let quantity = document.createElement('input')
    let remove_btn = document.createElement('button')

    column.className = 'quantity'
    column_div.className = 'quantity_div'
    quantity.type = 'number'
    quantity.className = 'quantity-input'
    remove_btn.className = 'btn remove-btn'
    remove_btn.innerHTML = 'Remove'

    quantity.value = item_quantity
    
    column_div.append(quantity)
    column_div.append(remove_btn)
    column.append(column_div)
    
    return column
}

function price_cell(item_price, quantity) {
    // Create table price cell

    let column = document.createElement('td')
    let item_total = 0
    column.className = 'price'
    item_price = parseFloat(item_price)
    quantity = parseInt(quantity)

    item_total += item_price * quantity
    // console.log(item_total, item_price, quantity)
    column.innerHTML = item_total.toFixed(2) // Could use Math.round()

    return [column, item_total]
}


function display_price() {
    let order = JSON.parse(sessionStorage.getItem('order'))
    let total_price = 0
    for (let i = 0; i < order.items.length; i++) {
        // console.log("BEFORE", total_price)
        total_price += parseFloat(order.items[i].price) * parseInt(order.items[i].quantity)
        // console.log("AFTER", total_price)
    }
    // console.log("TOTAL PRICE", total_price)
    return total_price.toFixed(2)
}


function get_price() {
    // Get the total price of the order
    let price_total = 0
    let json_order = JSON.parse(sessionStorage.getItem('order'))
    for (let counter = 0; counter < json_order.price.length; counter++) {
        price_total += parseFloat(json_order.price[counter])
    }
    document.querySelector('#order_price').innerHTML = price_total.toFixed(2)
}

function get_menu_names() {
    const menu_names = JSON.parse(document.getElementById('menu_names').textContent);
    return menu_names
}





// ------------------- OLD CODE -----------------

// QUANTITY CELL
// let quantity_column = document.createElement('td')
// quantity_column.setAttribute('class', column_headers[counter])
// let quantity_div = document.createElement('div')
// let quantity = document.createElement('input')
// let remove_btn = document.createElement('button')

// quantity_div.setAttribute('class', 'quantity_div')
// quantity.setAttribute('type', 'number')
// quantity.setAttribute('class', 'quantity-input')
// remove_btn.setAttribute('class', 'btn remove-btn')
// remove_btn.innerHTML = 'Remove'
// // console.log("Entering into quantity cell: ", keys[counter], get_order.items[i][keys[counter]])
// quantity.value = get_order.items[i][keys[counter]]
// quantity_div.append(quantity)
// quantity_div.append(remove_btn)
// quantity_column.append(quantity_div)
// row.append(quantity_column)


// PRICE CELL
// let column = document.createElement('td')
// column.setAttribute('class', column_headers[counter])
// // Float and int quantity and price
// let item_price = parseFloat(get_order.items[i][keys[counter]])
// let item_quantity = parseInt(get_order.items[i].quantity)
// let quantity_price = item_price * item_quantity
// total_price += quantity_price
// column.innerHTML = quantity_price.toFixed(2)









// function quantityChanged(event) {
//     let quantity = event.target;
//     if (isNaN(quantity.value) || quantity.value <= 0) {
//         quantity.value = 1
//     }

// }

// Tally order to display in order modal
// function total_order() {
//     // For now grab the prices from the table as a 'proof of concept'
//     let order_total_price = parseFloat(sessionStorage.getItem('order_total_price'))
//     console.log("Summing up order cost....")
//     let price = document.querySelectorAll('.price')
//     console.log(price)
//     for (let counter = 0; counter < price.length; counter++) {
//         console.log("Price of item", price[counter].outerText)
//         order_total_price += parseFloat(price[counter].outerText)
//         sessionStorage.setItem('order_total_price', order_total_price.toFixed(2))
//         console.log("The price is: ", order_total_price)
//     }
//     document.querySelector('#order_price').innerHTML = sessionStorage.getItem('order_total_price')
// }


// Get the total price of the order
function get_price() {
    let price_total = 0
    let json_order = JSON.parse(sessionStorage.getItem('order'))
    for (let counter = 0; counter < json_order.price.length; counter++) {
        price_total += parseFloat(json_order.price[counter])
    }
    document.querySelector('#order_price').innerHTML = price_total.toFixed(2)
}
// Create order instances of menu item inside sessionStorage

function get_menu_names() {
    const menu_names = JSON.parse(document.getElementById('menu_names').textContent);
    return menu_names
}