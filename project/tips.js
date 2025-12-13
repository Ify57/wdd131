/* tips page script - meets requirement: multiple functions, DOM interaction, arrays/objects, template literals, conditionals, localStorage, lazy loading */

const TIPS = [
    { id: 't1', title: 'Pack reusable essentials', category: 'packing', summary: 'Bring a reusable water bottle, utensils, bag, and straw to avoid single-use plastics.', image: 'images/tip-pack.jpg' },
    { id: 't2', title: 'Choose low-carbon transport', category: 'transport', summary: 'Prefer trains or buses for medium distances; fly direct where unavoidable.', image: 'images/tip-transport.jpg' },
    { id: 't3', title: 'Support local eco lodges', category: 'stay', summary: 'Book stays that follow sustainable practices and support local communities.', image: 'images/tip-lodge.jpg' },
    { id: 't4', title: 'Offset only carefully', category: 'carbon', summary: 'Use reputable offset programs and prefer avoidance over offsets when possible.', image: 'images/tip-offset.jpg' },
    { id: 't5', title: 'Pack light', category: 'packing', summary: 'Lighter luggage reduces fuel consumption—choose versatile clothes and do laundry locally.', image: 'images/tip-light.jpg' },
    { id: 't6', title: 'Respect wildlife', category: 'behavior', summary: 'Keep distance, do not feed animals, and use guides who practice ethical wildlife viewing.', image: 'images/tip-wildlife.jpg' }
];

// state
let favorites = loadFavorites(); // object map id->true

/document.addEventListener('DOMContentLoaded', () => {
    populateCategoryOptions();
    renderTips(TIPS);
    setupControls();
    observeLazy();
    updateFavCount();
});

// populate categories dynamically
function populateCategoryOptions() {
    const select = document.getElementById('catSelect');
    const cats = Array.from(new Set(TIPS.map(t => t.category)));
    cats.forEach(c => {
        const opt = document.createElement('option'); opt.value = c; opt.textContent = capitalize(c); select.appendChild(opt);
    });
}

// render tips to grid using template literals only
function renderTips(list) {
    const grid = document.getElementById('tipsGrid');
    if (!list.length) { document.getElementById('noResults').style.display = 'block'; grid.innerHTML = ''; return; }
    document.getElementById('noResults').style.display = 'none';
    const html = list.map(t => createCardMarkup(t)).join('');
    grid.innerHTML = `${html}`;
    attachCardListeners();
}

function createCardMarkup(tip) {
    const isFav = favorites[tip.id] ? 'is' : '';
    return `
        <article class="card" data-id="${tip.id}" tabindex="0">
          <div class="media">
            <img src="images/thumb-${tip.image.replace(/\.[^/.]+$/, ".webp")}" data-src="${tip.image}" alt="${escape(tip.title)}" class="lazy">
          </div>
          <div class="body">
            <h3>${escape(tip.title)}</h3>
            <p class="details">${escape(tip.summary)}</p>
            <div class="actions">
              <button class="btn-view" data-id="${tip.id}">Read</button>
              <button class="btn-fav ${isFav}" aria-pressed="${favorites[tip.id] ? 'true' : 'false'}" data-id="${tip.id}">${favorites[tip.id] ? '♥' : '♡'}</button>
            </div>
          </div>
        </article>
      `;
}

// attach event listeners to card buttons
function attachCardListeners() {
    document.querySelectorAll('.btn-view').forEach(btn => btn.addEventListener('click', onView));
    document.querySelectorAll('.btn-fav').forEach(btn => btn.addEventListener('click', onToggleFav));
    // allow Enter key on article card to open view
    document.querySelectorAll('article.card').forEach(card => {
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const id = card.dataset.id; openDetail(id); } });
    });
}

function onView(e) { const id = e.currentTarget.dataset.id; openDetail(id); }

// open detail - shows a small modal-like alert region; uses template literals
function openDetail(id) {
    const tip = TIPS.find(t => t.id === id);
    if (!tip) return;
    incrementView(id);
    const detail = `\n        ${tip.title}\n\n        ${tip.summary}\n\n        Category: ${capitalize(tip.category)}\n        Views on this device: ${getViewCount(id)}\n      `;
    // update live region if exists, else alert
    let live = document.getElementById('liveRegion');
    if (!live) { live = document.createElement('div'); live.id = 'liveRegion'; live.className = 'hidden-visually'; live.setAttribute('aria-live', 'polite'); document.body.appendChild(live); }
    live.textContent = detail;
    // also show a non-blocking custom panel
    showTransientPanel(detail);
}

// transient panel for user feedback
function showTransientPanel(text) {
    const p = document.createElement('div'); p.style.position = 'fixed'; p.style.right = '1rem'; p.style.bottom = '1rem'; p.style.background = '#0f5132'; p.style.color = '#fff'; p.style.padding = '1rem'; p.style.borderRadius = '8px'; p.style.boxShadow = '0 10px 30px rgba(0,0,0,.15)'; p.textContent = text; document.body.appendChild(p);
    setTimeout(() => { p.style.opacity = '0'; setTimeout(() => p.remove(), 500); }, 3500);
}

// favorites toggle
function onToggleFav(e) { const id = e.currentTarget.dataset.id; toggleFavorite(id, e.currentTarget); }

function toggleFavorite(id, btn) {
    if (favorites[id]) { delete favorites[id]; btn.classList.remove('is'); btn.setAttribute('aria-pressed', 'false'); btn.textContent = '♡'; }
    else { favorites[id] = true; btn.classList.add('is'); btn.setAttribute('aria-pressed', 'true'); btn.textContent = '♥'; }
    saveFavorites(); updateFavCount();
}

function updateFavCount() { document.getElementById('favCount').textContent = `Favorites: ${Object.keys(favorites).length}`; }

// controls: search, filter, clear, save
function setupControls() {
    document.getElementById('search').addEventListener('input', applyFilters);
    document.getElementById('catSelect').addEventListener('change', applyFilters);
    document.getElementById('clearFilters').addEventListener('click', () => { document.getElementById('search').value = ''; document.getElementById('catSelect').value = 'all'; applyFilters(); });
    document.getElementById('saveBtn').addEventListener('click', () => { downloadFavorites(); });
}

function applyFilters() {
    const q = document.getElementById('search').value.trim().toLowerCase();
    const cat = document.getElementById('catSelect').value;
    const out = TIPS.filter(t => {
        const catOk = (cat === 'all') ? true : t.category === cat;
        const qOk = q === '' ? true : (t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q));
        return catOk && qOk;
    });
    renderTips(out);
    observeLazy();
}

// lazy loading using IntersectionObserver
function observeLazy() {
    const imgs = document.querySelectorAll('img.lazy');
    if (!('IntersectionObserver' in window)) {
        imgs.forEach(i => { if (i.dataset.src) { i.src = i.dataset.src; i.classList.add('loaded'); } }); return;
    }
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(ent => {
            if (ent.isIntersecting) { const img = ent.target; const src = img.dataset.src; if (src) { img.src = src; img.addEventListener('load', () => img.classList.add('loaded')); img.removeAttribute('data-src'); } obs.unobserve(img); }
        });
    }, { rootMargin: '150px 0px', threshold: 0.01 });
    imgs.forEach(img => { if (img.dataset.src) { io.observe(img); } else { img.classList.add('loaded'); } });
}

// localStorage helpers for favorites and views
function saveFavorites() { localStorage.setItem('eco_tips_favs', JSON.stringify(favorites)); }
function loadFavorites() { try { return JSON.parse(localStorage.getItem('eco_tips_favs')) || {}; } catch { return {}; } }

function downloadFavorites() {
    const data = Object.keys(favorites).map(id => TIPS.find(t => t.id === id)).filter(Boolean);
    if (!data.length) { alert('No favorites to save'); return; }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'eco-favorites.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

// view counts
function incrementView(id) { const key = 'eco_tip_views'; const raw = JSON.parse(localStorage.getItem(key) || '{}'); raw[id] = (raw[id] || 0) + 1; localStorage.setItem(key, JSON.stringify(raw)); }
function getViewCount(id) { const raw = JSON.parse(localStorage.getItem('eco_tip_views') || '{}'); return raw[id] || 0; }

// util
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function escape(s) { return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }

// init favorites from storage
function loadFavorites() { try { return JSON.parse(localStorage.getItem('eco_tips_favs')) || {}; } catch { return {}; } }
