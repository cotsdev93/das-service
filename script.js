// NAV ANIMACIONES ENTRADA Y SALIDA
document.querySelectorAll("nav li").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    const sectionId = e.target.closest("li").getAttribute("data-section");
    const newActiveSection = document.getElementById(`section${sectionId}`);
    const currentActiveSection = document.querySelector(".section.active");

    // if (newActiveSection === currentActiveSection) {
    //   return; // Si es la misma sección, no hace nada.
    // }

    // Añadir clase para animar la salida de la sección actual.
    if (currentActiveSection) {
      currentActiveSection.classList.remove("active");
      currentActiveSection.classList.add("exit-left");
    }

    // Esperar 500ms antes de activar la entrada de la nueva sección.
    setTimeout(() => {
      newActiveSection.classList.add("enter-right");
    }, 500); // La nueva sección entra cuando la actual está a mitad de su animación.

    // Esperar hasta que la animación de salida termine antes de activar la nueva sección.
    setTimeout(() => {
      if (currentActiveSection) {
        currentActiveSection.classList.remove("exit-left");
      }
      newActiveSection.classList.remove("enter-right");
      newActiveSection.classList.add("active");
    }, 1500); // La duración debe coincidir con la duración de la animación.
  });
});

// CLIENTES
const placeId = "ChIJbfOMr3PIvJURJ2vXCwQqGzI";
const apiKey = "AIzaSyB2qQJFxptyNJyBkyQD1bzZHg-sr3V07Tw";

async function getGoogleReviews() {
  try {
    const response = await fetch("http://localhost:3000/google-reviews");
    const data = await response.json();

    console.log(data); // Verifica la estructura de la respuesta

    const reviews = data.result?.reviews; // Accede a las reseñas dentro de data.result
    if (reviews && Array.isArray(reviews)) {
      const reviewsElement = document.getElementById("reviews");
      reviewsElement.innerHTML = ""; // Limpiar contenido anterior

      reviews.forEach((review) => {
        const reviewElement = document.createElement("p");
        reviewElement.textContent = review.text;
        reviewsElement.appendChild(reviewElement);
      });
    } else {
      console.error("No se encontraron reseñas.");
    }
  } catch (error) {
    console.error("Error al obtener las calificaciones:", error);
  }
}

// document.getElementById("reviews").innerHTML = "Some content";

// Función para inicializar y cargar la API de Google Maps y Places
function initMap() {
  async function getPlaceDetails(Place) {
    try {
      // Crea una nueva instancia de Place usando el Place ID.
      const place = new google.maps.places.Place({
        id: "ChIJbfOMr3PIvJURJ2vXCwQqGzI",
        requestedLanguage: "en",
      });

      // Llama a fetchFields, pasando los campos de datos deseados.
      await place.fetchFields({ fields: ["displayName", "formattedAddress"] });

      // Verifica si los campos están definidos.
      if (place.displayName && place.formattedAddress) {
        console.log("Nombre del lugar:", place.displayName);
        console.log("Dirección formateada:", place.formattedAddress);
      } else {
        console.error(
          "No se encontraron detalles para el Place ID proporcionado."
        );
      }
    } catch (error) {
      console.error("Error al obtener los detalles del lugar:", error);
    }
  }

  // Llama a la función y verifica el resultado
  getPlaceDetails(google.maps.places.Place);
}
// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  initMap();
  getGoogleReviews();
});
