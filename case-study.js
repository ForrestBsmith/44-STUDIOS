// Get project name from URL query parameter
function getProjectName() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('project') || 'default';
}

// Load JSON dynamically based on project name
const projectName = getProjectName();
const jsonFile = `data/${projectName}.json`;

fetch(jsonFile)
  .then(response => {
    if (!response.ok) throw new Error('Project data not found');
    return response.json();
  })
  .then(projectData => {
    document.getElementById("project-title").innerText = projectData.title;
    document.getElementById("project-tagline").innerText = projectData.tagline;
    document.getElementById("project-mockup").src = projectData.mockup;

    document.getElementById("live-site-link").innerHTML = `
      <a href="${projectData.liveSiteURL}" target="_blank" class="text-decoration-none text-black">
        <i class="bi bi-box-arrow-up-right me-1"></i>${projectData.liveSiteText}
      </a>`;

    document.getElementById("overview-text").innerHTML = projectData.overview.map(p => `<p>${p}</p>`).join("");
    document.getElementById("overview-highlights").innerHTML = projectData.overviewHighlights.map(item => `<li><i class="bi bi-check-circle text-primary me-2"></i>${item}</li>`).join("");

    document.getElementById("technologies").innerHTML = projectData.technologies.map(tech => `<span class="badge bg-primary me-2">${tech}</span>`).join("");
    document.getElementById("key-highlights").innerHTML = projectData.keyHighlights.map(item => `<li class="bi bi-check-circle"> ${item}</li>`).join("");

    document.getElementById("gallery").innerHTML = projectData.gallery.map(img => `
      <div class="col-md-4">
        <a href="${img.src}" class="gallery-item" title="${img.alt}">
          <img src="${img.src}" class="img-fluid rounded shadow" alt="${img.alt}">
        </a>
      </div>
    `).join("");

    document.getElementById("process-steps").innerHTML = projectData.process.map(step => `
      <div class="col-md-6 col-lg-3">
        <div class="card bg-dark text-white border-0 h-100 shadow-sm p-4 text-center">
          <div class="mb-3">
            <div class="rounded-circle bg-white bg-opacity-95 d-inline-flex align-items-center justify-content-center" style="width:70px; height:70px;">
              <i class="bi ${step.icon} fs-3 text-${step.color}"></i>
            </div>
          </div>
          <h5 class="fw-bold mb-2">${step.step}</h5>
          <p class="small opacity-75">${step.text}</p>
        </div>
      </div>
    `).join("");

    document.getElementById("client-impact").innerHTML = `
      <p>${projectData.clientImpact.text}</p>
      <blockquote class="blockquote mt-4">
        <p class="mb-1">"${projectData.clientImpact.testimonial.quote}"</p>
        <footer class="blockquote-footer mt-1 text-white-50">${projectData.clientImpact.testimonial.author}</footer>
      </blockquote>`;

    document.getElementById("related-projects").innerHTML = projectData.relatedProjects.map(proj => `
      <div class="col-md-4">
        <a href="${proj.url}?project=${proj.url.split('.html')[0]}" class="text-decoration-none text-white">
          <div class="card bg-dark border-0 text-white">
            <img src="${proj.image}" class="card-img-top rounded" alt="${proj.title}">
            <div class="card-body">
              <h5 class="card-title">${proj.title}</h5>
              <p class="card-text">${proj.summary}</p>
            </div>
          </div>
        </a>
      </div>
    `).join("");

    // Initialize gallery lightbox
    new SimpleLightbox('.gallery a', { captions: true, captionDelay: 200, animationSlide: true, close: true });

  })
  .catch(error => {
    console.error("Error loading project data:", error);
    document.querySelector(".container").innerHTML = "<p class='text-center text-danger'>Project not found.</p>";
  });
