// funções gerais
function primeiraLetraMaiuscula(texto) {
    return String(texto)
      .trim() // Remove espaços em branco no início e no final da string
      .replace(/\s+/g, ' ') // Remove espaços extras entre as palavras
      .toLowerCase() // Converte todo o texto para minúsculas
      .replace(/(^|\s)\S/g, (match) => match.toUpperCase()); // Converte as primeiras letras de cada palavra para maiúsculo
  
  }
  
  function capitalizarEPontuar(str) {
    const capitalizada = str.charAt(0).toUpperCase() + str.slice(1); // Capitaliza a primeira letra
    const comPonto = capitalizada.endsWith('.') ? capitalizada : capitalizada + '.'; // Adiciona um ponto final se já não houver um
    
    return String(comPonto);
  }

  export {
    primeiraLetraMaiuscula, capitalizarEPontuar
  }