document.querySelectorAll("nav li").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    const sectionId = e.target.closest("li").getAttribute("data-section");
    const newActiveSection = document.getElementById(`section${sectionId}`);
    const currentActiveSection = document.querySelector(".section.active");

    if (newActiveSection === currentActiveSection) {
      return; // Si la nueva sección es la misma que la actual, no hace nada.
    }

    // Añadir clase para animar la salida de la sección actual.
    if (currentActiveSection) {
      currentActiveSection.classList.remove("active");
      currentActiveSection.classList.add("exit-left");
    }

    // Añadir clase para preparar la entrada de la nueva sección.
    newActiveSection.classList.add("enter-right");

    // Esperar a que la animación de salida termine antes de activar la nueva sección.
    setTimeout(() => {
      if (currentActiveSection) {
        currentActiveSection.classList.remove("exit-left");
      }
      newActiveSection.classList.remove("enter-right");
      newActiveSection.classList.add("active");
    }, 1000); // La duración debe coincidir con la duración de la transición en CSS.
  });
});
