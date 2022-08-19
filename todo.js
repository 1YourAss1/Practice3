"use strict"

let todo = [
    {id: Date.now(), text: "Задание 1", done: true, color:"yellow"},
    {id: Date.now()+1, text: "Задание 2", done: false},
    {id: Date.now()+2, text: "Задание 3", done: false},
    {id: Date.now()+3, text: "Задание 4", done: false},
]

let selectedElement=null;

let listTask;

document.addEventListener("DOMContentLoaded", () => {
    listTask = document.getElementById("olist");

    listTask.addEventListener("click", event => {
        let li = event.target.closest('li');
        if (!li) return;

        if (selectedElement === li) {
            li.classList.remove("elemselected");
            selectedElement = null;
        } else {
            selectedElement?.classList.remove("elemselected");
            selectedElement = li;
            li.classList.add("elemselected");
        }
    });

    render();
});

let render = function() {
    // Clear list
    listTask.replaceChildren();
    // Fill list
    todo.forEach(task => {
        listTask.append(createLiElement(task));
    });
    
}

let createLiElement = function(task) {
    let li = document.createElement("li");
    li.setAttribute("id", `${task.id}`);
    if ("color" in task) li.setAttribute("style", `background-color: ${task.color};`);
    li.innerHTML = `<input type="checkbox" ${(task.done)? "checked" : ""}>
                        <label for="${task.id}">${task.text}</label>`;
    return li;
}

let editItem = function() {
    let inputTask = document.getElementById("inputTask");
    let inputColor = document.getElementById("inputColor");

    inputTask.removeAttribute("hidden");
    inputColor.removeAttribute("hidden");

    inputTask.addEventListener("change", function() {
        console.log(this.value);
    });
}

let addItem = function() {
    let inputTask = document.getElementById("inputTask");
    let taskToAdd = {
        id: Date.now(),
        text: inputTask.value,
        done: false,
    };

    if(!taskToAdd.text) return;
    
    let li = createLiElement(taskToAdd);
    if (selectedElement != null) {
        todo.splice(todo.findIndex(task => task.id == selectedElement.id)+1, 0, taskToAdd);

        li.classList.add("elemselected");
        selectedElement.after(li);

        selectedElement.classList.remove("elemselected");
        selectedElement = li;
        
    } else {
        todo.unshift(taskToAdd);
        listTask.prepend(li);
    }
    
    inputTask.value = '';
}

let removeItem = function() {
    if(selectedElement === null) return;
    todo.splice(todo.findIndex(task => task.id == selectedElement.id), 1);
    selectedElement.remove();
    selectedElement = null;
}

let upItem = function() {
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
}

let downItem = function() {
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
}
