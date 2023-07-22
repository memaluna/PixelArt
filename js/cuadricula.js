// Clases
class Cuadro {
  constructor(id, x1, x2, y1, y2, color, ancho) {
    this.id = id;
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.color = color;
    this.ancho = ancho;
    this.largo = this.ancho;
  }

  getId() {
    return this.id;
  }
  getX1() {
    return this.x1;
  }
  getX2() {
    return this.x2;
  }
  getY1() {
    return this.y1;
  }
  getY2() {
    return this.y2;
  }
  getColor() {
    return this.color;
  }
  getAncho() {
    return this.ancho;
  }
  getLargo() {
    return this.largo;
  }
  setColor(color) {
    this.color = color;
  }
}

class Cuadricula {
  constructor(cuadros) {
    this.cuadros = cuadros;
  }
  getCuadros() {
    return this.cuadros;
  }
  addCuadro(cuadro) {
    this.cuadros.push(cuadro);
  }
  getCuadro(id) {
    return this.cuadros[id];
  }
}

class Pincel {
  constructor(color){
    this.color = color;
  }
  setColor(color) {
    this.color = color;
  }
  getColor() {
    return this.color;
  }
}

//responsive canvas
var canvas = document.getElementById('canvas');
var heightRatio = 1.5;
canvas.height = canvas.width * heightRatio;

//hilo
let tamanoCuadro = 0;
let cuadrosPorColumnaFila = 32;
 if (cuadrosPorColumnaFila == 16){
  tamanoCuadro = 64;
}else if(cuadrosPorColumnaFila == 32){
  tamanoCuadro = 32;
}else if(cuadrosPorColumnaFila == 64){
  tamanoCuadro = 16;
} 

let espaciado = 2;
let pincel = new Pincel("black");

let cuadricula = crearCuadricula(cuadrosPorColumnaFila, tamanoCuadro, espaciado, "grey");
draw(cuadricula.getCuadros());

let p = document.getElementById("actualizarDiseno"); // Encuentra el elemento "p" en el sitio
p.addEventListener('click', storageCuadricula, false);
p.cuadricula = cuadricula.getCuadros();


const getCursorPosition = (canvas, event) => {
  const x = event.offsetX;
  const y = event.offsetY;
  console.log(x, y);
  if(x < ((tamanoCuadro + espaciado)*cuadrosPorColumnaFila) && x > 0 && y < ((tamanoCuadro + espaciado)*cuadrosPorColumnaFila) && y > 0){
    let ValX = Math.floor(x/(tamanoCuadro+espaciado));
    let ValY = Math.floor(y/(tamanoCuadro+espaciado));
    let idCuadro = (ValY * cuadrosPorColumnaFila) + ValX;
    cuadricula.getCuadro(idCuadro).setColor(pincel.getColor());
    draw(cuadricula.getCuadros());
  }
 
};

const colorPicker = document.getElementById("favcolor");

colorPicker.addEventListener("input", watchColorPicker, false);
colorPicker.addEventListener("change", watchColorPicker, false);

function watchColorPicker(event) {
  pincel.setColor(event.target.value);
}



canvas.addEventListener("mousedown", (e) => {
  getCursorPosition(canvas, e);
});


//Funciones
function crearCuadricula(columnasFilas, tamanoCuadrado, espaciado, color) {
  let cuadros = [];
  let cuadricula1 = new Cuadricula(cuadros);
  let cantidadCuadrados = columnasFilas * columnasFilas;
  let tamanoTotal = tamanoCuadrado + espaciado;
  let x1 = espaciado / 2;
  let x2 = tamanoCuadrado + x1;
  let y1 = espaciado / 2;
  let y2 = tamanoCuadrado + y1;
  let yA = 1;

  for (let i = 0; i < cantidadCuadrados; i++) {
    let cuadradoNuevo = new Cuadro(i, x1, x2, y1, y2, color, tamanoCuadrado);
    if (x1 >= tamanoTotal * columnasFilas - tamanoTotal) {
      x1 = espaciado/2;
      x2 = x1 + tamanoCuadrado;
      yA = yA + tamanoTotal;
      y1 = yA;
      y2 = yA + tamanoTotal;
    } else {
      x1 = x1 + tamanoTotal;
      x2 = x1 + tamanoCuadrado;
      y1 = yA;
      y2 = yA + tamanoCuadrado;
    }
    cuadricula1.addCuadro(cuadradoNuevo);    
  }
  return cuadricula1;
}

function draw(cuadricula) {
  const canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.canvas.width  = (tamanoCuadro + espaciado)*cuadrosPorColumnaFila;
    ctx.canvas.height = (tamanoCuadro + espaciado)*cuadrosPorColumnaFila;
    for (let i = 0; i < cuadricula.length; i++) {
      ctx.fillRect(
        cuadricula[i].getX1(),
        cuadricula[i].getY1(),
        cuadricula[i].getAncho(),
        cuadricula[i].getAncho(),
        (ctx.fillStyle = cuadricula[i].getColor())
      );
    }
  }
}

function storageCuadricula(cuadricula){
  if (typeof(Storage) !== "undefined") {
    // Store
    localStorage.setItem("cuadricula", JSON.stringify(cuadricula.currentTarget.cuadricula));
    let stree = new Cuadricula(JSON.parse(localStorage.getItem("cuadricula")));
    console.log(stree);
  } else {
    console.log("Sorry, your browser does not support Web Storage...");
  }
}
