import { setupPasswordToggle } from '../features/passwordToggle.js';

// Thiết lập sự kiện cho trang Login
export function setupLoginPage() {
    setupPasswordToggle('password', 'eyeIcon', 'togglePasswordButton');
}