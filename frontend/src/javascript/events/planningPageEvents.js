export function registerPlanningPageEvents() {
    document.querySelectorAll('.create-task-btn[data-page], .open-task-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.getAttribute('data-page');
            if (page && page !== '#') {
                window.location.href = page;
            }
        });
    });
}