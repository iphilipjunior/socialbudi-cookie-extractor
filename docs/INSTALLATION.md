# SocialBudi Cookie Extractor - Installation Guide

This guide will help you install and use the SocialBudi Cookie Extractor Chrome Extension.

## What is this extension?

The SocialBudi Cookie Extractor makes it easy to extract your LinkedIn authentication cookie (`li_at`) without needing technical knowledge. This cookie is required for SocialBudi's LinkedIn scraping features.

**Why you need this:**
- LinkedIn scraping requires your authentication cookie
- Manual extraction via Chrome DevTools is too technical
- This extension does it in one click

---

## Prerequisites

Before installing, make sure you have:

- ✅ Google Chrome browser (version 88 or higher)
- ✅ An active LinkedIn account
- ✅ A SocialBudi account (sign up at contentscrapingserver.site)

---

## Installation Steps

### Step 1: Download the Extension

1. Go to the SocialBudi dashboard
2. Navigate to the LinkedIn scraper section
3. Click the **"Download Cookie Extractor"** button
4. Save the zip file to your computer (e.g., `Downloads/socialbudi-cookie-extractor.zip`)

**Alternative:** Download directly from [Google Drive link] (if provided separately)

---

### Step 2: Unzip the File

**Windows:**
1. Right-click the downloaded zip file
2. Select "Extract All..."
3. Choose a location (e.g., `Documents/Chrome Extensions/`)
4. Click "Extract"

**macOS:**
1. Double-click the downloaded zip file
2. The folder will automatically extract to the same location

**Linux:**
```bash
unzip socialbudi-cookie-extractor.zip -d ~/chrome-extensions/
```

---

### Step 3: Open Chrome Extensions Page

1. Open Google Chrome
2. Click the three-dot menu (⋮) in the top-right corner
3. Select **More Tools → Extensions**
4. Or navigate directly to: `chrome://extensions/`

---

### Step 4: Enable Developer Mode

1. On the Extensions page, find the **"Developer mode"** toggle in the top-right
2. Click to turn it **ON**
3. You should now see additional buttons: "Load unpacked", "Pack extension", etc.

**Note:** This is safe - you're just enabling the ability to install extensions that aren't from the Chrome Web Store.

---

### Step 5: Load the Extension

1. Click the **"Load unpacked"** button
2. Navigate to the folder where you extracted the extension
3. Select the `socialbudi-cookie-extractor` folder (the one containing `manifest.json`)
4. Click **"Select Folder"** (or "Open" on some systems)

---

### Step 6: Verify Installation

You should now see:
- ✅ "SocialBudi Cookie Extractor" in your extensions list
- ✅ The extension icon in your Chrome toolbar (may need to click the puzzle icon to see it)
- ✅ Status showing "Errors: 0" (no errors)

**If you see the extension icon:** Installation successful! ✅

**If you don't see the icon:** Click the puzzle piece icon in the toolbar, then click the pin icon next to "SocialBudi Cookie Extractor"

---

## How to Use

### Extract Your LinkedIn Cookie

**Method 1: Automatic Extraction**
1. Log into LinkedIn in Chrome
2. Visit any LinkedIn page (e.g., your feed)
3. The extension automatically extracts your cookie in the background
4. You'll see a ✓ badge on the extension icon when successful

**Method 2: Manual Extraction**
1. Log into LinkedIn in Chrome
2. Click the SocialBudi extension icon in your toolbar
3. Click the **"Extract LinkedIn Cookie"** button
4. Wait for the success message

---

### Send Cookie to SocialBudi Dashboard

1. Go to your SocialBudi dashboard (contentscrapingserver.site)
2. Navigate to the LinkedIn scraper section
3. The dashboard will automatically detect the extension
4. Click **"Send Cookie"** button
5. Your cookie is now saved and ready for scraping!

**Alternatively:**
1. Click the extension icon
2. Click **"Copy Cookie"**
3. Paste manually if needed (advanced users)

---

## Troubleshooting

### "No cookie found" Error

**Cause:** You're not logged into LinkedIn

**Solution:**
1. Open a new tab and go to linkedin.com
2. Log in with your credentials
3. Click the extension icon again
4. Click "Extract LinkedIn Cookie"

---

### Extension Not Showing in Dashboard

**Cause:** Dashboard page not refreshed after installation

**Solution:**
1. Refresh the SocialBudi dashboard page (F5)
2. The extension should now be detected
3. If still not working, check that the extension is enabled in `chrome://extensions/`

---

### "Extension Error" on Installation

**Cause:** Wrong folder selected or corrupted download

**Solution:**
1. Make sure you selected the folder containing `manifest.json`
2. Re-download the extension zip file
3. Extract again and try loading the extension

---

### Cookie Expired or Invalid

**Cause:** LinkedIn cookies expire periodically

**Solution:**
1. Log out of LinkedIn completely
2. Log back in
3. Extract cookie again using the extension
4. Send new cookie to dashboard

---

## Privacy & Security

### What data does the extension collect?

- ✅ Your LinkedIn cookie (li_at)
- ✅ Your browser user agent
- ✅ Extraction timestamp

### Where is this data stored?

- Locally in your browser (chrome.storage.local)
- Only sent to SocialBudi when you explicitly click "Send Cookie"

### What data does the extension NOT collect?

- ❌ Your LinkedIn password
- ❌ Your browsing history
- ❌ Any personal information
- ❌ Data from other websites

### Is it safe?

- ✅ Open source code (you can review it)
- ✅ No external connections except to SocialBudi
- ✅ No analytics or tracking
- ✅ You control when cookies are sent

---

## Updating the Extension

When a new version is released:

1. Download the new version zip file
2. Extract to a new folder
3. Go to `chrome://extensions/`
4. Click **"Remove"** on the old version
5. Click **"Load unpacked"** and select the new folder

**Note:** Your stored cookie will be lost - you'll need to extract it again.

---

## Uninstalling

If you want to remove the extension:

1. Go to `chrome://extensions/`
2. Find "SocialBudi Cookie Extractor"
3. Click **"Remove"**
4. Confirm removal

**Note:** This deletes the stored cookie from your browser. Your data on SocialBudi servers is unaffected.

---

## Getting Help

**Extension Issues:**
- GitHub: [Issues](https://github.com/iphilipjunior/socialbudi-cookie-extractor/issues)
- Email: support@socialbudi.com

**SocialBudi Account Issues:**
- Dashboard: contentscrapingserver.site/support
- Email: support@socialbudi.com

---

## Frequently Asked Questions

### Do I need to keep the extension running all the time?

No. You only need it when:
- Extracting a new cookie (when LinkedIn session expires)
- Updating your cookie in the dashboard

### Will this affect my LinkedIn account?

No. The extension only reads your existing authentication cookie. It doesn't:
- Change your LinkedIn settings
- Post anything on your behalf
- Access your messages or connections

### How often do I need to extract the cookie?

LinkedIn cookies typically last 30-60 days. You'll need to extract a new cookie when:
- The old one expires
- You log out and back into LinkedIn
- SocialBudi shows "Invalid cookie" error

### Can I use this on multiple computers?

Yes! Install the extension on each computer where you use Chrome. Each installation works independently.

### Does this work on other browsers?

No, currently only Google Chrome is supported. Firefox and Edge versions may be added in the future.

---

## Next Steps

After installing:
1. ✅ Extract your LinkedIn cookie
2. ✅ Send cookie to SocialBudi dashboard
3. ✅ Start using LinkedIn scraping features
4. ✅ Join our community for tips and support

**Happy scraping! 🚀**

---

**Version:** 1.0.0
**Last Updated:** February 20, 2026
**Support:** support@socialbudi.com
