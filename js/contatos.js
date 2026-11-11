/* ==========================================
   NAVEGAÇÃO DA PÁGINA
========================================== */

document.addEventListener("DOMContentLoaded", function() {

  const links = document.querySelectorAll(".navegacao a");

  const paginaAtual = window.location.pathname.replace(/\/$/, "") || "/";

  links.forEach(link => {

    const destino = link.getAttribute("href").replace(/\/$/, "") || "/";

    if (destino === paginaAtual) {

      link.setAttribute("aria-current", "page");

    } else {

      link.removeAttribute("aria-current");

    }

  });

});
