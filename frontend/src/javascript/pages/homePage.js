export function setupHomePageEvents() {
    // Điều hướng trang
    const getStartedButton = document.getElementById('get-started');
    if (getStartedButton) {
        getStartedButton.addEventListener('click', () => {
            const page = getStartedButton.getAttribute('data-page');
            if (page && page !== '#') {
                window.location.href = page;
            }
        });
    }
}