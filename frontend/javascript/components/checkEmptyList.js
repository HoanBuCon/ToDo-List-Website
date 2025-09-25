// Cache DOM elements tôi ưu hiệu suất
const todoList = document.getElementById('todo-list');
const emptyMessage = document.getElementById('empty-message');

// Hàm kiểm tra to-do list rỗng
export function checkEmptyList() {
    if (!todoList || !emptyMessage) return true;

    const hasTasks = todoList.querySelector('.todo-item') !== null;
    emptyMessage.style.display = hasTasks ? 'none' : 'block';

    return !hasTasks
}

// Đặt lại nút Complete All khi danh sách rỗng
export function resetCompleteAllButton(completeAllButton) {
    if (!completeAllButton) return;

    completeAllButton.classList.remove('completed-all');

    const textSpan = completeAllButton.querySelector('.task-button-group-text');
    const icon = completeAllButton.querySelector('.task-button-group-icon i');

    if (textSpan) textSpan.textContent = 'Complete All';
    if (icon) {
        icon.classList.add('fa-check');
        icon.classList.remove('fa-rotate-left');
    }
}