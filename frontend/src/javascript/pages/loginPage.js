import { setupPasswordToggle } from '../features/passwordToggle.js';
import { registerRegisterPageEvents } from '../events/registerPageEvents.js';

// Thiết lập sự kiện cho trang Login
export function loginPage() {
    setupPasswordToggle('password', 'eyeIcon', 'togglePasswordButton');
    registerRegisterPageEvents();
}