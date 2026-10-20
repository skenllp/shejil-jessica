# Shejil & Jessica: Static Omani Wedding Invitation (HTML/CSS/JS)
No build step. Files: `index.html`, `styles.css`, `script.js`, `assets/` (WebP art, MP4/WebM video, og.jpg), `api/rsvp.js` (Vercel serverless), `google-apps-script/Code.gs`.
Music: `assets/music.mp3` (original instrumental, plays after the guest taps Open; mute button bottom-right). Replace that file to change the song.
## Test locally
    python3 -m http.server 8000      # open http://localhost:8000
The page, cover, countdown and Maps button all work. RSVP shows a DEMO message (no backend locally).
To test RSVP end-to-end: `npm i -g vercel`, put `APPS_SCRIPT_URL` and `APPS_SCRIPT_SECRET` in `.env`, run `vercel dev`.
## Google Sheets RSVP setup
1. Create a new Google Sheet (e.g. "Wedding RSVPs").
2. Extensions > Apps Script. Delete the sample code and paste all of `google-apps-script/Code.gs`.
3. Project Settings (gear) > Script properties > Add `SECRET` = a long random string (keep it; you need it in step 6).
4. Select function `setup` > Run. Approve the permissions. This creates the `RSVPs` and `Summary` tabs.
5. Deploy > New deployment > type **Web app** > Execute as **Me** > Who has access **Anyone** > Deploy. Copy the Web app URL (ends in `/exec`).
6. In Vercel > Project > Settings > Environment Variables add `APPS_SCRIPT_URL` (the URL) and `APPS_SCRIPT_SECRET` (the same secret). Redeploy.
7. Submit a test RSVP on the live site and check the sheet. If you later edit Code.gs, use Deploy > Manage deployments > Edit > New version.
Responses appear as rows (same guest name resubmitting updates their row). The `Summary` tab shows totals. Share the sheet with family as viewer, or File > Download > CSV/Excel.
## Deploy (Vercel)
Upload the folder (or push to GitHub) and import it in Vercel: framework preset "Other", no build command. Social-preview meta tags already point to https://shejil-jessica.vercel.app. If you change domain, update the og:url / og:image / twitter:image tags in `index.html`.
