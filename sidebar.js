fetch("post.json")
  .then(res => res.json())
  .then(data => {
    const recentContainer = document.getElementById("recent-posts");
    const socialContainer = document.getElementById("social-links");
    const socials = data.socials;

    // Get latest 4 posts by ID
    const posts = data.posts.slice().sort((a,b) => b.id - a.id);

    recentContainer.innerHTML = "";
    posts.forEach(p => {
      recentContainer.innerHTML += `<a href="single.html?id=${p.id}" class="d-block mb-2 text-light">${p.title}</a>`;
    });

    socialContainer.innerHTML = `
      <a href="${socials.instagram}" target="_blank">Instagram</a>
      <a href="${socials.linkedin}" target="_blank">LinkedIn</a>
      <a href="${socials.twitter}" target="_blank">X (Twitter)</a>
    `;

    // Highlight current post if on single.html
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
