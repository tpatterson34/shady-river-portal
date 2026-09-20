/**
 * ============================================================================
 * THE SHADY RIVER BARD - "DROP A NOTE TO THE BARD" FEEDBACK CONTROLLER
 * ============================================================================
 */

(function () {
  'use strict';

  const BARD_EMAIL = 'theshadyriverbard@gmail.com';
  let activeTriggerEl = null;
  let currentSong = '';
  let currentAlbum = '';
  let currentTrackNum = '';

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
            Direct to: <strong>theshadyriverbard@gmail.com</strong>
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

      const subject = `Note for the Bard: "${currentSong}" (${currentAlbum})`;
      let body = `Dear Bard,\n\n`;
      if (message) {
        body += `${message}\n\n`;
      } else {
        body += `[I wanted to share my thoughts on "${currentSong}"]\n\n`;
      }
      if (name) {
        body += `From: ${name}\n`;
      }
      body += `Sent via The Shady River Bard Portal (https://theshadyriverbard.com)`;

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

      const copyText = `To: ${BARD_EMAIL}\nSubject: Note for the Bard: "${currentSong}" (${currentAlbum})\n\n${message || '(No message written)'}\n\nFrom: ${name || 'Anonymous listener'}`;

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
    currentTrackNum = trackNum || '';

    const pill = document.getElementById('bard-modal-context-pill');
    if (pill) {
      pill.textContent = `Regarding: "${currentSong}" • ${currentAlbum}`;
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

})();
