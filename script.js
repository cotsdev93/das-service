let isAnimating = false;

document.querySelectorAll("nav li").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    // Si la animación está en curso, no hacemos nada.
    if (isAnimating) return;

    const sectionId = e.target.closest("li").getAttribute("data-section");
    const newActiveSection = document.getElementById(`section${sectionId}`);
    const currentActiveSection = document.querySelector(".section.active");

    // Si es la misma sección, no hace nada.
    if (newActiveSection === currentActiveSection) return;

    // Activamos el flag de animación.
    isAnimating = true;

    // Añadir clase para animar la salida de la sección actual.
    if (currentActiveSection) {
      currentActiveSection.classList.remove("active");
      currentActiveSection.classList.add("exit-left");
    }

    // Usamos requestAnimationFrame para coordinar mejor la entrada de la nueva sección.
    requestAnimationFrame(() => {
      // Activar la entrada de la nueva sección al instante.
      newActiveSection.classList.add("enter-right");
    });

    // Esperar hasta que la animación de salida termine antes de activar la nueva sección.
    setTimeout(() => {
      if (currentActiveSection) {
        currentActiveSection.classList.remove("exit-left");
      }
      newActiveSection.classList.remove("enter-right");
      newActiveSection.classList.add("active");

      // Desactivamos el flag de animación después de que todas las animaciones hayan terminado.
      isAnimating = false;
    }, 2000); // Ajusta la duración para que coincida con la duración de las animaciones.
  });
});

// SERVICE
class BaseDeDatosService {
  constructor() {
    this.marcas = [];
    this.cargarRegistros();
  }

  async cargarRegistros() {
    const resultado = await fetch("./JSON/marcas.json");
    this.marcas = await resultado.json();
    cargarMarcas(this.marcas);
    verificarCantidadMarca()
  }
}

const marcasElement = document.querySelector("#marcas");

function cargarMarcas(marcas) {
  marcasElement.innerHTML = "";

  for (const marca of marcas) {
    marcasElement.innerHTML += `
      <div class="marcaContainer">
        <img src="${marca.img}" alt="Marca">
      </div>
    `;
  }
}

const bdService = new BaseDeDatosService();

const btnLeftService = document.querySelector(".btnLeftMarcas");
const btnRightService = document.querySelector(".btnRightMarcas");
const serviceMarcasContainer = document.querySelector(".serviceMarcasContainer");

function obtenerAnchoMarcaConMargen() {
  const marca = document.querySelector(".marcaContainer");
  if (marca) {
    const estilo = window.getComputedStyle(marca);
    const margenIzquierdo = parseFloat(estilo.marginLeft);
    const margenDerecho = parseFloat(estilo.marginRight);
    const anchoTotal = marca.offsetWidth + margenIzquierdo + margenDerecho;
    return anchoTotal;
  }
  return 0;
}

function moverCarrouselMarca(direccion) {
  const anchoMarca = obtenerAnchoMarcaConMargen();
  if (anchoMarca > 0) {
    const desplazamientoActual = serviceMarcasContainer.scrollLeft;
    const nuevoDesplazamiento =
      direccion === "izquierda"
        ? desplazamientoActual - anchoMarca
        : desplazamientoActual + anchoMarca;

    serviceMarcasContainer.scrollTo({
      left: nuevoDesplazamiento,
      behavior: "smooth",
    });
  }
}

// Mover el carrusel automáticamente hacia la derecha cada 3 segundos
let autoSlide = setInterval(() => {
  const anchoTotalScroll = serviceMarcasContainer.scrollWidth;
  const desplazamientoActual = serviceMarcasContainer.scrollLeft;
  const anchoMarca = obtenerAnchoMarcaConMargen();

  // Si el desplazamiento actual está al final, reinicia al principio
  if (desplazamientoActual + anchoMarca >= anchoTotalScroll - serviceMarcasContainer.clientWidth) {
    serviceMarcasContainer.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  } else {
    // Mueve el carrusel un casillero hacia la derecha
    moverCarrouselMarca("derecha");
  }
}, 3000); // 3000 ms = 3 segundos

function verificarCantidadMarca() {
  const cantidadMarca = document.querySelectorAll(".marcaContainer").length;

  if (cantidadMarca <= 4) {
    btnLeftService.style.display = "none";
    btnRightService.style.display = "none";
  } else {
    btnLeftService.style.display = "block";
    btnRightService.style.display = "block";
  }
}

btnLeftService.addEventListener("click", () =>
  moverCarrouselMarca("izquierda")
);
btnRightService.addEventListener("click", () =>
  moverCarrouselMarca("derecha")
);

verificarCantidadMarca();

// BASE DE DATOS repuestos

class BaseDeDatosRepuestos {
  constructor() {
    this.repuestos = [];
    this.cargarRegistros();
  }

  async cargarRegistros() {
    const resultado = await fetch("./JSON/repuestos.json");
    this.repuestos = await resultado.json();
    cargarRepuestos(this.repuestos);
  }

  registrosPorMarca(palabra) {
    return this.repuestos.filter(
      (repuesto) =>
        repuesto.marca.toLowerCase().indexOf(palabra.toLowerCase()) !== -1
    );
  }

  registroPorCategoria(categoria) {
    return this.repuestos.filter(
      (repuesto) =>
        repuesto.categoria.toLowerCase().indexOf(categoria.toLowerCase()) !== -1
    );
  }

  registroPorNombre(nombre) {
    return this.repuestos.filter(
      (repuesto) =>
        repuesto.nombre.toLowerCase().indexOf(nombre.toLowerCase()) !== -1
    );
  }
}

const repuestosElement = document.querySelector("#repuestos");

function cargarRepuestos(repuestos) {
  repuestosElement.innerHTML = "";

  for (const repuesto of repuestos) {
    repuestosElement.innerHTML += `
      <div class="repuestoContainer">
        <div class="imgContainer">
          <img src="${repuesto.img}" alt="" />
        </div>
        <div class="repuestoDetail">
        <p class="repuestoNombre">${repuesto.nombre}</p>
          <div class="repuestoTitle">
            <p class="repuestoMarca">${repuesto.marca}</p>
            <p class="repuestoPrecio">$${repuesto.precio.toLocaleString(
              "es-ES"
            )}</p>
          </div>
        </div>
      </div>
    `;
  }
  verificarCantidadRepuestos();
}

function noHayRepuestos(categoria) {
  repuestosElement.innerHTML = `
  <div class="noHayRepuestos">
    <p>No hay repuestos de ${categoria} disponibles</p>
  </div>
  `;
}

const bdRepuestos = new BaseDeDatosRepuestos();

const inputBuscadorRepuestos = document.querySelector(
  "#inputBuscadorRepuestos"
);

inputBuscadorRepuestos.addEventListener("input", (event) => {
  event.preventDefault();
  const palabra = inputBuscadorRepuestos.value;

  // Obtener productos por marca o categoría
  const repuestosPorMarca = bdRepuestos.registrosPorMarca(palabra);
  const repuestosPorCategoria = bdRepuestos.registroPorCategoria(palabra);
  const repuestosPorNombre = bdRepuestos.registroPorNombre(palabra);

  // Combinar los resultados eliminando duplicados
  const repuestos = [
    ...new Set([
      ...repuestosPorMarca,
      ...repuestosPorCategoria,
      ...repuestosPorNombre,
    ]),
  ];

  // Cargar los productos filtrados
  cargarRepuestos(repuestos);
});

const btnLeftRepuestos = document.querySelector(".btnLeftRepuestos");
const btnRightRepuestos = document.querySelector(".btnRightRepuestos");
const repuestosContainer = document.querySelector(".repuestosContainer");

// Función para obtener el ancho total de un repuesto, incluyendo márgenes
function obtenerAnchoRepuestoConMargen() {
  const repuesto = document.querySelector(".repuestoContainer");
  if (repuesto) {
    const estilo = window.getComputedStyle(repuesto);
    const margenIzquierdo = parseFloat(estilo.marginLeft);
    const margenDerecho = parseFloat(estilo.marginRight);
    const anchoTotal = repuesto.offsetWidth + margenIzquierdo + margenDerecho;
    return anchoTotal;
  }
  return 0;
}

// Función para mover el carrusel
function moverCarrouselRepuestos(direccion) {
  const anchoRepuesto = obtenerAnchoRepuestoConMargen();
  if (anchoRepuesto > 0) {
    const desplazamientoActual = repuestosContainer.scrollLeft; // Posición actual del scroll
    const nuevoDesplazamiento =
      direccion === "izquierda"
        ? desplazamientoActual - anchoRepuesto
        : desplazamientoActual + anchoRepuesto;

    repuestosContainer.scrollTo({
      left: nuevoDesplazamiento,
      behavior: "smooth",
    });
  }
}

// Función para verificar la cantidad de repuestos y ocultar/mostrar flechas
function verificarCantidadRepuestos() {
  const cantidadRepuestos =
    document.querySelectorAll(".repuestoContainer").length;

  if (cantidadRepuestos <= 4) {
    btnLeftRepuestos.style.display = "none";
    btnRightRepuestos.style.display = "none";
  } else {
    btnLeftRepuestos.style.display = "block";
    btnRightRepuestos.style.display = "block";
  }
}

// Event listeners para los botones
btnLeftRepuestos.addEventListener("click", () =>
  moverCarrouselRepuestos("izquierda")
);
btnRightRepuestos.addEventListener("click", () =>
  moverCarrouselRepuestos("derecha")
);

verificarCantidadRepuestos();

const btnCategoriaRepuestos = document.querySelectorAll(
  ".btnCategoriaRepuestos"
);

btnCategoriaRepuestos.forEach((boton) => {
  boton.addEventListener("click", () => {
    const categoria = boton.dataset.categoria;

    const repuestos = bdRepuestos.registroPorCategoria(boton.dataset.categoria);
    cargarRepuestos(repuestos);

    if (repuestos.length > 0) {
      cargarRepuestos(repuestos);
    } else {
      noHayRepuestos(categoria);
    }
  });
});

// BASE DE DATOS productos

class BaseDeDatosProductos {
  constructor() {
    this.productos = [];

    this.cargarRegistros();
  }

  async cargarRegistros() {
    const resultado = await fetch("./JSON/productos.json");
    this.productos = await resultado.json();
    cargarProductos(this.productos);
  }

  registrosPorMarca(palabra) {
    return this.productos.filter(
      (producto) =>
        producto.marca.toLowerCase().indexOf(palabra.toLowerCase()) !== -1
    );
  }

  registroPorCategoria(categoria) {
    return this.productos.filter(
      (producto) =>
        producto.categoria.toLowerCase().indexOf(categoria.toLowerCase()) !== -1
    );
  }
}

const productosElement = document.querySelector("#productos");

function cargarProductos(productos) {
  productosElement.innerHTML = "";

  for (const producto of productos) {
    productosElement.innerHTML += `
      <div class="productoContainer">
        <div class="imgContainer">
          <img src="${producto.img}" alt="" />
        </div>
        <div class="productoDetail">
          <p class="productoCategoria">${producto.categoria}</p>
          <div class="productoTitle">
            <p class="productoMarca">${producto.marca}</p>
            <p class="productoModelo">${producto.modelo}</p>
          </div>
          <p class="productoPrecio">$${producto.precio.toLocaleString(
            "es-ES"
          )}</p>
        </div>
      </div>
    `;
  }
  verificarCantidadProductos();
}

function noHayProductos(categoria) {
  productosElement.innerHTML = `
  <div class="noHayProductos">
    <p>No hay ${categoria} disponibles</p>
  </div>
  `;
}

const bdProductos = new BaseDeDatosProductos();

const inputBuscadorEquipos = document.querySelector("#inputBuscadorEquipos");

inputBuscadorEquipos.addEventListener("input", (event) => {
  event.preventDefault();
  const palabra = inputBuscadorEquipos.value;

  // Obtener productos por marca o categoría
  const productosPorMarca = bdProductos.registrosPorMarca(palabra);
  const productosPorCategoria = bdProductos.registroPorCategoria(palabra);

  // Combinar los resultados eliminando duplicados
  const productos = [
    ...new Set([...productosPorMarca, ...productosPorCategoria]),
  ];

  // Cargar los productos filtrados
  cargarProductos(productos);
});

const btnLeftProductos = document.querySelector(".btnLeftProductos");
const btnRightProductos = document.querySelector(".btnRightProductos");
const productosContainer = document.querySelector(".productosContainer");

// Función para obtener el ancho total de un producto, incluyendo márgenes
function obtenerAnchoProductoConMargen() {
  const producto = document.querySelector(".productoContainer");
  if (producto) {
    const estilo = window.getComputedStyle(producto);
    const margenIzquierdo = parseFloat(estilo.marginLeft);
    const margenDerecho = parseFloat(estilo.marginRight);
    const anchoTotal = producto.offsetWidth + margenIzquierdo + margenDerecho;
    return anchoTotal;
  }
  return 0;
}

// Función para mover el carrusel
function moverCarrousel(direccion) {
  const anchoProducto = obtenerAnchoProductoConMargen();
  if (anchoProducto > 0) {
    const desplazamientoActual = productosContainer.scrollLeft; // Posición actual del scroll
    const nuevoDesplazamiento =
      direccion === "izquierda"
        ? desplazamientoActual - anchoProducto
        : desplazamientoActual + anchoProducto;

    productosContainer.scrollTo({
      left: nuevoDesplazamiento,
      behavior: "smooth",
    });
  }
}

// Función para verificar la cantidad de productos y ocultar/mostrar flechas
function verificarCantidadProductos() {
  const cantidadProductos =
    document.querySelectorAll(".productoContainer").length;

  if (cantidadProductos <= 4) {
    btnLeftProductos.style.display = "none";
    btnRightProductos.style.display = "none";
  } else {
    btnLeftProductos.style.display = "block";
    btnRightProductos.style.display = "block";
  }
}

// Event listeners para los botones
btnLeftProductos.addEventListener("click", () => moverCarrousel("izquierda"));
btnRightProductos.addEventListener("click", () => moverCarrousel("derecha"));

verificarCantidadProductos();

const btnCategoriaProductos = document.querySelectorAll(
  ".btnCategoriaProductos"
);

btnCategoriaProductos.forEach((boton) => {
  boton.addEventListener("click", () => {
    const categoria = boton.dataset.categoria;

    const productos = bdProductos.registroPorCategoria(boton.dataset.categoria);
    cargarProductos(productos);

    if (productos.length > 0) {
      cargarProductos(productos);
    } else {
      noHayProductos(categoria);
    }
  });
});
