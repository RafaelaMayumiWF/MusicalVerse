document.addEventListener("DOMContentLoaded", function () {
    atualizarBotoesLogin();
    carregarComentarios();
  });

  function atualizarBotoesLogin() {
    var authButtons = document.getElementById("authButtons");
    if (!authButtons) return;

    var idUsuario = sessionStorage.ID_USUARIO;
    authButtons.innerHTML = "";

    if (idUsuario) {
      var dashboardLink = document.createElement("a");
      dashboardLink.href = "./dashboard-usuario.html";
      dashboardLink.id = "dashboardBtn";
      dashboardLink.innerText = "Dashboard";
      dashboardLink.style.marginRight = "10px";
      authButtons.appendChild(dashboardLink);

      var logoutLink = document.createElement("a");
      logoutLink.href = "#";
      logoutLink.id = "logoutBtn";
      logoutLink.innerText = "Logout";
      logoutLink.onclick = function (event) {
        event.preventDefault();
        sessionStorage.clear();
        window.location = "./index.html";
      };
      authButtons.appendChild(logoutLink);
    } else {
      var loginLink = document.createElement("a");
      loginLink.href = "./login.html";
      loginLink.id = "loginBtn";
      loginLink.innerText = "Login";
      authButtons.appendChild(loginLink);
    }
  }

  function comentar() {
    var titulo = inputTitulo.value;

    var conteudo = textareaComentario.value;

    var idUsuario = sessionStorage.ID_USUARIO;

    fetch("/comentarios/cadastrar", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        tituloServer: titulo,

        conteudoServer: conteudo,

        comentarioPaiServer: null,

        idUsuarioServer: idUsuario,
      }),
    })
      .then(function (resposta) {
        if (resposta.ok) {
          inputTitulo.value = "";
          textareaComentario.value = "";
          carregarComentarios(
            "<p style='color: green;'>✓ Comentário enviado com sucesso!</p>",
          );
        } else {
          throw new Error("Erro ao enviar");
        }
      })
      .catch(function (erro) {
        console.log(erro);
        carregarComentarios(
          "<p style='color: red;'>✗ Erro ao enviar comentário</p>",
        );
      });
  }

  function responder(idComentario) {
    if (!idComentario) {
      alert("Selecione um comentário para responder.");
      return;
    }

    var resposta = prompt("Digite sua resposta:");

    if (!resposta) return;

    fetch("/comentarios/cadastrar", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        tituloServer: "Resposta",

        conteudoServer: resposta,

        comentarioPaiServer: idComentario,

        idUsuarioServer: sessionStorage.ID_USUARIO,
      }),
    })
      .then(function (resposta) {
        if (resposta.ok) {
          alert("✓ Resposta enviada!");
          carregarComentarios();
        } else {
          return resposta.json().then(function (err) {
            throw new Error(err.erro || "Erro ao enviar resposta");
          });
        }
      })
      .catch(function (erro) {
        console.log(erro);
        alert("✗ " + erro.message);
      });
  }

  function carregarComentarios(mensagem) {
    var container = document.getElementById("mensagemComentario");
    container.innerHTML = mensagem || "";

    fetch("/comentarios/listar")
      .then(function (resposta) {
        if (!resposta.ok) {
          throw new Error("Não foi possível carregar os comentários");
        }
        return resposta.json();
      })
      .then(function (comentarios) {
        if (!comentarios || comentarios.length === 0) {
          container.innerHTML +=
            "<p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>";
          return;
        }

        var arvore = buildComentarioTree(comentarios);
        var lista = document.createElement("div");
        lista.className = "lista-comentarios";

        arvore.forEach(function (comentario) {
          lista.appendChild(criarComentarioElemento(comentario, 0));
        });

        container.appendChild(lista);
      })
      .catch(function (erro) {
        console.log(erro);
        container.innerHTML +=
          "<p style='color: red;'>✗ Erro ao carregar comentários</p>";
      });
  }

  function buildComentarioTree(comentarios) {
    var map = {};
    comentarios.forEach(function (comentario) {
      comentario.children = [];
      map[comentario.id_comentario] = comentario;
    });

    var raiz = [];
    comentarios.forEach(function (comentario) {
      if (comentario.comentarioPai) {
        var pai = map[comentario.comentarioPai];
        if (pai) {
          pai.children.push(comentario);
        } else {
          raiz.push(comentario);
        }
      } else {
        raiz.push(comentario);
      }
    });

    return raiz;
  }

  function criarComentarioElemento(comentario, nivel) {
    var div = document.createElement("div");
    div.className = "comentario-item";
    div.style.marginLeft = nivel * 20 + "px";
    div.innerHTML = `
      <div class="comentario-header">
        <h4>${escapeHtml(comentario.titulo)}</h4>
        <p>${escapeHtml(comentario.nomeUsuario || "Anônimo")}</p>
      </div>
      <div class="comentario-body">
        <p>${escapeHtml(comentario.conteudo)}</p>
        <button type="button" onclick="responder(${comentario.id_comentario})">Responder</button>
      </div>
    `;

    if (comentario.children && comentario.children.length > 0) {
      comentario.children.forEach(function (filho) {
        div.appendChild(criarComentarioElemento(filho, nivel + 1));
      });
    }

    return div;
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function avaliar() {
    var nota = selectNota.value;

    var idUsuario = sessionStorage.ID_USUARIO;

    var idMusical = 1;

    if (!idUsuario) {
      alert("✗ Você precisa estar logado para avaliar");
      return;
    }

    fetch("/avaliacoes/cadastrar", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        notaServer: nota,

        idUsuarioServer: idUsuario,

        idMusicalServer: idMusical,
      }),
    })
      .then(function (resposta) {
        if (resposta.ok) {
          alert("✓ Avaliação enviada com sucesso!");
          selectNota.value = "1";
        } else {
          return resposta.json().then((err) => {
            throw new Error(err.erro || "Erro ao enviar avaliação");
          });
        }
      })
      .catch(function (erro) {
        console.log(erro);
        alert("✗ " + erro.message);
      });
  }