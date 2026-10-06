/* TripNest - Admin dashboard (data database nunchi, admin key tho protected) */
(function () {
  const API = '';
  const esc = (v) => String(v ?? '—').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const day = (d) => (d ? String(d).slice(0, 10) : '—');

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
    : '<p class="empty">Data ledu.</p>';

  const views = {
    users: async () => table(['ID', 'Name', 'Email', 'Phone', 'Country', 'Joined'],
      (await api('/api/admin/users')).map((u) => `<tr><td>${u.user_id}</td><td>${esc(u.full_name)}</td><td>${esc(u.email)}</td><td>${esc(u.phone)}</td><td>${esc(u.country)}</td><td>${day(u.created_at)}</td></tr>`)),
    trips: async () => table(['ID', 'User', 'Destination', 'Hotel', 'Tier', 'Dates', 'Travelers', 'Budget', 'Status'],
      (await api('/api/admin/trips')).map((t) => `<tr><td>${t.trip_id}</td><td>${esc(t.full_name)}</td><td>${esc(t.destination)}</td><td>${esc(t.hotel)}</td><td>${esc(t.package_name)}</td><td>${day(t.start_date)} → ${day(t.end_date)}</td><td>${esc(t.travelers)}</td><td>$${esc(t.budget)}</td><td>${esc(t.status)}</td></tr>`)),
    bookings: async () => table(['ID', 'User', 'Package', 'Travel Date', 'Travelers', 'Total', 'Status'],
      (await api('/api/admin/bookings')).map((b) => `<tr><td>${b.booking_id}</td><td>${esc(b.full_name)}</td><td>${esc(b.package_name)}</td><td>${day(b.travel_date)}</td><td>${esc(b.travelers)}</td><td>$${esc(b.total_price)}</td>
        <td><select class="st" data-id="${b.booking_id}">${['pending', 'confirmed', 'cancelled'].map((s) => `<option ${s === b.status ? 'selected' : ''}>${s}</option>`).join('')}</select></td></tr>`)),
    payments: async () => table(['ID', 'User', 'Booking', 'Amount', 'Method', 'Status', 'Reference', 'Paid at'],
      (await api('/api/admin/payments')).map((p) => `<tr><td>${p.payment_id}</td><td>${esc(p.full_name)}</td><td>#${p.booking_id}</td><td>$${esc(p.amount)}</td><td>${esc(p.method)}</td><td>${esc(p.status)}</td><td>${esc(p.txn_ref)}</td><td>${day(p.paid_at)}</td></tr>`)),
    emails: async () => table(['ID', 'To', 'Subject', 'Message', 'Status', 'Date'],
      (await api('/api/admin/emails')).map((m) => `<tr><td>${m.email_id}</td><td>${esc(m.to_email)}</td><td>${esc(m.subject)}</td><td style="white-space:normal;min-width:240px">${esc(m.body)}</td><td>${esc(m.status)}</td><td>${day(m.created_at)}</td></tr>`)),
    refunds: async () => table(['ID', 'User', 'Package', 'Booking', 'Refund', '%', 'Reference', 'Status', 'Date'],
      (await api('/api/admin/refunds')).map((r) => `<tr><td>${r.refund_id}</td><td>${esc(r.full_name)}</td><td>${esc(r.package_name)}</td><td>#${r.booking_id}</td><td>$${esc(r.amount)}</td><td>${esc(r.percent_refunded)}%</td><td>${esc(r.refund_ref)}</td><td>${esc(r.status)}</td><td>${day(r.refunded_at)}</td></tr>`)),
    messages: async () => table(['ID', 'Name', 'Email', 'Subject', 'Message', 'Date'],
      (await api('/api/admin/messages')).map((m) => `<tr><td>${m.msg_id}</td><td>${esc(m.full_name)}</td><td>${esc(m.email)}</td><td>${esc(m.subject)}</td><td style="white-space:normal;min-width:240px">${esc(m.message)}</td><td>${day(m.created_at)}</td></tr>`)),
  };

  async function show(name) {
    const panel = document.getElementById('panel');
    panel.textContent = 'Loading…';
    try {
      panel.innerHTML = await views[name]();
      panel.querySelectorAll('select.st').forEach((s) => s.addEventListener('change', () =>
        api('/api/admin/bookings/' + s.dataset.id, 'PATCH', { status: s.value }).then(loadStats)));
    } catch (e) { panel.innerHTML = '<p class="err">Backend connect kaaledu. Server run chesi refresh cheyandi.</p>'; }
  }

  async function loadStats() {
    try {
      const s = await api('/api/admin/stats');
      document.getElementById('stats').innerHTML = [['Users', s.users], ['Trips', s.trips], ['Bookings', s.bookings], ['Revenue', '$' + Number(s.revenue).toLocaleString()]]
        .map(([l, v]) => `<div class="stat"><b>${esc(v)}</b><span>${l}</span></div>`).join('');
    } catch (e) {}
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
