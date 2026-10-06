/* TripNest - Destinations search + filters (database query: /api/search/destinations) */
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('destinations-master-grid');
  if (!grid || !window.tnShowDestinations) return;

  const st = document.createElement('style');
  st.textContent = `.tn-filters{display:flex;flex-wrap:wrap;gap:10px;align-items:center;background:#fff;border-radius:16px;padding:16px;margin:0 0 24px;box-shadow:0 4px 20px rgba(15,23,42,.08)}
  .tn-filters input,.tn-filters select{padding:10px 12px;border:1.5px solid #CBD5E1;border-radius:10px;font:14px 'Poppins',sans-serif;background:#fff;min-width:0}
  .tn-filters #tnQ{flex:1 1 200px}.tn-filters input[type=number]{width:96px}
  .tn-filters button{padding:10px 18px;border-radius:10px;border:0;font:600 14px 'Poppins',sans-serif;cursor:pointer}
  #tnApply{background:#2563EB;color:#fff}#tnReset{background:#F1F5F9;color:#475569}
  #tnCount{width:100%;font-size:13px;color:#64748B}`;
  document.head.appendChild(st);

  const bar = document.createElement('div');
  bar.className = 'tn-filters';
  bar.innerHTML = `
    <input id="tnQ" type="search" placeholder="Search destination or country" />
    <input id="tnMin" type="number" min="0" placeholder="Min $" />
    <input id="tnMax" type="number" min="0" placeholder="Max $" />
    <select id="tnRating"><option value="">Any rating</option><option value="4">4.0+</option><option value="4.5">4.5+</option><option value="4.8">4.8+</option></select>
    <select id="tnStyle"><option value="">Any style</option></select>
    <select id="tnSeason"><option value="">Any season</option></select>
    <select id="tnSort"><option value="rating">Top rated</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select>
    <button id="tnApply" type="button">Apply</button><button id="tnReset" type="button">Reset</button>
    <span id="tnCount"></span>`;
  grid.parentElement.insertBefore(bar, grid);
  const $ = (id) => document.getElementById(id);

  // style, season options database nunchi
  fetch('/api/destinations').then((r) => (r.ok ? r.json() : [])).then((rows) => {
    const fill = (id, key) => [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort()
      .forEach((v) => { const o = document.createElement('option'); o.value = o.textContent = v; $(id).appendChild(o); });
    fill('tnStyle', 'style'); fill('tnSeason', 'best_season');
  }).catch(() => {});

  async function run() {
    const p = new URLSearchParams();
    [['q', 'tnQ'], ['min', 'tnMin'], ['max', 'tnMax'], ['rating', 'tnRating'], ['style', 'tnStyle'], ['best_season', 'tnSeason'], ['sort', 'tnSort']]
      .forEach(([k, id]) => { const v = $(id).value.trim(); if (v) p.set(k, v); });
    try {
      const res = await fetch('/api/search/destinations?' + p.toString());
      if (!res.ok) throw new Error('Search failed');
      const rows = await res.json();
      window.tnShowDestinations(rows);
      $('tnCount').textContent = rows.length ? `${rows.length} destination${rows.length > 1 ? 's' : ''} found (database search)` : 'No destinations match these filters.';
    } catch (e) { $('tnCount').textContent = 'Search ki server run avvali.'; }
  }
  $('tnApply').addEventListener('click', run);
  bar.querySelectorAll('input').forEach((i) => i.addEventListener('keydown', (e) => { if (e.key === 'Enter') run(); }));
  $('tnReset').addEventListener('click', () => {
    bar.querySelectorAll('input').forEach((i) => (i.value = ''));
    bar.querySelectorAll('select').forEach((s) => (s.selectedIndex = 0));
    run();
  });
});
