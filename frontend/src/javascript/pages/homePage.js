export function setupHomePageEvents() {
    const getStartedButton = document.getElementById('get-started');
    const ditMingKingButton = document.getElementById('dit-mingking');
    const liemDaiButton = document.getElementById('liemdai');

    if (getStartedButton) {
        getStartedButton.addEventListener('click', (e) => {
            e.preventDefault();
            const section = document.getElementById('choose-difficulty-section');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    if (ditMingKingButton) {
        ditMingKingButton.addEventListener('click', () => {
            // Đường dẫn ảnh cho nút ditMingKingButton
            showImageOverlay('/frontend/src/assets/ming_king_bu_cac.jpg');
        });
    }

    if (liemDaiButton) {
        liemDaiButton.addEventListener('click', () => {
            // Đường dẫn ảnh cho nút liemDaiButton
            showImageOverlay('/frontend/src/assets/ming_king_liem_bi.png');
        });
    }

    // Hàm hiển thị ảnh overlay
    function showImageOverlay(imageSrc) {
        // Nếu overlay đã tồn tại thì xóa trước
        const oldOverlay = document.getElementById('custom-image-overlay');
        if (oldOverlay) oldOverlay.remove();

        const overlay = document.createElement('div');
        overlay.id = 'custom-image-overlay';
        overlay.className = 'custom-image-overlay';

        const img = document.createElement('img');
        img.src = imageSrc;
        img.className = 'custom-image-overlay-img';
        img.alt = 'Overlay Image';

        // Tạo container cho ảnh và nút
        const contentWrapper = document.createElement('div');
        contentWrapper.style.display = 'flex';
        contentWrapper.style.flexDirection = 'column';
        contentWrapper.style.alignItems = 'center';
        contentWrapper.appendChild(img);

        // Tạo group nút YES KING / NO KING giống layout ngoài trang
        const btnGroup = document.createElement('div');
        btnGroup.className = 'task-button-group overlay-btn-group';

        const yesBtn = document.createElement('button');
        yesBtn.textContent = 'YES KING';
        yesBtn.className = 'btn neon-btn task-button-group-btn';
        yesBtn.onclick = () => {
            window.location.href = '/frontend/src/pages/html/planningPage.html';
        };

        const noBtn = document.createElement('button');
        noBtn.textContent = 'NO KING';
        noBtn.className = 'btn neon-btn task-button-group-btn';
        noBtn.onclick = () => {
            window.location.href = '/frontend/src/pages/html/planningPage.html';
        };

        btnGroup.appendChild(yesBtn);
        btnGroup.appendChild(noBtn);
        contentWrapper.appendChild(btnGroup);

        // Đóng overlay khi click ra ngoài ảnh
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('show');
                setTimeout(() => overlay.remove(), 350);
            }
        });

        overlay.appendChild(contentWrapper);
        document.body.appendChild(overlay);
        // Kích hoạt hiệu ứng mở
        setTimeout(() => overlay.classList.add('show'), 10);
    }
}