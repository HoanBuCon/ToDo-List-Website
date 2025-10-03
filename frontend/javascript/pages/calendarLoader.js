document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    // Biến danh sách Todo bên trái thành nguồn kéo thả
    var todoContainer = document.querySelector('.todo-section');
    if (todoContainer && FullCalendar && FullCalendar.Draggable) {
        new FullCalendar.Draggable(todoContainer, {
            itemSelector: '.todo-item',
            startDelay: 200,         // delay trước khi bắt đầu drag (mobile cần thời gian cảm ứng)
            dragMask: true,           // hiển thị mặt nạ khi drag trên mobile
            longPressDelay: 150,      // delay cho long press trên touch device
            eventData: function(eventEl) {
                var titleEl = eventEl.querySelector('.todo-content');
                var descEl = eventEl.querySelector('.todo-desc');
                var title = titleEl ? titleEl.textContent.trim() : 'Todo';
                var description = descEl ? descEl.textContent.trim() : '';
                return {
                    title: title,
                    extendedProps: { description: description }
                };
            }
        });
    }

    var selectedEvent = null;

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        editable: true,              // cho phép kéo/resize sự kiện trong lịch
        droppable: true,             // nhận sự kiện kéo từ bên ngoài
        eventStartEditable: true,
        eventDurationEditable: true,
        eventResizableFromStart: true, // cho phép kéo cả đầu sự kiện
        dragScroll: true,            // bật auto scroll/kéo sang trang khác khi drag
        longPressDelay: 100,        // delay nhận drag (ms) để tránh nhầm với click
        scrollTime: '06:00:00',     // thời gian default để scroll khi không có sự kiện
        scrollTimeReset: false,     // không reset scroll time khi chuyển view
        nowIndicator: true,         // hiển thị đường thời gian hiện tại
        drop: function(info) {
            // Được gọi khi kéo thả từ ngoài vào (vị trí mục tiêu hợp lệ)
            // Có thể xoá element nguồn nếu cần: info.draggedEl.parentNode.removeChild(info.draggedEl)
        },
        eventReceive: function(info) {
            // Sự kiện mới được thêm từ Todo vào lịch
            // Mặc định ở dayGrid là allDay, có thể set duration 1 ngày nếu thiếu end
            if (!info.event.end) {
                // đặt độ dài 1 ngày để tiện nhìn (tuỳ biến tiếp nếu muốn)
                var end = new Date(info.event.start);
                end.setDate(end.getDate() + 1);
                info.event.setEnd(end);
            }
            // gán id nếu thiếu để có thể tham chiếu xoá/sửa
            if (!info.event.id) {
                info.event.setProp('id', 'ev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8));
            }
            // Tại đây có thể gọi API lưu DB nếu có backend
            // console.log('eventReceive', info.event.toPlainObject());
        },
        eventDrop: function(info) {
            // Kéo thay đổi ngày bắt đầu/kết thúc
            // console.log('eventDrop', info.event.start, info.event.end);
        },
        eventResize: function(info) {
            // Kéo giãn để thay đổi duration
            // console.log('eventResize', info.event.start, info.event.end);
            
            // Kiểm tra nếu event kéo ra ngoài boundary của view hiện tại
            var currentDate = calendar.getDate();
            var eventEnd = info.event.end;
            var eventStart = info.event.start;
            var view = calendar.view;
            
            if (view.type === 'dayGridMonth') {
                // So sánh với tháng hiện tại
                var monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                var monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
                
                if (eventEnd > monthEnd || eventStart < monthStart) {
                    // Chuyển sang tháng chứa phần lớn của event
                    var targetDate = eventEnd > monthEnd ? 
                        new Date(eventEnd.getFullYear(), eventEnd.getMonth(), 1) :
                        new Date(eventStart.getFullYear(), eventStart.getMonth(), 1);
                    calendar.changeView('dayGridMonth', targetDate);
                }
            }
        },
        eventClick: function(info) {
            // Quản lý chọn sự kiện để hỗ trợ xoá bằng phím
            if (selectedEvent && selectedEvent.el) {
                selectedEvent.el.classList.remove('selected-event');
            }
            selectedEvent = info.event;
            if (info.el) {
                info.el.classList.add('selected-event');
            }
        }
    });

    calendar.render();

    // Lắng nghe phím Delete/Backspace để xoá sự kiện đang chọn
    document.addEventListener('keydown', function(e) {
        if (!selectedEvent) return;
        if (e.key === 'Delete' || e.key === 'Backspace') {
            e.preventDefault();
            // Có thể hiển thị confirm nếu muốn
            selectedEvent.remove();
            selectedEvent = null;
        }
    });
});