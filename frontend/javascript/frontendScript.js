// ==================================================
// ========== Event Listener ==========
// Ẩn menu khi click ra ngoài
document.addEventListener('click', function(e) {
    const menu = document.querySelector('.page-button-group');
    const hamburger = document.querySelector('.hamburger-menu');
    if (
        menu.classList.contains('active') &&
        !menu.contains(e.target) &&
        !hamburger.contains(e.target)
    ) {
        menu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});
// ==================================================


// ==================================================
// ========== Event Listener ==========
// Bật tắt menu nút điều hướng trang
function toggleMenu() {
    const menu = document.querySelector('.page-button-group');
    const hamburger = document.querySelector('.hamburger-menu');
    hamburger.classList.toggle('active');
    menu.classList.toggle('active');
}

// Ẩn hiện mật khẩu cho form Login và Register
function togglePassword(inputId, iconId) {
    const password = document.getElementById(inputId);
    const eyeIcon = document.getElementById(iconId);

    if (password.type === 'password') {
        password.type = 'text';
        eyeIcon.className = 'fa-solid fa-eye-slash';
    } else {
        password.type = 'password';
        eyeIcon.className = 'fa-solid fa-eye';
    }
}

// Mở modal Terms and Conditions
function openTerms(e) {
    e.preventDefault();
    document.getElementById('termsModal').style.display = 'block';
}

// Đóng modal Terms and Conditions
function closeTerms() {
    document.getElementById('termsModal').style.display = 'none';
}
// Đóng modal khi click vào nền mờ
function closeTermsByBackground(e) {
    if (e.target.id === 'termsModal') {
        closeTerms();
    }
}