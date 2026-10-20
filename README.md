# Shejil & Jessica: Static Omani Wedding Invitation (HTML/CSS/JS)
No build step. Files: `index.html`, `styles.css`, `script.js`, `assets/` (WebP art, MP4/WebM video, og.jpg), `api/rsvp.js` (Vercel serverless), `supabase/schema.sql`.
## Test locally
    python3 -m http.server 8000      # open http://localhost:8000
The page, cover, countdown and Maps button all work. RSVP shows a DEMO message (no backend locally).
To test RSVP end-to-end: `npm i -g vercel`, copy your keys into a `.env`, run `vercel dev`.
## Supabase
1. Run `supabase/schema.sql` in the Supabase SQL editor.
2. In Vercel > Settings > Environment Variables add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (server only).
## Deploy (Vercel)
Upload the folder (or push to GitHub) and import it in Vercel: framework preset "Other", no build command. Then replace `https://YOUR-DOMAIN` in the three `index.html` meta tags (og:image / twitter:image) with the live address and redeploy.
