// Vercel serverless function (plain Node, no framework). Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (server-only).
const hits = new Map(); // best-effort per-instance limiter; add Vercel WAF rate limiting for hard limits
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  const ip = String(req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim(), now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < 600000);
  if (recent.length >= 5) return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
  hits.set(ip, [...recent, now]);
  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (b.website) return res.status(200).json({ ok: true }); // honeypot
  const name = String(b.name || '').trim().replace(/\s+/g, ' '), message = String(b.message || '').trim();
  const attending = b.attending === true, guests = attending ? Math.floor(Number(b.guests)) : 0;
  if (name.length < 2 || name.length > 80) return res.status(400).json({ error: 'Please enter a valid name.' });
  if (typeof b.attending !== 'boolean') return res.status(400).json({ error: 'Please select attendance.' });
  if (attending && !(guests >= 1 && guests <= 10)) return res.status(400).json({ error: 'Attendees must be between 1 and 10.' });
  if (message.length > 500) return res.status(400).json({ error: 'Message is too long.' });
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(503).json({ demo: true });
  try {
    const r = await fetch(`${url}/rest/v1/rsvps?on_conflict=name_key`, { method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ full_name: name, attending, guests, message: message || null }) });
    if (!r.ok) return res.status(502).json({ error: 'Could not save your response. Please try again.' });
    return res.status(200).json({ ok: true });
  } catch { return res.status(502).json({ error: 'Could not reach the server. Please try again.' }); }
};
