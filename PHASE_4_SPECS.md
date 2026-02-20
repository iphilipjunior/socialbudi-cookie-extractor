# SocialBudi Phase 4 Specifications
# Cookie Extractor Chrome Extension

**Phase:** 4 of 10 (Extension Component)
**Repository:** socialbudi-cookie-extractor
**Dependencies:** Phase 4 Backend (socialbudi-vm1-backend)
**Duration:** 2-3 days (16-24 hours)
**Status:** 🔄 IN PROGRESS

---

## Phase 4 Extension Objectives

This component implements the Cookie Extractor Chrome Extension - a critical UX feature that enables non-technical users to easily extract their LinkedIn authentication cookies for SocialBudi scraping services.

**What This Extension Accomplishes:**
1. Automatic LinkedIn cookie extraction (li_at)
2. Secure local storage of extracted cookies
3. Browser user agent capture
4. One-click integration with SocialBudi dashboard
5. Clipboard copy functionality for manual use

**Why This Extension is Critical:**
- LinkedIn scraper (Phase 6) requires user's li_at cookie
- Manual cookie extraction via DevTools is too technical for 95% of users
- Without this, users cannot use LinkedIn scraping features
- Eliminates major UX barrier for non-technical users

---

## Extension Architecture

### Manifest V3 Structure
```json
{
  "manifest_version": 3,
  "name": "SocialBudi Cookie Extractor",
  "version": "1.0.0",
  "permissions": ["cookies", "storage"],
  "host_permissions": ["*://*.linkedin.com/*"],
  "background": { "service_worker": "background.js" },
  "action": { "default_popup": "popup.html" },
  "content_scripts": [{
    "matches": ["*://contentscrapingserver.site/*"],
    "js": ["content.js"]
  }]
}
```

### Component Responsibilities

**background.js (Service Worker)**
- Listen for LinkedIn page visits
- Extract li_at cookie from LinkedIn domain
- Store cookie + user agent in chrome.storage.local
- Set badge indicator when cookie extracted
- Respond to messages from popup and content scripts

**popup.html/popup.js (User Interface)**
- Display extraction status
- "Extract Cookie" button
- "Copy Cookie" button
- Show cookie metadata (length, timestamp)
- Instructions for users

**content.js (Dashboard Integration)**
- Runs on contentscrapingserver.site
- Listen for cookie requests from dashboard
- Send extracted cookie to dashboard page
- Notify dashboard that extension is installed

**styles.css (UI Styling)**
- Clean, professional popup design
- SocialBudi branding colors (#0066FF)
- Responsive layout
- Success/error states

---

## User Flow

### Flow 1: Extract Cookie

1. User logs into LinkedIn in Chrome
2. User clicks SocialBudi extension icon
3. User clicks "Extract Cookie" button
4. Background worker extracts li_at cookie
5. Cookie stored in chrome.storage.local
6. Success message displayed
7. Badge shows ✓ indicator

### Flow 2: Send to Dashboard

1. User navigates to SocialBudi dashboard
2. Dashboard detects extension via content script
3. User clicks "Send Cookie" in dashboard
4. Content script retrieves cookie from storage
5. Content script sends to dashboard page
6. Dashboard sends to backend via API
7. Success confirmation shown

---

## Technical Specifications

### Cookie Extraction

**Target Cookie:**
- Name: `li_at`
- Domain: `.linkedin.com`
- Type: Authentication session cookie
- Typical length: 60-100 characters

**Storage Format:**
```javascript
{
  linkedin_cookie: "AQEDARabcdef...",
  user_agent: "Mozilla/5.0...",
  extracted_at: "2026-02-20T10:30:00Z",
  cookie_domain: ".linkedin.com",
  cookie_expires: 1740000000000
}
```

### Dashboard Communication

Extension → Dashboard:
```javascript
window.postMessage({
  type: 'SOCIALBUDI_EXTENSION_READY',
  version: '1.0.0'
}, '*');
```

Dashboard → Extension:
```javascript
window.postMessage({
  type: 'REQUEST_LINKEDIN_COOKIE'
}, '*');
```

Extension → Dashboard:
```javascript
window.postMessage({
  type: 'LINKEDIN_COOKIE_RESPONSE',
  success: true,
  data: {
    linkedin_cookie: "...",
    user_agent: "...",
    extracted_at: "..."
  }
}, '*');
```

---

## Security & Privacy

### Security Measures

- Local-Only Storage: Cookie stored only in chrome.storage.local
- HTTPS Only: Extension only works on HTTPS domains
- Content Script Isolation: Only runs on contentscrapingserver.site
- No External Dependencies: Vanilla JavaScript only

### Privacy Considerations

- User Consent: Explicit user action required to extract and send
- Data Minimization: Only collect necessary data
- No Tracking: No analytics or telemetry
- User Control: Can clear data or uninstall anytime

---

## Distribution Strategy

### Phase 1: Google Drive (MVP)

1. Build extension zip file
2. Upload to Google Drive
3. Set sharing: "Anyone with link"
4. Add download link to dashboard

**User Installation:**
1. Download zip from Google Drive
2. Unzip to folder
3. Chrome → Extensions → Developer Mode ON
4. Load Unpacked → Select folder

---

## Implementation Steps

| Step | Task | Status |
|------|------|--------|
| 4.7 | Repository Setup | ✅ COMPLETE |
| 4.8 | Core Documentation | 🔄 IN PROGRESS |
| 4.9 | Manifest & Background | ⏸️ PENDING |
| 4.10 | Extension UI | ⏸️ PENDING |
| 4.11 | Dashboard Integration | ⏸️ PENDING |
| 4.12 | Icons & Assets | ⏸️ PENDING |
| 4.13 | User Documentation | ⏸️ PENDING |
| 4.14 | Local Testing | ⏸️ PENDING |
| 4.15 | Package Extension | ⏸️ PENDING |
| 4.16 | Google Drive Upload | ⏸️ PENDING |
| 4.17 | End-to-End Testing | ⏸️ PENDING |

---

## Success Criteria

**Code Quality:**
- All files functional
- No console errors
- Valid Manifest V3
- Clean, commented code

**Functionality:**
- Cookie extraction works
- Dashboard integration works
- Popup UI functional
- Copy to clipboard works

**Documentation:**
- PHASE_4_SPECS.md complete
- README.md clear
- Installation guide helpful

---

**Last Updated:** February 20, 2026
**Status:** In Development
**Next:** Step 4.9 - Extension Code
