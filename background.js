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
 * Extract LinkedIn cookie from browser
 *
 * @returns {Promise<Object>} Result object with success status and message
 */
async function extractLinkedInCookie() {
  try {
    // Get LinkedIn cookie from Chrome
    const cookie = await chrome.cookies.get({
      url: LINKEDIN_DOMAIN,
      name: COOKIE_NAME
    });

    if (cookie && cookie.value) {
      // Prepare data to store
      const data = {
        linkedin_cookie: cookie.value,
        user_agent: navigator.userAgent,
        extracted_at: new Date().toISOString(),
        cookie_domain: cookie.domain,
        cookie_expires: cookie.expirationDate ? cookie.expirationDate * 1000 : null,
        cookie_length: cookie.value.length
      };

      // Store in chrome.storage.local
      await chrome.storage.local.set(data);

      // Show success badge
      await chrome.action.setBadgeText({ text: '✓' });
      await chrome.action.setBadgeBackgroundColor({ color: '#00AA00' });

      console.log('[SocialBudi] Cookie extracted successfully');

      return {
        success: true,
        message: 'LinkedIn cookie extracted successfully',
        cookie_length: cookie.value.length,
        extracted_at: data.extracted_at
      };
    } else {
      // No cookie found
      console.warn('[SocialBudi] LinkedIn cookie not found');

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
 * @returns {Promise<Object>} Stored cookie data
 */
async function getCookieData() {
  try {
    const data = await chrome.storage.local.get([
      'linkedin_cookie',
      'user_agent',
      'extracted_at',
      'cookie_domain',
      'cookie_expires',
      'cookie_length'
    ]);

    // Check if cookie exists
    const hasCookie = !!data.linkedin_cookie;

    return {
      has_cookie: hasCookie,
      linkedin_cookie: data.linkedin_cookie || null,
      user_agent: data.user_agent || null,
      extracted_at: data.extracted_at || null,
      cookie_domain: data.cookie_domain || null,
      cookie_expires: data.cookie_expires || null,
      cookie_length: data.cookie_length || 0
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
      chrome.action.setBadgeText({ text: '✓' });
      chrome.action.setBadgeBackgroundColor({ color: '#00AA00' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  });
});

console.log('[SocialBudi] Background service worker loaded');
