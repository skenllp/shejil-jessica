(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Opening cover
  const cover = $('#cover'), openBtn = $('#openBtn');
  root.style.overflow = 'hidden'; openBtn.focus({ preventScroll: true });
  openBtn.addEventListener('click', () => {
    root.dataset.opened = '1'; scrollTo(0, 0); cover.classList.add('open');
    setTimeout(() => { cover.remove(); root.style.overflow = ''; }, reduce ? 0 : 700);
  });

  // Footer video: start only when near the viewport (keeps first load light)
  const fv = $('#footVid');
  if (fv && !reduce) new IntersectionObserver((e, o) => {
    if (e[0].isIntersecting) { fv.preload = 'auto'; fv.play().catch(() => {}); o.disconnect(); }
  }, { rootMargin: '400px' }).observe(fv);

  // Countdown (Asia/Muscat = UTC+4, no DST)
  const target = Date.parse('2026-12-18T17:00:00+04:00');
  const cells = Object.fromEntries([...document.querySelectorAll('#countdown [data-u]')].map(n => [n.dataset.u, n]));
  const tick = () => {
    const s = Math.max(0, Math.floor((target - Date.now()) / 1000)), p = n => String(n).padStart(2, '0');
    cells.d.textContent = p(Math.floor(s / 86400)); cells.h.textContent = p(Math.floor(s % 86400 / 3600));
    cells.m.textContent = p(Math.floor(s % 3600 / 60)); cells.s.textContent = p(s % 60);
  };
  tick(); setInterval(tick, 1000);

  // RSVP
  const form = $('#rsvpForm'), done = $('#rsvpDone'), btn = $('#sendBtn'), gw = $('#guestsWrap');
  let sending = false;
  form.addEventListener('change', e => { if (e.target.name === 'att') gw.hidden = e.target.value !== 'yes'; });
  const fail = (id, msg) => { $(id).textContent = msg; };
  form.addEventListener('submit', async e => {
    e.preventDefault(); if (sending) return;
    const f = new FormData(form), name = String(f.get('name') || '').trim().replace(/\s+/g, ' '), att = f.get('att');
    fail('#eName', name.length < 2 ? 'Please enter your full name.' : ''); fail('#eAtt', att ? '' : 'Please choose one option.'); fail('#eForm', '');
    if (name.length < 2 || !att) return;
    sending = true; btn.disabled = true; btn.textContent = 'SENDING…';
    try {
      const r = await fetch('/api/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, attending: att === 'yes', guests: att === 'yes' ? Number(f.get('guests') || 1) : 0, message: String(f.get('message') || '').trim(), website: String(f.get('website') || '') }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) show('<p class="script">Thank you</p><p>Your response has been received.</p>');
      else if (j.demo || r.status === 404) show('<p class="cap">DEMO MODE</p><p>The form works, but RSVP storage isn’t configured yet. Your response was <b>not</b> saved.</p>');
      else throw new Error(j.error || 'Something went wrong. Please try again.');
    } catch (err) {
      fail('#eForm', err instanceof TypeError ? 'Network error. Please check your connection and try again.' : err.message);
      sending = false; btn.disabled = false; btn.textContent = 'SEND RSVP';
    }
  });
  function show(html) { form.hidden = true; done.innerHTML = html; done.hidden = false; }
})();
