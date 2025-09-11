import { openTerms, closeTerms, closeTermsByBackground } from '../components/termsModal.js';;

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
}