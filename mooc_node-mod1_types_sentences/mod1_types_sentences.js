console.log();

// 2) Saludo
const hora = new Date().getHours();
let greeting;
if (hora >= 7 && hora <= 12) {
  greeting = 'Good morning';
} else if (hora >= 13 && hora <= 22) {
  greeting = 'Good afternoon';
} else {
  greeting = 'Good night';
}
const saludo = `${greeting}, it's ${hora} o'clock`;
console.log(saludo);

console.log();

// 4) Pi con 6 decimales
console.log(Math.PI.toFixed(6));

console.log();

// 6) Tabla del 0 a 22 en decimal, hexadecimal, octal y binario
const changeNumberBase = (n) => {
  const dec = n;
  const hex = n.toString(16);
  const oct = n.toString(8);
  const bin = n.toString(2);
  return {
    dec, hex, oct, bin,
  };
};

for (let index = 0; index < 23; index++) {
  const numero = changeNumberBase(index);
  const linea = `${numero.dec} dec = ${numero.hex} hex = ${numero.oct} oct = ${numero.bin} bin`;
  console.log(linea);
}

console.log();

// 8) Tabla de impares 1 a 21, sin los incluidos en 10-20
const isOdd = n => n % 2;
for (let index = 0; index < 23; index++) {
  if (isOdd(index) && (index < 10 || index > 20)) {
    const numero = changeNumberBase(index);
    const linea = `${numero.dec} dec = ${numero.hex} hex = ${numero.oct} oct = ${numero.bin} bin`;
    console.log(linea);
  }
}

console.log();

// 10) Frase en chino
const chino = 'Hi in Chinese is written as: \u55e8\uff0c\u4f60\u597d\u5417';
console.log(chino);

console.log();

console.log('The program has finished');
