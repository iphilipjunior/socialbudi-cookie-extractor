# SocialBudi Cookie Extractor - Developer Guide

This guide is for developers who want to contribute to the extension or understand how it works.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Building & Testing](#building--testing)
- [Contributing](#contributing)
- [Deployment](#deployment)

---

## Prerequisites

### Required

- **Google Chrome** 88+ (for testing)
- **Git** (for version control)
- **Code Editor** (VS Code recommended)

### Optional

- **Node.js** 18+ (for tooling only — the extension itself has no build step)
- Chrome extension development experience
- JavaScript ES6+ knowledge
- Familiarity with Chrome Extension APIs
- Understanding of Manifest V3 format

---

## Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/iphilipjunior/socialbudi-cookie-extractor.git
cd socialbudi-cookie-extractor
```

### 2. Install Development Tools (Optional)

While the extension uses vanilla JavaScript (no build step), you might want:

```bash
# For SVG to PNG conversion
npm install -g sharp-cli

# For code formatting
npm install -g prettier

# For linting
npm install -g eslint
```

### 3. Load Extension in Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the repository folder
5. Extension is now loaded in development mode

### 4. Enable Auto-Reload (Optional)

Chrome doesn't auto-reload extensions by default. Install the **Extensions Reloader** extension for easier development.

---

## Project Structure

```
socialbudi-cookie-extractor/
├── manifest.json              # Extension configuration (Manifest V3)
├── background.js              # Service worker (cookie extraction)
├── popup.html                 # Extension popup UI structure
├── popup.js                   # Popup UI logic
├── styles.css                 # Popup styles
├── content.js                 # Dashboard integration script
├── icon.svg                   # Master icon source
├── icons/
│   ├── README.md             # Icon conversion guide
│   ├── icon16.png            # 16x16 PNG (optional)
│   ├── icon48.png            # 48x48 PNG (optional)
│   └── icon128.png           # 128x128 PNG (optional)
├── docs/
│   ├── INSTALLATION.md       # User installation guide
│   └── DEVELOPMENT.md        # This file
├── PHASE_4_SPECS.md          # Technical specifications
├── README.md                 # Project overview
├── CHANGELOG.md              # Version history
├── LICENSE                   # MIT License
└── .gitignore                # Git ignore rules
```

---

## Architecture

### Components Overview

The extension consists of 4 main components:

#### 1. Background Service Worker (`background.js`)

Runs in the background as a service worker (Manifest V3 requirement).

- Extracts LinkedIn cookies via Chrome Cookies API
- Stores cookies in `chrome.storage.local`
- Handles messages from popup and content scripts
- Updates extension badge indicator

Key functions:
- `extractLinkedInCookie()` — Extracts `li_at` cookie
- `getCookieData()` — Retrieves stored cookie
- Auto-extraction on LinkedIn visits (optional, via `chrome.tabs.onUpdated`)

#### 2. Popup Interface (`popup.html`, `popup.js`, `styles.css`)

Displays when user clicks the extension icon.

- Shows cookie status (extracted / not extracted)
- Provides "Extract Cookie" button
- Provides "Copy Cookie" button
- Shows cookie metadata (length, timestamp)

Key functions:
- `handleExtractClick()` — Triggers cookie extraction
- `handleCopyClick()` — Copies cookie to clipboard
- `updateStatus()` — Refreshes status display
- `formatDate()` — Relative time formatting

#### 3. Content Script (`content.js`)

Runs on `contentscrapingserver.site` and `localhost` only.

- Announces extension presence to dashboard on load
- Listens for cookie requests from dashboard page
- Sends cookies to dashboard page via `window.postMessage`

Key functions:
- `announceExtension()` — Posts `SOCIALBUDI_EXTENSION_READY`
- `handleCookieRequest()` — Retrieves cookie and posts response
- Domain guard prevents running on unintended pages

#### 4. Icons (`icon.svg`, `icons/*.png`)

- SVG source with SocialBudi branding
- Blue gradient background (`#0066FF → #0052CC`)
- Cookie design with chocolate chips and bite notch
- PNG files generated from SVG (see `icons/README.md`)

---

### Communication Flow

#### Cookie Extraction Flow

```
User clicks extension icon
        ↓
Popup sends 'extractCookie' message to background worker
        ↓
Background worker reads cookie from Chrome Cookies API
        ↓
Cookie stored in chrome.storage.local
        ↓
Badge updated with ✓ indicator
        ↓
Popup shows success message
```

#### Dashboard Integration Flow

```
User visits SocialBudi dashboard
        ↓
Content script loads and posts SOCIALBUDI_EXTENSION_READY
        ↓
Dashboard detects extension via window message listener
        ↓
User clicks "Send Cookie" in dashboard
        ↓
Dashboard posts REQUEST_LINKEDIN_COOKIE
        ↓
Content script retrieves cookie from background worker
        ↓
Content script posts LINKEDIN_COOKIE_RESPONSE to dashboard
        ↓
Dashboard sends cookie to backend API
```

---

## Building & Testing

### Testing Locally

#### 1. Load Extension

```bash
# Navigate to repository
cd socialbudi-cookie-extractor

# Open Chrome extensions page
open "chrome://extensions/"   # macOS
start chrome://extensions/    # Windows
xdg-open chrome://extensions/ # Linux

# Enable Developer Mode → Load unpacked → Select folder
```

#### 2. Test Cookie Extraction

1. Log into LinkedIn
2. Click extension icon
3. Click "Extract LinkedIn Cookie"
4. Check console for logs (F12 → Console)
5. Verify badge shows ✓

#### 3. Test Dashboard Integration

1. Navigate to `localhost` or `contentscrapingserver.site`
2. Open console (F12)
3. Look for `[SocialBudi Extension]` messages
4. Verify `SOCIALBUDI_EXTENSION_READY` is posted
5. Test the full cookie request/response cycle

#### 4. Test Error Handling

- Try extracting without LinkedIn login
- Try copying without prior extraction
- Try sending to dashboard without a stored cookie
- Verify appropriate error messages appear in all cases

---

### Debugging

Check the browser console for prefixed log lines:

| Prefix | Source |
|--------|--------|
| `[SocialBudi Popup]` | `popup.js` |
| `[SocialBudi Extension]` | `content.js` |
| `[SocialBudi]` | `background.js` |

**Service worker not starting:** Check `chrome://serviceworker-internals/`

**Messages not passing:** Verify `event.source === window` guard in `content.js`

**Cookie not extracting:** Confirm LinkedIn login state and that `cookies` permission is granted

---

## Code Style Guidelines

### JavaScript

- Use ES6+ features (`async/await`, arrow functions, `const`/`let`)
- Prefer `async/await` over promise chains
- Add JSDoc comments to all exported/module-level functions
- Use descriptive variable names
- Wrap all async operations in `try/catch`
- **Never log raw cookie values** — log lengths and flags only

```javascript
/**
 * Extract LinkedIn cookie from browser
 *
 * @returns {Promise<Object>} Result with success status and message
 */
async function extractLinkedInCookie() {
  try {
    const cookie = await chrome.cookies.get({
      url: LINKEDIN_DOMAIN,
      name: COOKIE_NAME
    });

    if (cookie) {
      // Process cookie...
      return { success: true, message: 'Cookie extracted' };
    }

    return { success: false, message: 'No cookie found' };
  } catch (error) {
    console.error('[SocialBudi] Error:', error);
    return { success: false, message: error.message };
  }
}
```

### CSS

- Use BEM naming convention where practical
- Mobile-first responsive design
- Use CSS variables for brand colors
- Comment complex or non-obvious selectors
- Maintain accessible contrast ratios (WCAG AA minimum)

### HTML

- Semantic HTML5 elements
- ARIA labels where native semantics are insufficient
- No inline styles or inline scripts
- Clear section comments

---

## Contributing

### Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (see [Testing Locally](#testing-locally))
5. Commit with conventional commits
6. Push to your fork (`git push origin feature/amazing-feature`)
7. Open a Pull Request against `main`

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Purpose |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Formatting, no logic change |
| `refactor:` | Code restructuring |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance tasks |

**Examples:**

```
feat: add auto-extraction on LinkedIn visits
fix: correct badge indicator not showing on startup
docs: update installation guide with screenshots
refactor: simplify message passing logic in content.js
```

---

## Deployment

### Creating a Release

#### 1. Update Version

Update the version string in:
- `manifest.json` → `"version"` field
- `CHANGELOG.md` → add new `[x.y.z] - YYYY-MM-DD` section
- `content.js` → `SOCIALBUDI_EXTENSION_READY` message payload

#### 2. Build ZIP File

```bash
# From repository root
zip -r cookie-extractor-v1.0.0.zip . \
  -x "*.git*" \
  -x "*.DS_Store" \
  -x "node_modules/*" \
  -x "docs/*" \
  -x ".vscode/*"
```

#### 3. Upload to Distribution

**Google Drive (current method):**
1. Upload zip to Google Drive
2. Set sharing: "Anyone with link"
3. Copy shareable link
4. Update dashboard download link

**Chrome Web Store (future):**
1. Create developer account ($5 one-time fee)
2. Prepare store listing (screenshots, description, privacy policy)
3. Upload zip
4. Submit for review (typically 1–2 weeks)

---

## API Reference

### Chrome APIs Used

| API | Purpose |
|-----|---------|
| `chrome.cookies` | Read `li_at` from LinkedIn domain |
| `chrome.storage.local` | Persist cookie data locally |
| `chrome.runtime` | Message passing between components |
| `chrome.action` | Control extension icon and badge |
| `chrome.tabs` | Detect LinkedIn page visits |

### Message Protocol

**Popup → Background:**

```javascript
{ action: 'extractCookie' | 'getCookie' }
```

**Background → Popup:**

```javascript
{
  success: boolean,
  message: string,
  has_cookie: boolean,
  linkedin_cookie?: string,  // present only on getCookie
  user_agent?: string,
  extracted_at?: string,
  cookie_length?: number
}
```

**Content Script ↔ Dashboard (`window.postMessage`):**

```javascript
// Extension → Dashboard (on load)
{ type: 'SOCIALBUDI_EXTENSION_READY', version: '1.0.0', timestamp: string }

// Dashboard → Extension (user action)
{ type: 'REQUEST_LINKEDIN_COOKIE' }

// Extension → Dashboard (success)
{
  type: 'LINKEDIN_COOKIE_RESPONSE',
  success: true,
  data: { linkedin_cookie: string, user_agent: string, extracted_at: string },
  timestamp: string
}

// Extension → Dashboard (failure)
{
  type: 'LINKEDIN_COOKIE_RESPONSE',
  success: false,
  error: string,
  message: string,
  timestamp: string
}
```

---

## Security Considerations

### What to NEVER do

- ❌ Log cookie values to the console
- ❌ Send cookies to unauthorized domains
- ❌ Store passwords or other credentials
- ❌ Execute code received from external sources
- ❌ Modify LinkedIn cookies or page content

### What to ALWAYS do

- ✅ Validate `event.source` before processing `window.postMessage`
- ✅ Use HTTPS-only connections
- ✅ Handle all errors gracefully with user-facing messages
- ✅ Request only the minimum permissions needed
- ✅ Keep dependencies at zero (vanilla JS only)

---

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Overview](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Cookies API](https://developer.chrome.com/docs/extensions/reference/cookies/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## License

MIT License — see [LICENSE](../LICENSE)

---

## Support

- GitHub Issues: https://github.com/iphilipjunior/socialbudi-cookie-extractor/issues
- Email: support@socialbudi.com
- Specs: [PHASE_4_SPECS.md](../PHASE_4_SPECS.md)

---

**Happy coding! 🚀**
