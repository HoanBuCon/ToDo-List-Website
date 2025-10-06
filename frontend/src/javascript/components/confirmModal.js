/**
 * Custom Confirm Modal Component
 * Cái confirm() mặc định của trình duyệt quá xấu nên nhờ AI làm cái custom này cho chất <(")
 * 
 * @param {string|Object} titleOrOptions - Tiêu đề modal hoặc object cấu hình
 * @param {string} message - Nội dung thông báo (nếu tham số đầu là string)
 * @param {string} confirmText - Text nút xác nhận (nếu tham số đầu là string)
 * @param {string} cancelText - Text nút hủy (nếu tham số đầu là string)
 * @returns {Promise<boolean>} - true nếu xác nhận, false nếu hủy
 */
export function showConfirmModal(titleOrOptions = {}, message, confirmText, cancelText) {
    let options = {};
    
    // Kiểm tra xem tham số đầu tiên là string hay object
    if (typeof titleOrOptions === 'string') {
        // Gọi theo cách cũ: showConfirmModal('Title', 'Message', 'OK', 'Cancel')
        options = {
            title: titleOrOptions,
            message: message || 'Are you sure?',
            confirmText: confirmText || 'OK',
            cancelText: cancelText || 'Cancel'
        };
    } else {
        // Gọi theo cách mới: showConfirmModal({ title: 'Title', message: 'Message', ... })
        options = titleOrOptions;
    }
    
    // Destructuring với giá trị mặc định
    const {
        title = 'Confirm',
        message: msg = 'Are you sure?',
        confirmText: confirmTxt = 'OK',
        cancelText: cancelTxt = 'Cancel',
        confirmButtonColor = '#44d62c',
        cancelButtonColor = '#ff4444'
    } = options;

    return new Promise((resolve) => {
        // Tạo overlay
        const overlay = document.createElement('div');
        overlay.className = 'confirm-modal-overlay';
        
        // Tạo modal
        const modal = document.createElement('div');
        modal.className = 'confirm-modal';
        
        // Tạo nội dung modal
        const modalContent = `
            <h3 class="confirm-modal-title">${title}</h3>
            <p class="confirm-modal-message">${msg}</p>
            <div class="confirm-modal-buttons">
                <button class="confirm-btn" style="background: ${confirmButtonColor};">${confirmTxt}</button>
                <button class="cancel-btn" style="border-color: ${cancelButtonColor}; color: ${cancelButtonColor};">${cancelTxt}</button>
            </div>
        `;
        
        modal.innerHTML = modalContent;
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Animation vào
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);

        // Event handlers
        const confirmBtn = modal.querySelector('.confirm-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');

        const cleanup = (result) => {
            overlay.classList.add('hide');
            setTimeout(() => {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
                resolve(result);
            }, 300);
        };

        // Click handlers
        confirmBtn.addEventListener('click', () => cleanup(true));
        cancelBtn.addEventListener('click', () => cleanup(false));
        
        // Click overlay để đóng (chỉ khi click vào overlay, không phải modal)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) cleanup(false);
        });

        // ESC để đóng
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                document.removeEventListener('keydown', handleEsc);
                cleanup(false);
            }
        };
        document.addEventListener('keydown', handleEsc);

        // Hover effects cho nút confirm
        confirmBtn.addEventListener('mouseenter', () => {
            const currentColor = confirmButtonColor;
            const hoverColor = lightenColor(currentColor, 20);
            confirmBtn.style.background = hoverColor;
            confirmBtn.style.transform = 'scale(1.05)';
        });
        
        confirmBtn.addEventListener('mouseleave', () => {
            confirmBtn.style.background = confirmButtonColor;
            confirmBtn.style.transform = 'scale(1)';
        });

        // Hover effects cho nút cancel
        cancelBtn.addEventListener('mouseenter', () => {
            cancelBtn.style.background = cancelButtonColor;
            cancelBtn.style.color = '#fff';
            cancelBtn.style.transform = 'scale(1.05)';
        });
        
        cancelBtn.addEventListener('mouseleave', () => {
            cancelBtn.style.background = 'transparent';
            cancelBtn.style.color = cancelButtonColor;
            cancelBtn.style.transform = 'scale(1)';
        });
    });
}

/**
 * Helper function để làm sáng màu
 * @param {string} color - Màu hex (ví dụ: '#44d62c')
 * @param {number} percent - Phần trăm làm sáng
 * @returns {string} - Màu hex mới
 */
function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}