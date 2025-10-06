import { checkEmptyList } from '../components/checkEmptyList.js';
import { resetCompleteAllButton } from '../components/checkEmptyList.js';
import { createTask } from './createNewTask.js';
import { showConfirmModal } from '../components/confirmModal.js';
import { showSuccessToast, showInfoToast } from '../components/toast.js';


export function setupTodoList() {
    const addButton = document.getElementById('add-todo-button');
    const taskInput = document.getElementById('todo-input');
    const editButton = document.querySelector('button[data-action="edit"]');
    const completeAllButton = document.querySelector('button[data-action="complete-all"]');
    const deleteAllButton = document.querySelector('button[data-action="delete-all"]');
    const todoList = document.getElementById('todo-list');
    
    // Edit mode state
    let isEditMode = false;
    let originalData = {}; // Lưu trữ dữ liệu gốc khi vào edit mode

    // Global event listener cho Enter key trong edit mode
    document.addEventListener('keydown', (event) => {
        if (isEditMode && event.key === 'Enter') {
            // Chỉ trigger nếu không phải đang focus vào input khác
            const activeElement = document.activeElement;
            if (activeElement && !activeElement.matches('input[type="text"], textarea')) {
                event.preventDefault();
                editButton.click();
            }
        }
    });

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
                if (checkEmptyList()) resetCompleteAllButton(completeAllButton);
            }
        });
    }

    // Xử lý sự kiện cho nút Edit
    if (editButton) {
        editButton.addEventListener('click', () => {
            if (!isEditMode) {
                // Vào edit mode
                enterEditMode();
                isEditMode = true;
                
                // Đổi text và icon của nút Edit
                const textSpan = editButton.querySelector('.task-button-group-text');
                const icon = editButton.querySelector('.task-button-group-icon i');
                textSpan.textContent = 'Save';
                icon.classList.remove('fa-pencil');
                icon.classList.add('fa-save');
                editButton.style.background = '#44d62c';
                editButton.style.color = '#000';
            } else {
                // Xác nhận lưu thay đổi trước khi thoát edit mode
                showSaveConfirmation();
            }
        });
    }

    // Xử lý sự kiện cho nút Complete All
    if (completeAllButton) {
        completeAllButton.addEventListener('click', async () => { // Thêm async cho await
            const checkboxes = todoList.querySelectorAll('.todo-checkbox');
            const isCompleting = !completeAllButton.classList.contains('completed-all');
            const message = isCompleting ? 'Are you sure you want to complete all tasks?' : 'Are you sure you want to undo all completed tasks?';
            const title = isCompleting ? 'Complete All Tasks' : 'Undo All Tasks';
            const confirmText = isCompleting ? 'Complete All' : 'Undo All';
            const buttonColor = isCompleting ? '#44d62c' : '#ffa500'; // Xanh cho Complete, Cam cho Undo
            
            if (checkEmptyList()) return; // nếu list rỗng thì thoát

            const confirmed = await showConfirmModal({
                title: title,
                message: message,
                confirmText: confirmText,
                cancelText: 'Cancel',
                confirmButtonColor: buttonColor
            });
            if (!confirmed) return; // nếu Cancel thì thoát

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

            // Hiển thị toast notification
            if (isCompleting) {
                showSuccessToast('All tasks completed!');
            } else {
                showInfoToast('All tasks restored!');
            }
        });
    }

    // Xử lý sự kiện cho nút Delete All
    if (deleteAllButton) {
        deleteAllButton.addEventListener('click', async () => { // Thêm async cho await
            if (checkEmptyList()) return; // nếu list rỗng thì thoát

            // Sử dụng custom modal thay vì confirm()
            const confirmed = await showConfirmModal({
                title: 'Delete All Tasks',
                message: 'Are you sure you want to delete all tasks? This action cannot be undone.',
                confirmText: 'Delete All',
                cancelText: 'Cancel',
                confirmButtonColor: '#ff4444'
            });
            
            if (confirmed) {
                const taskCount = todoList.querySelectorAll('.todo-item').length;
                if (todoList) {
                    todoList.querySelectorAll('.todo-item').forEach(item => item.remove());
                }

                // Kiểm tra list sau khi xóa
                if (checkEmptyList()) resetCompleteAllButton(completeAllButton);
                
                // Hiển thị toast notification
                showSuccessToast(`Deleted ${taskCount} tasks!`);
            }
        });
    }

    // Kiểm tra list ngay khi load trang
    if (checkEmptyList()) resetCompleteAllButton(completeAllButton);

    // Hàm xác nhận lưu thay đổi cho edit mode
    async function showSaveConfirmation() {
        const confirmed = await showConfirmModal({
            title: 'Save Changes',
            message: 'Are you sure you want to save all changes?',
            confirmText: 'Save',
            cancelText: 'Cancel',
            confirmButtonColor: '#44d62c'
        });
        
        if (confirmed) {
            // Thoát edit mode và lưu thay đổi
            exitEditMode();
            isEditMode = false;
            
            // Đổi text và icon về ban đầu
            const textSpan = editButton.querySelector('.task-button-group-text');
            const icon = editButton.querySelector('.task-button-group-icon i');
            textSpan.textContent = 'Edit';
            icon.classList.remove('fa-save');
            icon.classList.add('fa-pencil');
            editButton.style.background = '';
            editButton.style.color = '';
            
            // Hiển thị thông báo đã lưu thành công
            showSuccessToast('Changes saved successfully!');
        } else {
            // Nếu Cancel thì khôi phục dữ liệu gốc
            restoreOriginalData();
            exitEditMode();
            isEditMode = false;
            
            // Đổi text và icon về ban đầu
            const textSpan = editButton.querySelector('.task-button-group-text');
            const icon = editButton.querySelector('.task-button-group-icon i');
            textSpan.textContent = 'Edit';
            icon.classList.remove('fa-save');
            icon.classList.add('fa-pencil');
            editButton.style.background = '';
            editButton.style.color = '';
        }
    }

    // Hàm khôi phục dữ liệu gốc khi Cancel
    function restoreOriginalData() {
        // Khôi phục title
        const titleElement = document.querySelector('.edit-title-input');
        if (titleElement && originalData.title !== undefined) {
            titleElement.value = originalData.title;
        }
        
        // Khôi phục description
        const descElement = document.querySelector('.edit-desc-input');
        if (descElement && originalData.description !== undefined) {
            descElement.value = originalData.description;
        }
        
        // Khôi phục task names
        const taskInputs = document.querySelectorAll('.edit-task-input');
        taskInputs.forEach((input, index) => {
            if (originalData.tasks && originalData.tasks[index] !== undefined) {
                input.value = originalData.tasks[index];
            }
        });
    }

    // Helper functions cho edit mode
    function enterEditMode() {
        // Lưu dữ liệu gốc trước khi vào edit mode
        originalData = {
            title: document.querySelector('.main-content-title')?.textContent || '',
            description: document.querySelector('.main-content-description')?.textContent || '',
            tasks: Array.from(document.querySelectorAll('.todo-content')).map(el => el.textContent || '')
        };
        
        // Thêm class để style edit mode
        document.body.classList.add('edit-mode-active');
        // Biến title thành input
        const titleElement = document.querySelector('.main-content-title');
        if (titleElement) {
            const currentText = titleElement.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.className = 'edit-title-input edit-mode-input edit-title-input-custom';
            titleElement.replaceWith(input);
            
            // Thêm event listeners cho Enter và ESC
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent form submission
                    editButton.click(); // Trigger save
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    // ESC để cancel - restore original value và trigger save với cancel
                    input.value = originalData.title;
                    editButton.click();
                }
            });
            input.focus();
            input.select();
        }

        // Biến description thành input
        const descElement = document.querySelector('.main-content-description');
        if (descElement) {
            const currentText = descElement.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.className = 'edit-desc-input edit-mode-input edit-desc-input-custom';
            descElement.replaceWith(input);
            
            // Thêm event listeners cho Enter và ESC
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    editButton.click(); // Trigger save
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    // ESC để cancel - restore original value
                    input.value = originalData.description;
                    editButton.click();
                }
            });
        }

        // Biến task names thành inputs
        const taskContents = document.querySelectorAll('.todo-content');
        taskContents.forEach(content => {
            const currentText = content.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.className = 'edit-task-input edit-mode-input edit-task-input-custom';
            content.replaceWith(input);
            
            // Thêm event listeners cho Enter và ESC
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent any default behavior
                    editButton.click(); // Trigger save
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    // ESC để cancel - khôi phục giá trị cũ
                    input.value = currentText;
                    editButton.click();
                }
            });
        });
    }

    function exitEditMode() {
        // Remove edit mode class
        document.body.classList.remove('edit-mode-active');
        
        // Biến title input thành span
        const titleInput = document.querySelector('.edit-title-input');
        if (titleInput) {
            const span = document.createElement('span');
            span.className = 'main-content-title';
            span.textContent = titleInput.value.trim() || 'Untitled Todo List';
            titleInput.replaceWith(span);
        }

        // Biến description input thành span
        const descInput = document.querySelector('.edit-desc-input');
        if (descInput) {
            const span = document.createElement('span');
            span.className = 'main-content-description';
            span.textContent = descInput.value.trim() || 'No description';
            descInput.replaceWith(span);
        }

        // Biến task inputs thành spans
        const taskInputs = document.querySelectorAll('.edit-task-input');
        taskInputs.forEach(input => {
            const span = document.createElement('span');
            span.className = 'todo-content';
            span.textContent = input.value.trim() || 'Untitled Task';
            input.replaceWith(span);
        });
    }


}