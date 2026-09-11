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
const botaoCodificar = document.getElementById('btnCodificar'); // Novo botão
const input = document.getElementById('inputCodigo');
const displayResultado = document.getElementById('resultado');

botaoDecodificar.addEventListener('click', () => {
  const textoDigitado = input.value;
  
  if(textoDigitado.trim() !== "") {
    const mensagemTraduzida = decodificarMensagem(textoDigitado);
    displayResultado.innerText = "> " + mensagemTraduzida;
  } else {
    displayResultado.innerText = "> erro: insira os dados";
  }
});

// Novo ouvinte de eventos para o botão de codificar
botaoCodificar.addEventListener('click', () => {
  const textoDigitado = input.value;
  
  if(textoDigitado.trim() !== "") {
    const mensagemCifrada = codificarMensagem(textoDigitado);
    displayResultado.innerText = "> " + mensagemCifrada;
  } else {
    displayResultado.innerText = "> erro: insira os dados";
  }
});