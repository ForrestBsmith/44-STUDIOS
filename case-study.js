// Get project name from URL query parameter
function getProjectName() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("project") || "default";
}

const projectName = getProjectName();
const jsonFile = `data/${projectName}.json`;

fetch(jsonFile)
  .then(response => {
    if (!response.ok) throw new Error("Project data not found");
    return response.json();
  })
  .then(projectData => {
    // --- Basic Info ---
    document.getElementById("project-title").innerText = projectData.title;
    document.getElementById("project-tagline").innerText = projectData.tagline;
    document.getElementById("project-mockup").src = projectData.mockup;
    document.getElementById("project-description").innerText = projectData.description;

    document.getElementById("live-site-link").innerHTML = `
      <a href="${projectData.liveSiteURL}" target="_blank" class="text-decoration-none text-white">
        <i class="bi bi-box-arrow-up-right me-1"></i>${projectData.liveSiteText}
      </a>`;

    // --- Overview Highlights ---
    document.getElementById("overview-highlights").innerHTML = projectData.overviewHighlights
      .map((item, i) => `
        <li class="d-flex align-items-start mb-2 fade-up" style="transition-delay:${i*100}ms">
          <i class="bi bi-check-circle-fill text-primary me-2"></i>
          <span>${item}</span>
        </li>`).join("");

    // --- Technologies ---
    document.getElementById("technologies").innerHTML = projectData.technologies
      .map(tech => `<span class="badge bg-primary bg-opacity-75 text-light me-2 mb-2 px-3 py-2 shadow-sm">${tech}</span>`)
      .join("");

    // --- Key Highlights ---
    document.getElementById("key-highlights").innerHTML = projectData.keyHighlights
      .map((item, i) => `
        <li class="d-flex align-items-start mb-2 fade-up" style="transition-delay:${i*100}ms">
          <i class="bi bi-check-circle-fill text-primary me-2"></i>
          <span>${item}</span>
        </li>`).join("");

    // --- Gallery ---
    document.getElementById("gallery").innerHTML = projectData.gallery
      .map((img, i) => `
        <div class="col-md-4 fade-up" style="transition-delay:${i*100}ms">
          <a href="${img.src}" class="gallery-item d-block overflow-hidden rounded" title="${img.alt}">
            <img src="${img.src}" class="img-fluid rounded shadow-sm border border-dark-subtle gallery-img" alt="${img.alt}">
          </a>
        </div>`).join("");

    // --- Process Steps ---
    document.getElementById("process-steps").innerHTML = projectData.process
      .map((step, i) => `
        <div class="col-md-6 col-lg-3 fade-up" style="transition-delay:${i*150}ms">
          <div class="card text-white border-0 h-100 shadow-sm p-4 text-center" style="background: linear-gradient(145deg, #111, #1a1a1a);">
            <div class="mb-3">
              <div class="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center" style="width:70px; height:70px;">
                <i class="bi ${step.icon} fs-3 text-${step.color}"></i>
              </div>
            </div>
            <h5 class="fw-bold mb-2">${step.step}</h5>
            <p class="small text-light opacity-75">${step.text}</p>
          </div>
        </div>`).join("");

    // --- Client Impact ---
    document.getElementById("client-impact").innerHTML = `
      <p>${projectData.clientImpact.text}</p>
      <blockquote class="blockquote mt-4">
        <p class="mb-1">"${projectData.clientImpact.testimonial.quote}"</p>
        <footer class="blockquote-footer mt-1 text-white-50">${projectData.clientImpact.testimonial.author}</footer>
      </blockquote>`;

    // --- Related Projects with direction-aware arrows ---
    document.getElementById("related-projects").innerHTML = projectData.relatedProjects
      .map((proj, i) => {
        // Determine arrow direction based on column: left (1st), middle, right
        let arrowIcon;
        if (i % 3 === 0) arrowIcon = "bi-arrow-left-circle";       // Left column
        else arrowIcon = "bi-arrow-right-circle";                  // Middle & right

        return `
          <div class="col-md-4 fade-up" style="transition-delay:${i*100}ms">
            <a href="${proj.url}" class="text-decoration-none text-white">
              <div class="card bg-dark border-0 text-white overflow-hidden related-card h-100">
                <div class="card-img-wrapper position-relative">
                  <img src="${proj.image}" class="card-img-top rounded" alt="${proj.title}">
                  <div class="overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                    <i class="bi ${arrowIcon} fs-1 text-white"></i>
                  </div>
                </div>
                <div class="card-body">
                  <h5 class="card-title">${proj.title}</h5>
                  <p class="card-text text-secondary mb-0">${proj.summary}</p>
                </div>
              </div>
            </a>
          </div>`;
      }).join("");

    // --- Lightbox ---
    new SimpleLightbox(".gallery a", {
      captions: true,
      captionDelay: 0,          // remove caption delay
      animationSlide: false,    // disable slide animation
      animationSpeed: 0,        // no slide duration
      fadeSpeed: 0,             // no fade between items
      close: true,
    });

    // --- Intersection Observer for fade-up animations ---
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));

  })
  .catch(err => {
    console.error("Error loading project data:", err);
    document.querySelector(".container").innerHTML =
      "<p class='text-center text-danger'>Project not found.</p>";
  });
