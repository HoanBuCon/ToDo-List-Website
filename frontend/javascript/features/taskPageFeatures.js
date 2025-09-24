import { checkEmptyList } from '../components/checkEmptyList.js';
import { createTask } from './createNewTask.js';

export function setupTodoList() {
    const addButton = document.getElementById('add-todo-button');
    const taskInput = document.getElementById('todo-input');
    const editButton = document.querySelector('button[data-action="edit"]');
    const completeAllButton = document.querySelector('button[data-action="complete-all"]');
    const deleteAllButton = document.querySelector('button[data-action="delete-all"]');
    const todoList = document.getElementById('todo-list');

    // Tạo task mới
    if (addButton && taskInput) {
        addButton.addEventListener('click', () => {
            const taskContent = taskInput.value.trim();
            if(!taskContent) return; // Không thêm nếu input rỗng

            createTask(taskContent);
            taskInput.value = ""; // Xóa nội dung input sau khi thêm
        });
    }

    // Thêm task khi nhấn Enter
    if (taskInput) {
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addButton.click();
        }
    });
}

    // Event delegation cho checkbox và delete
    if (todoList) {

        // Checkbox complete và uncomplete
        todoList.addEventListener('change', (event) => { // Nâng tầm cuộc chơi bằng arrow function
            if (event.target.matches('.todo-checkbox')) {
                const todoItem = event.target.closest('.todo-item');
                todoItem.classList.toggle('completed', event.target.checked);
            }
        });

        // Delete task
        todoList.addEventListener('click', (event) => {
            if (event.target.closest('.todo-delete')) {
                event.target.closest('.todo-item').remove();
                checkEmptyList();
            }
        });
    }

    // Xử lý sự kiện cho nút Complete All
    if (completeAllButton) {
        completeAllButton.addEventListener('click', () => { // Nâng tầm cuộc chơi bằng arrow function
            const checkboxes = todoList.querySelectorAll('.todo-checkbox');
            const isCompleting = !completeAllButton.classList.contains('completed-all');
            const message = isCompleting ? 'Complete all tasks?' : 'Undo all tasks?';

            if (!confirm(message)) return; // nếu Cancel thì thoát

            completeAllButton.classList.toggle('completed-all', isCompleting);

            checkboxes.forEach(checkbox => {
                checkbox.checked = isCompleting;
                const todoItem = checkbox.closest('.todo-item');
                todoItem.classList.toggle('completed', isCompleting);
            });

            // Đổi text và icon cho nút
            const textSpan = completeAllButton.querySelector('.task-button-group-text');
            const icon = completeAllButton.querySelector('.task-button-group-icon i');
            
            textSpan.textContent = isCompleting ? 'Undo All' : 'Complete All';
            icon.classList.toggle('fa-check', !isCompleting);
            icon.classList.toggle('fa-rotate-left', isCompleting);
        });
    }

    // Xử lý sự kiện cho nút Delete All
    if (deleteAllButton) {
        deleteAllButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete all tasks?')) {
                if (todoList) {
                    todoList.querySelectorAll('.todo-item').forEach(item => item.remove());
                }

                // Kiểm tra list sau khi xóa
                checkEmptyList();
            }
        });
    }

    // Kiểm tra list ngay khi load trang
    checkEmptyList();
}