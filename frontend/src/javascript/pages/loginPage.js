import { setupPasswordToggle } from '../features/passwordToggle.js';

// Thiết lập sự kiện cho trang Login
export function loginPage() {
    setupPasswordToggle('password', 'eyeIcon', 'togglePasswordButton');
}