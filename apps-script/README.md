# Send leads to Google Sheets

1. Create a new Google Sheet (e.g. "Valencia Town Leads").
2. In the sheet: **Extensions → Apps Script**. Delete the sample code and paste in `Code.gs`.
3. Optional: set `NOTIFY_EMAIL` at the top to get an email for every new lead.
4. Click **Save**, choose `testLead` in the function dropdown and click **Run**. Approve the permissions. A `Leads` tab with one test row should appear. Delete that row.
5. **Deploy → New deployment → Select type: Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
6. Open `data/project.json` and paste the URL into `formEndpoint`, then run `python scripts/build.py`:
   ```js
   formEndpoint: 'https://script.google.com/macros/s/XXXX/exec'
   ```
7. Submit the form on the live site and check the sheet.

**After editing the script**, use **Deploy → Manage deployments → Edit → Version: New version** so the same URL keeps working.

## What gets saved
Time (IST), name, phone, "looking for", which form, page URL, UTM source/medium/campaign/term/content, gclid, fbclid, and a **Status** dropdown (New, Called, Site visit booked, Visited, Booked, Not interested) plus a Notes column for the sales team.

## Built-in protection
- Hidden honeypot field drops most spam bots.
- Phone must be a valid Indian mobile (+91, starting 6–9).
- The same number within 10 minutes is ignored (double clicks, both forms).
- Text starting with `= + - @` is cleaned so it can't run as a formula.
