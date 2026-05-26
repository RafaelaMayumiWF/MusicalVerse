var database =
require("../database/config");

function cadastrar(
    titulo,
    conteudo,
    comentarioPai,
    idUsuario
){

    // Validar e converter comentarioPai para null ou número válido
    var comentarioPaiValue = null;
    if (comentarioPai != null && comentarioPai !== "" && comentarioPai !== "null" && comentarioPai !== 0 && comentarioPai !== "0") {
        var parsed = parseInt(comentarioPai, 10);
        if (!isNaN(parsed) && parsed > 0) {
            comentarioPaiValue = parsed;
        }
    }

    // Sempre incluir a coluna comentario_id_comentario (com NULL se não houver pai)
    var instrucao = `
        INSERT INTO comentario
            (titulo, conteudo, comentario_id_comentario, usuario_id_usuario)
        VALUES
            (?, ?, ?, ?);
    `;
    
    var valores = [titulo, conteudo, comentarioPaiValue, idUsuario];
    
    return database.executarComParametros(instrucao, valores);
}

function listar() {
    var instrucao = `
        SELECT
            c.id_comentario,
            c.titulo,
            c.conteudo,
            c.comentario_id_comentario AS comentarioPai,
            c.usuario_id_usuario AS idUsuario,
            u.nome AS nomeUsuario
        FROM comentario c
        LEFT JOIN usuario u ON u.id_usuario = c.usuario_id_usuario
        ORDER BY c.comentario_id_comentario ASC, c.id_comentario ASC;
    `;

    return database.executar(instrucao);
}

function contarPorUsuario(idUsuario) {
    var instrucao = `
        SELECT COUNT(*) AS totalComentarios
        FROM comentario
        WHERE usuario_id_usuario = ?;
    `;

    return database.executarComParametros(instrucao, [idUsuario]);
}

module.exports = {
    cadastrar,
    listar,
    contarPorUsuario
}

// SELECT

// comentario.id_comentario,
// comentario.titulo,
// comentario.conteudo,
// comentario.comentario_id_comentario,

// usuario.nome

// FROM comentario

// JOIN usuario
// ON usuario.id_usuario =
// comentario.usuario_id_usuario