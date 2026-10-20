# Shejil & Jessica: Static Omani Wedding Invitation (HTML/CSS/JS)
No build step. Files: `index.html`, `styles.css`, `script.js`, `assets/` (WebP art, MP4/WebM video, og.jpg), `api/rsvp.js` (Vercel serverless), `supabase/schema.sql`.
Music: `assets/music.mp3` (original instrumental, plays after the guest taps Open; mute button bottom-right). Replace that file to change the song.
## Test locally
    python3 -m http.server 8000      # open http://localhost:8000
The page, cover, countdown and Maps button all work. RSVP shows a DEMO message (no backend locally).
To test RSVP end-to-end: `npm i -g vercel`, copy your keys into a `.env`, run `vercel dev`.
## Supabase
1. Run `supabase/schema.sql` in the Supabase SQL editor.
2. In Vercel > Settings > Environment Variables add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (server only).
## Deploy (Vercel)
Upload the folder (or push to GitHub) and import it in Vercel: framework preset "Other", no build command. Social-preview meta tags already point to https://shejil-jessica.vercel.app. If you change domain, update the og:url / og:image / twitter:image tags in `index.html`.
