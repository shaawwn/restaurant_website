// Try to refactor this so it doesn't look like garbage and run better
console.log("Loading scripts prime.....")
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

// Ready essentially adds elements after the DOM has loaded
function ready() {
    login()
    load_modals()
    // add_modal()


    // menu_names = get_menu_names()
    // let numItems = menu_names.length

    // for (let counter = 0; counter < numItems; counter++) {
    //     let modal = document.getElementById(`${menu_names[counter]}_modal`)
    //     let img = document.getElementById(`${menu_names[counter]}`)
    //     let modal_image = document.getElementsByClassName(`img${counter}`)
    //     img.onclick = function() {
    //         modal.style.display()
    //     }
    // }

    let order_button = document.getElementsByClassName('btn btn-primary btn-order')[0]
    console.log(order_button)
    order_button.addEventListener('click', customer_details)
}

// ---------------------------------- STORAGE ---------------------------------
if (!sessionStorage.getItem('order')) {
    let order = {'items': [], 'price': []}
    sessionStorage.setItem('order', JSON.stringify(order))
}

// ------------------------------- BASIC FUNCTION ---------------------------

function check_quantity() {
    // Checks for changes in order quantity
    let quantity_input = document.getElementsByClassName('quantity-input')

    for (let i = 0; i< quantity_input.length; i++) {
        let input = quantity_input[i]
        input.addEventListener('change', quantity_change)
    }
}

function quantity_change(event) {
    // Change the quantity of an item in the window
    let input = event.target
    let item_name = input.parentElement.parentElement.parentElement.innerText.split("\n")[0].trim()
    let order = JSON.parse(sessionStorage.getItem('order'))
    let key = Object.keys(order.items[0])[0]
    let item_price = document.getElementsByClassName('price')
    let total_price = document.getElementById('order_price')

    if (isNaN(input.value) || input.value <=0) {
        input.value = 1;
    }

    for (let i = 0; i < order.items.length;i++) {
        if (order.items[i][key] === item_name) {
            order.items[i].quantity = input.value
            sessionStorage.setItem('order', JSON.stringify(order))

            let new_price = parseFloat(order.items[i].price * input.value)
            item_price[i].innerHTML = new_price
            total_price.innerHTML = `$${display_price()}`
            return
        }
    }
}

function remove_button() {
    let remove_button = document.getElementsByClassName('btn remove-btn')
    
    for (let i = 0; i < remove_button.length;i++) {
        remove_button[i].addEventListener('click', remove_item)
    }
}

function remove_item(event) {
    // Remove items from order
    let button_clicked = event.target
    let total_price = document.getElementById('order_price')
    let item = button_clicked.parentElement.parentElement.parentElement.innerText.split('\n')[0]
    let order = JSON.parse(sessionStorage.getItem('order'))
    let key = Object.keys(order.items[0])[0]
    let index = 0
    for (let i = 0; i < order.items.length; i++) {
        if (order.items[i][key] === item.trim()) {
            index = order.items.indexOf(order.items[i])
            button_clicked.parentElement.parentElement.parentElement.remove()
            total_price.innerHTML = `$${display_price()}`
            break
        }
    }
    order.items.splice(index, 1)
    sessionStorage.setItem('order', JSON.stringify(order))
    total_price.innerHTML = `$${display_price()}`
}

// --------------------------------- MODALS --------------------------------

function load_modals() {
    let current_order_link = document.getElementById('current-order')
    let employee_login = document.getElementById('login')

    current_order_link.addEventListener('click', function() {
        current_order()
    })
}

// function add_modal() {
//     menu_names = get_menu_names()
//     let numItems = menu_names.length;
    
//     for (let counter = 0; counter < numItems; counter++) {
//         let modal = document.createElement('div')
//         modal.setAttribute('id', `${menu_names[counter]}_modal`)
//         modal.setAttribute('class', 'modal')

//         let span = document.createElement('span')
//         span.setAttribute('class', 'close')
//         span.innerHTML = '&times;'
//         span.onclick = function() {
//             modal.style.display = 'none'
//         }

//         let img = document.createElement('img')
//         img.setAttribute('id', `img${counter}`)
//         img.setAttribute('src', `/images/static/${menu_names[counter]}.jpg`)
//         img.setAttribute('class', 'modal-content')

//         modal.append(span)
//         modal.append(img)

//         document.getElementsByClassName('container-menu')[0].append(modal)
//     }
// }

function current_order() {
    document.getElementById('order-modal-table').innerHTML = '';
    display_current_order()

    let modal = document.getElementById('order_modal')
    let span = document.getElementsByClassName('close')[0]

    modal.style.display = 'block'
    span.onclick = function() {
        modal.style.display = 'none'
        document.getElementById('order-modal-table').innerHTML = ''
    }
    check_quantity()
    remove_button()
}


function customer_details() {
    let check_order = document.getElementById('order-modal-table')
    console.log("CHECK", check_order)
    if (check_order.childElementCount === 0) {
        alert("No order!")
        return
    }
    let modal = document.getElementById('confirm_order_modal')
    let span = document.getElementsByClassName('confirm-order-close')[0]
    let order = JSON.parse(sessionStorage.getItem('order'))

    modal.style.display = 'block'

    let input = document.getElementById('confirm-order-button')
    // Check that name* is not empty
    let customer_name = document.getElementById('customer-name').value
    // console.log("CUSTOMER", customer_name.value)

    input.onclick = function() {
        let customer_name = document.getElementById('customer-name').value
        if (customer_name != '') {
            console.log("CUSTOMER NAME", customer_name)
            fetch('/restaurant/customer_order', {
                method: 'POST',
                body: JSON.stringify({
                    name: document.getElementById('customer-name').value,
                    phone: document.getElementById('customer-phone').value,
                    order
                })
            })
            document.getElementById('order-modal-table').innerHTML = ''
            // Clear sessionStorage
            sessionStorage.removeItem('order')
        } else {
            alert("You must enter a name!")
        }
    }
    span.onclick = function() {
        modal.style.display = 'none'
    }
}

function login() {
    let modal = document.getElementById('login_modal')
    let span = document.getElementsByClassName('login-close')[0]
    let login = document.getElementById('login')

    login.onclick = function() {
        modal.style.display = 'block'
    }
    span.onclick = function() {
        modal.style.display = 'none'
    }
}


// ------------------------------------- MENU --------------------------------

function add_item_to_order(id, price) {
    let get_order = JSON.parse(sessionStorage.getItem('order'))
    let display_order = document.querySelector('order_modal')
    let ordered_items = []
    let item_objects = []

    let item_name = id.id
    let quantity = 1
    let item_price = price

    item = {
        'name': item_name,
        'quantity': quantity,
        'price': item_price
    }

    for (let i = 0; i < get_order.items.length;i++) {
        if (get_order.items[i].name == id.id) {
            get_order.items[i].qunatity = parseInt(get_order.items[i].quantity) + 1
            sessionStorage.setItem('order', JSON.stringify(get_order))
            current_order()
            return
        } else {
            ordered_items.push(get_order.items[i].name)
            item_objects.push(get_order.items[i])
        }
    }

    let item_names = ordered_items.name
    let ordered_quantity = document.getElementsByClassName('quantity')

    row = document.createElement('tr')

    get_order.items.push(item)
    sessionStorage.setItem('order', JSON.stringify(get_order))

    order_table = document.getElementsByClassName('table')[0]
    order_table.append(row)
    current_order()
}

function display_current_order() {
    let current_order = document.getElementById('order-modal-table')
    let get_order = JSON.parse(sessionStorage.getItem('order'))
    let total_price = 0
    let column_headers = ['item_name', 'quantity', 'price']

    for(let i = 0; i < get_order.items.length;i++) {
        let keys = Object.keys(get_order.items[i])
        let length = Object.keys(get_order.items[i]).length // Can change to keys.length ;ater

        let row = document.createElement('tr')

        for (let counter = 0; counter < length; counter++) {
            if (keys[counter] === 'quantity') {
                let column = quantity_cell(get_order.items[i][keys[counter]])
                row.append(column)
            } else if (keys[counter] === 'price') {
                let column = price_cell(get_order.items[i][keys[counter]], get_order.items[i].quantity, total_price)
                total_price += column[1]
                row.append(column[0])
            } else {
                let column = document.createElement('td')
                column.setAttribute('class', column_headers[counter]) // column.className
                column.innerHTML = get_order.items[i][keys[counter]]
                row.append(column)
            }
        }
        current_order.append(row)
    }
    let total_order_price = document.getElementById('order_price')
    total_order_price.innerHTML = `$${total_price.toFixed(2)}`
}

function quantity_cell(item_quantity) {
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
    let column = document.createElement('td')
    let item_total = 0

    column.className = 'price'
    item_price = parseFloat(item_price)
    quantity = parseInt(quantity)

    item_total += item_price * quantity
    column.innerHTML = item_total.toFixed(2)

    return [column, item_total]
}

function display_price() {
    let order = JSON.parse(sessionStorage.getItem('order'))
    let total_price = 0

    for (let i = 0; i < order.items.length; i++) {
        total_price += parseFloat(order.items[i].price) * parseInt(order.items[i].quantity)
    }
    return total_price.toFixed(2)
}

function get_price() {
    let price_total = 0
    let get_order = JSON.parse(sessionStorage.getItem('order'))
    for (let counter = 0; counter < get_order.items.price.length; counter++) {
        price_total += parseFloat(get_order.price[counter])
    }
    document.querySelector('#order_price').innerHTML = price_total.toFixed(2)
}

// function get_menu_names() {
//     let menu_names = JSON.parse(document.getElementById('menu_names').textContent)
//     return menu_names
// }