const postContainer = document.getElementById('post-container');

function updateClock() {
  const t = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  const el = document.getElementById('clock');
  if (el) el.textContent = t;
}
setInterval(updateClock, 1000);
updateClock();

const params = new URLSearchParams(window.location.search);
const slug   = params.get('slug');

if (!slug) {
  postContainer.innerHTML = `
    <div style="color:#ff2d6b; font-size:12px; padding:16px 0;">
      ERROR: no se especificó ningún post.
    </div>
  `;
} else {
  fetch('../data/posts.json')
    .then(res => res.json())
    .then(posts => {
      const meta = posts.find(p => p.slug === slug);
      if (!meta) throw new Error(`Post "${slug}" no encontrado en posts.json`);

      return fetch(`../posts/${slug}.html`)
        .then(res => {
          if (!res.ok) throw new Error(`Archivo ${slug}.html no encontrado`);
          return res.text();
        })
        .then(html => ({ meta, html }));
    })
    .then(({ meta, html }) => {
      document.title = `c4s3-c // ${meta.title}`;

      const tags = meta.tags.map(tag => {
        const isHighlight = meta.highlight_tags.includes(tag);
        return `<span class="ctag ${isHighlight ? 'highlight' : ''}">${tag.toUpperCase()}</span>`;
      }).join('');

      postContainer.innerHTML = `
        <div class="post-header">
          <div class="post-header-date">
            TRANSMISIÓN // ${meta.date} // ${meta.id}
          </div>
          <h1>${meta.title}</h1>
          <div class="card-tags">${tags}</div>
        </div>
        <div class="post-body">
          ${html}
        </div>
      `;
    })
    .catch(err => {
      postContainer.innerHTML = `
        <div style="color:#ff2d6b; font-size:12px; padding:16px 0;">
          ERROR: ${err.message}
        </div>
      `;
    });
}
