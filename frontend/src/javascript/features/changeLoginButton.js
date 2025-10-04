export function changeLoginButton() {
    const loginButton = document.querySelector('.login-btn');
    
    if (loginButton) {
        loginButton.textContent = 'REGISTER';
        loginButton.onclick = () => {
            window.location.href = 'registerPage.html';
        };
    }
}