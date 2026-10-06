/* TripNest - Virtual Hotel Tour (preview + fullscreen video modal) */
window.hotelsReady.then(function () {
  const preview = document.getElementById('vtPreview');
  const modal = document.getElementById('vtModal');
  if (!preview || !modal) return;
  const video = document.getElementById('vtVideo');
  const hotel = typeof HOTELS !== 'undefined' ? HOTELS[1] : null;

  if (hotel) {
    document.getElementById('vtImg').src = hotel.panorama;
    document.getElementById('vtName').textContent = hotel.name;
    document.getElementById('vtLoc').textContent = hotel.location;
    video.poster = hotel.videoPoster;
  }
  const src = hotel && hotel.videoUrl ? hotel.videoUrl : 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

  function open() { video.src = src; modal.classList.add('is-open'); video.play().catch(() => {}); }
  function close() { video.pause(); video.removeAttribute('src'); video.load(); modal.classList.remove('is-open'); }

  preview.addEventListener('click', open);
  document.getElementById('vtClose').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });
});
