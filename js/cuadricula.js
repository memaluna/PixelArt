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
  constructor(color) {
    this.color = color;
  }
  setColor(color) {
    this.color = color;
  }
  getColor() {
    return this.color;
  }
}

//ColorPicker
Coloris({
  themeMode: "dark",
  alpha: false,
  theme: "large",
  swatches: [
    "red",
    "blue",
    "green",
    "yellow",
    "black",
    "orange",
    "navy",
    "white",
    "purple",
    "Brown",
    "pink",
  ],
});

//responsive canvas
var canvas = document.getElementById("canvas");
var heightRatio = 1.5;
canvas.height = canvas.width * heightRatio;

//setDark
var n = document.getElementById("cuerpo");
var m = document.getElementById("marco3d");
var dark = localStorage.getItem("dark");
if (dark === "true") {
  n.classList.add("lights-off");
  m.classList.add("lights-off");
} else {
  n.classList.remove("lights-off");
  m.classList.remove("lights-off");
}

//hilo
let tamanoCuadro = 0;
let cuadrosPorColumnaFila = localStorage.getItem("cuadrados");
if (cuadrosPorColumnaFila == 16) {
  tamanoCuadro = 64;
} else if (cuadrosPorColumnaFila == 32) {
  tamanoCuadro = 32;
} else if (cuadrosPorColumnaFila == 64) {
  tamanoCuadro = 16;
}



let espaciado = 2;
let pincel = new Pincel("black");

let cuadricula = crearCuadricula(
  cuadrosPorColumnaFila,
  tamanoCuadro,
  espaciado,
  "#e9e9e9"
);
draw(cuadricula.getCuadros());

let p = document.getElementById("actualizarDiseno"); // Encuentra el elemento "p" en el sitio
p.addEventListener("click", storageCuadricula, false);
p.cuadricula = cuadricula.getCuadros();

const getCursorPosition = (canvas, event) => {
  const x = event.offsetX;
  const y = event.offsetY;
  console.log(x, y);
  if (
    x < (tamanoCuadro + espaciado) * cuadrosPorColumnaFila &&
    x > 0 &&
    y < (tamanoCuadro + espaciado) * cuadrosPorColumnaFila &&
    y > 0
  ) {
    let ValX = Math.floor(x / (tamanoCuadro + espaciado));
    let ValY = Math.floor(y / (tamanoCuadro + espaciado));
    let idCuadro = ValY * cuadrosPorColumnaFila + ValX;
    cuadricula.getCuadro(idCuadro).setColor(pincel.getColor());
    draw(cuadricula.getCuadros());
    guardarColorUsado(pincel.getColor());
  }
};

const colorPicker = document.getElementById("favcolor");
const borrador = document.getElementById("borrador");
const divColorUsado = document.getElementById("coloresUsados");
let colorUsado = document.getElementById("colorDiv");


let coloresUsados = [];
let currentIndex = 0;

borrador.addEventListener("click", function () {
  pincel.setColor("#e9e9e9");
});





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
      x1 = espaciado / 2;
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
    ctx.canvas.width = (tamanoCuadro + espaciado) * cuadrosPorColumnaFila;
    ctx.canvas.height = (tamanoCuadro + espaciado) * cuadrosPorColumnaFila;
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

function storageCuadricula(cuadricula) {
  if (typeof Storage !== "undefined") {
    // Store
    localStorage.setItem(
      "cuadricula",
      JSON.stringify(cuadricula.currentTarget.cuadricula)
    );
    let stree = new Cuadricula(JSON.parse(localStorage.getItem("cuadricula")));
    console.log(stree);
  } else {
    console.log("Sorry, your browser does not support Web Storage...");
  }
}

function displayColorGrid(colors) {
  while (divColorUsado.firstChild) {
    divColorUsado.removeChild(divColorUsado.firstChild);
  }
  colors.forEach((color) => {
    const colorBox = document.createElement("div");
    colorBox.classList.add("color-box");
    colorBox.style.backgroundColor = color;
    colorBox.id = "colorDiv";
    colorBox.onclick = cambiarColor;
    divColorUsado.appendChild(colorBox);
  });
}

function guardarColorUsado(value) {
  // Verificar si el valor ya existe en el array
  const index = coloresUsados.indexOf(value);
  if (index === -1) {
      // Si no existe, reemplazar en la posición actual (currentIndex)
      coloresUsados[currentIndex] = value;
      currentIndex = (currentIndex + 1) % 5; // Avanzar el índice circularmente
  }
  console.log(coloresUsados);
  displayColorGrid(coloresUsados);
  // currentIndex indica la posición donde se almacenará el siguiente valor
}

function cambiarColor(event){
  const divElement = event.target;
  const computedStyle = getComputedStyle(divElement);
  const color = rgbToHex(computedStyle.backgroundColor);
  console.log(color);
  pincel.setColor(color);
}

function rgbToHex(rgbColor) {
  const rgbValues = rgbColor.match(/\d+/g);
  if (rgbValues && rgbValues.length === 3) {
      const r = parseInt(rgbValues[0]);
      const g = parseInt(rgbValues[1]);
      const b = parseInt(rgbValues[2]);

      return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }
  return null;
}