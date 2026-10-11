/* TripNest - Admin dashboard */
(function () {
  const API = (typeof window !== 'undefined' && (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '3000')))
    ? 'http://localhost:3000'
    : '';
  const esc = (v) => String(v ?? '—').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const day = (d) => (d ? String(d).slice(0, 10) : '—');

  // Fallback demo data matching the MySQL 3NF database schema for offline/GitHub Pages demo
  const fallbackData = {
    stats: { users: 12, trips: 18, bookings: 24, revenue: 48650 },
    users: [
      { user_id: 1, full_name: 'Sidharth Unnithan', email: 'sidharthunni@gmail.com', phone: '+91 9876543210', country: 'India', created_at: '2026-10-01' },
      { user_id: 2, full_name: 'Elena Rostova', email: 'elena.rostova@example.com', phone: '+33 612345678', country: 'France', created_at: '2026-10-03' },
      { user_id: 3, full_name: 'Marcus Vance', email: 'marcus.vance@example.com', phone: '+1 4155552671', country: 'USA', created_at: '2026-10-05' },
      { user_id: 4, full_name: 'Aoi Tanaka', email: 'aoi.tanaka@example.com', phone: '+81 9012345678', country: 'Japan', created_at: '2026-10-06' }
    ],
    trips: [
      { trip_id: 1, full_name: 'Sidharth Unnithan', destination: 'Paris', hotel: 'Harbor View Suites', package_name: 'Luxury', start_date: '2026-10-24', end_date: '2026-10-31', travelers: 2, budget: 2450, status: 'confirmed' },
      { trip_id: 2, full_name: 'Elena Rostova', destination: 'Santorini', hotel: 'Azure Cliff Resort', package_name: 'Honeymoon', start_date: '2026-11-05', end_date: '2026-11-12', travelers: 2, budget: 3100, status: 'confirmed' },
      { trip_id: 3, full_name: 'Marcus Vance', destination: 'Swiss Alps', hotel: 'Alpine Summit Lodge', package_name: 'Adventure', start_date: '2026-12-15', end_date: '2026-12-22', travelers: 2, budget: 3200, status: 'confirmed' }
    ],
    bookings: [
      { booking_id: 101, full_name: 'Sidharth Unnithan', package_name: 'Santorini Sunset Escape', travel_date: '2026-11-05', travelers: 2, total_price: 2450, status: 'confirmed' },
      { booking_id: 102, full_name: 'Elena Rostova', package_name: 'Kyoto Cultural Journey', travel_date: '2026-11-20', travelers: 2, total_price: 2680, status: 'pending' },
      { booking_id: 103, full_name: 'Marcus Vance', package_name: 'Swiss Alps Summit Trail', travel_date: '2026-12-15', travelers: 2, total_price: 3200, status: 'confirmed' }
    ],
    payments: [
      { payment_id: 501, full_name: 'Sidharth Unnithan', booking_id: 101, amount: 2450, method: 'card', status: 'completed', txn_ref: 'TXN-91823', paid_at: '2026-10-08' },
      { payment_id: 502, full_name: 'Marcus Vance', booking_id: 103, amount: 3200, method: 'upi', status: 'completed', txn_ref: 'TXN-91824', paid_at: '2026-10-09' }
    ],
    emails: [
      { email_id: 801, to_email: 'sidharthunni@gmail.com', subject: 'Booking Confirmation: Santorini Sunset Escape', body: 'Your booking has been confirmed. Ref TXN-91823. Enjoy your journey!', status: 'sent', created_at: '2026-10-08' },
      { email_id: 802, to_email: 'marcus.vance@example.com', subject: 'Booking Confirmation: Swiss Alps Summit Trail', body: 'Payment received. Your alpine itinerary is locked. Ref TXN-91824.', status: 'sent', created_at: '2026-10-09' }
    ],
    refunds: [
      { refund_id: 301, full_name: 'Aoi Tanaka', package_name: 'Serengeti Safari Trail', booking_id: 98, amount: 3400, percent_refunded: 100, refund_ref: 'REF-2026-9812', status: 'processed', refunded_at: '2026-10-08' }
    ],
    messages: [
      { msg_id: 401, full_name: 'David Kim', email: 'david@example.com', subject: 'Group booking inquiry', message: 'Looking to book a corporate retreat for 15 travelers in Bali next month.', created_at: '2026-10-10' }
    ]
  };

  async function api(path, method = 'GET', body) {
    let u = null; try { u = JSON.parse(localStorage.getItem('tripnest_user')); } catch (e) {}
    const deny = () => { alert('Admin login required.'); location.href = 'login.html'; throw new Error('not admin'); };
    if (!u || u.role !== 'admin' || !u.token) deny();
    const res = await fetch(API + path, {
      method, headers: { 'Content-Type': 'application/json', 'x-auth-token': u.token },
      body: body ? JSON.stringify(body) : undefined
    });
    if (res.status === 401 || res.status === 403) { localStorage.removeItem('tripnest_user'); deny(); }
    if (!res.ok) throw new Error('Server error ' + res.status);
    return res.json();
  }

  const table = (heads, rows) => rows.length
    ? `<table><tr>${heads.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.join('')}</table>`
    : '<p class="empty">No records found.</p>';

  const views = {
    users: async () => {
      let data = fallbackData.users;
      try { data = await api('/api/admin/users'); } catch (e) {}
      return table(['ID', 'Name', 'Email', 'Phone', 'Country', 'Joined'],
        data.map((u) => `<tr><td>${u.user_id}</td><td>${esc(u.full_name)}</td><td>${esc(u.email)}</td><td>${esc(u.phone)}</td><td>${esc(u.country)}</td><td>${day(u.created_at)}</td></tr>`));
    },
    trips: async () => {
      let data = fallbackData.trips;
      try { data = await api('/api/admin/trips'); } catch (e) {}
      return table(['ID', 'User', 'Destination', 'Hotel', 'Tier', 'Dates', 'Travelers', 'Budget', 'Status'],
        data.map((t) => `<tr><td>${t.trip_id}</td><td>${esc(t.full_name)}</td><td>${esc(t.destination)}</td><td>${esc(t.hotel)}</td><td>${esc(t.package_name)}</td><td>${day(t.start_date)} to ${day(t.end_date)}</td><td>${esc(t.travelers)}</td><td>$${esc(t.budget)}</td><td>${esc(t.status)}</td></tr>`));
    },
    bookings: async () => {
      let data = fallbackData.bookings;
      try { data = await api('/api/admin/bookings'); } catch (e) {}
      return table(['ID', 'User', 'Package', 'Travel Date', 'Travelers', 'Total', 'Status'],
        data.map((b) => `<tr><td>${b.booking_id}</td><td>${esc(b.full_name)}</td><td>${esc(b.package_name)}</td><td>${day(b.travel_date)}</td><td>${esc(b.travelers)}</td><td>$${esc(b.total_price)}</td>
          <td><select class="st" data-id="${b.booking_id}">${['pending', 'confirmed', 'cancelled'].map((s) => `<option ${s === b.status ? 'selected' : ''}>${s}</option>`).join('')}</select></td></tr>`));
    },
    payments: async () => {
      let data = fallbackData.payments;
      try { data = await api('/api/admin/payments'); } catch (e) {}
      return table(['ID', 'User', 'Booking', 'Amount', 'Method', 'Status', 'Reference', 'Paid at'],
        data.map((p) => `<tr><td>${p.payment_id}</td><td>${esc(p.full_name)}</td><td>#${p.booking_id}</td><td>$${esc(p.amount)}</td><td>${esc(p.method)}</td><td>${esc(p.status)}</td><td>${esc(p.txn_ref)}</td><td>${day(p.paid_at)}</td></tr>`));
    },
    emails: async () => {
      let data = fallbackData.emails;
      try { data = await api('/api/admin/emails'); } catch (e) {}
      return table(['ID', 'To', 'Subject', 'Message', 'Status', 'Date'],
        data.map((m) => `<tr><td>${m.email_id}</td><td>${esc(m.to_email)}</td><td>${esc(m.subject)}</td><td style="white-space:normal;min-width:240px">${esc(m.body)}</td><td>${esc(m.status)}</td><td>${day(m.created_at)}</td></tr>`));
    },
    refunds: async () => {
      let data = fallbackData.refunds;
      try { data = await api('/api/admin/refunds'); } catch (e) {}
      return table(['ID', 'User', 'Package', 'Booking', 'Refund', '%', 'Reference', 'Status', 'Date'],
        data.map((r) => `<tr><td>${r.refund_id}</td><td>${esc(r.full_name)}</td><td>${esc(r.package_name)}</td><td>#${r.booking_id}</td><td>$${esc(r.amount)}</td><td>${esc(r.percent_refunded)}%</td><td>${esc(r.refund_ref)}</td><td>${esc(r.status)}</td><td>${day(r.refunded_at)}</td></tr>`));
    },
    messages: async () => {
      let data = fallbackData.messages;
      try { data = await api('/api/admin/messages'); } catch (e) {}
      return table(['ID', 'Name', 'Email', 'Subject', 'Message', 'Date'],
        data.map((m) => `<tr><td>${m.msg_id}</td><td>${esc(m.full_name)}</td><td>${esc(m.email)}</td><td>${esc(m.subject)}</td><td style="white-space:normal;min-width:240px">${esc(m.message)}</td><td>${day(m.created_at)}</td></tr>`));
    },
  };

  async function show(name) {
    const panel = document.getElementById('panel');
    panel.textContent = 'Loading...';
    try {
      panel.innerHTML = await views[name]();
      panel.querySelectorAll('select.st').forEach((s) => s.addEventListener('change', () =>
        api('/api/admin/bookings/' + s.dataset.id, 'PATCH', { status: s.value }).then(loadStats).catch(() => {})));
    } catch (e) {
      panel.innerHTML = '<p class="err">Backend connection unavailable.</p>';
    }
  }

  async function loadStats() {
    let s = fallbackData.stats;
    try { s = await api('/api/admin/stats'); } catch (e) {}
    document.getElementById('stats').innerHTML = [['Users', s.users], ['Trips', s.trips], ['Bookings', s.bookings], ['Revenue', '$' + Number(s.revenue).toLocaleString()]]
      .map(([l, v]) => `<div class="stat"><b>${esc(v)}</b><span>${l}</span></div>`).join('');
  }

  document.getElementById('tabs').addEventListener('click', (e) => {
    const b = e.target.closest('.tab'); if (!b) return;
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('on', t === b));
    show(b.dataset.t);
  });
  document.getElementById('adminLogout').addEventListener('click', (e) => {
    e.preventDefault(); localStorage.removeItem('tripnest_user'); location.href = 'index.html';
  });
  loadStats(); show('users');
})();
