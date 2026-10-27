function soloNumeros(texto) {
  return texto
    .split('')
    .filter((caracter) => caracter >= '0' && caracter <= '9')
    .join('');
}


export function mascaraFecha(texto) {
  const n = soloNumeros(texto).slice(0, 8);

  if (n.length <= 2) return n;
  if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}


export function mascaraHora(texto) {
  const n = soloNumeros(texto).slice(0, 4);

  if (n.length <= 2) return n;
  return `${n.slice(0, 2)}:${n.slice(2)}`;
}