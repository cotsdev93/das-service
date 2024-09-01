document.querySelectorAll("nav li").forEach((item) => {
    item.addEventListener("click", (e) => {

      e.preventDefault(); // Evita que el enlace recargue la página
  
      // Obtener el ID de la sección que se debe mostrar
      const sectionId = e.target.closest("li").getAttribute("data-section");
  
      // Remover la clase 'active' de la sección actualmente visible
      document.querySelector(".section.active").classList.remove("active");
  
      // Agregar la clase 'active' a la nueva sección
      document.getElementById(`section${sectionId}`).classList.add("active");
  
      // Mover el contenedor al porcentaje adecuado para crear el efecto de carrusel
    //   document.querySelector(".sectionsContainer").style.transform = `translateX(-${(sectionId - 1) * 100}%)`;
      console.log("funca")
    });
  });
  