// Vercel serverless function. The Apps Script URL is built in; only APPS_SCRIPT_SECRET must be set in Vercel (server-only).
const hits = new Map(); // best-effort per-instance limiter; add Vercel WAF rate limiting for hard limits
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  const ip = String(req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim(), now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < 600000);
  if (recent.length >= 5) return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
  hits.set(ip, [...recent, now]);
  let b; try { b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {}); } catch { return res.status(400).json({ error: 'Invalid request.' }); }
  if (b.website) return res.status(200).json({ ok: true }); // honeypot
  const name = String(b.name || '').trim().replace(/\s+/g, ' '), message = String(b.message || '').trim();
  const attending = b.attending === true, guests = attending ? Math.floor(Number(b.guests)) : 0;
  if (name.length < 2 || name.length > 80) return res.status(400).json({ error: 'Please enter a valid name.' });
  if (typeof b.attending !== 'boolean') return res.status(400).json({ error: 'Please select attendance.' });
  if (attending && !(guests >= 1 && guests <= 10)) return res.status(400).json({ error: 'Attendees must be between 1 and 10.' });
  if (message.length > 500) return res.status(400).json({ error: 'Message is too long.' });
  const url = process.env.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycby5UM_FqeDEDJITKriXsufvl_rueAeixNX5Ug1y4wjyvEq2rkBu2h2D0R8HekaaYfOOVA/exec', secret = process.env.APPS_SCRIPT_SECRET;
  if (!url || !secret) return res.status(503).json({ demo: true });
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, redirect: 'follow',
      body: JSON.stringify({ secret, name, attending, guests, message }), signal: AbortSignal.timeout(20000) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) return res.status(502).json({ error: 'Could not save your response. Please try again.' });
    return res.status(200).json({ ok: true });
  } catch { return res.status(502).json({ error: 'Could not reach the server. Please try again.' }); }
};
