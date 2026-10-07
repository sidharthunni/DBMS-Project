/**
 * TripNest - API helper + form wiring (register, contact)
 * Server same origin nunchi serve avthundi kabatti API = '' (relative URLs).
 * Frontend ni separate ga (Live Server) run chesthe: const API = 'http://localhost:3000';
 */
const API = (typeof window !== 'undefined' && (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '3000')))
  ? 'http://localhost:3000'
  : '';

async function apiCall(path, method = 'GET', body) {
  const res = await fetch(API + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

function currentUser() {
  try { return JSON.parse(localStorage.getItem('tripnest_user')); } catch { return null; }
}

document.addEventListener('DOMContentLoaded', () => {
  // ---------- REGISTER ----------
  const regForm = document.querySelector('.register-form');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = (id) => document.getElementById(id).value.trim();
      if (document.getElementById('password').value !== document.getElementById('confirm-password').value) {
        return alert('Passwords do not match.');
      }
      try {
        const user = await apiCall('/api/register', 'POST', {
          fullname: f('fullname'),
          email: f('email'),
          phone: f('phone'),
          country: document.getElementById('country').value,
          password: document.getElementById('password').value
        });
        localStorage.setItem('tripnest_user', JSON.stringify(user));
        alert('Account created! Welcome, ' + user.name);
        window.location.href = 'index.html';
      } catch (err) {
        alert(err.message);
      }
    });
  }

  // ---------- CONTACT ----------
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = (id) => document.getElementById(id).value.trim();
      try {
        await apiCall('/api/contact', 'POST', {
          fullname: f('fullname'), email: f('email'), phone: f('phone'),
          subject: f('subject'), message: f('message')
        });
        alert('Thanks! Mee message pampinchamu.');
        contactForm.reset();
      } catch (err) {
        alert(err.message);
      }
    });
  }
});

/* ============================================================
   PLAN-TRIP + PACKAGES BOOKING
   Mee plan-trip.js / packages.js ni touch cheyakunda, DOM nunchi values chaduvutham.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  function requireLogin() {
    const user = currentUser();
    if (!user) {
      alert('Please login first.');
      window.location.href = 'login.html';
      return null;
    }
    return user;
  }

  // ---------- plan-trip.html: "Complete My Trip" ----------
  const finishBtn = document.getElementById('finishBtn');
  if (finishBtn) {
    const picked = (group) =>
      document.querySelector(`.pt-option-grid[data-group="${group}"] .pt-option-card.is-selected`);

    finishBtn.addEventListener('click', async () => {
      const user = currentUser();
      if (!user) return requireLogin();
      const dest = picked('destination');
      const hotel = picked('hotel');
      const pkg = picked('package');
      const start = document.getElementById('startDate').value;
      const end = document.getElementById('endDate').value;
      if (!dest || !start || !end) return; // frontend already validates required steps
      try {
        await apiCall('/api/plan-trip', 'POST', {
          user_id: user.user_id,
          destination: dest.dataset.value,
          hotel: hotel ? hotel.dataset.value : null,
          hotel_price: hotel ? hotel.dataset.price : null,
          package_tier: pkg ? pkg.dataset.value : null,
          travelers: document.getElementById('travelers').value,
          budget: Number(document.getElementById('budgetSlider').value),
          start_date: start,
          end_date: end
        });
      } catch (err) {
        alert('Trip save cheyadam fail ayindi: ' + err.message);
      }
    });
  }

  // ---------- packages.html: booking modal ----------
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = currentUser();
      if (!user) return requireLogin();
      const dateInput = bookingForm.querySelector('input[type="date"]');
      if (!dateInput || !dateInput.value) {
        alert('Please select a valid travel date.');
        return;
      }
      try {
        await apiCall('/api/book-by-name', 'POST', {
          user_id: user.user_id,
          package_name: document.getElementById('modalTitle').textContent.trim(),
          travel_date: dateInput.value,
          travelers: 1
        });
        alert('Booking request saved successfully!');
      } catch (err) {
        alert('Booking failed: ' + err.message);
      }
    });
  }
});
