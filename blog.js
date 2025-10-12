const POSTS_PER_PAGE = 4;
let currentPage = 1;

fetch("post.json")
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

      pagePosts.forEach(post => {
        blogContainer.innerHTML += `
          <div class="col">
            <div class="blog-card">
              <img src="${post.image}" alt="${post.title}">
              <div class="blog-card-body">
                <h5 class="blog-card-title">${post.title}</h5>
                <p class="blog-card-text">${post.excerpt}</p>
                <a href="single.html?id=${post.id}" class="read-btn border rounded">Read More</a>
              </div>
            </div>
          </div>
        `;
      });

      renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
      paginationContainer.innerHTML = `
        <nav>
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
          if (e.target.dataset.page) currentPage = parseInt(e.target.dataset.page);
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
