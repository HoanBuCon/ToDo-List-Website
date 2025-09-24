import { checkEmptyList } from "../components/checkEmptyList.js";

export function createTask(content) {
    const todoList = document.getElementById('todo-list');

    if (!todoList) return;

    const todoItem = createTaskElement(content);
    todoList.appendChild(todoItem);

    checkEmptyList();

    return todoItem
}

function createTaskElement(content) {
    const todoItem = document.createElement('div');
    todoItem.className = 'todo-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';

    const span = document.createElement('span');
    span.className = 'todo-content';
    span.textContent = content;

    const deleteButton = document.createElement('button');
    deleteButton.title = "Delete Task";
    deleteButton.classList.add('todo-delete');

    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fa-solid fa-trash';

    // Gắn con vào bố sau đó vào ông <(")
    deleteButton.appendChild(deleteIcon);
    todoItem.appendChild(checkbox);
    todoItem.appendChild(span);
    todoItem.appendChild(deleteButton);

    return todoItem
}