document.querySelectorAll("nav li").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    const sectionId = e.target.closest("li").getAttribute("data-section");
    const newActiveSection = document.getElementById(`section${sectionId}`);
    const currentActiveSection = document.querySelector(".section.active");

    if (newActiveSection === currentActiveSection) {
      return; // Si es la misma sección, no hace nada.
    }

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
    }, 4000); // La duración debe coincidir con la duración de la animación.
  });
});

// BASE DE DATOS

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

  traerRegistros() {
    return this.productos;
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

const btnLeft = document.querySelector(".btnLeft");
const btnRight = document.querySelector(".btnRight");
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
    btnLeft.style.display = "none";
    btnRight.style.display = "none";
  } else {
    btnLeft.style.display = "block";
    btnRight.style.display = "block";
  }
}

// Event listeners para los botones
btnLeft.addEventListener("click", () => moverCarrousel("izquierda"));
btnRight.addEventListener("click", () => moverCarrousel("derecha"));

verificarCantidadProductos();

const btnCategoria = document.querySelectorAll(".btnCategoria");

btnCategoria.forEach((boton) => {
  boton.addEventListener("click", () => {
    const categoria = boton.dataset.categoria;

    const productos = bdProductos.registroPorCategoria(boton.dataset.categoria);
    cargarProductos(productos);
  });
});

// CLIENTES
// const placeId = "ChIJbfOMr3PIvJURJ2vXCwQqGzI";
// const apiKey = "AIzaSyB2qQJFxptyNJyBkyQD1bzZHg-sr3V07Tw";

// async function getGoogleReviews() {
//   try {
//     const response = await fetch("http://localhost:3000/google-reviews");
//     const data = await response.json();

//     console.log(data); // Verifica la estructura de la respuesta

//     const reviews = data.result?.reviews; // Accede a las reseñas dentro de data.result
//     if (reviews && Array.isArray(reviews)) {
//       const reviewsElement = document.getElementById("reviews");
//       reviewsElement.innerHTML = ""; // Limpiar contenido anterior

//       reviews.forEach((review) => {
//         const reviewElement = document.createElement("p");
//         reviewElement.textContent = review.text;
//         reviewsElement.appendChild(reviewElement);
//       });
//     } else {
//       console.error("No se encontraron reseñas.");
//     }
//   } catch (error) {
//     console.error("Error al obtener las calificaciones:", error);
//   }
// }

// function initMap() {
//   async function getPlaceDetails(Place) {
//     try {
//       // Crea una nueva instancia de Place usando el Place ID.
//       const place = new google.maps.places.Place({
//         id: "ChIJbfOMr3PIvJURJ2vXCwQqGzI",
//         requestedLanguage: "en",
//       });

//       // Llama a fetchFields, pasando los campos de datos deseados.
//       await place.fetchFields({ fields: ["displayName", "formattedAddress"] });

//       // Verifica si los campos están definidos.
//       if (place.displayName && place.formattedAddress) {
//         console.log("Nombre del lugar:", place.displayName);
//         console.log("Dirección formateada:", place.formattedAddress);
//       } else {
//         console.error(
//           "No se encontraron detalles para el Place ID proporcionado."
//         );
//       }
//     } catch (error) {
//       console.error("Error al obtener los detalles del lugar:", error);
//     }
//   }

//   // Llama a la función y verifica el resultado
//   getPlaceDetails(google.maps.places.Place);
// }

// // Espera a que el DOM esté completamente cargado
// document.addEventListener("DOMContentLoaded", function () {
//   initMap();
//   getGoogleReviews();
// });

// EQUIPOS
