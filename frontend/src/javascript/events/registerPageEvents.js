import { openTerms, closeTerms, closeTermsByBackground } from '../features/termsModal.js';
import { showErrorToast, showSuccessToast } from '../components/toast.js';

// Hàm khởi tạo và đăng ký các sự kiện toàn cục dùng chung cho các pages
export function registerRegisterPageEvents() {
    // Mở modal Terms and Conditions khi click link
    const openTermsLink = document.getElementById('openTermsLink');
    if (openTermsLink) {
        openTermsLink.addEventListener('click', openTerms);
    }

    // Đóng modal khi click nút close
    const closeTermsBtn = document.querySelector('.terms-modal-close');
    if (closeTermsBtn) {
        closeTermsBtn.addEventListener('click', closeTerms);
    }

    // Đóng modal khi click nền ngoài
    const termsModal = document.getElementById('termsModal');
    if (termsModal) {
        termsModal.addEventListener('click', closeTermsByBackground);
    }
    
    // Chuyển đổi giữa trang đăng ký và đăng nhập
    const link = document.querySelector('.register-link[data-page]');
    if (link) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) {
                window.location.href = page;
            }
        });
    }

    // ============================
    // Xử lý đăng ký
    // ============================
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById("username")?.value.trim();
        const email = document.getElementById("email")?.value.trim().toLowerCase();
        const password = document.getElementById("password")?.value;
        const confirmPassword = document.getElementById("confirmPassword")?.value;
        const agreeTerms = document.getElementById("agreeTerms")?.checked;

        // Kiểm tra xem đủ thông tin không
        if (!username || !email || !password || !confirmPassword) {
            showErrorToast('Please fill in all required fields.');
            return;
        }

        // Kiểm tra định dạng dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showErrorToast('Invalid email format.');
            return;
        }

        // Kiểm tra xem mật khẩu có khớp không
        if (password !== confirmPassword) {
            showErrorToast('Passwords do not match.');
            return;
        }

        // Kiểm tra xem đã tick đồng ý điều khoản chưa
        if (!agreeTerms) {
            showErrorToast('You must agree to the Terms and Conditions.');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

            const data = await response.json();

            // Kiểm tra phản hồi từ server
            if (!response.ok) {
                showErrorToast(data.message || 'Registration failed. Please try again.');
                return;
            }
            
            showSuccessToast('Registration successful!');
            // Lưu token nếu backend trả về JWT
            // localStorage.setItem('token', data.token);
            window.location.href = '/home';

        } catch (error) {
            showErrorToast('An error occurred. Please try again.');
        }
    });

    // ============================
    // Xử lý đăng nhập
    // ============================
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userInput = document.getElementById("username")?.value.trim()
        const password = document.getElementById("password")?.value;

        if (!userInput || !password) {
            showErrorToast('Please fill in all required fields.');
            return;
        }

        // Xác định xem user nhập username hay email
        let username;
        let email;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(userInput)) {
            email = userInput.trim().toLowerCase();
        } else {
            username = userInput;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });
            
            const data = await response.json();

            // Kiểm tra phản hồi từ server
            if (!response.ok) {
                showErrorToast(data.message || 'Login failed. Please try again.');
                return;
            }

            showSuccessToast('Login successful!');
            if (data.token) localStorage.setItem('token', data.token);
            window.location.href = '/home';

        } catch (error) {
            showErrorToast('An error occurred. Please try again.');
            return;
        }
    });
}