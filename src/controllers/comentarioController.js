var comentarioModel =
require("../models/comentarioModel");
var database = require("../database/config");

function cadastrar(req, res){

    var titulo =
    req.body.tituloServer;

    var conteudo =
    req.body.conteudoServer;

    var comentarioPai =
    req.body.comentarioPaiServer;

    var idUsuario =
    req.body.idUsuarioServer;

    if (!titulo || !conteudo || !idUsuario) {
        return res.status(400).json({erro: "Título, conteúdo e ID de usuário são obrigatórios"});
    }

    // Se há comentário pai, validar se existe no banco
    if (comentarioPai != null && comentarioPai !== "" && comentarioPai !== "null" && comentarioPai !== 0 && comentarioPai !== "0") {
        var parsed = parseInt(comentarioPai, 10);
        if (!isNaN(parsed) && parsed > 0) {
            var verificarQuery = `SELECT id_comentario FROM comentario WHERE id_comentario = ${parsed}`;
            database.executar(verificarQuery)
                .then(function(resultado) {
                    if (!resultado || resultado.length === 0) {
                        return res.status(400).json({erro: "Comentário pai não encontrado"});
                    }
                    inserirComentario(titulo, conteudo, comentarioPai, idUsuario, res);
                })
                .catch(function(erro) {
                    console.log(erro);
                    res.status(500).json({erro: "Erro ao validar comentário pai"});
                });
        } else {
            // ID inválido, inserir sem pai
            inserirComentario(titulo, conteudo, null, idUsuario, res);
        }
    } else {
        // Sem comentário pai
        inserirComentario(titulo, conteudo, null, idUsuario, res);
    }
}

function inserirComentario(titulo, conteudo, comentarioPai, idUsuario, res) {
    comentarioModel.cadastrar(
        titulo,
        conteudo,
        comentarioPai,
        idUsuario
    )
    .then(function(resultado){
        res.json(resultado);
    })
    .catch(function(erro){
        console.log(erro);
        res.status(500).json({erro: erro.sqlMessage || "Erro ao inserir comentário"});
    });
}

function listar(req, res) {
    comentarioModel.listar()
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json({erro: "Erro ao listar comentários"});
        });
}

function totalPorUsuario(req, res) {
    var idUsuario = req.params.id;
    comentarioModel.contarPorUsuario(idUsuario)
        .then(function(resultado) {
            if (resultado && resultado.length > 0) {
                res.json(resultado[0]);
            } else {
                res.json({ totalComentarios: 0 });
            }
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json({erro: "Erro ao contar comentários do usuário"});
        });
}

module.exports = {
    cadastrar,
    listar,
    totalPorUsuario
}

