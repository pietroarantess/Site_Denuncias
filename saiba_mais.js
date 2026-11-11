document.addEventListener("DOMContentLoaded", () => {

  // Identificar a página atual
  const links = document.querySelectorAll(".navegacao a");

  const paginaAtual =
    window.location.pathname.replace(/\/$/, "") || "/";

  links.forEach(link => {

    const destino =
      link.getAttribute("href").replace(/\/$/, "") || "/";

    if (destino === paginaAtual) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }

  });

  // Verificar carregamento das imagens
  const imagens = document.querySelectorAll(".imagem img");

  imagens.forEach(imagem => {

    imagem.addEventListener("error", () => {
      console.warn("Não foi possível carregar:", imagem.src);
    });

  });

});
