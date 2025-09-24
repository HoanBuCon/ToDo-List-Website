// Hàm kiểm tra to-do list rỗng
export function checkEmptyList() {
    const todoList = document.getElementById('todo-list');
    const emptyMessage = document.getElementById('empty-message');

    if (!todoList || !emptyMessage) return;

    const hasTasks = todoList.querySelector('.todo-item') !== null;
    emptyMessage.style.display = hasTasks ? 'none' : 'block';
}