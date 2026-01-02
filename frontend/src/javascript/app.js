import { registerGlobalEvents } from "./events/globalEvents.js";
import { loginPage } from "./pages/loginPage.js";
import { registerPage } from "./pages/registerPage.js";
import { changeLoginButton } from "./features/changeLoginButton.js";
import { domReady } from "./utils/domReady.js";
import { toggleMenu } from "./components/menuToggle.js";
import { registerRegisterPageEvents } from "./events/registerPageEvents.js";
import { registerPlanningPageEvents } from "./events/planningPageEvents.js";
import { setupTodoList } from "./features/taskPageFeatures.js";
import { setupHomePageEvents } from "./pages/homePage.js";

window.toggleMenu = toggleMenu;

domReady(() => {
    registerGlobalEvents();

    const body = document.body;

    if (body.classList.contains('home-page')) {
        setupHomePageEvents();
    }

    if (body.classList.contains('login-page')) {
        loginPage();
        changeLoginButton();
    }
    
    if (body.classList.contains('register-page')) {
        registerPage();
    }

    if (body.classList.contains('login-page') || body.classList.contains('register-page')) {
        registerRegisterPageEvents();
    }

    if (body.classList.contains('planning-page')) {
        registerPlanningPageEvents();
    }

    if (body.classList.contains('tasks-page')) {
        setupTodoList();
    }
});