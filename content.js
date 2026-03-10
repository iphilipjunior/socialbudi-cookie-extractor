/**
 * SocialBudi Cookie Extractor - Content Script
 *
 * This script runs on the SocialBudi dashboard (contentscrapingserver.site)
 * and enables communication between the extension and the dashboard page.
 *
 * Communication Flow:
 * 1. Content script loads and announces extension presence
 * 2. Dashboard detects extension via window message
 * 3. Dashboard requests cookie via window message
 * 4. Content script retrieves cookie from background worker
 * 5. Content script sends cookie to dashboard via window message
 * 6. Dashboard sends cookie to backend API
 *
 * @file content.js
 * @version 1.0.0
 */

// Only run on allowed domains
const ALLOWED_DOMAINS = ['contentscrapingserver.site', 'localhost'];
const currentDomain = window.location.hostname;

// Check if we should run on this domain
const shouldRun = ALLOWED_DOMAINS.some(domain =>
  currentDomain === domain || currentDomain.includes(domain)
);

if (!shouldRun) {
  console.log('[SocialBudi Extension] Not running on this domain:', currentDomain);
} else {
  console.log('[SocialBudi Extension] Content script loaded on:', currentDomain);

  // Initialize the extension
  initializeExtension();
}

/**
 * Initialize extension and set up communication with dashboard
 */
function initializeExtension() {
  // Announce extension presence to the dashboard
  announceExtension();

  // Listen for messages from the dashboard
  setupMessageListener();
}

/**
 * Announce extension presence to the dashboard
 *
 * This allows the dashboard to detect that the extension is installed
 * and update the UI accordingly.
 */
function announceExtension() {
  console.log('[SocialBudi Extension] Announcing presence to dashboard...');

  // Send message to dashboard
  window.postMessage({
    type: 'SOCIALBUDI_EXTENSION_READY',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  }, '*');

  console.log('[SocialBudi Extension] Presence announced');
}

/**
 * Set up listener for messages from the dashboard
 */
function setupMessageListener() {
  window.addEventListener('message', async (event) => {
    // Only accept messages from same origin (same window)
    if (event.source !== window) {
      return;
    }

    // Handle cookie request
    if (event.data.type === 'REQUEST_LINKEDIN_COOKIE') {
      console.log('[SocialBudi Extension] Cookie request received from dashboard');
      await handleCookieRequest();
    }
  });

  console.log('[SocialBudi Extension] Message listener ready');
}

/**
 * Handle cookie request from dashboard
 *
 * Retrieves cookie from background worker and sends to dashboard
 */
async function handleCookieRequest() {
  try {
    console.log('[SocialBudi Extension] Requesting cookie from background worker...');

    // Request cookie from background script
    const response = await chrome.runtime.sendMessage({
      action: 'getCookie'
    });

    console.log('[SocialBudi Extension] Background worker response:', {
      has_cookie: response.has_cookie,
      cookie_length: response.cookie_length
    });

    if (response.has_cookie && response.linkedin_cookie) {
      // Send cookie to dashboard
      window.postMessage({
        type: 'LINKEDIN_COOKIE_RESPONSE',
        success: true,
        data: {
          linkedin_cookie: response.linkedin_cookie,
          jsessionid: response.jsessionid,
          bcookie: response.bcookie,
          user_agent: response.user_agent,
          extracted_at: response.extracted_at,
          cookie_count: response.cookie_count
        },
        timestamp: new Date().toISOString()
      }, '*');

      console.log('[SocialBudi Extension] Cookie sent to dashboard successfully');
    } else {
      // No cookie available
      window.postMessage({
        type: 'LINKEDIN_COOKIE_RESPONSE',
        success: false,
        error: 'No cookie found',
        message: 'No LinkedIn cookie found. Please extract cookie first using the extension popup.',
        timestamp: new Date().toISOString()
      }, '*');

      console.warn('[SocialBudi Extension] No cookie available to send');
    }

  } catch (error) {
    console.error('[SocialBudi Extension] Error handling cookie request:', error);

    // Send error to dashboard
    window.postMessage({
      type: 'LINKEDIN_COOKIE_RESPONSE',
      success: false,
      error: error.message,
      message: 'Failed to retrieve cookie from extension.',
      timestamp: new Date().toISOString()
    }, '*');
  }
}

/**
 * Extension unload handler
 *
 * Clean up when content script is unloaded
 */
window.addEventListener('beforeunload', () => {
  console.log('[SocialBudi Extension] Content script unloading');
});

// Log successful initialization
console.log('[SocialBudi Extension] Initialization complete');
