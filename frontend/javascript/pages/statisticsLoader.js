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
            monthlyData: [
                { month: 'Jan', completed: 45, created: 62 },
                { month: 'Feb', completed: 52, created: 58 },
                { month: 'Mar', completed: 48, created: 65 },
                { month: 'Apr', completed: 61, created: 70 },
                { month: 'May', completed: 55, created: 63 },
                { month: 'Jun', completed: 67, created: 72 }
            ],
            categoryData: {
                'Công việc': 45,
                'Cá nhân': 32,
                'Học tập': 28,
                'Sức khỏe': 18,
                'Khác': 15
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
    // Todo Distribution Chart
    createMonthlyChart();
    
    // Completion Progress Chart
    createCategoryChart();
}

function createMonthlyChart() {
    const ctx = document.getElementById('todoDistributionChart');
    if (!ctx) return;
    
    // Destroy existing chart if exists
    if (charts.monthly) {
        charts.monthly.destroy();
    }
    
    charts.monthly = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: statisticsData.monthlyData.map(item => item.month),
            datasets: [{
                label: 'Hoàn thành',
                data: statisticsData.monthlyData.map(item => item.completed),
                backgroundColor: 'rgba(68, 214, 44, 0.8)',
                borderColor: '#44d62c',
                borderWidth: 2
            }, {
                label: 'Tạo mới',
                data: statisticsData.monthlyData.map(item => item.created),
                backgroundColor: 'rgba(52, 152, 219, 0.8)',
                borderColor: '#3498db',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            interaction: {
                intersect: false
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#e8e6e3'
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
                duration: 750
            }
        }
    });
}

function createCategoryChart() {
    const ctx = document.getElementById('completionProgressChart');
    if (!ctx) return;
    
    // Destroy existing chart if exists
    if (charts.category) {
        charts.category.destroy();
    }
    
    const colors = [
        '#44d62c', '#3498db', '#e74c3c', '#f39c12', '#9b59b6'
    ];
    
    charts.category = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statisticsData.categoryData),
            datasets: [{
                data: Object.values(statisticsData.categoryData),
                backgroundColor: colors.map(color => color + '80'),
                borderColor: colors,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            interaction: {
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e8e6e3',
                        padding: 20
                    }
                }
            },
            animation: {
                duration: 750
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
    // Update todo distribution chart
    if (charts.monthly) {
        charts.monthly.data.datasets[0].data = statisticsData.monthlyData.map(item => item.completed);
        charts.monthly.data.datasets[1].data = statisticsData.monthlyData.map(item => item.created);
        charts.monthly.update();
    }
    
    // Update completion progress chart
    if (charts.category) {
        charts.category.data.datasets[0].data = Object.values(statisticsData.categoryData);
        charts.category.update();
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