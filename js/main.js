// ============================================
// main.js — lógica del home
// Lee posts.json y renderiza las cards
// ============================================

const postsContainer = document.getElementById('posts-container');
const postCount      = document.getElementById('post-count');

// --- Clock ---
function updateClock() {
  const t = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  const el = document.getElementById('clock');
  if (el) el.textContent = t;
}
setInterval(updateClock, 1000);
updateClock();

// --- Render de una card ---
function renderCard(post, index) {
  const tags = post.tags.map(tag => {
    const isHighlight = post.highlight_tags.includes(tag);
    return `<span class="ctag ${isHighlight ? 'highlight' : ''}">${tag.toUpperCase()}</span>`;
  }).join('');

  const card = document.createElement('a');
  card.className   = 'post-card';
  card.href        = `post.html?slug=${post.slug}`;
  card.style.opacity   = '0';
  card.style.transform = 'translateY(12px)';
  card.style.transition = `opacity 0.4s ease ${index * 0.08}s, transform 0.4s ease ${index * 0.08}s`;

  card.innerHTML = `
    <div class="card-top">
      <div class="card-title">${post.title}</div>
      <div class="card-date">${post.date}</div>
    </div>
    <div class="card-excerpt">${post.excerpt}</div>
    <div class="card-tags">${tags}</div>
  `;

  return card;
}

// --- Fetch y render ---
fetch('data/posts.json')
  .then(res => {
    if (!res.ok) throw new Error('No se pudo cargar posts.json');
    return res.json();
  })
  .then(posts => {
    postsContainer.innerHTML = '';

    if (postCount) {
      postCount.textContent = `[ ${posts.length} ]`;
    }

    posts.forEach((post, i) => {
      const card = renderCard(post, i);
      postsContainer.appendChild(card);

      // Trigger animación de entrada
      requestAnimationFrame(() => {
        setTimeout(() => {
          card.style.opacity   = '1';
          card.style.transform = 'translateY(0)';
        }, 80);
      });
    });
  })
  .catch(err => {
    postsContainer.innerHTML = `
      <div style="color:#ff2d6b; font-size:12px; padding:16px 0;">
        ERROR: ${err.message}
      </div>
    `;
  });
