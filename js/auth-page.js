/* TripNest - login + register (Customer / Admin tabs), original page design tho */
(function () {
  const form = document.getElementById('authForm');
  if (!form) return;
  const mode = form.dataset.mode;                 // 'login' | 'register'
  const scope = form.closest('main') || document;
  const $ = (id) => document.getElementById(id);
  const banner = $('formError');
  const btn = form.querySelector('button[type="submit"]');
  let role = new URLSearchParams(location.search).get('tab') === 'admin' ? 'admin' : 'customer';

  const copy = {
    login: { customer: 'Please enter your credentials to access your trips', admin: 'Admin access: manage users, bookings and messages' },
    register: { customer: 'Join TripNest and start planning your dream vacations', admin: 'Admin accounts need an invite code from the site owner' },
  };
  const sub = scope.querySelector('.welcome-subtitle');

  async function apiCall(path, method, body) {
    const res = await fetch(path, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
    return data;
  }

  function setRole(r) {
    role = r;
    scope.classList.toggle('is-admin', r === 'admin');
    scope.querySelectorAll('.role-tab').forEach((t) => t.classList.toggle('on', t.dataset.role === r));
    if (sub) sub.textContent = copy[mode][r];
    banner.hidden = true;
  }
  scope.querySelectorAll('.role-tab').forEach((t) => t.addEventListener('click', () => setRole(t.dataset.role)));
  setRole(role);

  // Show / Hide password
  form.querySelectorAll('input[type="password"]').forEach((inp) => {
    const wrap = inp.closest('.input-wrapper'); if (!wrap) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'pw-toggle'; b.textContent = 'Show';
    b.addEventListener('click', () => { inp.type = inp.type === 'password' ? 'text' : 'password'; b.textContent = inp.type === 'password' ? 'Show' : 'Hide'; });
    wrap.appendChild(b); inp.style.paddingRight = '60px';
  });

  function fail(input, msg) {
    input.style.borderColor = '#ef4444';
    const g = input.closest('.form-group') || input.parentElement;
    let e = g.querySelector('.error-message');
    if (!e) { e = document.createElement('small'); e.className = 'error-message'; e.style.cssText = 'color:#ef4444;display:block;margin-top:6px;font-size:12px'; g.appendChild(e); }
    e.textContent = msg; return false;
  }
  function clear() {
    form.querySelectorAll('.error-message').forEach((e) => e.remove());
    form.querySelectorAll('input,select').forEach((i) => (i.style.borderColor = ''));
    banner.hidden = true;
  }
  function validate() {
    clear(); let ok = true; const v = (id) => $(id).value.trim();
    if (mode === 'register' && !v('fullname')) ok = fail($('fullname'), 'Please enter your full name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) ok = fail($('email'), 'Enter a valid email address.');
    if (mode === 'register') {
      if (v('phone') && !/^[0-9+()\-\s]{7,15}$/.test(v('phone'))) ok = fail($('phone'), 'Enter a valid phone number.');
      if (role === 'admin' && !v('admincode')) ok = fail($('admincode'), 'Admin invite code is required.');
      if ($('confirm-password').value !== $('password').value) ok = fail($('confirm-password'), 'Passwords do not match.');
      if (!$('terms').checked) { banner.textContent = 'Please accept the Terms of Service to continue.'; banner.hidden = false; ok = false; }
    }
    const pw = $('password').value;
    if (!pw) ok = fail($('password'), 'Enter your password.');
    else if (mode === 'register' && pw.length < 8) ok = fail($('password'), 'Use at least 8 characters.');
    return ok;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const label = btn.innerHTML; btn.disabled = true; btn.textContent = 'Please wait…';
    try {
      const body = mode === 'login'
        ? { email: $('email').value.trim(), password: $('password').value, as: role }
        : { fullname: $('fullname').value.trim(), email: $('email').value.trim(), phone: $('phone').value.trim(), country: $('country').value,
            password: $('password').value, role, admin_code: role === 'admin' ? $('admincode').value : undefined };
      const user = await apiCall(mode === 'login' ? '/api/auth/login' : '/api/auth/register', 'POST', body);
      localStorage.setItem('tripnest_user', JSON.stringify(user));
      location.href = user.role === 'admin' ? 'admin.html' : 'index.html';
    } catch (err) {
      banner.textContent = err.message; banner.hidden = false;
      btn.disabled = false; btn.innerHTML = label;
    }
  });
})();
