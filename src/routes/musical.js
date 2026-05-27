var express = require("express");
var router = express.Router();

var musicalController = require("../controllers/musicalController");

router.get("/aleatorio", function (req, res) {
    musicalController.sortearAleatorio(req, res);
});

module.exports = router;
