/**
 * SocialBudi Cookie Extractor - Background Service Worker
 *
 * This service worker handles:
 * - LinkedIn cookie extraction
 * - Local storage management
 * - Message handling from popup and content scripts
 * - Badge indicator updates
 *
 * @file background.js
 * @version 1.0.0
 */

// Constants
const LINKEDIN_DOMAIN = 'https://www.linkedin.com';
const COOKIE_NAME = 'li_at';

/**
 * Message handler for popup and content script communication
 *
 * Handles two actions:
 * - getCookie: Retrieve stored cookie data
 * - extractCookie: Extract LinkedIn cookie from browser
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCookie') {
    // Retrieve stored cookie data
    getCookieData().then(data => {
      sendResponse(data);
    }).catch(error => {
      console.error('[SocialBudi] Error getting cookie:', error);
      sendResponse({ has_cookie: false, error: error.message });
    });
    return true; // Required for async response
  }

  if (request.action === 'extractCookie') {
    // Extract LinkedIn cookie
    extractLinkedInCookie().then(result => {
      sendResponse(result);
    }).catch(error => {
      console.error('[SocialBudi] Error extracting cookie:', error);
      sendResponse({ success: false, message: error.message });
    });
    return true; // Required for async response
  }
});

/**
 * Extract LinkedIn cookies from browser
 *
 * Extracts all 3 required cookies for proxy authentication:
 * - li_at: Primary authentication cookie
 * - JSESSIONID: Session identifier
 * - bcookie: Browser cookie
 *
 * @returns {Promise<Object>} Result object with success status and message
 */
async function extractLinkedInCookie() {
  try {
    // Extract all 3 LinkedIn cookies in parallel
    const [liAtCookie, jsessionidCookie, bcookieCookie] = await Promise.all([
      chrome.cookies.get({ url: LINKEDIN_DOMAIN, name: 'li_at' }),
      chrome.cookies.get({ url: LINKEDIN_DOMAIN, name: 'JSESSIONID' }),
      chrome.cookies.get({ url: LINKEDIN_DOMAIN, name: 'bcookie' })
    ]);

    // Check if we have the primary cookie (li_at is required)
    if (liAtCookie && liAtCookie.value) {
      // Count how many cookies we successfully captured
      const cookieCount = [liAtCookie, jsessionidCookie, bcookieCookie].filter(c => c && c.value).length;

      // Prepare data to store
      const data = {
        linkedin_cookie: liAtCookie.value,
        jsessionid: jsessionidCookie?.value || null,
        bcookie: bcookieCookie?.value || null,
        user_agent: navigator.userAgent,
        extracted_at: new Date().toISOString(),
        cookie_domain: liAtCookie.domain,
        cookie_expires: liAtCookie.expirationDate ? liAtCookie.expirationDate * 1000 : null,
        cookie_length: liAtCookie.value.length,
        cookie_count: cookieCount
      };

      // Store in chrome.storage.local
      await chrome.storage.local.set(data);

      // Show badge based on cookie count
      const badgeText = cookieCount === 3 ? '✓' : cookieCount.toString();
      const badgeColor = cookieCount === 3 ? '#00AA00' : '#FFA500';

      await chrome.action.setBadgeText({ text: badgeText });
      await chrome.action.setBadgeBackgroundColor({ color: badgeColor });

      console.log(`[SocialBudi] ${cookieCount}/3 cookies extracted successfully`);

      return {
        success: true,
        message: `${cookieCount}/3 LinkedIn cookies extracted successfully`,
        cookie_count: cookieCount,
        cookie_length: liAtCookie.value.length,
        extracted_at: data.extracted_at
      };
    } else {
      // No primary cookie found
      console.warn('[SocialBudi] LinkedIn li_at cookie not found');

      // Clear badge
      await chrome.action.setBadgeText({ text: '' });

      return {
        success: false,
        message: 'LinkedIn cookie not found. Please log into LinkedIn first.'
      };
    }
  } catch (error) {
    console.error('[SocialBudi] Cookie extraction error:', error);

    // Clear badge on error
    await chrome.action.setBadgeText({ text: '' });

    return {
      success: false,
      message: 'Error extracting cookie: ' + error.message
    };
  }
}

/**
 * Get stored cookie data from chrome.storage.local
 *
 * Returns all 3 LinkedIn cookies plus metadata
 *
 * @returns {Promise<Object>} Stored cookie data
 */
async function getCookieData() {
  try {
    const data = await chrome.storage.local.get([
      'linkedin_cookie',
      'jsessionid',
      'bcookie',
      'user_agent',
      'extracted_at',
      'cookie_domain',
      'cookie_expires',
      'cookie_length',
      'cookie_count'
    ]);

    // Check if primary cookie exists
    const hasCookie = !!data.linkedin_cookie;

    return {
      has_cookie: hasCookie,
      linkedin_cookie: data.linkedin_cookie || null,
      jsessionid: data.jsessionid || null,
      bcookie: data.bcookie || null,
      user_agent: data.user_agent || null,
      extracted_at: data.extracted_at || null,
      cookie_domain: data.cookie_domain || null,
      cookie_expires: data.cookie_expires || null,
      cookie_length: data.cookie_length || 0,
      cookie_count: data.cookie_count || 0
    };
  } catch (error) {
    console.error('[SocialBudi] Error getting stored data:', error);
    return {
      has_cookie: false,
      error: error.message
    };
  }
}

/**
 * Auto-extract cookie when user visits LinkedIn (optional feature)
 *
 * This listens for tab updates and automatically extracts the cookie
 * when the user visits LinkedIn. Can be disabled if not desired.
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only run when page is fully loaded
  if (changeInfo.status === 'complete' &&
      tab.url &&
      tab.url.includes('linkedin.com')) {

    console.log('[SocialBudi] LinkedIn detected, auto-extracting cookie...');

    // Auto-extract cookie
    extractLinkedInCookie().then(result => {
      if (result.success) {
        console.log('[SocialBudi] Auto-extraction successful');
      } else {
        console.log('[SocialBudi] Auto-extraction failed:', result.message);
      }
    });
  }
});

/**
 * Extension installation handler
 *
 * Runs when extension is first installed or updated
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[SocialBudi] Extension installed');

    // Clear any existing data on fresh install
    chrome.storage.local.clear();

    // Clear badge
    chrome.action.setBadgeText({ text: '' });

  } else if (details.reason === 'update') {
    console.log('[SocialBudi] Extension updated to version', chrome.runtime.getManifest().version);
  }
});

/**
 * Extension startup handler
 *
 * Runs when Chrome starts with the extension installed
 */
chrome.runtime.onStartup.addListener(() => {
  console.log('[SocialBudi] Extension started');

  // Check if we have stored cookie and update badge
  getCookieData().then(data => {
    if (data.has_cookie) {
      const badgeText = data.cookie_count === 3 ? '✓' : (data.cookie_count || 1).toString();
      const badgeColor = data.cookie_count === 3 ? '#00AA00' : '#FFA500';
      chrome.action.setBadgeText({ text: badgeText });
      chrome.action.setBadgeBackgroundColor({ color: badgeColor });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  });
});

console.log('[SocialBudi] Background service worker loaded');
