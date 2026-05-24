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

module.exports = {
    cadastrar
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