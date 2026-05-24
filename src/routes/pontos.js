var express = require('express');
var router = express.Router();
var pontosController = require('../controllers/pontosController');

router.get('/total-pontos', function(req, res) {
  pontosController.buscarTotalPontos(req, res);
});

router.post('/adicionar-pontos', function(req, res) {
  pontosController.adicionarPontos(req, res);
});

module.exports = router;