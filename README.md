# Shejil & Jessica: Static Omani Wedding Invitation (HTML/CSS/JS)
No build step. Files: `index.html`, `styles.css`, `script.js`, `assets/` (WebP backgrounds, footer MP4/WebM, og-royal-muscat.jpg), `google-apps-script/Code.gs`.

## Test locally
    python3 -m http.server 8000      # open http://localhost:8000
Everything works locally, including RSVP (it writes to your sheet).
## Google Sheets RSVP setup (no server function needed)
1. Open your Google Sheet > Extensions > Apps Script. Replace all code with `google-apps-script/Code.gs`.
2. Run `setup` once (creates the RSVPs and Summary tabs).
3. Deploy > Manage deployments > pencil icon > Version: **New version** > Deploy. (First time: Deploy > New deployment > Web app > Execute as Me > Anyone.)
4. The web app URL is already set in `script.js` (`RSVP_URL`). If you create a new deployment with a new URL, update it there.
5. Test an RSVP on the live site and check the sheet. Same guest name resubmitting updates their row.
## Deploy (Vercel)
Upload the folder (or push to GitHub) and import it in Vercel: framework preset "Other", no build command. Social-preview meta tags already point to https://shejil-jessica.vercel.app. If you change domain, update the og:url / og:image / twitter:image tags in `index.html`.

## Royal Muscat theme notes
- Backgrounds: hero-sunset-courtyard (hero), family-ornate-archway (family), details-serene-archway (details + venue, venue is mirrored), rsvp-ivory-lantern-hall (RSVP). Footer files are unchanged.
- No opening cover and no music. The S&J monogram reveal is CSS only (plays once, ~2.5 s).
- WhatsApp image: `assets/og-royal-muscat.jpg` (new filename so old cached previews are not reused). Replace it with your own 1200x630 JPG under the same name; keep it under 300 KB.
