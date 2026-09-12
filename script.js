const DESLOCAMENTO = 3; 
const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function decodificarMensagem(mensagemCriptografada) {
  const palavras = mensagemCriptografada.trim().split(/\s+/);
  const mensagemFinal = [];

  for (let i = 0; i < palavras.length; i++) {
    const numeros = palavras[i].split(".");
    let palavraDecodificada = "";

    for (let j = 0; j < numeros.length; j++) {
      const numero = parseInt(numeros[j]);
      
      if (isNaN(numero) || numero < 1 || numero > 26) continue;

      const indiceLetraCifrada = numero - 1; 
      let novoIndice = (indiceLetraCifrada - DESLOCAMENTO) % 26;
      
      if (novoIndice < 0) {
        novoIndice += 26;
      }

      palavraDecodificada += ALFABETO[novoIndice];
    }
    
    if (palavraDecodificada !== "") {
      mensagemFinal.push(palavraDecodificada);
    }
  }

  // Junta as palavras com o espaço correto
  return mensagemFinal.join(" ");
}

function codificarMensagem(mensagemClara) {
  const palavras = mensagemClara.toUpperCase().trim().split(/\s+/);
  const mensagemFinal = [];

  for (let i = 0; i < palavras.length; i++) {
    let palavraCodificada = [];
    
    for (let j = 0; j < palavras[i].length; j++) {
      const letra = palavras[i][j];
      const indiceOriginal = ALFABETO.indexOf(letra);

      if (indiceOriginal === -1) continue;

      let novoIndice = (indiceOriginal + DESLOCAMENTO) % 26;
      const numeroCifrado = novoIndice + 1;
      
      palavraCodificada.push(numeroCifrado);
    }
    
    // Junta as letras de uma palavra com pontos
    if (palavraCodificada.length > 0) {
      mensagemFinal.push(palavraCodificada.join("."));
    }
  }

  // Junta as palavras com o espaço correto
  return mensagemFinal.join(" ");
}

// --- INTEGRAÇÃO COM O HTML (DOM) ---

const botaoDecodificar = document.getElementById('btnDecodificar');
const botaoCodificar = document.getElementById('btnCodificar'); 
const btnCopiar = document.getElementById('btnCopiar');
const avisoDestruicao = document.getElementById('avisoDestruicao');
const input = document.getElementById('inputCodigo');
const displayResultado = document.getElementById('resultado');

// A MÁGICA AQUI: Força o HTML a respeitar os espaços exatamente como estão
displayResultado.style.whiteSpace = "pre-wrap";

let timerDigitacao;
let timerDestruicao;

function efeitoDigitacao(texto, callback) {
  clearInterval(timerDigitacao);
  clearInterval(timerDestruicao);
  
  // Usamos textContent em vez de innerText para preservar os caracteres puros
  displayResultado.textContent = "> ";
  avisoDestruicao.style.display = "none";
  btnCopiar.style.display = "none";
  
  let i = 0;
  
  timerDigitacao = setInterval(() => {
    displayResultado.textContent += texto.charAt(i);
    i++;
    
    if (i >= texto.length) {
      clearInterval(timerDigitacao);
      if (callback) callback();
    }
  }, 50); 
}

function iniciarAutodestruicao() {
  btnCopiar.style.display = "inline-block"; 
  avisoDestruicao.style.display = "block";
  
  let tempoRestante = 10;
  avisoDestruicao.textContent = `[ATENÇÃO: Estes dados se autodestruirão em ${tempoRestante}s]`;
  
  timerDestruicao = setInterval(() => {
    tempoRestante--;
    avisoDestruicao.textContent = `[ATENÇÃO: Estes dados se autodestruirão em ${tempoRestante}s]`;
    
    if (tempoRestante <= 0) {
      clearInterval(timerDestruicao);
      displayResultado.textContent = "> [ DADOS APAGADOS PELO SISTEMA ]";
      avisoDestruicao.style.display = "none";
      btnCopiar.style.display = "none";
      input.value = ""; 
    }
  }, 1000);
}

btnCopiar.addEventListener('click', () => {
  // Pega o texto puro mantendo os espaços e tira apenas a seta "> " do começo
  const textoParaCopiar = displayResultado.textContent.replace(/^>\s*/, '');
  
  navigator.clipboard.writeText(textoParaCopiar).then(() => {
    btnCopiar.textContent = "Copiado!";
    setTimeout(() => {
      btnCopiar.textContent = "Copiar Código";
    }, 2000);
  });
});

botaoDecodificar.addEventListener('click', () => {
  const textoDigitado = input.value;
  if(textoDigitado.trim() !== "") {
    const mensagemTraduzida = decodificarMensagem(textoDigitado);
    efeitoDigitacao(mensagemTraduzida, iniciarAutodestruicao);
  } else {
    efeitoDigitacao("erro: insira os dados", null);
  }
});

botaoCodificar.addEventListener('click', () => {
  const textoDigitado = input.value;
  if(textoDigitado.trim() !== "") {
    const mensagemCifrada = codificarMensagem(textoDigitado);
    efeitoDigitacao(mensagemCifrada, iniciarAutodestruicao);
  } else {
    efeitoDigitacao("erro: insira os dados", null);
  }
});