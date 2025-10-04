const menu = document.querySelector('.page-button-group');
const hamburger = document.querySelector('.hamburger-menu');

// Ẩn menu khi click ra ngoài
export function toggleMenu(forceState = null) {
    const isActive = menu.classList.contains('active');
    let activateVariable;

    if (forceState === null) {
        activateVariable = !isActive;
    } else {
        activateVariable = forceState;
    }

    menu.classList.toggle('active', activateVariable);
    hamburger.classList.toggle('active', activateVariable);
}