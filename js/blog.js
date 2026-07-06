const POSTS_PER_PAGE = 4;
let currentPage = 1;

function resolvePostJsonPath() {
  const path = window.location.pathname;
  const segments = path.split("/").filter(Boolean);
  if (!path.endsWith("/")) {
    const last = segments[segments.length - 1] || "";
    if (last.includes(".")) segments.pop();
  }
  const depth = segments.length;
  const prefix = depth ? "../".repeat(depth) : "./";
  return `${prefix}post.json?v=20260706b`;
}

function escapeHtml(value = "") {
  return value
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function stripHtml(value = "") {
  const temp = document.createElement("div");
  temp.innerHTML = value;
  return temp.textContent || temp.innerText || "";
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function renderTags(tags = []) {
  if (!tags.length) return "";
  return `
    <div class="blog-card-tags">
      ${tags.slice(0, 3).map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}
    </div>
  `;
}

const postJsonPath = resolvePostJsonPath();

fetch(postJsonPath)
  .then(res => res.json())
  .then(data => {
    const posts = data.posts;
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

    const blogContainer = document.getElementById("blog-container");
    const paginationContainer = document.getElementById("pagination");

    function renderPosts(page) {
      blogContainer.innerHTML = "";
      const start = (page - 1) * POSTS_PER_PAGE;
      const end = start + POSTS_PER_PAGE;
      const pagePosts = posts.slice(start, end);

      pagePosts.forEach((post, index) => {
        const summary = post.summary || stripHtml(post.excerpt).slice(0, 170);
        const isFeatured = page === 1 && index === 0;

        blogContainer.innerHTML += `
          <div class="col ${isFeatured ? "blog-featured-col" : ""}">
            <article class="blog-card ${isFeatured ? "blog-card-featured" : ""}">
              <a href="/blog/post?id=${post.id}" class="blog-card-media" aria-label="Read ${escapeHtml(post.title)}">
                <img src="${post.image}" alt="${escapeHtml(post.title)}" loading="lazy">
              </a>
              <div class="blog-card-body">
                <div class="blog-card-meta">
                  <span>${escapeHtml(post.category || "Build Notes")}</span>
                  <span>${escapeHtml(post.readTime || "")}</span>
                </div>
                <h2 class="blog-card-title">${escapeHtml(post.title)}</h2>
                <p class="blog-card-summary">${escapeHtml(summary)}</p>
                ${renderTags(post.tags)}
                <div class="blog-card-footer">
                  <span>${formatDate(post.date)}</span>
                  <a href="/blog/post?id=${post.id}" class="read-btn">Read Brief</a>
                </div>
              </div>
            </article>
          </div>
        `;
      });

      renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
      paginationContainer.innerHTML = `
        <nav aria-label="Blog pagination">
          <ul class="pagination justify-content-center mb-0">
            <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
              <a class="page-link" href="#" id="prev">Previous</a>
            </li>
            ${Array.from({ length: totalPages }, (_, i) => `
              <li class="page-item ${i + 1 === currentPage ? "active" : ""}">
                <a class="page-link" href="#" data-page="${i + 1}">${i + 1}</a>
              </li>
            `).join("")}
            <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
              <a class="page-link" href="#" id="next">Next</a>
            </li>
          </ul>
        </nav>
      `;

      document.querySelectorAll(".page-link").forEach(link => {
        link.addEventListener("click", e => {
          e.preventDefault();
          if (e.target.dataset.page) currentPage = parseInt(e.target.dataset.page, 10);
          else if (e.target.id === "prev" && currentPage > 1) currentPage--;
          else if (e.target.id === "next" && currentPage < totalPages) currentPage++;
          renderPosts(currentPage);
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      });
    }

    renderPosts(currentPage);
  })
  .catch(err => console.error("Error loading posts:", err));
