/* TripNest - Featured Hotels grid (photos/details static data nunchi, price + rating database nunchi) */
(function () {
  const grid = document.getElementById('hotelsGrid');
  if (!grid || typeof HOTELS === 'undefined') return;

  function render() {
    grid.innerHTML = Object.values(HOTELS).map((h) => `
      <a class="hs-card" href="hotels-details.html?id=${h.id}">
        <img src="${h.images[0]}" alt="${h.name}" loading="lazy" />
        <div class="hs-body">
          <h3>${h.name}</h3>
          <div class="hs-loc">📍 ${h.location}</div>
          <div class="hs-badges">${h.badges.map((b) => `<span>${b}</span>`).join('')}</div>
          <div class="hs-foot">
            <span class="hs-price">$${h.priceFrom}<small> / night</small></span>
            <span class="hs-rate">★ ${Number(h.rating).toFixed(1)}</span>
          </div>
        </div>
      </a>`).join('');
  }
  window.hotelsReady.then(render);
})();
