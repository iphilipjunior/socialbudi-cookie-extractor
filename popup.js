/**
 * SocialBudi Cookie Extractor - Popup Script
 *
 * Handles popup UI interactions:
 * - Display cookie status
 * - Extract cookie button
 * - Copy cookie button
 * - Status updates
 *
 * @file popup.js
 * @version 1.0.0
 */

// DOM elements
let extractBtn;
let copyBtn;
let statusArea;

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[SocialBudi Popup] Initializing...');

  // Get DOM elements
  extractBtn = document.getElementById('extract-btn');
  copyBtn = document.getElementById('copy-btn');
  statusArea = document.getElementById('status-area');

  // Set up event listeners
  extractBtn.addEventListener('click', handleExtractClick);
  copyBtn.addEventListener('click', handleCopyClick);

  // Load and display current status
  await updateStatus();

  console.log('[SocialBudi Popup] Initialized successfully');
});

/**
 * Handle Extract Cookie button click
 */
async function handleExtractClick() {
  try {
    // Disable button and show loading state
    extractBtn.disabled = true;
    extractBtn.innerHTML = '<span class="btn-icon">⏳</span> Extracting...';

    console.log('[SocialBudi Popup] Extracting cookie...');

    // Send message to background script to extract cookie
    const response = await chrome.runtime.sendMessage({
      action: 'extractCookie'
    });

    console.log('[SocialBudi Popup] Extract response:', response);

    // Show result
    if (response.success) {
      showStatus('success', response.message);
      copyBtn.disabled = false;

      // Update status display
      await updateStatus();
    } else {
      showStatus('error', response.message);
    }

  } catch (error) {
    console.error('[SocialBudi Popup] Extract error:', error);
    showStatus('error', 'Error: ' + error.message);
  } finally {
    // Re-enable button
    extractBtn.disabled = false;
    extractBtn.innerHTML = '<span class="btn-icon">🔄</span> Extract LinkedIn Cookie';
  }
}

/**
 * Handle Copy Cookie button click
 */
async function handleCopyClick() {
  try {
    console.log('[SocialBudi Popup] Copying cookie to clipboard...');

    // Get cookie data from background script
    const data = await chrome.runtime.sendMessage({
      action: 'getCookie'
    });

    if (data.has_cookie && data.linkedin_cookie) {
      // Copy to clipboard
      await navigator.clipboard.writeText(data.linkedin_cookie);

      // Show success message
      showStatus('success', 'Cookie copied to clipboard!');

      // Change button text temporarily
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span class="btn-icon">✓</span> Copied!';

      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
      }, 2000);

      console.log('[SocialBudi Popup] Cookie copied successfully');
    } else {
      showStatus('error', 'No cookie found to copy');
    }

  } catch (error) {
    console.error('[SocialBudi Popup] Copy error:', error);
    showStatus('error', 'Failed to copy: ' + error.message);
  }
}

/**
 * Update status display with current cookie information
 */
async function updateStatus() {
  try {
    // Get cookie data from background script
    const data = await chrome.runtime.sendMessage({
      action: 'getCookie'
    });

    if (data.has_cookie) {
      // Cookie exists - show success state
      const extractedDate = new Date(data.extracted_at);
      const cookieLength = data.cookie_length || data.linkedin_cookie.length;

      statusArea.innerHTML = `
        <div class="status-box success">
          <div class="status-icon">✓</div>
          <div class="status-content">
            <p class="status-title"><strong>Cookie Extracted</strong></p>
            <p class="status-detail">Length: ${cookieLength} characters</p>
            <p class="status-detail">Extracted: ${formatDate(extractedDate)}</p>
          </div>
        </div>
      `;

      // Enable copy button
      copyBtn.disabled = false;

    } else {
      // No cookie - show warning state
      statusArea.innerHTML = `
        <div class="status-box warning">
          <div class="status-icon">⚠</div>
          <div class="status-content">
            <p class="status-title"><strong>No Cookie Found</strong></p>
            <p class="status-detail">Please log into LinkedIn first, then extract.</p>
          </div>
        </div>
      `;

      // Disable copy button
      copyBtn.disabled = true;
    }

  } catch (error) {
    console.error('[SocialBudi Popup] Status update error:', error);

    // Show error state
    statusArea.innerHTML = `
      <div class="status-box error">
        <div class="status-icon">✗</div>
        <div class="status-content">
          <p class="status-title"><strong>Error</strong></p>
          <p class="status-detail">${error.message}</p>
        </div>
      </div>
    `;
  }
}

/**
 * Show temporary status message (alert-style)
 *
 * @param {string} type - 'success', 'error', 'info', 'warning'
 * @param {string} message - Message to display
 */
function showStatus(type, message) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  // Insert at top of status area
  statusArea.insertBefore(alert, statusArea.firstChild);

  // Remove after 3 seconds
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

/**
 * Format date for display
 *
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  // Show relative time if recent
  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffMins < 1440) {
    const hours = Math.floor(diffMins / 60);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    // Show full date/time
    return date.toLocaleString();
  }
}

console.log('[SocialBudi Popup] Script loaded');
