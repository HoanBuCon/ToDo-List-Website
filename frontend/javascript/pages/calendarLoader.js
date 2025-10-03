// Global variables
var selectedEvent = null;
var dragCleanupTimer = null;

// Calendar initialization
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    
    if (!calendarEl) {
        console.error('Calendar element not found');
        return;
    }

    // Initialize draggable todo items
    initializeTodoDraggable();
    
    // Initialize main calendar
    var calendar = initializeCalendar(calendarEl);
    
    // Setup global event listeners
    setupGlobalEventListeners();
});

// Initialize draggable functionality for todo items
function initializeTodoDraggable() {
    var todoContainer = document.querySelector('.todo-section');
    
    if (!todoContainer || !FullCalendar || !FullCalendar.Draggable) {
        console.warn('Todo draggable initialization skipped - missing dependencies');
        return;
    }

    new FullCalendar.Draggable(todoContainer, {
        itemSelector: '.todo-item',
        startDelay: 200,         // Delay cho mobile touch
        dragMask: true,          // Visual feedback cho mobile
        longPressDelay: 150,     // Long press delay cho touch devices
        eventData: function(eventEl) {
            var titleEl = eventEl.querySelector('.todo-content');
            var descEl = eventEl.querySelector('.todo-desc');
            var title = titleEl ? titleEl.textContent.trim() : 'Todo';
            var description = descEl ? descEl.textContent.trim() : '';
            
            return {
                title: title,
                extendedProps: { description: description },
                id: 'todo_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
            };
        }
    });
}

// Initialize main calendar with optimized configuration
function initializeCalendar(calendarEl) {

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        editable: true,
        droppable: true,
        eventStartEditable: true,
        eventDurationEditable: true,
        eventResizableFromStart: true,
        dragScroll: true,
        longPressDelay: 100,
        scrollTime: '06:00:00',
        scrollTimeReset: false,
        nowIndicator: true,
        eventConstraint: {
            start: '1900-01-01',
            end: '2100-12-31'
        },
        
        // Event handlers
        drop: handleDrop,
        eventReceive: handleEventReceive,
        eventDrop: handleEventDrop,
        eventResize: handleEventResize,
        eventClick: handleEventClick,
        eventDragStart: handleEventDragStart,
        eventDragStop: handleEventDragStop,
        eventResizeStart: handleEventResizeStart,
        eventResizeStop: handleEventResizeStop
    });

    calendar.render();
    return calendar;
}

// Event handler functions
function handleDrop(info) {
    console.log('Item dropped from external source');
    // Optional: Remove source element if needed
    // info.draggedEl.parentNode.removeChild(info.draggedEl);
}

function handleEventReceive(info) {
    console.log('Event received:', info.event.title);
    
    // Ensure event has end date
    if (!info.event.end) {
        var end = new Date(info.event.start);
        end.setDate(end.getDate() + 1);
        info.event.setEnd(end);
    }
    
    // Ensure event has ID
    if (!info.event.id) {
        info.event.setProp('id', 'ev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8));
    }
    
    // Here you can call API to save to backend
    // saveEventToBackend(info.event.toPlainObject());
}

function handleEventDrop(info) {
    console.log('Event dropped:', info.event.title);
    
    // Auto navigate to month containing the dropped event
    var calendar = info.view.calendar;
    autoNavigateToEventMonth(calendar, info.event.start);
    
    // Here you can call API to update backend
    // updateEventInBackend(info.event.toPlainObject());
}

function handleEventResize(info) {
    console.log('Event resized:', info.event.title);
    
    var calendar = info.view.calendar;
    var startDate = info.event.start;
    var endDate = info.event.end;
    
    // Auto navigate if resized event extends to different month
    var startInDifferentMonth = !isDateInCurrentView(calendar, startDate);
    var endInDifferentMonth = endDate && !isDateInCurrentView(calendar, endDate);
    
    if (startInDifferentMonth) {
        autoNavigateToEventMonth(calendar, startDate);
    } else if (endInDifferentMonth) {
        autoNavigateToEventMonth(calendar, endDate);
    }
    
    // Here you can call API to update backend
    // updateEventInBackend(info.event.toPlainObject());
}

function handleEventClick(info) {
    // Manage event selection for keyboard deletion
    if (selectedEvent && selectedEvent.el) {
        selectedEvent.el.classList.remove('selected-event');
    }
    selectedEvent = info.event;
    if (info.el) {
        info.el.classList.add('selected-event');
    }
}

function handleEventDragStart(info) {
    console.log('Drag started:', info.event.title);
    
    if (info.el) {
        info.el.classList.add('fc-event-dragging');
    }
    
    // Set auto cleanup timer as failsafe
    if (dragCleanupTimer) {
        clearTimeout(dragCleanupTimer);
    }
    dragCleanupTimer = setTimeout(function() {
        console.log('Auto cleanup triggered after timeout');
        forceCleanupDragState();
    }, 10000);
}

function handleEventDragStop(info) {
    console.log('Drag stopped:', info.event.title);
    
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
        cleanupDragArtifacts();
    }, 100);
}

function handleEventResizeStart(info) {
    console.log('Resize started:', info.event.title);
    if (info.el) {
        info.el.classList.add('fc-event-resizing');
    }
}

function handleEventResizeStop(info) {
    console.log('Resize stopped:', info.event.title);
    if (info.el) {
        info.el.classList.remove('fc-event-resizing');
    }
    
    // Force cleanup any resize artifacts
    setTimeout(function() {
        cleanupResizeArtifacts();
    }, 100);
}

// Utility functions
function autoNavigateToEventMonth(calendar, eventDate) {
    var currentDate = calendar.getDate();
    
    if (eventDate.getMonth() !== currentDate.getMonth() || 
        eventDate.getFullYear() !== currentDate.getFullYear()) {
        console.log('Event moved to different month, navigating...');
        calendar.gotoDate(eventDate);
    }
}

function isDateInCurrentView(calendar, date) {
    var currentDate = calendar.getDate();
    var view = calendar.view;
    
    if (view.type === 'dayGridMonth') {
        return date.getMonth() === currentDate.getMonth() && 
               date.getFullYear() === currentDate.getFullYear();
    }
    
    // Add logic for other view types if needed
    return true;
}

function cleanupDragArtifacts() {
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
}

function cleanupResizeArtifacts() {
    var resizeElements = document.querySelectorAll('.fc-event-resizing');
    resizeElements.forEach(function(el) {
        if (el && el.parentNode) {
            el.classList.remove('fc-event-resizing');
        }
    });
}

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

// Global event listeners
function setupGlobalEventListeners() {
    // Keyboard event listeners
    document.addEventListener('keydown', function(e) {
        if (!selectedEvent) return;
        
        if (e.key === 'Delete' || e.key === 'Backspace') {
            e.preventDefault();
            // Optional: Add confirmation dialog
            // if (confirm('Are you sure you want to delete this event?')) {
                selectedEvent.remove();
                selectedEvent = null;
            // }
        }
        
        // ESC key to cancel drag if stuck
        if (e.key === 'Escape') {
            forceCleanupDragState();
        }
    });
    
    // Auto cleanup on mouse up globally (failsafe)
    document.addEventListener('mouseup', function(e) {
        setTimeout(function() {
            var stuckElements = document.querySelectorAll('.fc-event-mirror, .fc-drag-helper');
            if (stuckElements.length > 0) {
                console.log('Found stuck drag elements, cleaning up...');
                forceCleanupDragState();
            }
        }, 500);
    });
    
    // Auto cleanup on mouse leave calendar area (failsafe)
    document.addEventListener('mouseleave', function(e) {
        if (e.target.closest('#calendar')) {
            setTimeout(function() {
                var stuckElements = document.querySelectorAll('.fc-event-mirror, .fc-drag-helper');
                if (stuckElements.length > 0) {
                    console.log('Mouse left calendar with stuck elements, cleaning up...');
                    forceCleanupDragState();
                }
            }, 200);
        }
    });
}