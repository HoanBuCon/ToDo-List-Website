// Chuyển đổi trạng thái hiển thị mật khẩu
export function togglePassword(inputId, toggleId) {
    const passwordInput = document.getElementById(inputId);
    const eyesIcon = document.getElementById(toggleId);

    if (!passwordInput || !eyesIcon) return;

    const isPassword = passwordInput.type === 'password';

    if (isPassword) {
        passwordInput.type = 'text';
        eyesIcon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyesIcon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Thiết lập sự kiện chuyển đổi hiển thị mật khẩu cho nút bấm
export function setupPasswordToggle(inputId, toggleId, buttonId) {
    console.log(`Setting up password toggle for input: ${inputId}, icon: ${toggleId}, button: ${buttonId}`);
    
    const toggleButton = document.getElementById(buttonId);
    if (!toggleButton) {
        console.error(`Toggle button with ID '${buttonId}' not found`);
        return;
    }

    console.log('Toggle button found:', toggleButton);

    toggleButton.addEventListener('click', () => {
        console.log('Toggle button clicked');
        togglePassword(inputId, toggleId);
    });
}