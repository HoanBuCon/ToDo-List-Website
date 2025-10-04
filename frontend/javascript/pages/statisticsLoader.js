// ===============================
// Statistics Page Loader TEST DEMO
// ===============================

// Global variables
let statisticsData = null;
let charts = {};

// Initialize the statistics page
function initializeStatisticsPage() {
    console.log('Initializing Statistics Page...');
    
    // Load statistics data
    loadStatisticsData();
    
    // Initialize charts
    initializeCharts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load todo lists
    loadTodoLists();
    
    console.log('Statistics Page initialized successfully');
}

// ===============================
// Utility Functions for Dynamic Dates
// ===============================

function getLast6Months() {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        months.push({
            month: monthName,
            fullDate: date
        });
    }
    
    return months;
}

function generateRandomData(baseValue, variance) {
    return Math.floor(baseValue + (Math.random() - 0.5) * variance);
}

// ===============================
// Data Management
// ===============================

function loadStatisticsData() {
    try {
        // Demo data - in real app, this would come from backend/localStorage
        statisticsData = {
            overview: {
                totalTasks: 15,
                completedTasks: 8,
                pendingTasks: 5,
                overdueTasks: 2
            },
            taskStats: {
                totalTasks: 56,
                completedTasks: 36,
                incompleteTasks: 15,
                overdueTasks: 5,
                completionRate: 64
            },
            // Timeline data for Todo Lists (6 months) - Dynamic based on current date
            todoListsTimeline: getLast6Months().map((monthData, index) => ({
                month: monthData.month,
                completed: generateRandomData(15, 10), // Base: 15, variance: ±5
                created: generateRandomData(20, 8)     // Base: 20, variance: ±4
            })),
            // Timeline data for Tasks (6 months) - Dynamic based on current date
            tasksTimeline: getLast6Months().map((monthData, index) => ({
                month: monthData.month,
                completed: generateRandomData(55, 20), // Base: 55, variance: ±10
                created: generateRandomData(65, 15)    // Base: 65, variance: ±7.5
            })),
            // Status distribution for Todo Lists
            todoListsStatus: {
                completed: 45,
                pending: 32,
                overdue: 12
            },
            // Status distribution for Tasks
            tasksStatus: {
                completed: 156,
                pending: 89,
                overdue: 23
            },
            todos: {
                completed: [
                    {
                        id: 1,
                        title: 'Hoàn thành báo cáo tháng',
                        description: 'Tổng hợp và phân tích dữ liệu kinh doanh tháng 6',
                        progress: 100,
                        status: 'completed',
                        completedDate: '2024-06-15'
                    },
                    {
                        id: 2,
                        title: 'Học JavaScript nâng cao',
                        description: 'Hoàn thành khóa học về ES6+ và các framework hiện đại',
                        progress: 100,
                        status: 'completed',
                        completedDate: '2024-06-10'
                    },
                    {
                        id: 3,
                        title: 'Tập gym 3 lần/tuần',
                        description: 'Duy trì thói quen tập luyện để cải thiện sức khỏe',
                        progress: 100,
                        status: 'completed',
                        completedDate: '2024-06-12'
                    }
                ],
                overdue: [
                    {
                        id: 4,
                        title: 'Nộp hồ sơ thực tập',
                        description: 'Chuẩn bị và nộp hồ sơ xin thực tập tại công ty công nghệ',
                        progress: 30,
                        status: 'overdue',
                        dueDate: '2024-09-15'
                    },
                    {
                        id: 5,
                        title: 'Khám sức khỏe định kỳ',
                        description: 'Đi khám sức khỏe tổng quát hàng năm',
                        progress: 0,
                        status: 'overdue',
                        dueDate: '2024-09-20'
                    }
                ],
                pending: [
                    {
                        id: 7,
                        title: 'Lên kế hoạch du lịch',
                        description: 'Nghiên cứu và đặt tour du lịch Đà Lạt cho kỳ nghỉ',
                        progress: 0,
                        status: 'pending',
                        dueDate: '2024-07-20'
                    },
                    {
                        id: 8,
                        title: 'Mua quà sinh nhật bạn',
                        description: 'Tìm món quà ý nghĩa cho sinh nhật bạn thân',
                        progress: 0,
                        status: 'pending',
                        dueDate: '2024-06-25'
                    },
                    {
                        id: 9,
                        title: 'Bảo trì xe máy',
                        description: 'Đưa xe đi thay nhớt và kiểm tra tổng quát',
                        progress: 0,
                        status: 'pending',
                        dueDate: '2024-07-05'
                    }
                ]
            }
        };
        
        updateOverviewStats();
        updateTaskStats();
        
    } catch (error) {
        console.error('Error loading statistics data:', error);
        showError('Không thể tải dữ liệu thống kê');
    }
}

function updateOverviewStats() {
    if (!statisticsData) return;
    
    const { overview } = statisticsData;
    
    // Update overview cards - fix ID mapping to match HTML
    updateStatCard('total-todos', overview.totalTasks);
    updateStatCard('completed-todos', overview.completedTasks);
    updateStatCard('pending-todos', overview.pendingTasks);
    updateStatCard('overdue-todos', overview.overdueTasks || 12); // Add overdue data
}

function updateTaskStats() {
    if (!statisticsData) return;
    
    const { taskStats } = statisticsData;
    
    // Update task statistics - fix ID mapping to match HTML
    updateTaskStat('total-tasks', taskStats.totalTasks || 156);
    updateTaskStat('completed-tasks', taskStats.completedTasks || 89);
    updateTaskStat('incomplete-tasks', taskStats.incompleteTasks || 45);
    updateTaskStat('overdue-tasks', taskStats.overdueTasks || 12);
    updateTaskStat('completion-rate', taskStats.completionRate + '%');
}

function updateStatCard(id, value) {
    const element = document.getElementById(id);
    if (element) {
        // Add animation effect
        element.style.transform = 'scale(1.1)';
        element.textContent = value;
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }
}

function updateTaskStat(id, value) {
    const element = document.getElementById(id);
    if (element) {
        // Add glow effect
        element.parentElement.parentElement.style.boxShadow = '0 0 8px rgba(68, 214, 44, 0.3)';
        element.textContent = value;
        
        setTimeout(() => {
            element.parentElement.parentElement.style.boxShadow = '';
        }, 500);
    }
}

// ===============================
// Charts Initialization
// ===============================

function initializeCharts() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded, loading from CDN...');
        loadChartJS().then(() => {
            createCharts();
        });
    } else {
        createCharts();
    }
}

function loadChartJS() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function createCharts() {
    // Chart 1: Todo Lists Timeline (Line Chart)
    createTodoListsTimelineChart();
    
    // Chart 2: Tasks Timeline (Line Chart)
    createTasksTimelineChart();
    
    // Chart 3: Todo Lists Status (Doughnut Chart)
    createTodoListsStatusChart();
    
    // Chart 4: Tasks Status (Doughnut Chart)
    createTasksStatusChart();
}

// Chart 1: Todo Lists Timeline (Line Chart)
function createTodoListsTimelineChart() {
    const ctx = document.getElementById('todoListsTimelineChart');
    if (!ctx) return;
    
    // Update chart title with current period
    const chartTitle = ctx.closest('.chart-container').querySelector('.chart-title');
    if (chartTitle) {
        chartTitle.textContent = `Todo Lists Timeline`;
    }
    
    // Destroy existing chart if exists
    if (charts.todoListsTimeline) {
        charts.todoListsTimeline.destroy();
    }
    
    charts.todoListsTimeline = new Chart(ctx, {
        type: 'line',
        data: {
            labels: statisticsData.todoListsTimeline.map(item => item.month),
            datasets: [{
                label: 'Todo Lists Completed',
                data: statisticsData.todoListsTimeline.map(item => item.completed),
                borderColor: '#44d62c',
                backgroundColor: 'rgba(68, 214, 44, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#44d62c',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }, {
                label: 'Todo Lists Created',
                data: statisticsData.todoListsTimeline.map(item => item.created),
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3498db',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#e8e6e3',
                        usePointStyle: true
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#e8e6e3'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#e8e6e3'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            animation: {
                duration: 1000
            }
        }
    });
}

// Chart 2: Tasks Timeline (Line Chart)
function createTasksTimelineChart() {
    const ctx = document.getElementById('tasksTimelineChart');
    if (!ctx) return;
    
    // Update chart title with current period
    const chartTitle = ctx.closest('.chart-container').querySelector('.chart-title');
    if (chartTitle) {
        chartTitle.textContent = `Tasks Timeline`;
    }
    
    // Destroy existing chart if exists
    if (charts.tasksTimeline) {
        charts.tasksTimeline.destroy();
    }
    
    charts.tasksTimeline = new Chart(ctx, {
        type: 'line',
        data: {
            labels: statisticsData.tasksTimeline.map(item => item.month),
            datasets: [{
                label: 'Tasks Completed',
                data: statisticsData.tasksTimeline.map(item => item.completed),
                borderColor: '#44d62c',
                backgroundColor: 'rgba(68, 214, 44, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#44d62c',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }, {
                label: 'Tasks Created',
                data: statisticsData.tasksTimeline.map(item => item.created),
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#e74c3c',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#e8e6e3',
                        usePointStyle: true
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#e8e6e3'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#e8e6e3'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            animation: {
                duration: 1000
            }
        }
    });
}

// Chart 3: Todo Lists Status (Doughnut Chart)
function createTodoListsStatusChart() {
    const ctx = document.getElementById('todoListsStatusChart');
    if (!ctx) return;
    
    // Destroy existing chart if exists
    if (charts.todoListsStatus) {
        charts.todoListsStatus.destroy();
    }
    
    const statusColors = {
        completed: '#44d62c',
        pending: '#f39c12',
        overdue: '#e74c3c'
    };
    
    charts.todoListsStatus = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Pending', 'Overdue'],
            datasets: [{
                data: [
                    statisticsData.todoListsStatus.completed,
                    statisticsData.todoListsStatus.pending,
                    statisticsData.todoListsStatus.overdue
                ],
                backgroundColor: [
                    statusColors.completed + '80',
                    statusColors.pending + '80',
                    statusColors.overdue + '80'
                ],
                borderColor: [
                    statusColors.completed,
                    statusColors.pending,
                    statusColors.overdue
                ],
                borderWidth: 3,
                hoverBorderWidth: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.2,
            interaction: {
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e8e6e3',
                        padding: 15,
                        usePointStyle: true
                    }
                }
            },
            animation: {
                duration: 1000
            }
        }
    });
}

// Chart 4: Tasks Status (Doughnut Chart)
function createTasksStatusChart() {
    const ctx = document.getElementById('tasksStatusChart');
    if (!ctx) return;
    
    // Destroy existing chart if exists
    if (charts.tasksStatus) {
        charts.tasksStatus.destroy();
    }
    
    const statusColors = {
        completed: '#44d62c',
        pending: '#f39c12',
        overdue: '#e74c3c'
    };
    
    charts.tasksStatus = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Pending', 'Overdue'],
            datasets: [{
                data: [
                    statisticsData.tasksStatus.completed,
                    statisticsData.tasksStatus.pending,
                    statisticsData.tasksStatus.overdue
                ],
                backgroundColor: [
                    statusColors.completed + '80',
                    statusColors.pending + '80',
                    statusColors.overdue + '80'
                ],
                borderColor: [
                    statusColors.completed,
                    statusColors.pending,
                    statusColors.overdue
                ],
                borderWidth: 3,
                hoverBorderWidth: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.2,
            interaction: {
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e8e6e3',
                        padding: 15,
                        usePointStyle: true
                    }
                }
            },
            animation: {
                duration: 1000
            }
        }
    });
}

// Remove createTrendChart since we only have 2 charts in HTML

// ===============================
// Todo Lists Management
// ===============================

function loadTodoLists() {
    if (!statisticsData) return;
    
    const { todos } = statisticsData;
    
    // Load each category - fix container IDs to match HTML
    loadTodoCategory('completed-list', todos.completed);
    loadTodoCategory('overdue-list', todos.overdue || []);
    loadTodoCategory('pending-list', todos.pending);
}

function loadTodoCategory(containerId, todos) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (todos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-text">Không có tác vụ nào</div>
                <div class="empty-state-subtext">Danh sách trống</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = todos.map(todo => createTodoItem(todo)).join('');
    
    // Add click events
    container.querySelectorAll('.todo-item').forEach(item => {
        item.addEventListener('click', () => {
            const todoId = item.dataset.todoId;
            showTodoDetails(todoId);
        });
    });
}

function createTodoItem(todo) {
    const statusClass = todo.status.replace('-', '');
    const statusText = {
        'completed': 'Hoàn thành',
        'overdue': 'Quá hạn',
        'pending': 'Chờ xử lý'
    };
    
    const dateInfo = todo.completedDate 
        ? `Hoàn thành: ${formatDate(todo.completedDate)}`
        : `Hạn: ${formatDate(todo.dueDate)}`;
    
    return `
        <div class="todo-item ${statusClass}" data-todo-id="${todo.id}">
            <div class="todo-header">
                <h4 class="todo-title">${todo.title}</h4>
                <span class="todo-status ${statusClass}">${statusText[todo.status]}</span>
            </div>
            <p class="todo-description">${todo.description}</p>
            <div class="todo-progress">
                <span class="todo-stats">${dateInfo}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${todo.progress}%"></div>
                </div>
            </div>
        </div>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function showTodoDetails(todoId) {
    // Find todo in all categories
    let todo = null;
    for (const category of Object.values(statisticsData.todos)) {
        todo = category.find(t => t.id == todoId);
        if (todo) break;
    }
    
    if (!todo) return;
    
    // Create modal or navigate to task details
    alert(`Chi tiết tác vụ: ${todo.title}\n\n${todo.description}\n\nTrạng thái: ${todo.progress}%`);
}

// ===============================
// Event Listeners
// ===============================

function setupEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refresh-stats');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshStatistics);
    }
    
    // Chart resize on window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            Object.values(charts).forEach(chart => {
                if (chart && chart.resize) {
                    chart.resize();
                }
            });
        }, 250); // Debounce resize events
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            refreshStatistics();
        }
    });
}

function refreshStatistics() {
    const refreshBtn = document.getElementById('refresh-stats');
    const refreshIcon = refreshBtn?.querySelector('i');
    
    // Show loading state
    if (refreshIcon) {
        refreshIcon.classList.add('fa-spin');
    }
    
    // Simulate loading delay
    setTimeout(() => {
        // Reload data
        loadStatisticsData();
        
        // Update charts
        updateCharts();
        
        // Reload todo lists
        loadTodoLists();
        
        // Remove loading state
        if (refreshIcon) {
            refreshIcon.classList.remove('fa-spin');
        }
        
        // Show success message
        showSuccess('Đã cập nhật thống kê thành công!');
        
    }, 1000);
}

function updateCharts() {
    // Update Todo Lists Timeline chart
    if (charts.todoListsTimeline) {
        charts.todoListsTimeline.data.datasets[0].data = statisticsData.todoListsTimeline.map(item => item.completed);
        charts.todoListsTimeline.data.datasets[1].data = statisticsData.todoListsTimeline.map(item => item.created);
        charts.todoListsTimeline.update();
    }
    
    // Update Tasks Timeline chart
    if (charts.tasksTimeline) {
        charts.tasksTimeline.data.datasets[0].data = statisticsData.tasksTimeline.map(item => item.completed);
        charts.tasksTimeline.data.datasets[1].data = statisticsData.tasksTimeline.map(item => item.created);
        charts.tasksTimeline.update();
    }
    
    // Update Todo Lists Status chart
    if (charts.todoListsStatus) {
        charts.todoListsStatus.data.datasets[0].data = [
            statisticsData.todoListsStatus.completed,
            statisticsData.todoListsStatus.pending,
            statisticsData.todoListsStatus.overdue
        ];
        charts.todoListsStatus.update();
    }
    
    // Update Tasks Status chart
    if (charts.tasksStatus) {
        charts.tasksStatus.data.datasets[0].data = [
            statisticsData.tasksStatus.completed,
            statisticsData.tasksStatus.pending,
            statisticsData.tasksStatus.overdue
        ];
        charts.tasksStatus.update();
    }
}

// ===============================
// Utility Functions
// ===============================

function showSuccess(message) {
    // Create and show success notification
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(46, 204, 113, 0.9);
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showError(message) {
    // Create and show error notification
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(231, 76, 60, 0.9);
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ===============================
// Page Cleanup
// ===============================

function cleanupStatisticsPage() {
    // Destroy charts
    Object.values(charts).forEach(chart => {
        if (chart && chart.destroy) {
            chart.destroy();
        }
    });
    
    charts = {};
    statisticsData = null;
    
    console.log('Statistics page cleaned up');
}

// ===============================
// Initialize when DOM is ready
// ===============================

document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the statistics page by looking for any statistics elements
    if (document.getElementById('total-todos') || document.querySelector('.stats-overview')) {
        initializeStatisticsPage();
    }
});

// Cleanup when leaving page
window.addEventListener('beforeunload', cleanupStatisticsPage);

// Export functions for global access
if (typeof window !== 'undefined') {
    window.StatisticsPage = {
        initialize: initializeStatisticsPage,
        refresh: refreshStatistics,
        cleanup: cleanupStatisticsPage
    };
    
    // Make refreshStatistics globally accessible for HTML onclick
    window.refreshStatistics = refreshStatistics;
}