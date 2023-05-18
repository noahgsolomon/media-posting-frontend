import {signUp} from '../../util/api/userapi.js'
import {applyTheme} from "../../util/userUtils.js";
window.addEventListener("load", function() {

    const page = document.querySelector('.page');
    page.classList.remove('hidden');

    applyTheme();

    const signUpForm = document.getElementById("signup-form");

    signUpForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        (async () => {
            await signUp(username, email, password);
            signUpForm.reset();
        })();
    });
});
