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
      
      // Aplica o deslocamento de -3 na Cifra de César
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

// --- INTEGRAÇÃO COM O HTML (DOM) ---

// 1. Capturamos os elementos da tela pelos IDs que definimos no HTML
const botao = document.getElementById('btnDecodificar');
const input = document.getElementById('inputCodigo');
const displayResultado = document.getElementById('resultado');

// 2. Criamos um "ouvinte de eventos" para agir quando o botão for clicado
botao.addEventListener('click', () => {
  // Pega o que foi digitado no input
  const codigoDigitado = input.value;
  
  // Verifica se o campo não está vazio
  if(codigoDigitado.trim() !== "") {
    // Chama a nossa função para traduzir o código
    const mensagemTraduzida = decodificarMensagem(codigoDigitado);
    // Joga o resultado na tela do HTML
    displayResultado.innerText = "> " + mensagemTraduzida;
  } else {
    // Mensagem de erro se ele clicar sem digitar nada
    displayResultado.innerText = "> erro: insira os dados";
  }
});