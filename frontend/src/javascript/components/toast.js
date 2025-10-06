/**
 * Toast Notification Component
 * Tạo thông báo toast đẹp và có thể tùy chỉnh thay cho cái toast() mặc định của trình duyệt (Cũng nhờ AI build chứ chịu chết)
 * 
 * @param {Object} options - Cấu hình toast
 * @param {string} options.message - Nội dung thông báo
 * @param {string} options.type - Loại toast: 'success', 'error', 'warning', 'info' (mặc định: 'info')
 * @param {number} options.duration - Thời gian hiển thị (ms) (mặc định: 3000)
 * @param {string} options.position - Vị trí hiển thị: 'top-right', 'top-left', 'bottom-right', 'bottom-left' (mặc định: 'top-right')
 * @param {boolean} options.showIcon - Hiển thị icon hay không (mặc định: true)
 */
export function showToast(options = {}) {
    // Destructuring với giá trị mặc định
    const {
        message = 'Notification',
        type = 'info',
        duration = 3000,
        position = 'top-right',
        showIcon = true
    } = options;

    // Tạo toast element
    const toast = document.createElement('div');
    toast.className = `custom-toast custom-toast-${type}`;
    
    // Lấy màu và icon tương ứng với type
    const config = getToastConfig(type);
    
    // Tạo nội dung toast
    let content = '';
    if (showIcon) {
        content += `<i class="${config.icon}" style="margin-right: 8px;"></i>`;
    }
    content += message;
    
    toast.innerHTML = content;
    
    // Áp dụng styles
    applyToastStyles(toast, config, position);
    
    // Thêm vào DOM
    document.body.appendChild(toast);
    
    // Animation vào
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = getTransformValue(position, 'show');
    }, 10);
    
    // Tự động ẩn sau thời gian quy định
    setTimeout(() => {
        hideToast(toast, position);
    }, duration);
    
    // Trả về toast element để có thể thao tác thêm nếu cần
    return toast;
}

/**
 * Cách gọi đơn giản với string (tương thích ngược)
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại toast
 * @param {number} duration - Thời gian hiển thị
 */
export function showSimpleToast(message, type = 'info', duration = 3000) {
    return showToast({ message, type, duration });
}

/**
 * Lấy cấu hình màu sắc và icon cho từng loại toast
 */
function getToastConfig(type) {
    const configs = {
        success: {
            background: '#44d62c',
            icon: 'fa-solid fa-check'
        },
        error: {
            background: '#ff4444',
            icon: 'fa-solid fa-xmark'
        },
        warning: {
            background: '#ffa500',
            icon: 'fa-solid fa-triangle-exclamation'
        },
        info: {
            background: '#0198fc',
            icon: 'fa-solid fa-info-circle'
        }
    };
    
    return configs[type] || configs.info;
}

/**
 * Áp dụng styles cho toast
 */
function applyToastStyles(toast, config, position) {
    const positionStyles = getPositionStyles(position);
    
    toast.style.cssText = `
        position: fixed;
        ${positionStyles}
        padding: 12px 24px;
        background: ${config.background};
        color: white;
        border-radius: 6px;
        z-index: 10000;
        opacity: 0;
        transform: ${getTransformValue(position, 'hide')};
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        max-width: 400px;
        word-wrap: break-word;
    `;
}

/**
 * Lấy styles vị trí cho toast
 */
function getPositionStyles(position) {
    const positions = {
        'top-right': 'top: 20px; right: 20px;',
        'top-left': 'top: 20px; left: 20px;',
        'bottom-right': 'bottom: 20px; right: 20px;',
        'bottom-left': 'bottom: 20px; left: 20px;'
    };
    
    return positions[position] || positions['top-right'];
}

/**
 * Lấy giá trị transform cho animation
 */
function getTransformValue(position, state) {
    const isTop = position.includes('top');
    const isRight = position.includes('right');
    
    if (state === 'hide') {
        if (isTop) {
            return isRight ? 'translateX(100%)' : 'translateX(-100%)';
        } else {
            return isRight ? 'translateX(100%)' : 'translateX(-100%)';
        }
    } else {
        return 'translateX(0)';
    }
}

/**
 * Ẩn toast với animation
 */
function hideToast(toast, position) {
    toast.style.opacity = '0';
    toast.style.transform = getTransformValue(position, 'hide');
    
    setTimeout(() => {
        if (document.body.contains(toast)) {
            document.body.removeChild(toast);
        }
    }, 300);
}

/**
 * Các hàm tiện ích cho từng loại toast
 */
export function showSuccessToast(message, duration = 3000) {
    return showToast({ message, type: 'success', duration });
}

export function showErrorToast(message, duration = 3000) {
    return showToast({ message, type: 'error', duration });
}

export function showWarningToast(message, duration = 3000) {
    return showToast({ message, type: 'warning', duration });
}

export function showInfoToast(message, duration = 3000) {
    return showToast({ message, type: 'info', duration });
}