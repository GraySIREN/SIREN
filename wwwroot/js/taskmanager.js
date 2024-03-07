// SET COLOR THEME

function setTheme(theme) {
    if (theme == 'theme1') {
        document.documentElement.style.setProperty('--theme-page-background-color', '#F2F2F2');
        document.documentElement.style.setProperty('--theme-grid-container-background-color', '#F2F2F2');
        document.documentElement.style.setProperty('--theme-text-color', '#262626');
        document.documentElement.style.setProperty('--theme-border-color', '#737373');
        document.documentElement.style.setProperty('--theme-grid-item-hover-background-color', '#BFBFBF');
        document.documentElement.style.setProperty('--theme-grid-item-hover-text-color', '#262626');
    }
    else if (theme === 'theme2') { //ROSE GOLD
        document.documentElement.style.setProperty('--theme-page-background-color', '#F2D5CE');
        document.documentElement.style.setProperty('--theme-grid-container-background-color', '#F2BFBB');
        document.documentElement.style.setProperty('--theme-text-color', '#D98B84');
        document.documentElement.style.setProperty('--theme-border-color', '#F2F2F2');
        document.documentElement.style.setProperty('--theme-grid-item-hover-background-color', '#F2BDC7');
        document.documentElement.style.setProperty('--theme-grid-item-hover-text-color', '#BF495E');
    } else if (theme === 'theme3') { //LIME GREEN
        document.documentElement.style.setProperty('--theme-page-background-color', '#B5D991');
        document.documentElement.style.setProperty('--theme-grid-container-background-color', '#B5D991');
        document.documentElement.style.setProperty('--theme-text-color', '#F0F1F2');
        document.documentElement.style.setProperty('--theme-border-color', '#71A64B');
        document.documentElement.style.setProperty('--theme-grid-item-hover-background-color', '#DDF2CE');
        document.documentElement.style.setProperty('--theme-grid-item-hover-text-color', '#71A64B');
    } else if (theme === 'theme4') { //DARK MODE
        document.documentElement.style.setProperty('--theme-page-background-color', '#1F1F1F');
        document.documentElement.style.setProperty('--theme-grid-container-background-color', '#000000');
        document.documentElement.style.setProperty('--theme-text-color', '#BB86FC');
        document.documentElement.style.setProperty('--theme-border-color', '#03DAC6');
        document.documentElement.style.setProperty('--theme-grid-item-hover-background-color', '#BB86FC');
        document.documentElement.style.setProperty('--theme-grid-item-hover-text-color', '#000000');
    } else if (theme === 'theme5') { //LIGHT MODE
        document.documentElement.style.setProperty('--theme-page-background-color', '#E9F0F2');
        document.documentElement.style.setProperty('--theme-grid-container-background-color', '#CCDBE3');
        document.documentElement.style.setProperty('--theme-text-color', '#6092A6');
        document.documentElement.style.setProperty('--theme-border-color', '#E7E3FD');
        document.documentElement.style.setProperty('--theme-grid-item-hover-background-color', '#8BCAD9');
        document.documentElement.style.setProperty('--theme-grid-item-hover-text-color', '#E9F0F2');
    } else if (theme === 'theme6') { //RETRO
        document.documentElement.style.setProperty('--theme-page-background-color', '#037E8C');
        document.documentElement.style.setProperty('--theme-grid-container-background-color', '#024959');
        document.documentElement.style.setProperty('--theme-text-color', '#FFFFFA');
        document.documentElement.style.setProperty('--theme-border-color', '#F2F2BF');
        document.documentElement.style.setProperty('--theme-grid-item-hover-background-color', '#024959');
        document.documentElement.style.setProperty('--theme-grid-item-hover-text-color', '#F24C27');
    }
}

function addTaskRow() {
    // Create a new task grid item
    const newTask = document.createElement('div');
    newTask.setAttribute('id', 'grid-item');
    newTask.setAttribute('contenteditable', 'true');
    newTask.setAttribute('draggable', 'true');
    newTask.textContent = 'New Task';

    // Append the new task grid item to the grid container
    document.getElementById('grid-container').appendChild(newTask);
}

function deleteTaskRow() {
    // Get the grid container
    const gridContainer = document.getElementById('grid-container');

    // Remove the last task grid item if it exists
    if (gridContainer.lastElementChild.id === 'grid-item') {
        gridContainer.removeChild(gridContainer.lastElementChild);
    }
}




//Creating draggable element to HTML

const draggables = document.querySelectorAll('.draggable')
const containers = document.querySelectorAll('.container')

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging')
    })

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging')
    })
})

containers.forEach(container => {
    container.addEventListener('dragover', e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(container, e.clientY)
        const draggable = document.querySelector('.dragging')
        if (afterElement == null) {
            container.appendChild(draggable)
        } else {
            container.insertBefore(draggable, afterElement)
        }
    })
})

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}