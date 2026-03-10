# Changelog

All notable changes to the SocialBudi Cookie Extractor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- Capture JSESSIONID and bcookie alongside li_at for complete LinkedIn session authentication
- Display cookie count in popup UI (3/3 vs 1/3 or 2/3)
- Orange badge indicator when partial cookies captured (not all 3)
- Green badge indicator when all 3 cookies captured
- All 3 cookies sent to dashboard for VM2 LinkedIn scraper proxy authentication

### Changed
- Badge now shows cookie count number for partial captures instead of just checkmark
- Popup status displays individual cookie details with character counts
- Extension sends all 3 cookies to backend in POST /api/user/cookie request

### Planned
- Chrome Web Store distribution
- Auto-update functionality
- Multi-account support
- Cookie expiration warnings

## [1.0.0] - 2026-02-20

### Added
- Initial release
- LinkedIn cookie extraction (li_at)
- Local secure storage
- Browser user agent capture
- Extension popup interface
- Dashboard integration
- Copy to clipboard
- Auto-extraction on LinkedIn visits
- Badge indicator
- Installation documentation
- MIT License

### Security
- HTTPS-only operation
- Local-only storage
- Content script domain restrictions
- Message origin validation
