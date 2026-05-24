var database = require('../database/config');

function buscarTotalPontos() {

  var instrucaoSql = `
  
    SELECT SUM(pontos) AS totalPontos
    FROM usuario
  
  `;

  console.log('Executando a instrução SQL: \n' + instrucaoSql);

  return database.executar(instrucaoSql);
}

function adicionarPontos(idUsuario, pontos) {

  var instrucaoSql = `
  
    UPDATE usuario
    SET pontos = pontos + ${pontos}
    WHERE id_usuario = ${idUsuario};
  
  `;

  console.log('Executando a instrução SQL: \n' + instrucaoSql);

  return database.executar(instrucaoSql);
}

module.exports = {
  buscarTotalPontos,
  adicionarPontos
}