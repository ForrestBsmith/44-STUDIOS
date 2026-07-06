const blogContainer = document.getElementById("blog-post");
const prevBtn = document.getElementById("prev-post");
const nextBtn = document.getElementById("next-post");

const params = new URLSearchParams(window.location.search);
const postId = parseInt(params.get("id"), 10);

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

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function renderTags(tags = []) {
  if (!tags.length) return "";
  return tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("");
}

fetch(resolvePostJsonPath())
  .then(res => res.json())
  .then(data => {
    const posts = data.posts;
    const post = posts.find(p => p.id === postId) || posts[0];

    const ctaHref = post.ctaHref || "/contact";
    const ctaAttrs = ctaHref.startsWith("http") ? "target='_blank' rel='noopener'" : "";

    document.title = `${post.title} | 44 Studios Build Notes`;

    blogContainer.innerHTML = `
      <article class="single-post-shell">
        <header class="single-hero">
          <div class="single-hero-copy">
            <a class="single-back-link" href="/blog">Blog Index</a>
            <p class="single-eyebrow">${escapeHtml(post.eyebrow || post.category || "Build Notes")}</p>
            <h1>${escapeHtml(post.title)}</h1>
            <p class="single-summary">${escapeHtml(post.summary || "")}</p>
            <div class="single-meta-grid" aria-label="Post details">
              <div>
                <span>Published</span>
                <strong>${formatDate(post.date)}</strong>
              </div>
              <div>
                <span>Read Time</span>
                <strong>${escapeHtml(post.readTime || "4 min read")}</strong>
              </div>
              <div>
                <span>Capability</span>
                <strong>${escapeHtml(post.category || "Build Notes")}</strong>
              </div>
            </div>
          </div>
          <figure class="single-hero-media">
            <img src="${post.image}" alt="${escapeHtml(post.title)}">
          </figure>
        </header>

        <div class="single-body-layout">
          <aside class="single-brief" aria-label="Post brief">
            <div>
              <span class="brief-label">Useful For</span>
              <strong>${escapeHtml(post.relatedService || "Digital build planning")}</strong>
            </div>
            <div>
              <span class="brief-label">Core Value</span>
              <strong>${escapeHtml(post.stat || "Clearer digital operations")}</strong>
            </div>
            <div class="single-tag-stack">
              ${renderTags(post.tags)}
            </div>
            <a class="single-cta" href="${escapeHtml(ctaHref)}" ${ctaAttrs}>
              ${escapeHtml(post.ctaLabel || "Start A Build")}
            </a>
          </aside>
          <div class="blog-card-content single-article">
            ${post.content}
          </div>
        </div>
      </article>
    `;

    const currentIndex = posts.findIndex(p => p.id === post.id);
    if (currentIndex > 0) {
      prevBtn.href = `/blog/post?id=${posts[currentIndex - 1].id}`;
      prevBtn.textContent = `<- ${posts[currentIndex - 1].title}`;
    } else {
      prevBtn.style.display = "none";
    }

    if (currentIndex < posts.length - 1) {
      nextBtn.href = `/blog/post?id=${posts[currentIndex + 1].id}`;
      nextBtn.textContent = `${posts[currentIndex + 1].title} ->`;
    } else {
      nextBtn.style.display = "none";
    }
  })
  .catch(err => console.error("Error loading post:", err));
