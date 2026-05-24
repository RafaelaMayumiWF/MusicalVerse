var database =
require("../database/config");

function cadastrar(
    nota,
    idUsuario,
    idMusical
){

    var instrucao = `

        INSERT INTO avaliacao
        (
            nota,
            usuario_id_usuario,
            musical_id_musical
        )

        VALUES
        (
            ${nota},
            ${idUsuario},
            ${idMusical}
        );

    `;

    console.log(instrucao);

    return database.executar(instrucao);
}

module.exports = {
    cadastrar
}