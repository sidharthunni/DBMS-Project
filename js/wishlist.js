/* TripNest - Wishlist hearts (destinations page) -> database */
(function () {
  let user = null; try { user = JSON.parse(localStorage.getItem('tripnest_user')); } catch (e) {}
  const saved = new Set();
  const SEL = '.c-action-btn[title="Add to Wishlist"]';
  const nameOf = (btn) => { const card = btn.closest('article'); const img = card && card.querySelector('img'); return img ? img.alt : null; };
  const mark = () => document.querySelectorAll(SEL).forEach((b) => { const n = nameOf(b); if (n) b.classList.toggle('active', saved.has(n)); });

  async function load() {
    if (!user || !user.token) return;
    try {
      const r = await fetch('/api/wishlist', { headers: { 'x-auth-token': user.token } });
      if (r.ok) { (await r.json()).forEach((d) => saved.add(d.name)); mark(); }
    } catch (e) {}
  }

  document.addEventListener('click', async (e) => {
    const b = e.target.closest(SEL); if (!b) return;
    const name = nameOf(b); if (!name) return;
    if (!user || !user.token) { b.classList.toggle('active'); alert('Please login to save destinations.'); location.href = 'login.html'; return; }
    try {
      const r = await fetch('/api/wishlist/toggle', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-auth-token': user.token }, body: JSON.stringify({ dest_name: name }) });
      if (r.status === 401) { b.classList.toggle('active'); localStorage.removeItem('tripnest_user'); alert('Session expired. Please login again.'); location.href = 'login.html'; return; }
      const d = await r.json(); if (!r.ok) throw new Error(d.error);
      b.classList.toggle('active', d.saved); d.saved ? saved.add(name) : saved.delete(name);   // inline onclick toggle ni server state tho sari chestundi
    } catch (err) { b.classList.toggle('active'); alert(err.message); }
  });

  let t; new MutationObserver(() => { clearTimeout(t); t = setTimeout(mark, 80); }).observe(document.body, { childList: true, subtree: true });
  load();
})();
