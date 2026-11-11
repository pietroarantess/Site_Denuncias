document.addEventListener("DOMContentLoaded", () => {

    // Identifica automaticamente a página atual
    const currentPath = window.location.pathname;

    document.querySelectorAll(".navigation a").forEach(link => {
        const linkPath = new URL(link.href).pathname;

        if (linkPath === currentPath) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

});
