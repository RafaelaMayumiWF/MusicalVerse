var avaliacaoModel =
require("../models/avaliacaoModel");

function cadastrar(req, res){

    var nota =
    req.body.notaServer;

    var idUsuario =
    req.body.idUsuarioServer;

    var idMusical =
    req.body.idMusicalServer;

    // Validações básicas
    if (!nota || !idUsuario || !idMusical) {
        return res.status(400).json({
            erro: "Nota, usuário e musical são obrigatórios"
        });
    }

    if (nota < 1 || nota > 5) {
        return res.status(400).json({
            erro: "Nota deve estar entre 1 e 5"
        });
    }

    avaliacaoModel.cadastrar(
        nota,
        idUsuario,
        idMusical
    )

    .then(function(resultado){

        res.json(resultado);

    })

    .catch(function(erro){

        console.log(erro);

        res.status(500).json(erro.sqlMessage);

    });

}

module.exports = {
    cadastrar
}