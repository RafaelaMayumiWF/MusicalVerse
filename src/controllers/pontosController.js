var pontosModel = require("../models/pontosModel");

function buscarTotalPontos(req, res) {
  pontosModel
    .buscarTotalPontos()
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado[0]);
      } else {
        res.status(204).send("Nenhum resultado encontrado!");
      }
    })
    .catch(function (erro) {
      console.log("Erro ao buscar total de pontos:", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

function adicionarPontos(req, res) {
  var idUsuarioRaw = req.body.idUsuario;
  var pontosRaw = req.body.pontos;
  console.log(idUsuarioRaw);
  console.log(pontosRaw);
  if (
    idUsuarioRaw == null ||
    idUsuarioRaw === "" ||
    idUsuarioRaw === "undefined" ||
    idUsuarioRaw === "null" ||
    pontosRaw == null ||
    pontosRaw === ""
  ) {
    res
      .status(400)
      .json({ mensagem: "idUsuario e pontos válidos são obrigatórios." });
    return;
  }

  var idUsuario = Number(idUsuarioRaw);
  console.log('idUsuarioRaw:', idUsuarioRaw, 'parsed:', idUsuario);
  var pontos = Number(pontosRaw);
  console.log('pontosRaw:', pontosRaw, 'parsed:', pontos);
  if (isNaN(idUsuario) || idUsuario <= 0 || isNaN(pontos)) {
    res
      .status(400)
      .json({ mensagem: "idUsuario e pontos válidos são obrigatórios." });
    return;
  }

  pontosModel
    .adicionarPontos(idUsuario, pontos)
    .then(function (resultado) {
      if (resultado && resultado.affectedRows > 0) {
        res.status(200).json({ mensagem: "Pontos adicionados com sucesso." });
      } else {
        res.status(404).json({
          mensagem: "Usuário não encontrado ou nenhum ponto adicionado.",
        });
      }
    })
    .catch(function (erro) {
      console.log("Erro ao adicionar pontos:", erro.sqlMessage || erro);
      res.status(500).json(erro.sqlMessage || erro);
    });
}

module.exports = {
  buscarTotalPontos,
  adicionarPontos,
};
