import { setupPasswordToggle } from '../features/passwordToggle.js';
import { registerRegisterPageEvents } from '../events/registerPageEvents.js';

// Thiết lập sự kiện cho trang Register
export function setupRegisterPage() {
    setupPasswordToggle('password', 'eyeIcon', 'togglePasswordButton');
    setupPasswordToggle('confirmPassword', 'eyeIconConfirm', 'toggleConfirmPasswordButton');
    registerRegisterPageEvents();
}