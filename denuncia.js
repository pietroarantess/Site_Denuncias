
document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // ELEMENTOS
    // =========================

    const form = document.getElementById("denuncia-form");

    const identificada = document.getElementById("identificada");
    const anonima = document.getElementById("anonima");

    const campoNome = document.getElementById("campo-nome");

    const relato = document.getElementById("relato");
    const contador = document.getElementById("contador");

    const alertaPerigo = document.getElementById("alerta-perigo");

    const camposContato = document.getElementById("campos-contato");

    const botaoEnviar = document.getElementById("enviar-denuncia");


    // =========================
    // IDENTIFICAÇÃO
    // =========================

    function atualizarIdentificacao() {

        if (anonima.checked) {

            campoNome.hidden = true;

        } else {

            campoNome.hidden = false;

        }

    }

    identificada.addEventListener("change", atualizarIdentificacao);

    anonima.addEventListener("change", atualizarIdentificacao);


    // =========================
    // CONTADOR DE CARACTERES
    // =========================

    relato.addEventListener("input", () => {

        contador.textContent = relato.value.length;

    });


    // =========================
    // PERIGO IMEDIATO
    // =========================

    const opcoesPerigo = document.querySelectorAll(
        'input[name="perigo"]'
    );

    opcoesPerigo.forEach(opcao => {

        opcao.addEventListener("change", () => {

            if (opcao.checked && opcao.value === "Sim") {

                alertaPerigo.hidden = false;

            } else if (opcao.checked) {

                alertaPerigo.hidden = true;

            }

        });

    });


    // =========================
    // CONTATO SEGURO
    // =========================

    const opcoesContato = document.querySelectorAll(
        'input[name="contato"]'
    );

    function atualizarContato() {

        const selecionado = document.querySelector(
            'input[name="contato"]:checked'
        );

        if (selecionado && selecionado.value === "sim") {

            camposContato.hidden = false;

        } else {

            camposContato.hidden = true;

        }

    }

    opcoesContato.forEach(opcao => {

        opcao.addEventListener("change", atualizarContato);

    });


    // =========================
    // ENVIO DEMONSTRATIVO
    // =========================

    botaoEnviar.addEventListener("click", () => {

        const mensagem =
            "Protótipo demonstrativo: nenhuma denúncia foi enviada.";

        alert(mensagem);

    });


    // =========================
    // PREVENIR ENVIO DO FORMULÁRIO
    // =========================

    form.addEventListener("submit", (event) => {

        event.preventDefault();

    });


    // =========================
    // INICIALIZAÇÃO
    // =========================

    atualizarIdentificacao();

    atualizarContato();

});
