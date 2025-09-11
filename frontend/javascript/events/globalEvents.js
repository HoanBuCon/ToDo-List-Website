import { toggleMenu } from '../components/menuToggle.js';

// Hàm khởi tạo và đăng ký các sự kiện toàn cục dùng chung cho các pages
export function registerGlobalEvents() {
    const menu = document.querySelector('.page-button-group');
    const hamburger = document.querySelector('.hamburger-menu');

    // Bật tắt menu
    document.addEventListener('click', (e) => {
        if (menu &&
            menu.classList.contains('active') &&
            !menu.contains(e.target) &&
            hamburger &&
            !hamburger.contains(e.target)
        ) {
            toggleMenu();
        }

        closeTermsByBackground(e);
    });

    // Điều hướng trang
    document.querySelectorAll('.page-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.getAttribute('data-page');
            if (page && page !== '#') {
                window.location.href = page;
            }
        });
    });
}