const DESLOCAMENTO = 3; 
const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// 1. Função Original: Transforma números cifrados de volta em texto
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
    
    mensagemFinal.push(palavraDecodificada);
  }

  return mensagemFinal.join(" ");
}

// 2. Função Nova: Transforma texto puro em números cifrados
function codificarMensagem(mensagemClara) {
  // Remove espaços extras e transforma tudo em maiúsculas
  const palavras = mensagemClara.toUpperCase().trim().split(/\s+/);
  const mensagemFinal = [];

  for (let i = 0; i < palavras.length; i++) {
    let palavraCodificada = [];
    
    for (let j = 0; j < palavras[i].length; j++) {
      const letra = palavras[i][j];
      const indiceOriginal = ALFABETO.indexOf(letra);

      // Se o caractere não for uma letra (como vírgulas ou números), apenas ignora
      if (indiceOriginal === -1) continue;

      // Aplica o deslocamento de +3 na Cifra de César
      let novoIndice = (indiceOriginal + DESLOCAMENTO) % 26;
      
      // Converte o índice de volta para o formato de número (1 a 26)
      const numeroCifrado = novoIndice + 1;
      
      palavraCodificada.push(numeroCifrado);
    }
    
    // Junta os números da palavra com pontos
    if (palavraCodificada.length > 0) {
      mensagemFinal.push(palavraCodificada.join("."));
    }
  }

  // Junta as palavras com um espaço em branco
  return mensagemFinal.join(" ");
}


// --- INTEGRAÇÃO COM O HTML (DOM) ---

const botaoDecodificar = document.getElementById('btnDecodificar');
const botaoCodificar = document.getElementById('btnCodificar'); 
const btnCopiar = document.getElementById('btnCopiar');
const avisoDestruicao = document.getElementById('avisoDestruicao');
const input = document.getElementById('inputCodigo');
const displayResultado = document.getElementById('resultado');

// Variáveis para controlar os tempos e cancelar caso o usuário clique de novo rápido
let timerDigitacao;
let timerDestruicao;

// Função de Efeito Máquina de Escrever (Terminal Hacker)
function efeitoDigitacao(texto, callback) {
  // Limpa animações anteriores
  clearInterval(timerDigitacao);
  clearInterval(timerDestruicao);
  
  displayResultado.innerText = "> ";
  avisoDestruicao.style.display = "none";
  btnCopiar.style.display = "none";
  
  let i = 0;
  
  timerDigitacao = setInterval(() => {
    displayResultado.innerText += texto.charAt(i);
    i++;
    
    // Quando terminar de digitar tudo
    if (i >= texto.length) {
      clearInterval(timerDigitacao);
      if (callback) callback();
    }
  }, 50); // Velocidade da digitação (50ms por letra)
}

// Função de Autodestruição (10 segundos)
function iniciarAutodestruicao() {
  btnCopiar.style.display = "inline-block"; // Mostra o botão de copiar
  avisoDestruicao.style.display = "block";
  
  let tempoRestante = 10;
  avisoDestruicao.innerText = `[ATENÇÃO: Estes dados se autodestruirão em ${tempoRestante}s]`;
  
  timerDestruicao = setInterval(() => {
    tempoRestante--;
    avisoDestruicao.innerText = `[ATENÇÃO: Estes dados se autodestruirão em ${tempoRestante}s]`;
    
    // Momento da destruição
    if (tempoRestante <= 0) {
      clearInterval(timerDestruicao);
      displayResultado.innerText = "> [ DADOS APAGADOS PELO SISTEMA ]";
      avisoDestruicao.style.display = "none";
      btnCopiar.style.display = "none";
      input.value = ""; // Limpa o que a pessoa digitou também
    }
  }, 1000);
}

// Botão de Copiar
btnCopiar.addEventListener('click', () => {
  // Remove o ">" e qualquer espaço inicial de forma segura
  const textoParaCopiar = displayResultado.innerText.replace(/^>\s*/, '');
  
  navigator.clipboard.writeText(textoParaCopiar).then(() => {
    btnCopiar.innerText = "Copiado!";
    setTimeout(() => {
      btnCopiar.innerText = "Copiar Código";
    }, 2000);
  });
});

// Ouvintes de clique
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