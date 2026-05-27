var musicalModel =
require("../models/musicalModel");

function sortearAleatorio(req, res) {
    musicalModel.sortearAleatorio()
        .then(function (resultado) {
            if (!resultado || resultado.length === 0) {
                return res.status(404).json({
                    erro: "Nenhum musical encontrado"
                });
            }

            res.json(resultado[0]);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

module.exports = {
    sortearAleatorio
}
