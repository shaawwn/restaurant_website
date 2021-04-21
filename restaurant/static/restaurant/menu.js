if (document.readyState == 'running') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {

    add_modal()

    menu_names = get_menu_names()
    let numItems = menu_names.length

    for (let counter = 0; counter < numItems; counter++) {
        let modal = document.getElementById(`${menu_names[counter]}_modal`)
        let img = document.getElementById(`${menu_names[counter]}`)
        let modal_image = document.getElementsByClassName(`img${counter}`)
        img.onclick = function() {
            modal.style.display = 'block'
        }
    }
}

function add_modal() {
    menu_names = get_menu_names()
    let numItems = menu_names.length;
    
    for (let counter = 0; counter < numItems; counter++) {
        let modal = document.createElement('div')
        modal.setAttribute('id', `${menu_names[counter]}_modal`)
        modal.setAttribute('class', 'modal')

        let span = document.createElement('span')
        span.setAttribute('class', 'close')
        span.innerHTML = '&times;'
        span.onclick = function() {
            modal.style.display = 'none'
        }

        let img = document.createElement('img')
        img.setAttribute('id', `img${counter}`)
        img.setAttribute('src', `/images/static/${menu_names[counter]}.jpg`) // Change to correct directory when using AWS
        img.setAttribute('class', 'modal-content')

        modal.append(span)
        modal.append(img)

        document.getElementsByClassName('container-menu')[0].append(modal)
    }
}

function get_menu_names() {
    let menu_names = JSON.parse(document.getElementById('menu_names').textContent)
    return menu_names
}