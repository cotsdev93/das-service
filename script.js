let isAnimating = false;

document.querySelectorAll("nav li, .navEnd i").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    // Si la animación está en curso, no hacemos nada.
    if (isAnimating) return;

    const sectionId = e.target.closest("li, i").getAttribute("data-section");
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
    verificarCantidadMarca();
  }
}

const marcasElement = document.querySelector("#marcas");

function cargarMarcas(marcas) {
  marcasElement.innerHTML = "";

  for (const marca of marcas) {
    marcasElement.innerHTML += `
      <div class="marcaContainer">
        <img src="${marca.img}" alt="${marca.alt}">
      </div>
    `;
  }
}

const bdService = new BaseDeDatosService();

const btnLeftService = document.querySelector(".btnLeftMarcas");
const btnRightService = document.querySelector(".btnRightMarcas");
const serviceMarcasContainer = document.querySelector(
  ".serviceMarcasContainer"
);

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
  if (
    desplazamientoActual + anchoMarca >=
    anchoTotalScroll - serviceMarcasContainer.clientWidth
  ) {
    serviceMarcasContainer.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  } else {
    // Mueve el carrusel un casillero hacia la derecha
    moverCarrouselMarca("derecha");
  }
}, 4000);

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
btnRightService.addEventListener("click", () => moverCarrouselMarca("derecha"));

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

  registroPorId(id) {
    return this.repuestos.find((repuesto) => repuesto.id === id);
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
          <p class="repuestoMarca">${repuesto.marca}</p>
        </div>
        <div class="repuestoPrecioContainer">
          <p class="repuestoPrecio">$${repuesto.precio.toLocaleString(
            "es-ES"
          )}</p>
          <div class="repuestoPrecioCart">
            <i class="fa-solid fa-cart-plus agregarCarrito" data-id="${
              repuesto.id
            }"></i>
          </div>
        </div>
      </div>
    `;
  }

  const agregarCarrito = document.querySelectorAll(".agregarCarrito");

  for (const boton of agregarCarrito) {
    boton.addEventListener("click", (event) => {
      event.preventDefault();
      const idRepuesto = Number(boton.dataset.id);
      const repuesto = bdRepuestos.registroPorId(idRepuesto);
      console.log("funca", carrito);

      carrito.agregar(repuesto);
    });
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

  // Obtener repuestos por marca o categoría
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

  // Cargar los repuestos filtrados
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

// BASE DE DATOS equipos

// Definir la clase BaseDeDatosEquipos para manejar la carga y filtrado de equipos
class BaseDeDatosEquipos {
  constructor() {
    this.equipos = [];
    // Cargar los registros al inicializar
    this.cargarRegistros();
  }

  // Cargar los equipos desde el archivo JSON
  async cargarRegistros() {
    const resultado = await fetch("./JSON/productos.json");
    this.equipos = await resultado.json();
    cargarEquipo(this.equipos); // Llamar a cargarEquipo para mostrar los equipos
  }

  // Filtrar equipos por marca
  registrosPorMarca(palabra) {
    return this.equipos.filter(
      (equipo) =>
        equipo.marca.toLowerCase().indexOf(palabra.toLowerCase()) !== -1
    );
  }

  // Filtrar equipos por categoría
  registroPorCategoria(categoria) {
    return this.equipos.filter(
      (equipo) =>
        equipo.categoria.toLowerCase().indexOf(categoria.toLowerCase()) !== -1
    );
  }

  registroPorId(id) {
    return this.equipos.find((equipo) => equipo.id === id);
  }
}

// Seleccionar el contenedor donde se mostrarán los equipos
const equiposElement = document.querySelector("#equipos");

// Función para cargar los equipos y mostrarlos en el HTML
function cargarEquipo(equipos) {
  equiposElement.innerHTML = ""; // Limpiar el contenido previo

  for (const equipo of equipos) {
    equiposElement.innerHTML += `
        <div class="equipoContainer">
          <div class="imgContainer">
            <img src="${equipo.img}" alt="" />
          </div>
          <div class="equipoDetail">
            <p class="equipoCategoria">${equipo.categoria}</p>
            <div class="equipoTitle">
              <p class="equipoMarca">${equipo.marca}</p>
              <p class="equipoModelo">${equipo.modelo}</p>
            </div>
            <div class="equipoPrecioContainer">
              <p class="equipoPrecio">$${equipo.precio.toLocaleString(
                "es-ES"
              )}</p>
              <div class="equipoPrecioCart">
                <i class="fa-solid fa-cart-plus agregarCarrito" data-id="${
                  equipo.id
                }"></i>
              </div>
            </div>
          </div>
        </div>
    `;
  }
  verificarCantidadEquipos(); // Verificar si hay suficientes equipos para mostrar las flechas
}

// Función para mostrar un mensaje si no hay equipos disponibles en una categoría
function noHayEquipos(categoria) {
  equiposElement.innerHTML = `
  <div class="noHayEquipos">
    <p>No hay ${categoria} disponibles</p>
  </div>
  `;
}

// Inicializar la base de datos de equipos
const bdEquipos = new BaseDeDatosEquipos();

// Manejar el evento de búsqueda de equipos
const inputBuscadorEquipos = document.querySelector("#inputBuscadorEquipos");

inputBuscadorEquipos.addEventListener("input", (event) => {
  event.preventDefault();
  const palabra = inputBuscadorEquipos.value;

  // Obtener equipos por marca o categoría
  const equiposPorMarca = bdEquipos.registrosPorMarca(palabra);
  const equiposPorCategoria = bdEquipos.registroPorCategoria(palabra);

  // Combinar los resultados eliminando duplicados
  const equipos = [...new Set([...equiposPorMarca, ...equiposPorCategoria])];

  // Cargar los equipos filtrados
  cargarEquipo(equipos);
});

// Seleccionar los botones de navegación del carrusel
const btnLeftEquipos = document.querySelector(".btnLeftEquipos");
const btnRightEquipos = document.querySelector(".btnRightEquipos");
const equiposContainer = document.querySelector(".equiposContainer");

// Función para obtener el ancho total de un equipo, incluyendo márgenes
function obtenerAnchoEquipoConMargen() {
  const equipo = document.querySelector(".equipoContainer");
  if (equipo) {
    const estilo = window.getComputedStyle(equipo);
    const margenIzquierdo = parseFloat(estilo.marginLeft);
    const margenDerecho = parseFloat(estilo.marginRight);
    const anchoTotal = equipo.offsetWidth + margenIzquierdo + margenDerecho;
    return anchoTotal;
  }
  return 0;
}

// Función para mover el carrusel
function moverCarrousel(direccion) {
  const anchoEquipo = obtenerAnchoEquipoConMargen();
  if (anchoEquipo > 0) {
    const desplazamientoActual = equiposContainer.scrollLeft; // Posición actual del scroll
    const nuevoDesplazamiento =
      direccion === "izquierda"
        ? desplazamientoActual - anchoEquipo
        : desplazamientoActual + anchoEquipo;

    equiposContainer.scrollTo({
      left: nuevoDesplazamiento,
      behavior: "smooth",
    });
  }
}

// Función para verificar la cantidad de equipos y mostrar u ocultar las flechas
function verificarCantidadEquipos() {
  const cantidadEquipos = document.querySelectorAll(".equipoContainer").length;

  if (cantidadEquipos <= 4) {
    btnLeftEquipos.style.display = "none";
    btnRightEquipos.style.display = "none";
  } else {
    btnLeftEquipos.style.display = "block";
    btnRightEquipos.style.display = "block";
  }
}

// Event listeners para los botones del carrusel
btnLeftEquipos.addEventListener("click", () => moverCarrousel("izquierda"));
btnRightEquipos.addEventListener("click", () => moverCarrousel("derecha"));

// Verificar cantidad de equipos al cargar la página
verificarCantidadEquipos();

// Manejar el filtrado por categorías de equipos
const btnCategoriaEquipos = document.querySelectorAll(".btnCategoriaEquipos");

btnCategoriaEquipos.forEach((boton) => {
  boton.addEventListener("click", () => {
    const categoria = boton.dataset.categoria;

    const equipos = bdEquipos.registroPorCategoria(boton.dataset.categoria);
    if (equipos.length > 0) {
      cargarEquipo(equipos); // Mostrar los equipos filtrados
    } else {
      noHayEquipos(categoria); // Mostrar mensaje si no hay equipos
    }
  });
});
const divCarrito = document.querySelector("#carrito")

class Carrito {
  constructor() {
    this.carrito = [];
    this.total = 0;
    this.cantidadProductos = 0;
  }
  
  estaEnCarrito({ id }) {
    return this.carrito.find((producto) => producto.id === id);
  }
  
  agregar(producto) {
    const productoEnCarrito = this.estaEnCarrito(producto);
    
    if (!productoEnCarrito) {
      this.carrito.push({ ...producto, cantidad: 1 });
    } else {
      productoEnCarrito.cantidad++;
    }

    this.listar()
  }
  
  quitar(id) {
    const indice = this.carrito.findIndex((producto) => producto.id === id);
    if (this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
    } else {
      this.carrito.splice(indice, 1);
    }
    this.listar()
  }
  
  listar() {
    this.total = 0
    this.cantidadProductos = 0
    divCarrito.innerHTML = ""
    
    for (const producto of this.carrito) {
      divCarrito.innerHTML += `
      <div>
      <h1>${producto.nombre}</h1>
      <p>Precio: $${producto.precio}</p>
      <p>Cantidad: ${producto.cantidad}</p>
      <a href="#" data-id="${producto.id}" class="quitarCarrito">Quitar carrito</a>
      </div>
      `
      this.total += producto.precio * producto.cantidad
      this.cantidadProductos += producto.cantidad
    }
    const quitarCarrito = document.querySelectorAll(".quitarCarrito")
    
    for (const boton of quitarCarrito ) {
      boton.addEventListener("click", (event) => {
        event.preventDefault()
        const idProducto = Number(boton.dataset.id)
        this.quitar(idProducto)
      })
    }
  }
}

const carrito = new Carrito()