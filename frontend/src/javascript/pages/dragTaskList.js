import { showConfirmModal } from '../components/confirmModal.js';
import { showSuccessToast, showInfoToast, showWarningToast } from '../components/toast.js';

class TaskListManager {
    constructor() {
        this.allTasks = [];
        this.selectedTasks = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.setupDragAndDrop();
    }

    setupEventListeners() {
        // Nút chọn task list
        document.addEventListener('click', (e) => {
            if (e.target.closest('.todo-select')) {
                e.preventDefault();
                const todoItem = e.target.closest('.todo-item');
                this.selectTask(todoItem);
            }
        });

        // Nút xóa task list
        document.addEventListener('click', (e) => {
            if (e.target.closest('.todo-unselect')) {
                e.preventDefault();
                const todoItem = e.target.closest('.todo-item');
                this.unselectTask(todoItem);
            }
        });

        // Nút Select All
        document.addEventListener('click', (e) => {
            if (e.target.closest('.select-all-btn')) {
                e.preventDefault();
                this.selectAllTasks();
            }
        });

        // Nút Remove All
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-all-btn')) {
                e.preventDefault();
                this.removeAllTasks();
            }
        });
    }

    setupDragAndDrop() {
        this.updateDragAndDrop();
    }

    updateDragAndDrop() {
        // Setup kéo thả cho tất cả các mục trong danh sách
        const allListItems = document.querySelectorAll('.all-list .todo-item');
        allListItems.forEach(item => {
            item.draggable = true;
            item.addEventListener('dragstart', (e) => this.handleDragStart(e));
            item.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });

        // Setup kéo thả cho các mục trong danh sách đã chọn
        const selectedListItems = document.querySelectorAll('.selected-list .todo-item');
        selectedListItems.forEach(item => {
            item.draggable = true;
            item.addEventListener('dragstart', (e) => this.handleDragStart(e));
            item.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });

        // Setup vùng thả
        const allList = document.querySelector('.all-list');
        const selectedList = document.querySelector('.selected-list');

        [allList, selectedList].forEach(zone => {
            zone.addEventListener('dragover', (e) => this.handleDragOver(e));
            zone.addEventListener('drop', (e) => this.handleDrop(e));
            zone.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            zone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        });
    }

    handleDragStart(e) {
        const todoItem = e.target.closest('.todo-item');
        const taskData = this.getTaskData(todoItem);
        
        e.dataTransfer.setData('text/plain', JSON.stringify(taskData));
        e.dataTransfer.effectAllowed = 'move';
        
        // Thêm hiệu ứng kéo
        todoItem.style.opacity = '0.5';
        todoItem.classList.add('dragging');
    }

    handleDragEnd(e) {
        const todoItem = e.target.closest('.todo-item');
        todoItem.style.opacity = '1';
        todoItem.classList.remove('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDragEnter(e) {
        e.preventDefault();
        const dropZone = e.target.closest('.all-list, .selected-list');
        if (dropZone) {
            dropZone.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        const dropZone = e.target.closest('.all-list, .selected-list');
        if (dropZone && !dropZone.contains(e.relatedTarget)) {
            dropZone.classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        const dropZone = e.target.closest('.all-list, .selected-list');
        dropZone.classList.remove('drag-over');

        try {
            const taskData = JSON.parse(e.dataTransfer.getData('text/plain'));
            const sourceList = taskData.source;
            const targetList = dropZone.classList.contains('all-list') ? 'all' : 'selected';

            if (sourceList !== targetList) {
                if (targetList === 'selected' && sourceList === 'all') {
                    this.moveTaskToSelected(taskData);
                } else if (targetList === 'all' && sourceList === 'selected') {
                    this.moveTaskToAll(taskData);
                }
            }
        } catch (error) {
            console.error('Error handling drop:', error);
        }
    }

    // Phương thức generate ID task duy nhất (cái này lụm của AI chứ dev chịu chết :v)
    generateTaskId(content, desc) {
        // Mã hóa chuỗi UTF-8 an toàn (dùng TextEncoder)
        const encoder = new TextEncoder();
        const bytes = encoder.encode(content + desc);
        const encoded = btoa(String.fromCharCode(...bytes));

        // Xóa ký tự đặc biệt
        const clean = encoded.replace(/[^a-zA-Z0-9]/g, '');

        // Thêm timestamp
        const timePart = Date.now().toString(36);

        // Ghép và cắt
        return (clean + timePart).substring(0, 12);
    }

    // Phương thức lấy dữ liệu task
    getTaskData(todoItem) {
        const content = todoItem.querySelector('.todo-content').textContent;
        const desc = todoItem.querySelector('.todo-desc').textContent;
        const source = todoItem.closest('.all-list') ? 'all' : 'selected';

        return {content, desc, source, id: this.generateTaskId(content, desc)};
    }

    findTaskInList(listSelector, taskId) {
        return document.querySelector(`${listSelector} .todo-item[data-task-id="${taskId}"]`);
    }

    // Phương thức thêm tasklist vào danh mục tương ứng
    addTaskToList(listSelector, taskData, listType) {
        const list = document.querySelector(listSelector);
        const todoItem = this.createTodoItem(taskData, listType);

        const lastChild = list.lastElementChild;
        if (lastChild && lastChild.classList.contains('list-title')) {
            list.appendChild(todoItem);
        } else {
            list.appendChild(todoItem);
        }

        this.updateDragAndDrop();
    }

    // Chuyển tasklist từ All sang Selected
    moveTaskToSelected(taskData) {
        const allListItem = this.findTaskInList('.all-list', taskData.id);
        if (allListItem) {
            allListItem.remove();
            this.addTaskToList('.selected-list', taskData, 'selected');
        }
    }

    // Chuyển tasklist từ Selected về All
    moveTaskToAll(taskData) {  
        const selectedListItem = this.findTaskInList('.selected-list', taskData.id);
        if (selectedListItem) {
            selectedListItem.remove();
            this.addTaskToList('.all-list', taskData, 'all');
        }
    }

    selectTask(todoItem) {
        const taskData = this.getTaskData(todoItem);
        this.moveTaskToSelected(taskData);
    }

    unselectTask(todoItem) {
        const taskData = this.getTaskData(todoItem);
        this.moveTaskToAll(taskData);
    }

    createTodoItem(taskData, listType) {
        // ================ Cấu trúc HTML mẫu ================
        // <div class="todo-item">
        //     <div class="todo-item-container">
        //         <span class="todo-content">Build ưebsite Ming King</span>
        //         <span class="todo-desc">Who tf need database?</span>
        //     </div>
        //     <button title="Chọn" class="todo-select">
        //         <span><i class="fa-solid fa-plus"></i></span>
        //         <span>Select</span>
        //     </button>
        // </div>
        // ===================================================

        // Tạo container chính
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        todoItem.setAttribute('data-task-id', taskData.id);

        // Tạo container cho nội dung task
        const todoItemContainer = document.createElement('div');
        todoItemContainer.className = 'todo-item-container';

        // Tạo element cho content
        const contentSpan = document.createElement('span');
        contentSpan.className = 'todo-content';
        contentSpan.textContent = taskData.content;

        // Tạo element cho description
        const descSpan = document.createElement('span');
        descSpan.className = 'todo-desc';
        descSpan.textContent = taskData.desc;

        // Tạo button
        const button = document.createElement('button');
        const buttonClass = listType === 'selected' ? 'todo-unselect' : 'todo-select';
        const buttonIcon = listType === 'selected' ? 'fa-xmark' : 'fa-plus';
        const buttonText = listType === 'selected' ? 'Remove' : 'Select';
        
        button.className = buttonClass;

        // Tạo icon span
        const iconSpan = document.createElement('span');
        const icon = document.createElement('i');
        icon.className = `fa-solid ${buttonIcon}`;
        iconSpan.appendChild(icon);

        // Tạo text span
        const textSpan = document.createElement('span');
        textSpan.textContent = buttonText;

        // Gắn các elements vào nhau
        button.appendChild(iconSpan);
        button.appendChild(textSpan);
        
        todoItemContainer.appendChild(contentSpan);
        todoItemContainer.appendChild(descSpan);
        
        todoItem.appendChild(todoItemContainer);
        todoItem.appendChild(button);

        return todoItem;
    }

    loadInitialData() {
        // Thêm ID cho các task items có sẵn trong HTML
        document.querySelectorAll('.todo-item').forEach(item => {
            const taskData = this.getTaskData(item);
            item.setAttribute('data-task-id', taskData.id);
        });
    }

    // Chọn tất cả tasks từ All List sang Selected List
    async selectAllTasks() {
        const allListItems = Array.from(document.querySelectorAll('.all-list .todo-item'));
        
        if (allListItems.length === 0) {
            showInfoToast('No tasks to select!');
            return;
        }

        // Xác nhận trước khi thực hiện với custom modal
        const confirmed = await showConfirmModal({
            title: 'Select All Tasks',
            message: `Are you sure you want to select all ${allListItems.length} tasks?`,
            confirmText: 'Select All',
            cancelText: 'Cancel',
            confirmButtonColor: '#44d62c'
        });
        if (!confirmed) {
            showInfoToast('Selection cancelled!');
            return;
        }

        let movedCount = 0;
        allListItems.forEach(item => {
            const taskData = this.getTaskData(item);
            this.moveTaskToSelected(taskData);
            movedCount++;
        });

        showSuccessToast(`Selected ${movedCount} tasks!`);
    }

    // Xóa tất cả tasks từ Selected List về All List
    async removeAllTasks() {
        const selectedListItems = Array.from(document.querySelectorAll('.selected-list .todo-item'));
        
        if (selectedListItems.length === 0) {
            showWarningToast('No tasks to remove!');
            return;
        }

        // Xác nhận trước khi thực hiện với custom modal
        const confirmed = await showConfirmModal({
            title: 'Remove All Tasks',
            message: `Are you sure you want to remove all ${selectedListItems.length} selected tasks?`,
            confirmText: 'Remove All',
            cancelText: 'Cancel',
            confirmButtonColor: '#ff4444'
        });
        if (!confirmed) {
            showInfoToast('Removal cancelled!');
            return;
        }

        let movedCount = 0;
        selectedListItems.forEach(item => {
            const taskData = this.getTaskData(item);
            this.moveTaskToAll(taskData);
            movedCount++;
        });

        showInfoToast(`Removed ${movedCount} tasks!`);
    }



}

// Khởi tạo TaskListManager khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    new TaskListManager();
});