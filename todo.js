"use strict";

let todo = []; 

let selectedElement=null;

let listTask;
let inputTask;
let inputColor;

document.addEventListener("DOMContentLoaded", () => {
    todo = localStorage.getItem('todo');
    todo = JSON.parse(todo);

    listTask = document.getElementById("olist");
    inputTask = document.getElementById("inputTask");
    inputColor = document.getElementById("inputColor");

    listTask.addEventListener('click', event => {
        let li = event.target.closest('li');
        if (!li) return;
        // Add new selection by click
        selectedElement?.classList.remove("elemselected");
        li.classList.add("elemselected");
        selectedElement = li;
        // Hide edit input fields
        inputTask.setAttribute("hidden", "");
        inputColor.setAttribute("hidden", "");
    });

    let replaceElement = function(task) {
        let li = createLiElement(task);
        li.classList.add("elemselected");
        selectedElement.replaceWith(li);
        selectedElement = li;
    }

    inputTask.addEventListener('change', function() {
        // Edit element text
        let task = todo.find(task => task.id == selectedElement.id);
        task.text = this.value;
        saveJSON();
        replaceElement(task);
    });

    inputColor.addEventListener('change', function() {
        // Edit element color
        let task = todo.find(task => task.id == selectedElement.id);
        task.color = this.value;
        saveJSON();
        replaceElement(task);
    });

    document.getElementById('editButton').addEventListener('click', editTask);
    document.getElementById('addButton').addEventListener('click', addTask);
    document.getElementById('removeButton').addEventListener('click', removeTask);
    document.getElementById('upButton').addEventListener('click', upTask);
    document.getElementById('downButton').addEventListener('click', downTask);
    
    render();
});

let render = function() {
    // Clear list
    listTask.replaceChildren();
    // Fill list
    if (todo) {
        todo.forEach(task => {
            let li = createLiElement(task);
            listTask.append(li);
        });
    }
}


let createLiElement = function(task) {
    // Create outer li element
    let li = document.createElement('li');
    li.id = task.id;
    if ('color' in task) li.style(`background-color: ${task.color};`);
    // Create inner input checkbox
    let inputCheckbox = document.createElement('input');
    inputCheckbox.type = 'checkbox';
    inputCheckbox.checked = task.done;
    inputCheckbox.addEventListener('change', (event) => {
        todo.find(task => task.id == selectedElement.id).done = event.target.checked;
        saveJSON();
    });
    li.append(inputCheckbox);
    // Create inner label
    let label = document.createElement('label');
    label.textContent = task.text;
    li.append(label);

    return li;
}

let saveJSON = function() {
    localStorage.setItem('todo', JSON.stringify(todo));
}

let editTask = function() {
    // Select task to edit
    if (selectedElement == null) {
        alert("Выберите элемент для редактирования");
        return;
    }
    // Show input fields
    inputTask.removeAttribute("hidden");
    inputColor.removeAttribute("hidden");
    // Fill input fields with data to edit
    let task = todo.find(task => task.id == selectedElement.id);
    inputTask.value = task.text;
    inputColor.value = task.color;
}

let addTask = function() {
    let taskToAdd = {
        id: Date.now(),
        text: prompt("Введите новое задание"),
        done: false,
    };
    // Not empty task
    if(!taskToAdd.text) return;
    // Add new task
    let li = createLiElement(taskToAdd);
    if (selectedElement) {
        // Insert new task into todo array
        todo.splice(todo.findIndex(task => task.id == selectedElement.id)+1, 0, taskToAdd);
        saveJSON();
        // Move selection to new task
        li.classList.add("elemselected");
        selectedElement.after(li);
        selectedElement.classList.remove("elemselected");
        selectedElement = li;
    } else {
        todo.unshift(taskToAdd);
        listTask.prepend(li);
    }
    
}

let removeTask = function() {
    if(selectedElement === null) return;
    todo.splice(todo.findIndex(task => task.id == selectedElement.id), 1);
    saveJSON();
    // Remove selection
    selectedElement.remove();
    selectedElement = null;
}

let upTask = function() {
    if(selectedElement === null) return;
    // Get task and its index in array
    let task = todo.find(task => task.id == selectedElement.id);
    let indexTask = todo.findIndex(task => task.id == selectedElement.id);
    // Remove task from todo array
    todo.splice(indexTask, 1);
    // Insert task in index-1
    if (indexTask === 0) {
        todo.splice(todo.length, 0 ,task);
        listTask.append(selectedElement);
    } else {
        todo.splice(indexTask-1, 0, task);
        selectedElement.after(selectedElement.previousSibling);
    }
    saveJSON();
}

let downTask = function() {
    if(selectedElement === null) return;
    // Get task and its index in array
    let task = todo.find(task => task.id == selectedElement.id);
    let indexTask = todo.findIndex(task => task.id == selectedElement.id);
    // Remove task from todo array
    todo.splice(indexTask, 1);
    // Insert task in index+1
    if (indexTask === todo.length) {
        todo.splice(0, 0 ,task);
        listTask.prepend(selectedElement);
    } else {
        todo.splice(indexTask+1, 0, task);
        selectedElement.before(selectedElement.nextSibling);
    }
    saveJSON();
}
