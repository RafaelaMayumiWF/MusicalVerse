var lista = [c1, c2, c3];

var indice = 0;

function atualizar() {
  // resetar todos
  for (var i = 0; i < lista.length; i++) {
    lista[indice].style.filter = "opacity(75%)";
    lista[indice].style.width = "400px";
    lista[indice].style.height = "150px";
    lista[i].style.zIndex = "0";
    lista[indice].style.position = "relative";
  }

  // card ativo (centro)
  //lista[indice].style.position = "absolute";
  //lista[indice].style.left = "50%";
  //lista[indice].style.transform = "translateX(-50%)";
  lista[indice].style.filter = "opacity(100%)";
  lista[indice].style.height = "200px";
  lista[indice].style.filter = "none";
  lista[indice].style.boxShadow = "0 5px 5px rgba(0, 0, 0, 0.25)";

  // esquerda
  var esq = indice - 1;
  if (esq < 0) {
    esq = lista.length - 1;
  }

  lista[esq].style.opacity = "0.7";
  lista[esq].style.transform = "scale(0.95)";

  // direita
  var dir = indice + 1;
  if (dir >= lista.length) {
    dir = 0;
  }

  lista[dir].style.opacity = "0.7";
  lista[dir].style.transform = "scale(0.95)";
}

function proximo() {
  indice++;

  if (indice >= lista.length) {
    indice = 0;
  }

  atualizar();
}

// iniciar
atualizar();

function anterior() {
  indice--;

  if (indice < 0) {
    indice = lista.length - 1;
  }

  atualizar();
}
