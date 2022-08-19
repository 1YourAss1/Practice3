"use strict"

let todo = [
    {text: "Пообедать", done: true, color:"yellow"},
    {text: "Сделать практику", done: false},
]

let listTask;

document.addEventListener("DOMContentLoaded", () => {
    listTask = document.getElementById("olist");
    // listTask.addEventListener("click", event => {
    //     console.log(event.target);
    // });
    listTask.onclick = event => {console.log(event.target);} 

    render();
});

let render = function() {
    // Clear list
    listTask.replaceChildren();
    // Fill list
    todo.forEach(task => {
        let liElement = document.createElement("li");
        if ("color" in task) liElement.setAttribute("style", `background-color: ${task.color};`);
        liElement.innerHTML = `<input type="checkbox" ${(task.done)? "checked" : ""}>
                            <label>${task.text}</label>`;
        listTask.append(liElement);
    });
    
}


let addItem = function() {
    todo.push({
        text: prompt("Введите задачу"),
        done: false,
        color: null
    });
    render();
}

