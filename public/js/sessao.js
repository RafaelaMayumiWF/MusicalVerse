// sessão
function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;

    var b_usuario = document.getElementById("b_usuario");

    if (email != null && nome != null) {
        b_usuario.innerHTML = nome;
    } else {
        window.location = "../login.html";
    }
}

function salvarSessaoUsuario(usuario) {
    if (!usuario) return;
    if (usuario.email != null) {
        sessionStorage.EMAIL_USUARIO = usuario.email;
    }
    if (usuario.nome != null) {
        sessionStorage.NOME_USUARIO = usuario.nome;
    }
    var usuarioId = usuario.id || usuario.id_usuario || usuario.ID_USUARIO;
    if (usuarioId != null && usuarioId !== "undefined" && usuarioId !== "null") {
        sessionStorage.ID_USUARIO = usuarioId;
    }
}

function getIdUsuarioSessao() {
    var id = sessionStorage.getItem("ID_USUARIO");
    if (!id || id === "undefined" || id === "null") {
        return null;
    }
    var numericId = Number(id);
    return isNaN(numericId) ? null : numericId;
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "../login.html";
}

// carregamento (loading)
function aguardar() {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "flex";
}

function finalizarAguardar(texto) {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "none";

    var divErrosLogin = document.getElementById("div_erros_login");
    if (texto) {
        divErrosLogin.style.display = "flex";
        divErrosLogin.innerHTML = texto;
    }
}

