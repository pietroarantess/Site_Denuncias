
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("login-form");

    const emailInput = document.getElementById("login-email");

    const passwordInput = document.getElementById("login-password");

    const togglePassword = document.getElementById("toggle-password");

    const alertMessage = document.getElementById("alert-message");

    const eyeIcon = document.getElementById("eye-icon");


    // =========================
    // ALERTAS
    // =========================

    function showAlert(message, type) {

        alertMessage.textContent = message;

        alertMessage.className = "alert " + type;

        alertMessage.hidden = false;

    }


    function hideAlert() {

        alertMessage.hidden = true;

        alertMessage.textContent = "";

        alertMessage.className = "alert";

    }


    // =========================
    // MOSTRAR / OCULTAR SENHA
    // =========================

    togglePassword.addEventListener("click", () => {

        const passwordVisible = passwordInput.type === "text";

        if (passwordVisible) {

            passwordInput.type = "password";

            togglePassword.setAttribute("aria-label", "Mostrar senha");

            togglePassword.setAttribute("title", "Mostrar senha");

            eyeIcon.innerHTML = `
                <path
                    d="M2 12C2 12 5.5 5 12 5S22 12 22 12
                    S18.5 19 12 19S2 12 2 12Z"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linejoin="round"
                />

                <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    stroke-width="1.8"
                />
            `;

        } else {

            passwordInput.type = "text";

            togglePassword.setAttribute("aria-label", "Ocultar senha");

            togglePassword.setAttribute("title", "Ocultar senha");

            eyeIcon.innerHTML = `
                <path
                    d="M3 3L21 21"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                />

                <path
                    d="M10.6 5.2C11.05 5.07 11.52 5 12 5
                    C18.5 5 22 12 22 12
                    S20.8 14.4 18.8 16.2"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                />

                <path
                    d="M6.2 6.2C3.5 8.1 2 12 2 12
                    S5.5 19 12 19C13.5 19 14.8 18.7 16 18"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                />

                <path
                    d="M9.9 9.9A3 3 0 0 0 14.1 14.1"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                />
            `;

        }

    });


    // =========================
    // ENVIO DO FORMULÁRIO
    // =========================

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const email = emailInput.value.trim();

        const password = passwordInput.value;

        if (!email || !password) {

            showAlert(
                "Preencha o e-mail e a senha.",
                "error"
            );

            return;

        }


        // SUCESSO DEMONSTRATIVO

        showAlert(
            "Sucesso! Bem-vinda de volta ao Security Woman. Redirecionando...",
            "success"
        );


        // LIMPA OS CAMPOS APÓS 2 SEGUNDOS

        setTimeout(() => {

            form.reset();

            passwordInput.type = "password";

            togglePassword.setAttribute("aria-label", "Mostrar senha");

            togglePassword.setAttribute("title", "Mostrar senha");

            eyeIcon.innerHTML = `
                <path
                    d="M2 12C2 12 5.5 5 12 5S22 12 22 12
                    S18.5 19 12 19S2 12 2 12Z"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linejoin="round"
                />

                <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    stroke-width="1.8"
                />

            `;

            hideAlert();

        }, 2000);

    });

});
