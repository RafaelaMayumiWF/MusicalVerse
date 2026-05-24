var express = require("express");

var router = express.Router();

var comentarioController =
require("../controllers/comentarioController");

router.post("/cadastrar", function(req, res){

    comentarioController.cadastrar(req, res);

});

module.exports = router;