/**
 * Valencia Town – lead capture to Google Sheets
 *
 * Paste this into Extensions → Apps Script of your Google Sheet,
 * then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 * Put the web app URL in CONFIG.formEndpoint in js/main.js.
 */

var SHEET_NAME = 'Leads';
var NOTIFY_EMAIL = '';          // e.g. 'sales@example.com' or 'a@x.com,b@x.com' – leave empty for no email alerts
var DUPLICATE_WINDOW_MIN = 10;  // ignore the same phone number again within this many minutes

var HEADERS = [
  'Received (IST)', 'Name', 'Phone', 'Looking for', 'Form', 'Page',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'fbclid', 'Submitted (browser)', 'Status', 'Notes',
  'Email', 'Preferred call time'     // at the end so existing sheets keep their columns
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.website) return json({ ok: true });                       // honeypot hit: pretend success

    var name = clean(data.name, 80);
    var phone = String(data.phone || '').replace(/[^\d+]/g, '');
    if (name.length < 2 || !/^\+91[6-9]\d{9}$/.test(phone)) {
      return json({ ok: false, error: 'invalid' });
    }

    var email = clean(data.email, 120);
    var preferredTime = clean(data.preferred_time, 40);

    var sheet = getSheet();
    if (isDuplicate(sheet, phone)) return json({ ok: true, duplicate: true });

    var now = new Date();
    sheet.appendRow([
      Utilities.formatDate(now, 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss'),
      name,
      "'" + phone,                                                     // keep the leading +
      clean(data.interest, 120),
      clean(data.source, 40),
      clean(data.page, 200),
      clean(data.utm_source, 100),
      clean(data.utm_medium, 100),
      clean(data.utm_campaign, 150),
      clean(data.utm_term, 150),
      clean(data.utm_content, 150),
      clean(data.gclid, 200),
      clean(data.fbclid, 200),
      clean(data.submitted_at, 40),
      'New',
      '',
      email,
      preferredTime
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        replyTo: email || NOTIFY_EMAIL.split(',')[0],
        subject: 'New Valencia Town lead: ' + name,
        body: 'Name: ' + name + '\nPhone: ' + phone + '\nEmail: ' + (email || 'not given') +
          '\nPreferred call time: ' + (preferredTime || 'any time') +
          '\nLooking for: ' + clean(data.interest, 120) +
          '\nSource: ' + (clean(data.utm_source, 100) || 'direct') + ' / ' + clean(data.source, 40) +
          '\n\nOpen the sheet: ' + SpreadsheetApp.getActive().getUrl()
      });
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the web app URL in a browser to check it is live
function doGet() {
  return json({ ok: true, service: 'Valencia Town leads' });
}

function getSheet() {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#C08A62').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.getRange('O2:O').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(['New', 'Called', 'Site visit booked', 'Visited', 'Booked', 'Not interested'], true)
        .build());
  }
  return sheet;
}

function isDuplicate(sheet, phone) {
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var start = Math.max(2, last - 49);                                  // check the latest 50 rows
  var rows = sheet.getRange(start, 1, last - start + 1, 3).getValues();
  var cutoff = Date.now() - DUPLICATE_WINDOW_MIN * 60000;
  return rows.some(function (r) {
    if (String(r[2]).replace(/^'/, '') !== phone) return false;
    // Sheets may turn the timestamp text into a Date; handle both
    var t = r[0] instanceof Date ? r[0] : Utilities.parseDate(String(r[0]), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss');
    return t.getTime() > cutoff;
  });
}

function clean(v, max) {
  // Strip characters that make Sheets treat text as a formula
  return String(v == null ? '' : v).trim().replace(/^[=+\-@]+/, '').slice(0, max);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Run once from the editor to check everything works (adds a test row)
function testLead() {
  var res = doPost({ postData: { contents: JSON.stringify({
    name: 'Test Lead', phone: '+919876543210', email: 'test@example.com', preferred_time: 'Evening (4 pm – 7 pm)',
    interest: 'Site visit', source: 'test',
    page: 'manual test', submitted_at: new Date().toISOString()
  }) } });
  Logger.log(res.getContent());
}
