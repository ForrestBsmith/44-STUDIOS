const blogContainer = document.getElementById("blog-post");
const prevBtn = document.getElementById("prev-post");
const nextBtn = document.getElementById("next-post");

// Get post ID from URL
const params = new URLSearchParams(window.location.search);
const postId = parseInt(params.get("id"));

// Load posts
fetch("post.json")
  .then(res => res.json())
  .then(data => {
    const posts = data.posts;
    const post = posts.find(p => p.id === postId) || posts[0]; // fallback

    // Render blog post
    blogContainer.innerHTML = `
      <img src="${post.image}" alt="${post.title}" class="img-fluid mb-3" />
      <h1 class="blog-card-title mb-3">${post.title}</h1>
      <p class="blog-card-text text-secondary mb-3">${post.excerpt}</p>
      <div class="blog-card-content">${post.content}</div>
    `;

    // Previous/Next Post Links
    const currentIndex = posts.findIndex(p => p.id === post.id);
    if (currentIndex > 0) {
      prevBtn.href = `/blog/post?id=${posts[currentIndex - 1].id}`;
      prevBtn.textContent = `← ${posts[currentIndex - 1].title}`;
    } else {
      prevBtn.style.display = "none";
    }

    if (currentIndex < posts.length - 1) {
      nextBtn.href = `/blog/post?id=${posts[currentIndex + 1].id}`;
      nextBtn.textContent = `${posts[currentIndex + 1].title} →`;
    } else {
      nextBtn.style.display = "none";
    }
  })
  .catch(err => console.error("Error loading post:", err));
