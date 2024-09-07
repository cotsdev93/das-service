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
//  api key AIzaSyCp87SnpuaNwzEwtKyl_8A_ATvK0-cCiss

async function getGoogleReviews() {
  const placeId = "ChIJbfOMr3PIvJURJ2vXCwQqGzI"
  const apiKey = "AIzaSyCp87SnpuaNwzEwtKyl_8A_ATvK0-cCiss"

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,reviews&key=${apiKey}`;
}