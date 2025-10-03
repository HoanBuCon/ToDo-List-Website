// Calendar mini cho Create Task Page
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        var calendarEl = document.getElementById('calendar-preview');
        
        if (calendarEl && typeof FullCalendar !== 'undefined') {
            // Initialize Task Preview functionality first to get the update function
            var updateDateInputsFromEvent = initTaskPreview();
            
            var calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                aspectRatio: 1.5,
                headerToolbar: { left: 'title', center: '', right: 'today prev next' },
                editable: true,              // Cho phép kéo sự kiện
                droppable: true,             // Nhận sự kiện kéo từ bên ngoài
                eventStartEditable: true,
                eventDurationEditable: true, // Bật lại resize duration
                eventResizableFromStart: true, // Bật lại resize từ đầu
                dragScroll: true,            // Auto scroll khi drag
                longPressDelay: 100,         // Delay cho mobile
                dayMaxEvents: 2,
                selectable: false,           // Tắt select để tránh conflict
                selectMirror: false,         // Tắt select mirror
                eventConstraint: {           // Allow dragging to any date
                    start: '1900-01-01',
                    end: '2100-12-31'
                },
                eventReceive: function(info) {
                    // Khi drop task vào calendar
                    if (!info.event.end) {
                        var end = new Date(info.event.start);
                        end.setDate(end.getDate() + 1);
                        info.event.setEnd(end);
                    }
                    if (!info.event.id) {
                        info.event.setProp('id', 'task_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8));
                    }
                },
                eventDrop: function(info) {
                    // Kéo thay đổi ngày - cập nhật input fields
                    console.log('Event dropped:', info.event.title, info.event.id);
                    
                    // Auto navigate to the month of the dropped event
                    var eventDate = info.event.start;
                    var currentDate = calendar.getDate();
                    
                    if (eventDate.getMonth() !== currentDate.getMonth() || 
                        eventDate.getFullYear() !== currentDate.getFullYear()) {
                        console.log('Event moved to different month, navigating...');
                        calendar.gotoDate(eventDate);
                    }
                    
                    if (updateDateInputsFromEvent) {
                        updateDateInputsFromEvent(info.event);
                    }
                },
                eventResize: function(info) {
                    // Kéo giãn để thay đổi duration - cập nhật input fields
                    console.log('Event resized:', info.event.title, info.event.id);
                    
                    // Auto navigate if resized event extends to different month
                    var startDate = info.event.start;
                    var endDate = info.event.end;
                    var currentDate = calendar.getDate();
                    
                    // Check if start or end date is in different month
                    var startInDifferentMonth = startDate.getMonth() !== currentDate.getMonth() || 
                                               startDate.getFullYear() !== currentDate.getFullYear();
                    var endInDifferentMonth = endDate && (endDate.getMonth() !== currentDate.getMonth() || 
                                             endDate.getFullYear() !== currentDate.getFullYear());
                    
                    if (startInDifferentMonth) {
                        console.log('Event start moved to different month, navigating...');
                        calendar.gotoDate(startDate);
                    } else if (endInDifferentMonth) {
                        console.log('Event end moved to different month, navigating...');
                        calendar.gotoDate(endDate);
                    }
                    
                    if (updateDateInputsFromEvent) {
                        updateDateInputsFromEvent(info.event);
                    }
                },
                eventClick: function(info) {
                    // Select event để có thể xóa bằng phím
                    if (selectedEvent && selectedEvent.el) {
                        selectedEvent.el.classList.remove('selected-event');
                    }
                    selectedEvent = info.event;
                    if (info.el) {
                        info.el.classList.add('selected-event');
                    }
                },
                eventDragStart: function(info) {
                    console.log('Drag started for:', info.event.title);
                    // Store original date for potential navigation
                    info.event.originalDate = calendar.getDate();
                    // Add dragging class for visual feedback
                    if (info.el) {
                        info.el.classList.add('fc-event-dragging');
                    }
                    
                    // Set auto cleanup timer as failsafe (10 seconds)
                    if (dragCleanupTimer) {
                        clearTimeout(dragCleanupTimer);
                    }
                    dragCleanupTimer = setTimeout(function() {
                        console.log('Auto cleanup triggered after timeout');
                        forceCleanupDragState();
                    }, 10000);
                },
                eventDragStop: function(info) {
                    console.log('Drag stopped for:', info.event.title);
                    
                    // Clear timeout timer
                    if (dragCleanupTimer) {
                        clearTimeout(dragCleanupTimer);
                        dragCleanupTimer = null;
                    }
                    
                    // Remove dragging class
                    if (info.el) {
                        info.el.classList.remove('fc-event-dragging');
                    }
                    
                    // Force cleanup any drag artifacts
                    setTimeout(function() {
                        var dragElements = document.querySelectorAll('.fc-event-dragging, .fc-event-mirror');
                        dragElements.forEach(function(el) {
                            if (el && el.parentNode) {
                                if (el.classList.contains('fc-event-mirror')) {
                                    el.parentNode.removeChild(el);
                                } else {
                                    el.classList.remove('fc-event-dragging');
                                }
                            }
                        });
                    }, 100);
                },
                eventResizeStart: function(info) {
                    console.log('Resize started for:', info.event.title);
                    if (info.el) {
                        info.el.classList.add('fc-event-resizing');
                    }
                },
                eventResizeStop: function(info) {
                    console.log('Resize stopped for:', info.event.title);
                    if (info.el) {
                        info.el.classList.remove('fc-event-resizing');
                    }
                    // Force cleanup any resize artifacts
                    setTimeout(function() {
                        var resizeElements = document.querySelectorAll('.fc-event-resizing');
                        resizeElements.forEach(function(el) {
                            if (el && el.parentNode) {
                                el.classList.remove('fc-event-resizing');
                            }
                        });
                    }, 100);
                }
            });
            calendar.render();
            
            // Setup calendar for task preview functionality
            setupTaskPreview(calendar);
        }
    }, 100);
});

var selectedEvent = null;
var isUpdatingFromCalendar = false; // Global flag để tránh loop giữa input và calendar
var previewEventId = 'preview-task-' + Date.now(); // Global preview event ID
var dragCleanupTimer = null; // Timer cho auto cleanup

// Helper function to format date for input
function formatDateForInput(date) {
    if (!date) return '';
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

// Task Preview functionality - khởi tạo và trả về hàm update
function initTaskPreview() {
    // Get DOM elements
    var taskTitleInput = document.querySelector('.task-title-input');
    var dateInputs = document.querySelectorAll('.task-date-input');
    var startDateInput = dateInputs[0]; // First input is Start Date
    var endDateInput = dateInputs[1];   // Second input is End Date
    
    if (!taskTitleInput) {
        return null;
    }
    
    // Update date inputs from calendar event - ĐÂY LÀ HÀM CHÍNH CẦN EXPORT
    function updateDateInputsFromEvent(event) {
        // Kiểm tra xem có phải là preview event không - sử dụng global previewEventId
        if (!event.id || event.id !== previewEventId) {
            console.log('Event is not the current preview task, skipping update:', event.id, 'Expected:', previewEventId);
            return;
        }
        
        console.log('Updating date inputs from calendar event:', event.title, event.start, event.end);
        
        isUpdatingFromCalendar = true;
        
        var start = event.start;
        var end = event.end;
        
        if (startDateInput && start) {
            var startDateValue = formatDateForInput(start);
            console.log('Setting start date to:', startDateValue);
            startDateInput.value = startDateValue;
            
            // Trigger input event để các listener khác biết
            startDateInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        if (endDateInput && end) {
            // Subtract 1 day from end date since FullCalendar end is exclusive
            var endDate = new Date(end);
            endDate.setDate(endDate.getDate() - 1);
            var endDateValue = formatDateForInput(endDate);
            console.log('Setting end date to:', endDateValue);
            endDateInput.value = endDateValue;
            
            // Trigger input event để các listener khác biết
            endDateInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // Reset flag sau một khoảng thời gian ngắn
        setTimeout(function() {
            isUpdatingFromCalendar = false;
            console.log('Calendar update flag reset');
        }, 150);
    }
    
    // Trả về hàm update để sử dụng ở ngoài
    return updateDateInputsFromEvent;
}

// Setup Task Preview functionality với calendar
function setupTaskPreview(calendar) {
    // Get DOM elements
    var taskTitleInput = document.querySelector('.task-title-input');
    var dateInputs = document.querySelectorAll('.task-date-input');
    var startDateInput = dateInputs[0]; // First input is Start Date
    var endDateInput = dateInputs[1];   // Second input is End Date
    
    if (!taskTitleInput || !calendar) {
        return;
    }
    
    // Update preview when title changes
    taskTitleInput.addEventListener('input', function() {
        if (!isUpdatingFromCalendar) {
            updateCalendarPreview();
        }
    });
    
    // Update preview when dates change
    function updateDatePreview() {
        console.log('Date input changed, isUpdatingFromCalendar:', isUpdatingFromCalendar);
        if (!isUpdatingFromCalendar) {
            updateCalendarPreview();
        }
    }
    
    if (startDateInput) {
        startDateInput.addEventListener('change', updateDatePreview);
        startDateInput.addEventListener('input', updateDatePreview);
    }
    if (endDateInput) {
        endDateInput.addEventListener('change', updateDatePreview);
        endDateInput.addEventListener('input', updateDatePreview);
    }
    
    // Update calendar preview
    function updateCalendarPreview() {
        var title = taskTitleInput.value.trim();
        var startDate = startDateInput ? startDateInput.value : '';
        var endDate = endDateInput ? endDateInput.value : '';
        
        // Remove existing preview event
        var existingEvent = calendar.getEventById(previewEventId);
        if (existingEvent) {
            existingEvent.remove();
        }
        
        // Add new preview event if we have enough data
        if (title && startDate) {
            var start = new Date(startDate);
            var end = endDate ? new Date(endDate) : new Date(start.getTime() + 24 * 60 * 60 * 1000); // +1 ngày nếu không có end date
            
            // Ensure end is after start
            if (end <= start) {
                end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
            }
            
            // Auto navigate to the month containing the start date
            var currentDate = calendar.getDate();
            if (!isUpdatingFromCalendar && 
                (start.getMonth() !== currentDate.getMonth() || 
                 start.getFullYear() !== currentDate.getFullYear())) {
                console.log('Task date in different month, navigating to:', start);
                calendar.gotoDate(start);
            }
            
            // Giữ lại toàn bộ ký tự Unicode, kể cả dấu tiếng Việt
            var cleanTitle = title.trim();

            calendar.addEvent({
                id: previewEventId,
                title: cleanTitle,
                start: start,
                end: end,
                backgroundColor: 'rgba(68, 214, 44, 0.3)',
                borderColor: '#44d62c',
                textColor: '#44d62c',
                classNames: ['preview-task-event'],
                allDay: true
            });
        }
    }
    
    // Initial update
    updateCalendarPreview();
}

// Lắng nghe phím Delete/Backspace để xóa sự kiện đang chọn
document.addEventListener('keydown', function(e) {
    if (!selectedEvent) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        selectedEvent.remove();
        selectedEvent = null;
    }
    
    // ESC key để cancel drag nếu bị stuck
    if (e.key === 'Escape') {
        forceCleanupDragState();
    }
});

// Force cleanup drag state khi bị lock
function forceCleanupDragState() {
    console.log('Force cleaning up drag state...');
    
    // Remove all drag-related classes and elements
    var dragElements = document.querySelectorAll('.fc-event-dragging, .fc-event-resizing, .fc-event-mirror, .fc-drag-helper');
    dragElements.forEach(function(el) {
        if (el && el.parentNode) {
            el.classList.remove('fc-event-dragging', 'fc-event-resizing');
            if (el.classList.contains('fc-event-mirror') || el.classList.contains('fc-drag-helper')) {
                el.parentNode.removeChild(el);
            }
        }
    });
    
    // Reset cursor
    document.body.style.cursor = '';
    
    // Clear any ongoing drag operations
    if (document.ondragstart) {
        document.ondragstart = null;
    }
    
    console.log('Drag state cleanup completed');
}

// Auto cleanup on mouse up globally (failsafe)
document.addEventListener('mouseup', function(e) {
    setTimeout(function() {
        // Check if there are stuck drag elements after a brief delay
        var stuckElements = document.querySelectorAll('.fc-event-mirror, .fc-drag-helper');
        if (stuckElements.length > 0) {
            console.log('Found stuck drag elements, cleaning up...');
            forceCleanupDragState();
        }
    }, 500);
});

// Auto cleanup on mouse leave calendar area (failsafe)
document.addEventListener('mouseleave', function(e) {
    if (e.target.closest('#calendar-preview')) {
        setTimeout(function() {
            var stuckElements = document.querySelectorAll('.fc-event-mirror, .fc-drag-helper');
            if (stuckElements.length > 0) {
                console.log('Mouse left calendar with stuck elements, cleaning up...');
                forceCleanupDragState();
            }
        }, 200);
    }
});