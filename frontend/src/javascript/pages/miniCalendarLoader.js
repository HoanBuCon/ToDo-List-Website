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
                
                // Ensure events have proper class names for hover effect
                eventClassNames: function(arg) {
                    return ['event-id-' + arg.event.id];
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
                    
                    // Auto navigate to the month of the dropped event
                    var eventDate = info.event.start;
                    var currentDate = calendar.getDate();
                    
                    if (eventDate.getMonth() !== currentDate.getMonth() || 
                        eventDate.getFullYear() !== currentDate.getFullYear()) {
                        calendar.gotoDate(eventDate);
                    }
                    
                    if (updateDateInputsFromEvent) {
                        updateDateInputsFromEvent(info.event);
                    }
                },
                eventResize: function(info) {
                    // Kéo giãn để thay đổi duration - cập nhật input fields
                    
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
                        calendar.gotoDate(startDate);
                    } else if (endInDifferentMonth) {
                        calendar.gotoDate(endDate);
                    }
                    
                    if (updateDateInputsFromEvent) {
                        updateDateInputsFromEvent(info.event);
                    }
                },
                eventClick: function(info) {
                    // Preview events are not selectable in create task page
                    // Just a visual preview, no interaction needed
                },
                eventDragStart: function(info) {
                    console.log('Drag started for:', info.event.title);
                    // Store original date for potential navigation
                    info.event.originalDate = calendar.getDate();
                    
                    // Clear any existing cleanup timers
                    if (dragCleanupTimer) {
                        clearTimeout(dragCleanupTimer);
                    }
                    
                    // Set shorter cleanup timer as failsafe (3 seconds)
                    dragCleanupTimer = setTimeout(function() {
                        console.log('Auto cleanup triggered after timeout');
                        forceCleanupDragState();
                    }, 3000);
                },
                eventDragStop: function(info) {
                    console.log('Drag stopped for:', info.event.title);
                    
                    // Clear timeout timer immediately
                    if (dragCleanupTimer) {
                        clearTimeout(dragCleanupTimer);
                        dragCleanupTimer = null;
                    }
                    
                    // Immediate cleanup
                    forceCleanupDragState();
                },
                eventResizeStart: function(info) {
                    console.log('Resize started for:', info.event.title);
                    // Clear any existing cleanup timers
                    if (dragCleanupTimer) {
                        clearTimeout(dragCleanupTimer);
                    }
                    
                    // Set cleanup timer for resize as well
                    dragCleanupTimer = setTimeout(function() {
                        console.log('Auto cleanup triggered during resize');
                        forceCleanupDragState();
                    }, 3000);
                },
                eventResizeStop: function(info) {
                    console.log('Resize stopped for:', info.event.title);
                    
                    // Clear timeout timer immediately
                    if (dragCleanupTimer) {
                        clearTimeout(dragCleanupTimer);
                        dragCleanupTimer = null;
                    }
                    
                    // Immediate cleanup
                    forceCleanupDragState();
                }
            });
            calendar.render();
            
            // Setup calendar for task preview functionality
            setupTaskPreview(calendar);
            
            // Setup event hover effect for multi-segment events
            setupEventHoverEffect();
        }
    }, 100);
});

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
            return;
        }
        
        
        isUpdatingFromCalendar = true;
        
        var start = event.start;
        var end = event.end;
        
        if (startDateInput && start) {
            var startDateValue = formatDateForInput(start);
            startDateInput.value = startDateValue;
            
            // Trigger input event để các listener khác biết
            startDateInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        if (endDateInput && end) {
            // Subtract 1 day from end date since FullCalendar end is exclusive
            var endDate = new Date(end);
            endDate.setDate(endDate.getDate() - 1);
            var endDateValue = formatDateForInput(endDate);
            endDateInput.value = endDateValue;
            
            // Trigger input event để các listener khác biết
            endDateInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // Reset flag sau một khoảng thời gian ngắn
        setTimeout(function() {
            isUpdatingFromCalendar = false;
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

// ESC key để cancel drag nếu bị stuck - chỉ giữ lại chức năng này
document.addEventListener('keydown', function(e) {
    // ESC key để cancel drag nếu bị stuck
    if (e.key === 'Escape') {
        forceCleanupDragState();
    }
});

// Force cleanup drag state khi bị lock - Enhanced version
function forceCleanupDragState() {
    console.log('Force cleanup drag state');
    
    // Clear any pending timers first
    if (dragCleanupTimer) {
        clearTimeout(dragCleanupTimer);
        dragCleanupTimer = null;
    }
    
    // Remove all drag-related classes and elements
    var dragElements = document.querySelectorAll('.fc-event-dragging, .fc-event-resizing, .fc-event-mirror, .fc-drag-helper');
    dragElements.forEach(function(el) {
        if (el && el.parentNode) {
            el.classList.remove('fc-event-dragging', 'fc-event-resizing');
            if (el.classList.contains('fc-event-mirror') || el.classList.contains('fc-drag-helper')) {
                try {
                    el.parentNode.removeChild(el);
                } catch (e) {
                    console.log('Error removing drag element:', e);
                }
            }
        }
    });
    
    // Reset all cursors
    document.body.style.cursor = '';
    var calendarEl = document.getElementById('calendar-preview');
    if (calendarEl) {
        calendarEl.style.cursor = '';
    }
    
    // Clear any drag/drop event handlers that might be stuck
    document.ondragstart = null;
    document.ondragover = null;
    document.ondrop = null;
    
    // Force release any mouse capture
    if (document.releasePointerCapture) {
        try {
            document.releasePointerCapture();
        } catch (e) {}
    }
    
    // Clear any selection that might interfere
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
}

// Enhanced global cleanup events with proper scope
document.addEventListener('mouseup', function(e) {
    // Only cleanup if we're actually in a drag state or have stuck elements
    var stuckElements = document.querySelectorAll('.fc-event-mirror, .fc-drag-helper, .fc-event-dragging, .fc-event-resizing');
    if (stuckElements.length > 0) {
        setTimeout(function() {
            forceCleanupDragState();
        }, 100); // Shorter delay
    }
});

// Cleanup on mouse leave document (handles case where mouse leaves window during drag)
document.addEventListener('mouseleave', function(e) {
    // Only trigger if mouse leaves the entire document
    if (e.target === document.documentElement || e.target === document.body) {
        setTimeout(function() {
            var stuckElements = document.querySelectorAll('.fc-event-mirror, .fc-drag-helper');
            if (stuckElements.length > 0) {
                forceCleanupDragState();
            }
        }, 100);
    }
});

// Cleanup on window blur (when user switches tabs/windows during drag)
window.addEventListener('blur', function() {
    setTimeout(function() {
        var stuckElements = document.querySelectorAll('.fc-event-mirror, .fc-drag-helper, .fc-event-dragging, .fc-event-resizing');
        if (stuckElements.length > 0) {
            console.log('Window blur cleanup triggered');
            forceCleanupDragState();
        }
    }, 100);
});

// Setup hover effect for all segments of the same event - SCOPED TO MINI CALENDAR ONLY
function setupEventHoverEffect() {
    var calendarPreview = document.getElementById('calendar-preview');
    if (!calendarPreview) return;
    
    // Event delegation chỉ trong mini calendar container
    calendarPreview.addEventListener('mouseenter', function(e) {
        var eventElement = e.target.closest('.fc-daygrid-event');
        if (!eventElement) return;
        
        // Lấy event ID từ các class hoặc data attribute
        var eventId = getMiniEventIdFromElement(eventElement);
        if (!eventId) return;
        
        // Highlight tất cả segments của cùng event chỉ trong mini calendar
        highlightMiniEventSegments(eventId, true);
    }, true);
    
    calendarPreview.addEventListener('mouseleave', function(e) {
        var eventElement = e.target.closest('.fc-daygrid-event');
        if (!eventElement) return;
        
        var eventId = getMiniEventIdFromElement(eventElement);
        if (!eventId) return;
        
        // Remove highlight từ tất cả segments chỉ trong mini calendar
        highlightMiniEventSegments(eventId, false);
    }, true);
}

// Extract event ID from element - MINI CALENDAR SPECIFIC
function getMiniEventIdFromElement(eventElement) {
    // Look for our custom event-id class
    var classList = eventElement.classList;
    for (var i = 0; i < classList.length; i++) {
        var className = classList[i];
        if (className.startsWith('event-id-')) {
            return className;
        }
    }
    
    // Fallback: check parent harness
    var harness = eventElement.closest('.fc-daygrid-event-harness');
    if (harness) {
        for (var i = 0; i < harness.classList.length; i++) {
            var className = harness.classList[i];
            if (className.startsWith('event-id-')) {
                return className;
            }
        }
    }
    
    return null;
}

// Highlight/unhighlight all segments of an event - MINI CALENDAR SPECIFIC
function highlightMiniEventSegments(eventId, highlight) {
    if (!eventId) return;
    
    // Find all elements with the same event ID class within calendar preview ONLY
    var calendarPreview = document.getElementById('calendar-preview');
    if (!calendarPreview) return;
    
    var selector = '.' + eventId;
    var elements = calendarPreview.querySelectorAll(selector);
    
    elements.forEach(function(element) {
        var eventEl = element.querySelector('.fc-daygrid-event') || element;
        if (eventEl && eventEl.classList.contains('fc-daygrid-event')) {
            if (highlight) {
                eventEl.classList.add('event-hover-active');
            } else {
                eventEl.classList.remove('event-hover-active');
            }
        }
    });
}