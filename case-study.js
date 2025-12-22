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
    const mockupTabNav = document.getElementById("mockupTabNav");
    const mockupTabContent = document.getElementById("mockupTabContent");
    const fallbackHighlights = projectData.keyHighlights || [];
    const fallbackTech = projectData.technologies || [];
    const mockups = (projectData.mockups || (projectData.gallery || []).slice(0,3).map((img, i) => ({
      src: img.src,
      alt: img.alt || `View ${i+1}`,
      label: img.label || `View ${i+1}`,
      description: projectData.overview?.[i] || projectData.description || "",
      highlights: fallbackHighlights.slice(i*3, i*3 + 3),
      tools: fallbackTech
    }))).map(m => ({
      ...m,
      highlights: m.highlights && m.highlights.length ? m.highlights : fallbackHighlights.slice(0,3),
      tools: m.tools && m.tools.length ? m.tools : fallbackTech
    }));
    mockupTabNav.innerHTML = mockups.map((m, i) => `
      <li class="nav-item" role="presentation">
        <button class="nav-link ${i===0 ? "active" : ""}" id="mockup-tab-${i}" data-bs-toggle="pill" data-bs-target="#mockup-pane-${i}" type="button" role="tab" aria-controls="mockup-pane-${i}" aria-selected="${i===0}">
          ${m.label}
        </button>
      </li>`).join("");
    mockupTabContent.innerHTML = mockups.map((m, i) => `
      <div class="tab-pane fade ${i===0 ? "show active" : ""} mockup-pane" id="mockup-pane-${i}" role="tabpanel" aria-labelledby="mockup-tab-${i}">
        <img src="${m.src}" alt="${m.alt}">
      </div>`).join("");
    const mockupDescriptionEl = document.getElementById("mockup-description");
    const mockupBulletsEl = document.getElementById("mockup-bullets");
    const mockupTechEl = document.getElementById("mockup-tech");

    const setMockupDetail = index => {
      const detail = mockups[index] || mockups[0];
      if(!detail) return;
      mockupDescriptionEl.textContent = detail.description || projectData.description || "";
      mockupBulletsEl.innerHTML = (detail.highlights || fallbackHighlights)
        .map(item => `<li>${item}</li>`).join("") || "<li>No highlights provided.</li>";
      mockupTechEl.innerHTML = (detail.tools || fallbackTech)
        .map(tool => `<span class="badge">${tool}</span>`).join("");
    };

    document.querySelectorAll("#mockupTabNav .nav-link").forEach((btn, idx) => {
      btn.addEventListener("shown.bs.tab", () => setMockupDetail(idx));
    });
    setMockupDetail(0);
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

    // --- Meta Data ---
    document.getElementById("meta-client").innerText = projectData.clientName || "—";
    document.getElementById("meta-field").innerText = projectData.businessField || "—";
    document.getElementById("meta-location").innerText = projectData.location || "—";
    document.getElementById("meta-turnaround").innerText = projectData.turnaround || "—";
    document.getElementById("meta-tags").innerHTML = (projectData.technologies || [])
      .map(tech => `<span class="badge">${tech}</span>`)
      .join("");

    const overviewCopy = projectData.overview || [];
    document.getElementById("challenge-copy").innerText = overviewCopy[0] || projectData.description || "";
    document.getElementById("solution-copy").innerText = overviewCopy[1] || overviewCopy[0] || "";
    const impactText = projectData.clientImpact?.text || "";
    document.getElementById("result-copy").innerText = impactText;

    // --- Technologies ---
    document.getElementById("technologies").innerHTML = projectData.technologies
      .map(tech => `<span class="badge bg-primary bg-opacity-75 text-light me-2 mb-2 px-3 py-2 shadow-sm">${tech}</span>`)
      .join("");

    // --- Experience Layers ---
    document.getElementById("feature-grid").innerHTML = (projectData.keyHighlights || [])
      .map((item, i) => `
        <div class="col-md-6 col-lg-4 fade-up" style="transition-delay:${i*80}ms">
          <div class="feature-card h-100">
            <span class="feature-index">${String(i + 1).padStart(2, "0")}</span>
            <p class="mb-0 mt-2">${item}</p>
          </div>
        </div>`).join("");

    // --- Gallery ---
    document.getElementById("gallery").innerHTML = projectData.gallery
      .map((img, i) => `
        <div class="col-md-4 fade-up" style="transition-delay:${i*100}ms">
          <a href="${img.src}" class="gallery-item d-block overflow-hidden rounded" title="${img.alt}">
            <img src="${img.src}" class="img-fluid rounded shadow-sm border border-dark-subtle gallery-img" alt="${img.alt}">
          </a>
        </div>`).join("");

    // --- Client Impact ---
    const quote = projectData.clientImpact?.testimonial?.quote || "";
    const author = projectData.clientImpact?.testimonial?.author || "";
    document.getElementById("client-impact").innerHTML = `
      <div class="impact-card">
        <div>
          <p class="impact-label">Outcome</p>
          <p class="mb-0">${impactText}</p>
        </div>
        <div class="impact-quote">
          <p class="fst-italic mb-2">"${quote}"</p>
          <p class="text-secondary">${author}</p>
        </div>
      </div>`;

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
