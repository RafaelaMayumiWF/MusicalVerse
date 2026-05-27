var database =
require("../database/config");

function sortearAleatorio() {
    var instrucao = `
        SELECT
            m.id_musical,
            m.nome,
            m.descricao,
            m.data_criacao,
            m.data_estreia,
            m.base,
            m.musicalcol,
            GROUP_CONCAT(DISTINCT CONCAT(c.nome, ' (', c.descricao, ')') ORDER BY c.nome SEPARATOR ', ') AS categorias
        FROM musical m
        LEFT JOIN categoria_has_musical cm
            ON cm.musical_id_musical = m.id_musical
        LEFT JOIN categoria c
            ON c.id_categoria = cm.categoria_id_categoria
        GROUP BY m.id_musical
        ORDER BY RAND()
        LIMIT 1;
    `;

    return database.executar(instrucao);
}

module.exports = {
    sortearAleatorio
}
