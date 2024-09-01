document.querySelectorAll("nav li").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    const sectionId = e.target.closest("li").getAttribute("data-section");
    const newActiveSection = document.getElementById(`section${sectionId}`);
    const currentActiveSection = document.querySelector(".section.active");

    if (newActiveSection === currentActiveSection) {
      return;
    }

    if (currentActiveSection) {
      currentActiveSection.classList.remove("active");
    }

    document.querySelector(
      ".sectionsContainer"
    ).style.transform = `translateX(-${(sectionId - 1) * 100}vw)`;

    setTimeout(() => {
      const newActiveSection = document.getElementById(`section${sectionId}`);
      if (newActiveSection) {
        newActiveSection.classList.add("active");
      }
    }, 100);
  });
});
