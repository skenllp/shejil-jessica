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
- No music. The old CSS monogram reveal on the hero is retired: the S&J monogram now lives on the door cover, and the hero shows the Bismillah and names with a short (~1 s) fade as the cover dissolves.

## Door-opening cover (Royal Muscat)
- Files: `assets/opening-poster.jpg` (first frame of the video, 720x1280, ~150 KB) and `assets/opening-doors.mp4` (the approved Firefly clip, 8 s, no audio, moov atom moved to the front for fast start; video data is byte-identical to the upload).
- Markup is the `#opening` block at the top of `<body>` in `index.html`; styles are the last section of `styles.css`; logic is the first block of `script.js`.
- Poster and video share one 9:16 stage (`#openStage`) sized in JS to whole device pixels (CSS sizing is the fallback), so they hand off without a visible shift. The whole artwork is always visible; leftover space is filled by a blurred copy of the poster.
- The only control is an invisible native `<button id="openBtn" aria-label="Open Invitation">` over the OPEN INVITATION lettering. Position/size are percentages of the stage (`.open-hit` in `styles.css`: left 33%, top 37.5%, width 34%, height 9%). If you ever swap the artwork, re-measure these.
- Playback starts only on activation. The cover ends on the video `ended` event (no timer). If the video errors, or makes no progress for 9 s, the invitation opens anyway. With `prefers-reduced-motion`, tapping skips the video.
- Opening state is not stored: every fresh page load shows the doors once; the cover is removed from the DOM after it opens.
- To tune the crossfade, change `--fade` (500ms) in `.opening`; the JS failsafe timer (1000 ms) must stay longer than it.
- WhatsApp image: `assets/og-royal-muscat.jpg` (new filename so old cached previews are not reused). Replace it with your own 1200x630 JPG under the same name; keep it under 300 KB.
