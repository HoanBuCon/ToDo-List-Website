import { registerGlobalEvents } from "./events/globalEvents.js";
import { setupLoginPage } from "./pages/setupLoginPage.js";
import { setupRegisterPage } from "./pages/setupRegisterPage.js";
import { domReady } from "./utils/domReady.js";
import { toggleMenu } from "./components/menuToggle.js";

window.toggleMenu = toggleMenu;

domReady(() => {
    console.log('DOM ready');
    registerGlobalEvents();

    const body = document.body;

    if (body.classList.contains('login-page')) {
        setupLoginPage();
    }
    
    if (body.classList.contains('register-page')) {
        setupRegisterPage();
    }
});