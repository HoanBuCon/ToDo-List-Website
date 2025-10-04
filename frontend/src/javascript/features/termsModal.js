const termsModal = document.getElementById('termsModal');

export function openTerms(e) {
    if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
    }

    if (termsModal && termsModal.style) {
        termsModal.style.setProperty('display', 'block');
    }
}

export function closeTerms() {
    if (termsModal && termsModal.style) {
        termsModal.style.setProperty('display', 'none');
    }
}

export function closeTermsByBackground(e) {
    if (e.target === termsModal) {
        closeTerms();
    }
}