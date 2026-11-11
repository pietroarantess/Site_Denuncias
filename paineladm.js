
/* ==========================================
   DADOS DAS DENÚNCIAS
========================================== */

let denuncias = [
  {
    id: 1,
    dataRegistro: "20/10/2026",
    identificacao: "Anônima",
    nome: "",
    tipos: [
      "Violência psicológica ou emocional",
      "Assédio"
    ],
    relato:
      "Exemplo demonstrativo de denúncia. Este registro é fictício.",
    local: "São Paulo - SP",
    dataOcorrido: "2026-10-18",
    perigo: "Sim",
    contatoSeguro: "Não",
    meioContato: "",
    horarioSeguro: "",
    status: "Nova"
  },

  {
    id: 2,
    dataRegistro: "19/10/2026",
    identificacao: "Identificada",
    nome: "Maria Oliveira",
    tipos: [
      "Violência física"
    ],
    relato:
      "Exemplo demonstrativo de denúncia. Este registro é fictício.",
    local: "Barueri - SP",
    dataOcorrido: "2026-10-17",
    perigo: "Não",
    contatoSeguro: "Sim",
    meioContato: "maria@example.com",
    horarioSeguro: "Período da manhã",
    status: "Em análise"
  }
];


/* ==========================================
   CONFIGURAÇÕES
========================================== */

const statusDisponiveis = [
  "Nova",
  "Em análise",
  "Em andamento",
  "Resolvida"
];

let denunciaSelecionada = null;


/* ==========================================
   ELEMENTOS HTML
========================================== */

const corpoTabela = document.getElementById("corpo-tabela");

const busca = document.getElementById("busca");

const filtro = document.getElementById("filtro");

const mensagemVazia = document.getElementById("mensagem-vazia");

const modalFundo = document.getElementById("modal-fundo");

const conteudoModal = document.getElementById("conteudo-modal");

const tituloModal = document.getElementById("titulo-denuncia");


/* ==========================================
   FUNÇÕES AUXILIARES
========================================== */

// Evita interpretar os dados recebidos como HTML.

function escaparHTML(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, caractere => {
    const entidades = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entidades[caractere];
  });
}


// Retorna um valor ou "Não informado".

function resposta(valor) {
  return String(valor ?? "").trim() || "Não informado";
}


// Formata a data.

function formatarData(data) {
  if (!data) return "Não informada";

  const partes = data.split("-");

  if (partes.length !== 3) {
    return escaparHTML(data);
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// Formata o número da denúncia.

function formatarId(id) {
  return String(id).padStart(3, "0");
}


/* ==========================================
   ATUALIZAR RESUMO
========================================== */

function atualizarResumo() {

  const total = denuncias.length;

  const novas = denuncias.filter(
    d => d.status === "Nova"
  ).length;

  const andamento = denuncias.filter(
    d => d.status === "Em andamento" ||
         d.status === "Em análise"
  ).length;

  document.getElementById("total-denuncias").textContent = total;

  document.getElementById("total-novas").textContent = novas;

  document.getElementById("total-andamento").textContent = andamento;
}


/* ==========================================
   RENDERIZAR TABELA
========================================== */

function renderizarTabela() {

  const textoBusca = busca.value.toLowerCase().trim();

  const statusFiltro = filtro.value;

  const filtradas = denuncias.filter(d => {

    const texto = [
      d.id,
      d.dataRegistro,
      d.identificacao,
      d.nome,
      d.tipos.join(" "),
      d.relato,
      d.local,
      d.dataOcorrido,
      d.perigo,
      d.contatoSeguro,
      d.meioContato,
      d.horarioSeguro,
      d.status
    ]
      .join(" ")
      .toLowerCase();

    const correspondeBusca = texto.includes(textoBusca);

    const correspondeStatus =
      statusFiltro === "Todos" ||
      d.status === statusFiltro;

    return correspondeBusca && correspondeStatus;
  });


  corpoTabela.innerHTML = filtradas.map(d => {

    const identificacao =
      d.identificacao === "Anônima"
        ? "Anônima"
        : escaparHTML(resposta(d.nome));

    const tipos =
      d.tipos.length > 0
        ? escaparHTML(d.tipos.join(", "))
        : "Não informado";

    return `
      <tr>

        <td>${formatarId(d.id)}</td>

        <td>${escaparHTML(d.dataRegistro)}</td>

        <td>${identificacao}</td>

        <td>${tipos}</td>

        <td class="celula-relato">
          ${escaparHTML(resposta(d.relato))}
        </td>

        <td>${escaparHTML(resposta(d.local))}</td>

        <td>${formatarData(d.dataOcorrido)}</td>

        <td>${escaparHTML(resposta(d.perigo))}</td>

        <td>${escaparHTML(d.contatoSeguro)}</td>

        <td>
          <select
            class="status"
            data-status-id="${d.id}"
            aria-label="Status da denúncia ${d.id}"
          >

            ${statusDisponiveis.map(status => `
              <option
                value="${escaparHTML(status)}"
                ${d.status === status ? "selected" : ""}
              >
                ${escaparHTML(status)}
              </option>
            `).join("")}

          </select>
        </td>

        <td>
          <button
            type="button"
            class="acao"
            data-visualizar="${d.id}"
          >
            Visualizar
          </button>
        </td>

      </tr>
    `;

  }).join("");


  mensagemVazia.hidden = filtradas.length !== 0;

  atualizarResumo();
}


/* ==========================================
   ALTERAR STATUS
========================================== */

function alterarStatus(id, novoStatus) {

  denuncias = denuncias.map(d => {

    if (d.id === id) {
      return {
        ...d,
        status: novoStatus
      };
    }

    return d;

  });


  // Atualiza também o registro aberto no modal.

  if (
    denunciaSelecionada &&
    denunciaSelecionada.id === id
  ) {

    denunciaSelecionada = denuncias.find(
      d => d.id === id
    );

    renderizarModal();
  }

  renderizarTabela();
}


/* ==========================================
   ABRIR MODAL
========================================== */

function abrirModal(id) {

  denunciaSelecionada = denuncias.find(
    d => d.id === id
  );

  if (!denunciaSelecionada) return;

  renderizarModal();

  modalFundo.hidden = false;

  document.body.style.overflow = "hidden";

  document.getElementById("fechar-modal").focus();
}


/* ==========================================
   CONTEÚDO DO MODAL
========================================== */

function renderizarModal() {

  const d = denunciaSelecionada;

  if (!d) return;

  tituloModal.textContent =
    `Denúncia #${formatarId(d.id)}`;


  const nomeIdentificacao =
    d.identificacao === "Identificada"
      ? `
        <p>
          <b>Nome:</b>
          ${escaparHTML(resposta(d.nome))}
        </p>
      `
      : "";


  const listaTipos = d.tipos.length > 0
    ? `
      <ul>
        ${d.tipos.map(tipo => `
          <li>${escaparHTML(tipo)}</li>
        `).join("")}
      </ul>
    `
    : "<p>Não informado</p>";


  const informacoesContato =
    d.contatoSeguro === "Sim"
      ? `
        <p>
          <b>Meio de contato:</b>
          ${escaparHTML(resposta(d.meioContato))}
        </p>

        <p>
          <b>Horário seguro:</b>
          ${escaparHTML(resposta(d.horarioSeguro))}
        </p>
      `
      : "";


  conteudoModal.innerHTML = `

    <h3>Identificação</h3>

    <p>
      <b>Forma de identificação:</b>
      ${escaparHTML(d.identificacao)}
    </p>

    ${nomeIdentificacao}


    <h3>Informações da denúncia</h3>

    <p>
      <b>Data do registro:</b>
      ${escaparHTML(d.dataRegistro)}
    </p>

    <p><b>Tipos de violência:</b></p>

    ${listaTipos}

    <p><b>Relato:</b></p>

    <div class="relato-modal">
      ${escaparHTML(resposta(d.relato))}
    </div>

    <p>
      <b>Onde aconteceu?</b>
      ${escaparHTML(resposta(d.local))}
    </p>

    <p>
      <b>Quando aconteceu?</b>
      ${formatarData(d.dataOcorrido)}
    </p>


    <h3>Segurança e contato</h3>

    <p>
      <b>Está em perigo neste momento?</b>
      ${escaparHTML(resposta(d.perigo))}
    </p>

    <p>
      <b>É seguro entrar em contato?</b>
      ${escaparHTML(d.contatoSeguro)}
    </p>

    ${informacoesContato}


    <h3>Andamento</h3>

    <p>
      <b>Status atual:</b>
      ${escaparHTML(d.status)}
    </p>

    <label for="status-modal">
      Alterar status
    </label>

    <select id="status-modal" class="status">

      ${statusDisponiveis.map(status => `
        <option
          value="${escaparHTML(status)}"
          ${d.status === status ? "selected" : ""}
        >
          ${escaparHTML(status)}
        </option>
      `).join("")}

    </select>

  `;


  // Evento para alterar status dentro do modal.

  document.getElementById("status-modal")
    .addEventListener("change", function() {

      alterarStatus(d.id, this.value);

    });

}


/* ==========================================
   FECHAR MODAL
========================================== */

function fecharModal() {

  modalFundo.hidden = true;

  denunciaSelecionada = null;

  document.body.style.overflow = "";

}


/* ==========================================
   EVENTOS DA TABELA
========================================== */

// Eventos delegados para os elementos da tabela.

corpoTabela.addEventListener("change", function(e) {

  if (e.target.matches("[data-status-id]")) {

    const id = Number(e.target.dataset.statusId);

    alterarStatus(id, e.target.value);

  }

});


corpoTabela.addEventListener("click", function(e) {

  const botao = e.target.closest("[data-visualizar]");

  if (botao) {

    const id = Number(botao.dataset.visualizar);

    abrirModal(id);

  }

});


/* ==========================================
   EVENTOS DE PESQUISA E FILTRO
========================================== */

busca.addEventListener("input", renderizarTabela);

filtro.addEventListener("change", renderizarTabela);


/* ==========================================
   EVENTOS DO MODAL
========================================== */

document.getElementById("fechar-modal")
  .addEventListener("click", fecharModal);

document.getElementById("botao-fechar")
  .addEventListener("click", fecharModal);


// Fecha ao clicar fora do modal.

modalFundo.addEventListener("click", function(e) {

  if (e.target === modalFundo) {
    fecharModal();
  }

});


// Fecha com a tecla ESC.

document.addEventListener("keydown", function(e) {

  if (e.key === "Escape" && !modalFundo.hidden) {
    fecharModal();
  }

});


/* ==========================================
   NAVEGAÇÃO DO MENU LATERAL
========================================== */

const botoesMenu = document.querySelectorAll(".menu-item");

botoesMenu.forEach(botao => {

  botao.addEventListener("click", function() {

    const pagina = this.dataset.pagina;

    // Remove seleção anterior.

    botoesMenu.forEach(item => {
      item.classList.remove("menu-ativo");
    });

    // Marca o botão selecionado.

    this.classList.add("menu-ativo");

    // Esconde todas as páginas.

    document.querySelectorAll(".pagina-tela").forEach(tela => {
      tela.classList.remove("ativa");
    });

    // Mostra a página escolhida.

    const telaSelecionada = document.getElementById(
      `pagina-${pagina}`
    );

    if (telaSelecionada) {
      telaSelecionada.classList.add("ativa");
    }

  });

});

/* ==========================================
   CADASTRO DE USUÁRIOS
========================================== */

const formularioCadastro = document.getElementById("form-cadastro");

const botaoLimparCadastro = document.getElementById("limpar-cadastro");


function limparCadastro() {

  formularioCadastro.reset();

}


botaoLimparCadastro.addEventListener("click", limparCadastro);


formularioCadastro.addEventListener("submit", function(e) {

  e.preventDefault();

  const dados = new FormData(formularioCadastro);

  const nome = dados.get("nome");
  const email = dados.get("email");
  const telefone = dados.get("telefone");
  const nascimento = dados.get("nascimento");
  const tipo = dados.get("tipo");
  const cidade = dados.get("cidade");
  const estado = dados.get("estado");

  /*
    Cadastro demonstrativo.

    Nenhum dado é enviado ou salvo em servidor.
  */

  alert(
    "Cadastro demonstrativo realizado!\n\n" +
    "Nome: " + nome + "\n" +
    "E-mail: " + email + "\n" +
    "Tipo: " + tipo + "\n" +
    "Cidade: " + cidade + "\n" +
    "Estado: " + estado + "\n\n" +
    "Nenhum dado foi salvo no servidor."
  );

  limparCadastro();

});

/* ==========================================
   DADOS DOS USUÁRIOS
========================================== */

let usuarios = [

  {
    id: 1,
    nome: "Ana Beatriz Silva",
    email: "ana@exemplo.com",
    telefone: "(11) 98765-4321",
    nascimento: "12/04/2005",
    tipo: "Usuária",
    status: "Ativa"
  },

  {
    id: 2,
    nome: "Mariana Costa",
    email: "mariana@exemplo.com",
    telefone: "(11) 91234-5678",
    nascimento: "03/08/2004",
    tipo: "Usuária",
    status: "Ativa"
  },

  {
    id: 3,
    nome: "Juliana Lima",
    email: "juliana@exemplo.com",
    telefone: "(11) 99876-5432",
    nascimento: "21/11/2003",
    tipo: "Administradora",
    status: "Ativa"
  },

  {
    id: 4,
    nome: "Carla Mendes",
    email: "carla@exemplo.com",
    telefone: "(11) 92345-6789",
    nascimento: "30/06/2002",
    tipo: "Usuária",
    status: "Inativa"
  }

];


/* ==========================================
   ELEMENTOS DA LISTA DE USUÁRIOS
========================================== */

const corpoTabelaUsuarios =
  document.getElementById("corpo-tabela-usuarios");

const buscaUsuarios =
  document.getElementById("busca-usuarios");

const filtroUsuarios =
  document.getElementById("filtro-usuarios");

const mensagemUsuariosVazios =
  document.getElementById("usuarios-vazios");


/* ==========================================
   RENDERIZAR USUÁRIOS
========================================== */

function renderizarUsuarios() {

  const textoBusca = buscaUsuarios.value
    .toLowerCase()
    .trim();

  const statusFiltro = filtroUsuarios.value;


  const filtrados = usuarios.filter(u => {

    const texto = [
      u.nome,
      u.email,
      u.tipo
    ].join(" ").toLowerCase();

    const correspondeBusca =
      texto.includes(textoBusca);

    const correspondeStatus =
      statusFiltro === "Todos" ||
      u.status === statusFiltro;

    return correspondeBusca && correspondeStatus;

  });


  corpoTabelaUsuarios.innerHTML = filtrados.map(u => {

    return `

      <tr>

        <td>${String(u.id).padStart(3, "0")}</td>

        <td>
          <div class="usuario-nome">

            <span class="avatar">
              ${escaparHTML(u.nome.charAt(0))}
            </span>

            ${escaparHTML(u.nome)}

          </div>
        </td>

        <td>${escaparHTML(u.email)}</td>

        <td>${escaparHTML(u.telefone)}</td>

        <td>${escaparHTML(u.nascimento)}</td>

        <td>${escaparHTML(u.tipo)}</td>

        <td>

          <select
            class="status"
            data-usuario-status="${u.id}"
            aria-label="Status de ${escaparHTML(u.nome)}"
          >

            <option
              value="Ativa"
              ${u.status === "Ativa" ? "selected" : ""}
            >
              Ativa
            </option>

            <option
              value="Inativa"
              ${u.status === "Inativa" ? "selected" : ""}
            >
              Inativa
            </option>

          </select>

        </td>

      </tr>

    `;

  }).join("");


  mensagemUsuariosVazios.hidden =
    filtrados.length !== 0;

}


/* ==========================================
   ALTERAR STATUS DOS USUÁRIOS
========================================== */

function alterarStatusUsuario(id, novoStatus) {

  usuarios = usuarios.map(u => {

    if (u.id === id) {

      return {
        ...u,
        status: novoStatus
      };

    }

    return u;

  });

  renderizarUsuarios();

}


/* ==========================================
   EVENTOS DA LISTA DE USUÁRIOS
========================================== */

corpoTabelaUsuarios.addEventListener("change", function(e) {

  if (e.target.matches("[data-usuario-status]")) {

    const id = Number(e.target.dataset.usuarioStatus);

    alterarStatusUsuario(id, e.target.value);

  }

});


/* ==========================================
   PESQUISA E FILTRO DE USUÁRIOS
========================================== */

buscaUsuarios.addEventListener(
  "input",
  renderizarUsuarios
);

filtroUsuarios.addEventListener(
  "change",
  renderizarUsuarios
);


/* ==========================================
   INICIALIZAÇÃO
========================================== */

renderizarTabela();

renderizarUsuarios();
