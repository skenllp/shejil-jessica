/**
 * RSVP receiver for the wedding invitation.
 * Setup: run setup() once, then Deploy as Web app (Execute as Me, access Anyone). After editing: Deploy > Manage deployments > New version.
 */
const SHEET = 'RSVPs';
const clean = v => { v = String(v == null ? '' : v).trim(); return /^[=+\-@]/.test(v) ? "'" + v : v; }; // blocks formula injection
const norm = n => String(n).trim().replace(/\s+/g, ' ').toLowerCase();
const reply = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);

function doPost(e) {
  let b;
  try { b = JSON.parse(e.postData.contents); } catch (_) { return reply({ ok: false, error: 'bad request' }); }
  if (b.website) return reply({ ok: true }); // honeypot: bots fill the hidden field
  // Abuse guard: max 200 submissions per hour across the site
  const cache = CacheService.getScriptCache(), n = Number(cache.get('hits') || 0);
  if (n >= 200) return reply({ ok: false, error: 'busy' });
  cache.put('hits', String(n + 1), 3600);

  const name = String(b.name || '').trim().replace(/\s+/g, ' ');
  const attending = b.attending === true;
  const guests = attending ? Math.floor(Number(b.guests)) : 0;
  if (name.length < 2 || name.length > 80 || (attending && !(guests >= 1 && guests <= 10)))
    return reply({ ok: false, error: 'invalid data' });
  const message = clean(b.message).slice(0, 500);

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = SpreadsheetApp.getActive().getSheetByName(SHEET);
    if (!sh) return reply({ ok: false, error: 'run setup() first' });
    const key = norm(name), now = new Date(), att = attending ? 'Joyfully Accepts' : 'Regretfully Declines';
    const last = sh.getLastRow();
    let row = 0;
    if (last > 1) {
      const keys = sh.getRange(2, 7, last - 1, 1).getValues();
      for (let i = 0; i < keys.length; i++) if (keys[i][0] === key) { row = i + 2; break; }
    }
    if (row) sh.getRange(row, 2, 1, 5).setValues([[now, clean(name), att, guests, message]]); // same guest resubmits = update
    else sh.appendRow([now, now, clean(name), att, guests, message, key]);
    return reply({ ok: true });
  } finally { lock.releaseLock(); }
}

/** Run once from the editor: creates the RSVPs and Summary sheets. */
function setup() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  sh.getRange(1, 1, 1, 7).setValues([['Submitted', 'Updated', 'Guest name', 'Attendance', 'Guests', 'Message', 'key']])
    .setFontWeight('bold').setBackground('#F5ECDD');
  sh.setFrozenRows(1); sh.hideColumns(7);
  sh.getRange('A:B').setNumberFormat('dd mmm yyyy, hh:mm');
  sh.setColumnWidths(1, 2, 140); sh.setColumnWidth(3, 200); sh.setColumnWidth(4, 150); sh.setColumnWidth(6, 320);
  let sm = ss.getSheetByName('Summary') || ss.insertSheet('Summary');
  sm.clear();
  sm.getRange('A1:B4').setValues([
    ['Responses', '=COUNTA(RSVPs!C2:C)'],
    ['Joyfully Accepts', '=COUNTIF(RSVPs!D2:D,"Joyfully Accepts")'],
    ['Regretfully Declines', '=COUNTIF(RSVPs!D2:D,"Regretfully Declines")'],
    ['Total guests attending', '=SUMIF(RSVPs!D2:D,"Joyfully Accepts",RSVPs!E2:E)']]);
  sm.getRange('A1:A4').setFontWeight('bold'); sm.setColumnWidth(1, 200);
}
