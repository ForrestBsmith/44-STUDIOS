function resolvePostJsonPath() {
  const path = window.location.pathname;
  const segments = path.split("/").filter(Boolean);
  if (!path.endsWith("/")) {
    const last = segments[segments.length - 1] || "";
    if (last.includes(".")) segments.pop();
  }
  const depth = segments.length;
  const prefix = depth ? "../".repeat(depth) : "./";
  return `${prefix}post.json`;
}

fetch(resolvePostJsonPath())
  .then(res => res.json())
  .then(data => {
    const recentContainer = document.getElementById("recent-posts");
    const socialContainer = document.getElementById("social-links");
    const socials = data.socials;

    // Get latest 4 posts by ID
    const posts = data.posts.slice().sort((a,b) => b.id - a.id);

    recentContainer.innerHTML = "";
    posts.forEach(p => {
      recentContainer.innerHTML += `<a href="/blog/post?id=${p.id}" class="d-block mb-2 sidebartext">${p.title}</a>`;
    });

    socialContainer.innerHTML = `
      <a href="${socials.instagram}" target="_blank">Facebook</a>
      <a href="${socials.linkedin}" target="_blank">LinkedIn (Forrest @ Fortyfour Studios)</a>
      <a href="${socials.twitter}" target="_blank">X (Twitter)</a>
    `;

    // Highlight current post if on blog detail page
    const urlParams = new URLSearchParams(window.location.search);
    const currentId = parseInt(urlParams.get("id"));
    if(currentId){
      document.querySelectorAll("#recent-posts a").forEach(a => {
        if(a.href.includes(`id=${currentId}`)){
          a.classList.add("fw-bold","text-warning");
        }
      });
    }
  })
  .catch(err => console.error("Error loading sidebar:", err));
