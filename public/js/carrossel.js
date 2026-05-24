let slideAtual = 0;
let totalSlides = 3;
let tempoPorSlide = 5500;

// Cor do bolinho (dot) de cada slide
let coresDots = ['#ff0a6c', '#7b2fff', '#00c853'];

let timerAutoplay = null;
let timerProgresso = null;
let pausado = false;

let track     = document.querySelector('#carTrack');
let slides    = document.querySelectorAll('.slide');
let dots      = document.querySelectorAll('.cdot');
let barras    = document.querySelectorAll('.cdot__fill');
let btnPrev   = document.querySelector('#carPrev');
let btnNext   = document.querySelector('#carNext');
let carrossel = document.querySelector('#carousel');


function irParaSlide(numero) {
  if (numero === slideAtual) return;

  slides[slideAtual].classList.remove('is-active');
  dots[slideAtual].classList.remove('active');
  dots[slideAtual].style.background = '';
  pararProgresso(slideAtual);

  if (numero >= totalSlides) {
    slideAtual = 0;
  } else if (numero < 0) {
    slideAtual = totalSlides - 1;
  } else {
    slideAtual = numero;
  }

  track.style.transform = 'translateX(-' + (slideAtual * 100) + '%)';

  slides[slideAtual].classList.add('is-active');
  dots[slideAtual].classList.add('active');
  dots[slideAtual].style.background = coresDots[slideAtual];

  iniciarProgresso(slideAtual);
  reiniciarAutoplay();
}

function proximoSlide() {
  irParaSlide(slideAtual + 1);
}

function slideAnterior() {
  irParaSlide(slideAtual - 1);
}

function pararProgresso(numero) {
  clearInterval(timerProgresso);
  barras[numero].style.width = '0%';
}

function iniciarProgresso(numero) {
  pararProgresso(numero);
  if (pausado) return;

  let larguraAtual = 0;
  let passo = 100 / (tempoPorSlide / 50);

  timerProgresso = setInterval(function () {
    larguraAtual = larguraAtual + passo;
    if (larguraAtual >= 100) {
      larguraAtual = 100;
      clearInterval(timerProgresso);
    }
    barras[numero].style.width = larguraAtual + '%';
  }, 50);
}

function reiniciarAutoplay() {
  clearTimeout(timerAutoplay);
  if (pausado) return;
  timerAutoplay = setTimeout(function () {
    proximoSlide();
  }, tempoPorSlide);
}

btnPrev.onclick = function () { slideAnterior(); };
btnNext.onclick = function () { proximoSlide(); };

dots[0].onclick = function () { irParaSlide(0); };
dots[1].onclick = function () { irParaSlide(1); };
dots[2].onclick = function () { irParaSlide(2); };

document.onkeydown = function (evento) {
  if (evento.key === 'ArrowRight') proximoSlide();
  if (evento.key === 'ArrowLeft')  slideAnterior();
};

let toqueInicio = 0;

track.ontouchstart = function (evento) {
  toqueInicio = evento.touches[0].clientX;
};

track.ontouchend = function (evento) {
  let toqueFim  = evento.changedTouches[0].clientX;
  let diferenca = toqueInicio - toqueFim;

  // Se arrastou mais de 50px para o lado, troca o slide
  if (diferenca > 50)  proximoSlide();
  if (diferenca < -50) slideAnterior();
};

carrossel.onmouseenter = function () {
  pausado = true;
  clearTimeout(timerAutoplay);
  clearInterval(timerProgresso);
};

carrossel.onmouseleave = function () {
  pausado = false;
  iniciarProgresso(slideAtual);
  reiniciarAutoplay();
};

dots[0].style.background = coresDots[0];
iniciarProgresso(0);
reiniciarAutoplay();