var express = require("express");

var router = express.Router();

var comentarioController =
require("../controllers/comentarioController");

router.post("/cadastrar", function(req, res){

    comentarioController.cadastrar(req, res);

});

router.get("/listar", function(req, res){

    comentarioController.listar(req, res);

});

router.get("/total-usuario/:id", function(req, res){

    comentarioController.totalPorUsuario(req, res);

});

module.exports = router;