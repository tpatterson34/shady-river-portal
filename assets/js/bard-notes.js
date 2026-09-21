/**
 * ============================================================================
 * THE SHADY RIVER BARD - "DROP A NOTE TO THE BARD" FEEDBACK CONTROLLER
 * ============================================================================
 * Embeds provenance metadata (page URL, song title, album, track number, timestamp)
 * into listener feedback notes to ensure the Bard knows the exact context.
 */

(function () {
  'use strict';

  const BARD_EMAIL = 'theshadyriverbard@gmail.com';
  let activeTriggerEl = null;
  let currentSong = '';
  let currentAlbum = '';
  let currentTrackNum = '';

  function buildProvenanceBlock() {
    const pageUrl = window.location.href || 'https://theshadyriverbard.com';
    let block = '\n\n─────────────────────────────────────────\n';
    block += 'NOTE METADATA & ORIGIN:\n';
    if (currentSong && currentSong !== 'A Song') {
      block += `• Song: "${currentSong}"\n`;
    }
    if (currentTrackNum) {
      block += `• Track Number: #${String(currentTrackNum).padStart(2, '0')}\n`;
    }
    block += `• Album: ${currentAlbum}\n`;
    block += `• Source Page: ${pageUrl}\n`;
    block += `• Sent: ${new Date().toLocaleString()}\n`;
    block += `• Sent via The Shady River Bard Portal (https://theshadyriverbard.com)\n`;
    block += '─────────────────────────────────────────';
    return block;
  }

  // Inject modal into DOM once
  function ensureModalExists() {
    if (document.getElementById('bard-note-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'bard-note-modal-overlay';
    overlay.className = 'bard-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'bard-modal-title-text');

    overlay.innerHTML = `
      <div class="bard-modal-dialog" id="bard-modal-dialog">
        <div class="bard-modal-header">
          <div>
            <h3 class="bard-modal-title" id="bard-modal-title-text">
              <span class="bard-modal-title-icon">&#9993;</span>
              <span>Drop a Note to the Bard</span>
            </h3>
            <div class="bard-modal-context" id="bard-modal-context-pill">
              Regarding Song
            </div>
          </div>
          <button type="button" class="bard-modal-close" id="bard-modal-close-btn" aria-label="Close note dialog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="bard-modal-body">
          <p style="font-size: 0.8125rem; color: #a8a29e; margin: 0; line-height: 1.45;">
            Have a thought, memory, or reflection stirred by this song? Send your note directly to the Bard's desk.
          </p>

          <div class="bard-modal-origin-pill" id="bard-modal-origin-info">
            <span class="bard-origin-icon">&#128205;</span>
            <span class="bard-origin-text" id="bard-origin-path">Capturing origin URL...</span>
          </div>

          <div class="bard-form-group">
            <label class="bard-form-label" for="bard-note-name">Your Name or Call-sign (Optional)</label>
            <input type="text" id="bard-note-name" class="bard-form-input" placeholder="e.g. A Traveler by the River" />
          </div>

          <div class="bard-form-group">
            <label class="bard-form-label" for="bard-note-message">Your Note or Reflection</label>
            <textarea id="bard-note-message" class="bard-form-textarea" placeholder="Write your thoughts, reactions to the lyrics, or personal reflections..."></textarea>
          </div>

          <div class="bard-modal-actions">
            <button type="button" id="bard-note-send-mailto" class="bard-btn-primary">
              <span>&#9993; Send Note via Email</span>
            </button>
            <button type="button" id="bard-note-copy-btn" class="bard-btn-secondary">
              <span>&#128203; Copy Note &amp; Email Address</span>
            </button>
          </div>

          <div class="bard-modal-footer-note">
            Direct to: <strong>${BARD_EMAIL}</strong> &bull; Origin data auto-attached
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Event listeners
    document.getElementById('bard-modal-close-btn').addEventListener('click', closeBardNoteModal);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeBardNoteModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeBardNoteModal();
      }
    });

    // Send Mailto Button
    document.getElementById('bard-note-send-mailto').addEventListener('click', () => {
      const name = document.getElementById('bard-note-name').value.trim();
      const message = document.getElementById('bard-note-message').value.trim();
      const provenance = buildProvenanceBlock();

      const subject = (currentSong && currentSong !== 'A Song')
        ? `Note for the Bard: "${currentSong}" (${currentAlbum})`
        : `Note for the Bard: ${currentAlbum}`;

      let body = `Dear Bard,\n\n`;
      if (message) {
        body += `${message}\n\n`;
      } else {
        body += `[I wanted to share my thoughts on "${currentSong || currentAlbum}"]\n\n`;
      }
      if (name) {
        body += `From: ${name}\n`;
      }
      body += provenance;

      const mailtoUrl = `mailto:${BARD_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;

      setTimeout(() => {
        closeBardNoteModal();
      }, 500);
    });

    // Copy Note & Email Button
    document.getElementById('bard-note-copy-btn').addEventListener('click', () => {
      const name = document.getElementById('bard-note-name').value.trim();
      const message = document.getElementById('bard-note-message').value.trim();
      const btn = document.getElementById('bard-note-copy-btn');
      const provenance = buildProvenanceBlock();

      const subject = (currentSong && currentSong !== 'A Song')
        ? `Note for the Bard: "${currentSong}" (${currentAlbum})`
        : `Note for the Bard: ${currentAlbum}`;

      const copyText = `To: ${BARD_EMAIL}\nSubject: ${subject}\n\n${message || '(No message written)'}\n\nFrom: ${name || 'Anonymous listener'}${provenance}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(copyText).then(() => {
          const original = btn.innerHTML;
          btn.innerHTML = '<span>&#10003; Copied to Clipboard!</span>';
          setTimeout(() => {
            btn.innerHTML = original;
          }, 2500);
        }).catch(() => {
          fallbackPrompt(copyText);
        });
      } else {
        fallbackPrompt(copyText);
      }
    });

    function fallbackPrompt(text) {
      window.prompt('Copy your note below and email it to ' + BARD_EMAIL + ':', text);
    }
  }

  // Open Modal
  window.openBardNoteModal = function (songTitle, albumTitle, trackNum) {
    ensureModalExists();
    activeTriggerEl = document.activeElement;

    currentSong = songTitle || 'A Song';
    currentAlbum = albumTitle || 'The Shady River Bard';
    if (trackNum === undefined || trackNum === null || trackNum === 'undefined' || trackNum === 'null') {
      currentTrackNum = '';
    } else {
      currentTrackNum = trackNum;
    }

    // Attempt recovery from active element or closest card if missing
    if (!currentTrackNum && activeTriggerEl) {
      const card = activeTriggerEl.closest('[data-track], .track-card, article');
      if (card) {
        const dt = card.getAttribute('data-track') || card.dataset.track;
        if (dt && /^\d+$/.test(dt)) {
          currentTrackNum = parseInt(dt, 10);
        }
      }
    }

    const pill = document.getElementById('bard-modal-context-pill');
    if (pill) {
      const trackPrefix = currentTrackNum ? `Track #${String(currentTrackNum).padStart(2, '0')}: ` : '';
      if (currentSong && currentSong !== 'A Song') {
        pill.textContent = `Regarding: ${trackPrefix}"${currentSong}" • ${currentAlbum}`;
      } else {
        pill.textContent = `Regarding Album: ${currentAlbum}`;
      }
    }

    const originPathEl = document.getElementById('bard-origin-path');
    if (originPathEl) {
      const displayUrl = window.location.pathname.replace(/^\//, '') || 'theshadyriverbard.com';
      originPathEl.textContent = `Origin: ${displayUrl} (Full URL auto-attached)`;
    }

    const msgBox = document.getElementById('bard-note-message');
    if (msgBox) msgBox.value = '';

    const overlay = document.getElementById('bard-note-modal-overlay');
    if (overlay) {
      overlay.classList.add('active');
      setTimeout(() => {
        if (msgBox) msgBox.focus();
      }, 50);
    }
  };

  // Close Modal
  window.closeBardNoteModal = function () {
    const overlay = document.getElementById('bard-note-modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
    if (activeTriggerEl && typeof activeTriggerEl.focus === 'function') {
      activeTriggerEl.focus();
    }
  };

  // ============================================================================
  // TRACK SHARE & DEEP LINKING ENGINE
  // ============================================================================

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.warn('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  }

  function showTrackShareToast(message) {
    let toast = document.getElementById('track-share-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'track-share-toast';
      toast.className = 'track-share-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="track-share-toast-icon">&#10003;</span><span>${message}</span>`;
    toast.classList.add('show');

    if (window._trackShareToastTimer) {
      clearTimeout(window._trackShareToastTimer);
    }
    window._trackShareToastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Share Track Link Action
  window.shareTrackLink = function (songTitle, albumTitle, trackIdentifier) {
    let trackNum = (typeof trackIdentifier === 'number' || /^\d+$/.test(trackIdentifier)) ? parseInt(trackIdentifier, 10) : null;
    if (trackIdentifier === undefined || trackIdentifier === null || trackIdentifier === 'undefined' || trackIdentifier === 'null' || trackIdentifier === '') {
      trackNum = null;
      trackIdentifier = null;
    }

    // Try recovering trackNum or identifier from active element / closest card if missing
    const activeBtn = document.activeElement;
    if (trackNum === null && !trackIdentifier && activeBtn) {
      const card = activeBtn.closest('[data-track], .track-card, article');
      if (card) {
        const dt = card.getAttribute('data-track') || card.dataset.track;
        if (dt && /^\d+$/.test(dt)) {
          trackNum = parseInt(dt, 10);
        } else if (card.id && /^track-(\d+)$/.test(card.id)) {
          trackNum = parseInt(card.id.replace('track-', ''), 10);
        } else if (card.id && card.id !== 'undefined') {
          trackIdentifier = card.id;
        }
      }
    }

    let anchor = '';
    if (trackNum !== null) {
      anchor = `track-${trackNum}`;
    } else if (trackIdentifier && trackIdentifier !== 'undefined' && trackIdentifier !== 'null') {
      anchor = String(trackIdentifier).replace(/^#/, '');
    } else if (songTitle) {
      // Fallback to songTitle slug rather than undefined
      anchor = songTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const baseUrl = window.location.origin + window.location.pathname;
    const fullShareUrl = anchor ? `${baseUrl}#${anchor}` : baseUrl;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullShareUrl).catch(() => {
        fallbackCopyText(fullShareUrl);
      });
    } else {
      fallbackCopyText(fullShareUrl);
    }

    const titleStr = songTitle ? `"${songTitle}"` : (trackNum !== null ? `Track #${trackNum}` : 'Track');
    showTrackShareToast(`Link for ${titleStr} copied to clipboard!`);

    // Update browser URL hash without jump
    if (window.history && window.history.replaceState && anchor) {
      window.history.replaceState(null, '', `#${anchor}`);
    }

    // Temporary tooltip feedback on active button if triggered by event
    if (activeBtn && activeBtn.classList.contains('track-share-btn')) {
      const tooltip = activeBtn.querySelector('.track-share-tooltip');
      if (tooltip) {
        const origText = tooltip.textContent;
        tooltip.textContent = '✓ Link Copied!';
        setTimeout(() => {
          tooltip.textContent = origText;
        }, 2000);
      }
    }

    // Flash highlight on the target card
    const targetCard = (anchor ? document.getElementById(anchor) : null) ||
                       (trackNum !== null ? (document.getElementById(`track-${trackNum}`) ||
                                            document.getElementById(`track-${String(trackNum).padStart(2, '0')}`) ||
                                            document.getElementById(`track-card-${trackNum}`) ||
                                            document.querySelector(`[data-track="${trackNum}"]`)) : null);
    if (targetCard) {
      const cardEl = targetCard.closest('.track-card, article') || targetCard;
      cardEl.classList.remove('track-card-highlighted');
      void cardEl.offsetWidth;
      cardEl.classList.add('track-card-highlighted');
    }
  };

  // Deep Link Resolver: Automatically scroll & highlight track on direct link arrival
  function handleTrackDeepLink() {
    const rawHash = window.location.hash ? window.location.hash.replace(/^#/, '').trim() : '';
    if (!rawHash || rawHash === 'undefined' || rawHash === 'null') return;

    let trackNum = null;
    const match = rawHash.match(/track[-_]?(\d+)/i) || rawHash.match(/song[-_]?(\d+)/i) || rawHash.match(/^(\d+)$/);
    if (match) {
      trackNum = parseInt(match[1], 10);
    }

    let attempts = 0;
    const maxAttempts = 35; // 35 * 60ms = ~2.1s
    const pollInterval = setInterval(() => {
      attempts++;
      let targetEl = document.getElementById(rawHash);

      if (!targetEl && trackNum !== null) {
        targetEl = document.getElementById(`track-${trackNum}`) ||
                   document.getElementById(`track-${String(trackNum).padStart(2, '0')}`) ||
                   document.getElementById(`track-card-${trackNum}`) ||
                   document.querySelector(`[data-track="${trackNum}"]`);
      }

      if (!targetEl) {
        targetEl = document.querySelector(`[data-slug="${rawHash}"]`) ||
                   document.getElementById(`track-${rawHash}`);
      }

      // If still not found and a filter might be active, attempt resetting filter
      if (!targetEl && trackNum !== null && attempts === 10) {
        if (typeof filterTracks === 'function') {
          try { filterTracks('all'); } catch (e) {}
        }
        if (typeof clearSearch === 'function') {
          try { clearSearch(); } catch (e) {}
        }
      }

      if (targetEl || attempts >= maxAttempts) {
        clearInterval(pollInterval);
        if (targetEl) {
          const cardEl = targetEl.closest('.track-card, article') || targetEl;

          // Check if parent act needs switching
          const actAttr = cardEl.getAttribute('data-act') || targetEl.getAttribute('data-act');
          if (actAttr && typeof filterByAct === 'function') {
            const actNumMatch = actAttr.match(/\d+/);
            if (actNumMatch) {
              try { filterByAct(parseInt(actNumMatch[0], 10)); } catch (e) {}
            }
          }

          // Smooth scroll into view
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Pulse glow animation
          cardEl.classList.remove('track-card-highlighted');
          void cardEl.offsetWidth;
          cardEl.classList.add('track-card-highlighted');

          // Auto-expand lyrics drawer if collapsed
          const slug = cardEl.getAttribute('data-slug') || targetEl.getAttribute('data-slug') || (cardEl.id !== `track-${trackNum}` ? cardEl.id : null);
          const toggleBtn = (slug ? document.getElementById(`btn-lyrics-${slug}`) : null) ||
                            (trackNum !== null ? document.getElementById(`btn-lyrics-track-${trackNum}`) : null) ||
                            (trackNum !== null ? document.getElementById(`toggle-btn-${trackNum}`) : null) ||
                            cardEl.querySelector('[id^="btn-lyrics-"]') ||
                            cardEl.querySelector('button[onclick*="toggleLyrics"]');
          if (toggleBtn && (toggleBtn.getAttribute('aria-expanded') === 'false' || cardEl.querySelector('.lyrics-drawer.hidden') || cardEl.querySelector('[id^="drawer-"].hidden'))) {
            try { toggleBtn.click(); } catch (e) {}
          }
        }
      }
    }, 60);
  }

  window.addEventListener('hashchange', handleTrackDeepLink);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleTrackDeepLink);
  } else {
    setTimeout(handleTrackDeepLink, 100);
  }

})();

