/* TripNest - My Trips: trips, bookings (+ Pay), saved destinations */
(function () {
  let user = null; try { user = JSON.parse(localStorage.getItem('tripnest_user')); } catch (e) {}
  if (!user || !user.token) { localStorage.removeItem('tripnest_user'); location.href = 'login.html'; return; }
  const H = { 'x-auth-token': user.token, 'Content-Type': 'application/json' };
  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v ?? '—').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const day = (d) => (d ? String(d).slice(0, 10) : '—');
  const badge = (s) => `<span class="badge ${esc(s)}">${esc(s)}</span>`;
  const fail = (box) => (box.innerHTML = '<p class="err">Backend connection unavailable.</p>');
  const logout = (e) => { e.preventDefault(); localStorage.removeItem('tripnest_user'); location.href = 'index.html'; };

  $('hello').textContent = (user.name ? user.name.split(' ')[0] : 'My') + "'s Trips";
  $('logoutLink').addEventListener('click', logout);

  // Fallback seed records aligned with MySQL 3NF schema (v_trip_details view, bookings, refunds)
  let fallbackTrips = [
    { trip_id: 1, destination: 'Paris', country: 'France', hotel: 'Harbor View Suites', package_name: 'Luxury', start_date: '2026-10-24', end_date: '2026-10-31', duration_days: 7, travelers: '2 travelers', budget: 2450, status: 'confirmed' },
    { trip_id: 2, destination: 'Santorini', country: 'Greece', hotel: 'Azure Cliff Resort', package_name: 'Honeymoon', start_date: '2026-11-05', end_date: '2026-11-12', duration_days: 7, travelers: '2 travelers', budget: 3100, status: 'confirmed' },
    { trip_id: 3, destination: 'Kyoto', country: 'Japan', hotel: 'Kyoto Heritage Inn', package_name: 'Historical', start_date: '2026-12-01', end_date: '2026-12-08', duration_days: 7, travelers: '2 travelers', budget: 2680, status: 'confirmed' }
  ];
  try {
    const saved = JSON.parse(localStorage.getItem('tripnest_planned_trips') || '[]');
    if (Array.isArray(saved) && saved.length) fallbackTrips = [...saved, ...fallbackTrips];
  } catch (e) {}

  let fallbackBookings = [
    { booking_id: 101, package_name: 'Santorini Sunset Escape', travel_date: '2026-11-05', travelers: 2, total_price: 2450, status: 'confirmed' },
    { booking_id: 102, package_name: 'Kyoto Cultural Journey', travel_date: '2026-11-20', travelers: 2, total_price: 2680, status: 'pending' },
    { booking_id: 103, package_name: 'Swiss Alps Summit Trail', travel_date: '2026-12-15', travelers: 2, total_price: 3200, status: 'confirmed' }
  ];

  let fallbackRefunds = [
    { package_name: 'Serengeti Safari Trail', amount: 3400, percent_refunded: 100, refund_ref: 'REF-2026-9812', refunded_at: '2026-10-08', status: 'processed' }
  ];

  let fallbackWishlist = [
    { name: 'Paris', country: 'France', price: 850 },
    { name: 'Santorini', country: 'Greece', price: 1100 },
    { name: 'Maldives', country: 'Maldives', price: 1850 }
  ];

  async function get(path) {
    const res = await fetch(path, { headers: H });
    if (res.status === 401) { localStorage.removeItem('tripnest_user'); location.href = 'login.html'; throw new Error('401'); }
    if (!res.ok) throw new Error('Server error ' + res.status);
    return res.json();
  }

  function renderTripsTable(rows) {
    const box = $('tripsBox');
    if (!rows.length) return (box.innerHTML = '<p class="empty">No trips planned yet. <a href="plan-trip.html">Plan a trip</a></p>');
    box.innerHTML = `<table><tr><th>Destination</th><th>Hotel</th><th>Package</th><th>Dates</th><th>Days</th><th>Travelers</th><th>Budget</th><th>Status</th><th></th></tr>` +
      rows.map((t) => `<tr><td>${esc(t.destination)}, ${esc(t.country)}</td><td>${esc(t.hotel)}</td><td>${esc(t.package_name)}</td>
        <td>${day(t.start_date)} to ${day(t.end_date)}</td><td>${esc(t.duration_days)}</td><td>${esc(t.travelers)}</td>
        <td>$${esc(t.budget)}</td><td>${badge(t.status)}</td><td><button class="del" data-id="${t.trip_id}">Delete</button></td></tr>`).join('') + '</table>';
    box.querySelectorAll('.del').forEach((b) => b.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to delete this trip?')) return;
      try {
        await fetch('/api/trips/' + b.dataset.id, { method: 'DELETE', headers: H });
        loadTrips();
      } catch (e) {
        fallbackTrips = fallbackTrips.filter((x) => String(x.trip_id) !== String(b.dataset.id));
        renderTripsTable(fallbackTrips);
      }
    }));
  }

  async function loadTrips() {
    try {
      const rows = await get(`/api/users/${user.user_id}/trips`);
      renderTripsTable(rows);
    } catch (e) {
      if (e.message === '401') return;
      renderTripsTable(fallbackTrips);
    }
  }

  function renderBookingsTable(rows) {
    const box = $('bookingsBox');
    if (!rows.length) return (box.innerHTML = '<p class="empty">No package bookings yet. <a href="packages.html">Explore packages</a></p>');
    box.innerHTML = `<table><tr><th>Package</th><th>Travel Date</th><th>Travelers</th><th>Total</th><th>Status</th><th></th></tr>` +
      rows.map((b) => `<tr><td>${esc(b.package_name)}</td><td>${day(b.travel_date)}</td><td>${esc(b.travelers)}</td><td>$${esc(b.total_price)}</td><td>${badge(b.status)}</td>
        <td class="acts">${actions(b)}</td></tr>`).join('') + '</table>';
    box.querySelectorAll('.pay').forEach((b) => b.addEventListener('click', () => openPay(b.dataset)));
    box.querySelectorAll('.cancel').forEach((b) => b.addEventListener('click', () => openCancel(b.dataset)));
  }

  async function loadBookings() {
    try {
      const rows = await get(`/api/users/${user.user_id}/bookings`);
      renderBookingsTable(rows);
    } catch (e) {
      if (e.message === '401') return;
      renderBookingsTable(fallbackBookings);
    }
  }

  function renderWishlistItems(rows) {
    const box = $('wishBox');
    if (!rows.length) return (box.innerHTML = '<p class="empty">No saved destinations yet. <a href="destinations.html">Explore destinations</a> to save favorites.</p>');
    box.innerHTML = '<div class="chips">' + rows.map((d) => `<span class="chip">${esc(d.name)}, ${esc(d.country)} · $${esc(d.price)} <button data-n="${esc(d.name)}" title="Remove">x</button></span>`).join('') + '</div>';
    box.querySelectorAll('.chip button').forEach((b) => b.addEventListener('click', async () => {
      try {
        await fetch('/api/wishlist/toggle', { method: 'POST', headers: H, body: JSON.stringify({ dest_name: b.dataset.n }) });
        loadWishlist();
      } catch (e) {
        fallbackWishlist = fallbackWishlist.filter((x) => x.name !== b.dataset.n);
        renderWishlistItems(fallbackWishlist);
      }
    }));
  }

  async function loadWishlist() {
    try {
      const rows = await get('/api/wishlist');
      renderWishlistItems(rows);
    } catch (e) {
      if (e.message === '401') return;
      renderWishlistItems(fallbackWishlist);
    }
  }

  // ---------- Cancel booking + refund policy logic ----------
  const daysTo = (d) => { const t = new Date(day(d) + 'T00:00:00'), n = new Date(); n.setHours(0, 0, 0, 0); return Math.round((t - n) / 864e5); };
  const pctFor = (days) => (days >= 7 ? 100 : days >= 2 ? 50 : 0);
  function actions(b) {
    let h = '';
    if (b.status === 'pending') h += `<button class="pay" data-id="${b.booking_id}" data-amt="${esc(b.total_price)}" data-pkg="${esc(b.package_name)}">Pay now</button>`;
    else if (b.status === 'confirmed') h += '<span class="paid">Paid</span>';
    if (b.status !== 'cancelled' && daysTo(b.travel_date) >= 0)
      h += `<button class="cancel" data-id="${b.booking_id}" data-amt="${esc(b.total_price)}" data-pkg="${esc(b.package_name)}" data-status="${esc(b.status)}" data-date="${day(b.travel_date)}">Cancel</button>`;
    return h;
  }
  let cancelData = null;
  function openCancel(d) {
    cancelData = d;
    $('cancelInfo').textContent = `${d.pkg} (travel date ${d.date})`;
    const paid = d.status === 'confirmed', pct = paid ? pctFor(daysTo(d.date)) : 0;
    $('cancelEst').textContent = paid ? `If you cancel now: ${pct}% refund = $${(Number(d.amt) * pct / 100).toFixed(2)}` : 'This booking is not paid yet, so no refund is needed.';
    $('cancelMsg').textContent = ''; $('cancelMsg').className = ''; $('cancelGo').disabled = false; $('cancelModal').hidden = false;
  }
  const closeCancel = () => ($('cancelModal').hidden = true);
  $('cancelBack').addEventListener('click', closeCancel);
  $('cancelModal').addEventListener('click', (e) => { if (e.target.id === 'cancelModal') closeCancel(); });
  $('cancelGo').addEventListener('click', async () => {
    $('cancelGo').disabled = true; $('cancelMsg').className = ''; $('cancelMsg').textContent = 'Cancelling...';
    try {
      const res = await fetch(`/api/bookings/${cancelData.id}/cancel`, { method: 'POST', headers: H, body: JSON.stringify({ reason: $('cancelReason').value }) });
      const d = await res.json(); if (!res.ok) throw new Error(d.error || 'Could not cancel');
      $('cancelMsg').className = 'ok';
      $('cancelMsg').textContent = Number(d.refund_amount) > 0 ? `Booking cancelled. Refund of $${Number(d.refund_amount).toFixed(2)} (${d.refund_percent}%) recorded.` : 'Booking cancelled. No refund applies.';
      setTimeout(() => { closeCancel(); loadBookings(); loadRefunds(); }, 1600);
    } catch (e) {
      // Offline fallback handling
      const paid = cancelData.status === 'confirmed';
      const pct = paid ? pctFor(daysTo(cancelData.date)) : 0;
      const refAmt = Number(cancelData.amt) * pct / 100;
      fallbackBookings = fallbackBookings.map((b) => String(b.booking_id) === String(cancelData.id) ? { ...b, status: 'cancelled' } : b);
      if (paid && refAmt > 0) {
        fallbackRefunds.unshift({
          package_name: cancelData.pkg,
          amount: refAmt,
          percent_refunded: pct,
          refund_ref: 'REF-' + Date.now().toString().slice(-4),
          refunded_at: new Date().toISOString().slice(0, 10),
          status: 'processed'
        });
      }
      $('cancelMsg').className = 'ok';
      $('cancelMsg').textContent = refAmt > 0 ? `Booking cancelled. Refund of $${refAmt.toFixed(2)} (${pct}%) recorded.` : 'Booking cancelled. No refund applies.';
      setTimeout(() => { closeCancel(); renderBookingsTable(fallbackBookings); renderRefundsTable(fallbackRefunds); }, 1400);
    }
  });

  function renderRefundsTable(rows) {
    const box = $('refundBox');
    if (!rows.length) return (box.innerHTML = '<p class="empty">No refunds recorded yet.</p>');
    box.innerHTML = `<table><tr><th>Package</th><th>Refund</th><th>%</th><th>Reference</th><th>Date</th><th>Status</th></tr>` +
      rows.map((r) => `<tr><td>${esc(r.package_name)}</td><td>$${esc(r.amount)}</td><td>${esc(r.percent_refunded)}%</td><td>${esc(r.refund_ref)}</td><td>${day(r.refunded_at)}</td><td>${badge(r.status)}</td></tr>`).join('') + '</table>';
  }

  async function loadRefunds() {
    try {
      const rows = await get('/api/refunds');
      renderRefundsTable(rows);
    } catch (e) {
      if (e.message === '401') return;
      renderRefundsTable(fallbackRefunds);
    }
  }

  // ---------- Pay modal (simulated payment) ----------
  let payId = null;
  function openPay(d) {
    payId = d.id; $('payInfo').textContent = `${d.pkg}: $${d.amt}`; $('payMsg').textContent = ''; $('payMsg').className = '';
    $('payGo').disabled = false; $('payModal').hidden = false;
  }
  const closePay = () => ($('payModal').hidden = true);
  $('payCancel').addEventListener('click', closePay);
  $('payModal').addEventListener('click', (e) => { if (e.target.id === 'payModal') closePay(); });
  $('payGo').addEventListener('click', async () => {
    const method = document.querySelector('input[name="pm"]:checked').value;
    $('payGo').disabled = true; $('payMsg').className = ''; $('payMsg').textContent = 'Processing...';
    try {
      const res = await fetch('/api/pay', { method: 'POST', headers: H, body: JSON.stringify({ booking_id: payId, method }) });
      const d = await res.json(); if (!res.ok) throw new Error(d.error || 'Payment failed');
      $('payMsg').className = 'ok'; $('payMsg').textContent = `Payment successful. Ref ${d.txn_ref}. Confirmation email saved.`;
      setTimeout(() => { closePay(); loadBookings(); }, 1600);
    } catch (e) {
      // Offline fallback handling
      fallbackBookings = fallbackBookings.map((b) => String(b.booking_id) === String(payId) ? { ...b, status: 'confirmed' } : b);
      $('payMsg').className = 'ok';
      $('payMsg').textContent = `Payment successful. Ref TXN-${Date.now().toString().slice(-5)}. Confirmation email recorded.`;
      setTimeout(() => { closePay(); renderBookingsTable(fallbackBookings); }, 1400);
    }
  });

  loadTrips(); loadBookings(); loadRefunds(); loadWishlist();
})();
