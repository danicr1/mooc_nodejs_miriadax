const [rutaNode, rutaFichero, ...param] = [...process.argv];

console.log();

// Ruta al interprete de node.js
console.log(`Route to node.js: ${rutaNode}`);

// Ruta a este fichero
console.log(`Route to this file: ${rutaFichero}`);

console.log();

// Array donde guardamos los parametros que no vamos a mostrar
const paramToRemove = ['-r'];
for (let index = 0; index < param.length; index++) {
  if (param[index - 1] === '-r') { // Si está precedido por -r
    paramToRemove.push(param[index]); // Lo añadimos a la lista negra
  }
}

// Array ya sin los elementos precedidos de "-r"
const cleanArray = param.reduce((acc, elem) => {
  if (!paramToRemove.includes(elem)) {
    acc.push(elem);
  }
  return acc;
}, []);

// Primero el array se ordena alfabéticamente, con los elementos iguales consecutivos
// Después se usa reduce para iterar e imprimir los elementos
cleanArray.sort().reduce((acc, ele, index, array) => {
  if (index > 0) { // Si no es el primer elemento
    if (ele === array[index - 1]) {
      acc += 1;
      if (index === array.length - 1) { // Si es el último se imprime lo que haya
        console.log(`${ele}: ${acc}`);
      }
    } else {
      console.log(`${array[index - 1]}: ${acc}`);
      acc = 1;
      if (index === array.length - 1) { // Si es el último se imprime lo que haya
        console.log(`${ele}: ${acc}`);
      }
    }
  } else if (index === array.length - 1) { // Si el primero es el último se imprime lo que haya
    console.log(`${ele}: ${acc}`);
  }

  return acc;
}, 1);
