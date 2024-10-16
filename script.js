function intro() {
  const logoIntro = document.querySelector(".logoIntroContainer");
  const introContainer = document.querySelector(".introContainer");
  const body = document.querySelector("body");
  const mobile = window.innerWidth <= 737;

  body.style.overflow = "hidden";

  if (mobile) {
    logoIntro.style.transform = "scale(1)";
  } else {
    logoIntro.style.transform = "scale(2)";
  }

  setTimeout(function () {
    if (mobile) {
      logoIntro.style.transform = "scale(1)";
    } else {
      logoIntro.style.transform = "scale(2)";
    }
    introContainer.style.transform = "translateY(-100vh)";
    setTimeout(() => {
      body.style.overflow = "auto";
    }, 1000);
  }, 2000);
}

intro();

window.addEventListener("keydown", function (event) {
  if (event.key == "Tab") {
    event.preventDefault();
    console.log("funca");
  }
});

let isAnimating = false;

document.querySelectorAll("nav li, .navEnd i").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    if (isAnimating) return;

    const sectionId = e.target.closest("li, i").getAttribute("data-section");
    const newActiveSection = document.getElementById(`section${sectionId}`);
    const currentActiveSection = document.querySelector(".section.active");

    if (newActiveSection === currentActiveSection) return;

    isAnimating = true;

    if (currentActiveSection) {
      currentActiveSection.classList.remove("active");
      currentActiveSection.classList.add("exit-left");
    }

    requestAnimationFrame(() => {
      newActiveSection.classList.add("enter-right");
    });

    setTimeout(() => {
      if (currentActiveSection) {
        currentActiveSection.classList.remove("exit-left");
      }
      newActiveSection.classList.remove("enter-right");
      newActiveSection.classList.add("active");

      isAnimating = false;
    }, 2000);
  });
});

// wp notification

function wpNotification() {
  
  setTimeout(() => {
    const wp = document.querySelector(".wpNotificationContainer");
    wp.style.right = "20px";

    setTimeout(() => {
      const wpNumber = document.querySelector(".wpNotificationNumber");
      wpNumber.style.opacity = "1";
      setTimeout(() => {
        const wpMensaje = document.querySelector(".wpNotificationMensaje");
        wpMensaje.style.opacity = "1";
        wpMensaje.style.display = "block";
      }, 1000);
    }, 3000);

    const close = document.querySelector(".close");
    close.addEventListener("click", () => {
      const wpMensaje = document.querySelector(".wpNotificationMensaje");
      wp.style.right = "-50px";
      wpMensaje.style.display = "none";
    });


    setTimeout(() => {
      const wpMensaje = document.querySelector(".wpNotificationMensaje");
      wp.style.right = "-50px";
      wpMensaje.style.display = "none";
    }, 25000);
  }, 5000);
}

wpNotification();

function mostrarHora() {
  const fecha = new Date();
  const hora = fecha.getHours().toString().padStart(2, "0");
  const minutos = fecha.getMinutes().toString().padStart(2, "0");

  // Formato de 24 horas: HH:MM:SS
  const horaFormateada = `${hora}:${minutos}`;

  document.getElementById("horaActual").textContent = horaFormateada;
}

mostrarHora();

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

const mobile = window.innerWidth <= 737;

let autoSlide = setInterval(() => {
  const anchoTotalScroll = serviceMarcasContainer.scrollWidth;
  const desplazamientoActual = serviceMarcasContainer.scrollLeft;
  const anchoMarca = obtenerAnchoMarcaConMargen();

  if (
    desplazamientoActual + anchoMarca >=
    anchoTotalScroll - serviceMarcasContainer.clientWidth
  ) {
    serviceMarcasContainer.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  } else {
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

const btnLeftFotos = document.querySelector(".btnLeftFotos");
const btnRightFotos = document.querySelector(".btnRightFotos");
const serviceFotoContainer = document.querySelector(".serviceFotoContainer");

class BaseDeDatosServiceFotos {
  constructor() {
    this.fotos = [];
    this.cargarFotos();
  }

  async cargarFotos() {
    const resultado = await fetch("./JSON/fotos.json");
    this.fotos = await resultado.json();
    cargarFotos(this.fotos);
    // verificarCantidadFotos();
  }
}

const fotosElement = document.querySelector("#fotos");

function cargarFotos(fotos) {
  fotosElement.innerHTML = "";

  for (const foto of fotos) {
    fotosElement.innerHTML += `
    <div class="fotoContainer">
      <img src="${foto.img}" loading="lazy" alt="${foto.alt}">
    </div>
    `;
  }
}

const bsServiceFotos = new BaseDeDatosServiceFotos();

function obtenerAnchoFotoConMargen() {
  const foto = document.querySelector(".fotoContainer");
  if (foto) {
    const estilo = window.getComputedStyle(foto);
    const margenIzquierdo = parseFloat(estilo.marginLeft);
    const margenDerecho = parseFloat(estilo.marginRight);
    const anchoTotal = foto.offsetWidth + margenIzquierdo + margenDerecho;
    return anchoTotal;
  }
  return 0;
}

function moverCarrouselFoto(direccion) {
  const anchoFoto = obtenerAnchoFotoConMargen();
  if (anchoFoto > 0) {
    const desplazamientoActual = serviceFotoContainer.scrollLeft;
    const nuevoDesplazamiento =
      direccion === "izquierda"
        ? desplazamientoActual - anchoFoto
        : desplazamientoActual + anchoFoto;

    serviceFotoContainer.scrollTo({
      left: nuevoDesplazamiento,
      behavior: "smooth",
    });
  }
}

const serviceFotosCarrousel = document.querySelector(".serviceFotosCarrousel");

let autoSlideFotos;

function iniciarAutoSlide() {
  autoSlideFotos = setInterval(() => {
    const anchoTotalScroll = serviceFotoContainer.scrollWidth;
    const desplazamientoActual = serviceFotoContainer.scrollLeft;
    const anchoFoto = obtenerAnchoFotoConMargen(); // Corregido el nombre de la función

    if (
      desplazamientoActual + anchoFoto >=
      anchoTotalScroll - serviceFotoContainer.clientWidth
    ) {
      serviceFotoContainer.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    } else {
      moverCarrouselFoto("derecha");
    }
  }, 4000);
}

function detenerAutoSlide() {
  clearInterval(autoSlideFotos);
}

iniciarAutoSlide();

serviceFotosCarrousel.addEventListener("mouseenter", () => {
  if (mobile) {
    return;
  } else {
    detenerAutoSlide();
    const body = document.querySelector("body");

    function estirarBody() {
      body.style.height = "110%";
    }
    estirarBody();
  }
});

serviceFotosCarrousel.addEventListener("mouseleave", () => {
  if (mobile) {
    return;
  } else {
    iniciarAutoSlide();
    const body = document.querySelector("body");

    function achicarBody() {
      body.style.height = "100%";
    }
    achicarBody();
  }
});

function moverCarrouselFoto(direccion) {
  const anchoFoto = obtenerAnchoFotoConMargen();
  const desplazamientoActual = serviceFotoContainer.scrollLeft;
  const anchoTotalScroll = serviceFotoContainer.scrollWidth;

  let nuevoDesplazamiento;

  if (direccion === "derecha") {
    if (
      desplazamientoActual + serviceFotoContainer.clientWidth >=
      anchoTotalScroll - anchoFoto
    ) {
      nuevoDesplazamiento = 0;
    } else {
      nuevoDesplazamiento = desplazamientoActual + anchoFoto;
    }
  } else if (direccion === "izquierda") {
    if (desplazamientoActual <= 0) {
      nuevoDesplazamiento = anchoTotalScroll - serviceFotoContainer.clientWidth;
    } else {
      nuevoDesplazamiento = desplazamientoActual - anchoFoto;
    }
  }

  serviceFotoContainer.scrollTo({
    left: nuevoDesplazamiento,
    behavior: "smooth",
  });
}

// Manejo de eventos de las flechas (no afecta el botón de derecha)
btnLeftFotos.addEventListener("click", () => {
  console.log("funca");
  moverCarrouselFoto("izquierda"); // Corregido el nombre de la función
});

btnRightFotos.addEventListener("click", () => {
  console.log("funca");
  moverCarrouselFoto("derecha"); // Corregido el nombre de la función
});

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
      const mobile = window.innerWidth <= 737;
      event.preventDefault();
      const idRepuesto = Number(boton.dataset.id);
      const repuesto = bdRepuestos.registroPorId(idRepuesto);
      carrito.agregar(repuesto);
      if (mobile) {
        Toastify({
          text: `Se ha añadido ${repuesto.nombre} ${repuesto.marca} al Carrito`,
          className: "info",
          style: {
            background: "#003459",
            minWidth: "350px",
            transition: "0.8s ease-out",
          },
          offset: {
            x: "0px", // Posición horizontal (0px es centrado)
            y: "90px", // Posición vertical (a partir de 99px desde la parte superior)
          },
        }).showToast();
      } else {
        Toastify({
          text: `se ha añadido ${repuesto.nombre} ${repuesto.marca} al Carrito`,
          className: "info",
          style: {
            background: "#003459",
          },
        }).showToast();
      }
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

  const repuestosPorMarca = bdRepuestos.registrosPorMarca(palabra);
  const repuestosPorCategoria = bdRepuestos.registroPorCategoria(palabra);
  const repuestosPorNombre = bdRepuestos.registroPorNombre(palabra);

  const repuestos = [
    ...new Set([
      ...repuestosPorMarca,
      ...repuestosPorCategoria,
      ...repuestosPorNombre,
    ]),
  ];

  cargarRepuestos(repuestos);
});

const btnLeftRepuestos = document.querySelector(".btnLeftRepuestos");
const btnRightRepuestos = document.querySelector(".btnRightRepuestos");
const repuestosContainer = document.querySelector(".repuestosContainer");

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

function moverCarrouselRepuestos(direccion) {
  const anchoRepuesto = obtenerAnchoRepuestoConMargen();
  if (anchoRepuesto > 0) {
    const desplazamientoActual = repuestosContainer.scrollLeft;
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

class BaseDeDatosEquipos {
  constructor() {
    this.equipos = [];
    this.cargarRegistros();
  }

  async cargarRegistros() {
    const resultado = await fetch("./JSON/productos.json");
    this.equipos = await resultado.json();
    cargarEquipo(this.equipos);
  }

  registrosPorMarca(palabra) {
    return this.equipos.filter(
      (equipo) =>
        equipo.marca.toLowerCase().indexOf(palabra.toLowerCase()) !== -1
    );
  }

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

const equiposElement = document.querySelector("#equipos");

function cargarEquipo(equipos) {
  equiposElement.innerHTML = "";

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
              <i
                class="fa-solid fa-cart-plus agregarCarrito"
                data-id="${equipo.id}"
              ></i>
            </div>
          </div>
        </div>
      </div>
                `;
  }

  const agregarCarrito = document.querySelectorAll(".agregarCarrito");

  for (const boton of agregarCarrito) {
    boton.addEventListener("click", (event) => {
      const mobile = window.innerWidth <= 737;
      event.preventDefault();
      const idEquipo = Number(boton.dataset.id);
      const equipo = bdEquipos.registroPorId(idEquipo);
      carrito.agregar(equipo);
      if (mobile) {
        Toastify({
          text: `Se ha añadido ${equipo.categoria} ${equipo.marca} al Carrito`,
          className: "info",
          style: {
            background: "#003459",
            minWidth: "350px",
            transition: "0.8s ease-out",
          },
          offset: {
            x: "0px", // Posición horizontal (0px es centrado)
            y: "90px", // Posición vertical (a partir de 99px desde la parte superior)
          },
        }).showToast();
      } else {
        Toastify({
          text: `se ha añadido ${equipo.categoria} ${equipo.marca} al Carrito`,
          className: "info",
          style: {
            background: "#003459",
          },
        }).showToast();
      }
    });
  }
  verificarCantidadEquipos();
}

function noHayEquipos(categoria) {
  equiposElement.innerHTML = `
  <div class="noHayEquipos">
    <p>No hay ${categoria} disponibles</p>
  </div>
  `;
}

const bdEquipos = new BaseDeDatosEquipos();

const inputBuscadorEquipos = document.querySelector("#inputBuscadorEquipos");

inputBuscadorEquipos.addEventListener("input", (event) => {
  event.preventDefault();
  const palabra = inputBuscadorEquipos.value;

  const equiposPorMarca = bdEquipos.registrosPorMarca(palabra);
  const equiposPorCategoria = bdEquipos.registroPorCategoria(palabra);

  const equipos = [...new Set([...equiposPorMarca, ...equiposPorCategoria])];

  cargarEquipo(equipos);
});

const btnLeftEquipos = document.querySelector(".btnLeftEquipos");
const btnRightEquipos = document.querySelector(".btnRightEquipos");
const equiposContainer = document.querySelector(".equiposContainer");

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

function moverCarrousel(direccion) {
  const anchoEquipo = obtenerAnchoEquipoConMargen();
  if (anchoEquipo > 0) {
    const desplazamientoActual = equiposContainer.scrollLeft;
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

btnLeftEquipos.addEventListener("click", () => moverCarrousel("izquierda"));
btnRightEquipos.addEventListener("click", () => moverCarrousel("derecha"));

verificarCantidadEquipos();

const btnCategoriaEquipos = document.querySelectorAll(".btnCategoriaEquipos");

btnCategoriaEquipos.forEach((boton) => {
  boton.addEventListener("click", () => {
    const categoria = boton.dataset.categoria;

    const equipos = bdEquipos.registroPorCategoria(boton.dataset.categoria);
    if (equipos.length > 0) {
      cargarEquipo(equipos);
    } else {
      noHayEquipos(categoria);
    }
    console.log("funca");
  });
});

function carritoVacio() {
  const carritoContainer = document.getElementById("carrito");

  if (carritoContainer) {
    carritoContainer.innerHTML = `
    <div class="noHayProductos">
    <p>No hay productos en el carrito.</p>
    </div>
    `;
  }

  const comprarContainer = document.querySelector(".comprarContainer");

  comprarContainer.style.display = "none";
}

carritoVacio();

const divCarrito = document.querySelector("#carrito");

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
    if (!producto) return;

    const productoEnCarrito = this.estaEnCarrito(producto);

    if (!productoEnCarrito) {
      this.carrito.push({ ...producto, cantidad: 1 });
    } else {
      productoEnCarrito.cantidad++;
    }

    console.log(producto);
    this.listar();
  }
  quitar(id) {
    const indice = this.carrito.findIndex((producto) => producto.id === id);

    if (indice !== -1 && this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
    } else if (indice !== -1) {
      this.carrito.splice(indice, 1);
    }

    if (this.carrito.length === 0) {
      this.total = 0;
      this.cantidadProductos = 0;

      const totalCarrito = document.getElementById("totalCarrito");

      if (totalCarrito) {
        totalCarrito.innerHTML = `$0`;
      }

      carritoVacio();
    } else {
      this.listar();
    }

    const cantidadCartElements = document.querySelectorAll(".cantidadCart");
    for (const elemento of cantidadCartElements) {
      elemento.innerHTML = this.cantidadProductos;
    }
  }

  listar() {
    this.total = 0;
    this.cantidadProductos = 0;
    divCarrito.innerHTML = "";

    for (const producto of this.carrito) {
      divCarrito.innerHTML += `
          <div class="productoContainer">
            <div class="productoImgContainer">
              <img src="${producto.img}" alt="${producto.nombre}" />
            </div>
            <div class="productoDetailContainer">
              <div class="productoDetailContainerMobile">
                <div class="bloque01">
                  <div class="productoNombreContainer">
                    <p class="productoNombre">${
                      producto.nombre || producto.categoria
                    }</p>
                    <div class="productoMarcaModelo">
                      <p class="marca">${producto.marca}</p>
                      <p class="modelo">${producto.modelo}</p>
                    </div>
                  </div>
                  <div class="productoDescrip">
                    <p>${producto.descripcion}</p>
                  </div>
                </div>
                <div class="bloque02">
                  <div class="productosUnidadesContainer">
                    <div class="productoUnidades">
                      <i class="fa-solid fa-circle-minus" data-id="${
                        producto.id
                      }"></i>
                      <p>${producto.cantidad}</p>
                      <i
                        class="fa-solid fa-circle-plus"
                        data-id="${producto.id}"
                      ></i>
                    </div>
                  </div>
                  <div class="productoPrecioContainer">
                  <div class="productoPrecio">
                    <p>$ ${producto.precio.toLocaleString("es-ES")}</p>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

      `;
      this.total += producto.precio * producto.cantidad;
      this.cantidadProductos += producto.cantidad;
    }

    if (totalCarrito) {
      totalCarrito.innerHTML = `$${this.total.toLocaleString("es-ES")}`;
    }

    const cantidadCartElements = document.querySelectorAll(".cantidadCart");
    for (const elemento of cantidadCartElements) {
      elemento.innerHTML = this.cantidadProductos;
    }

    const quitarCarrito = document.querySelectorAll(".fa-circle-minus");
    const agregarCarrito = document.querySelectorAll(".fa-circle-plus");

    for (const boton of agregarCarrito) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        const idRepuesto = Number(boton.dataset.id);
        const repuesto = bdRepuestos.registroPorId(idRepuesto);
        carrito.agregar(repuesto);
        const idEquipo = Number(boton.dataset.id);
        const equipo = bdEquipos.registroPorId(idEquipo);
        carrito.agregar(equipo);
      });
    }

    for (const boton of quitarCarrito) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        const idProducto = Number(boton.dataset.id);
        this.quitar(idProducto);
      });
    }

    const comprarContainer = document.querySelector(".comprarContainer");

    comprarContainer.style.display = "flex";
  }
}

const carrito = new Carrito();
