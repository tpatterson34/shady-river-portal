/**
 * ============================================================================
 * TREVOR SWISTCHEW PORTAL - "DROP A NOTE TO TREVOR" FEEDBACK CONTROLLER
 * Recipient: t.swistchew65@gmail.com
 * ============================================================================
 * Pre-populates context metadata (page URL, essay title, compendium number,
 * song title, track number, timestamp) into listener and reader notes.
 */

(function () {
  'use strict';

  const TREVOR_EMAIL = 't.swistchew65@gmail.com';
  let activeTriggerEl = null;
  let currentWork = '';
  let currentContext = '';
  let currentKind = 'work';

  function buildProvenanceBlock() {
    const pageUrl = window.location.href || 'https://theshadyriverbard.com/trevor-swistchew/';
    let block = '\n\n─────────────────────────────────────────\n';
    block += 'NOTE METADATA & ORIGIN:\n';
    if (currentWork) {
      block += `• Work: "${currentWork}"\n`;
    }
    if (currentContext) {
      block += `• Context: ${currentContext}\n`;
    }
    block += `• Recipient: Trevor Swistchew (${TREVOR_EMAIL})\n`;
    block += `• Source Page: ${pageUrl}\n`;
    block += `• Sent: ${new Date().toLocaleString()}\n`;
    block += `• Sent via Trevor Swistchew Portal (https://theshadyriverbard.com/trevor-swistchew/)\n`;
    block += '─────────────────────────────────────────';
    return block;
  }

  // Inject modal into DOM once
  function ensureModalExists() {
    if (document.getElementById('trevor-note-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'trevor-note-modal-overlay';
    overlay.className = 'trevor-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'trevor-modal-title-text');

    overlay.innerHTML = `
      <div class="trevor-modal-dialog" id="trevor-modal-dialog">
        <div class="trevor-modal-header">
          <div>
            <h3 class="trevor-modal-title" id="trevor-modal-title-text">
              <span class="trevor-modal-title-icon">&#9993;</span>
              <span>Drop a Note to Trevor</span>
            </h3>
            <div class="trevor-modal-context" id="trevor-modal-context-pill">
              Regarding Work
            </div>
          </div>
          <button type="button" class="trevor-modal-close" id="trevor-modal-close-btn" aria-label="Close note dialog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="trevor-modal-body">
          <p class="trevor-modal-intro" id="trevor-modal-intro-text">
            Have a thought, reflection, question, or reaction to this work? Send your note directly to Trevor Swistchew.
          </p>

          <div class="trevor-modal-origin-pill" id="trevor-modal-origin-info">
            <span class="trevor-origin-icon">&#128205;</span>
            <span class="trevor-origin-text" id="trevor-origin-path">Capturing origin URL...</span>
          </div>

          <div class="trevor-form-group">
            <label class="trevor-form-label" for="trevor-note-name">Your Name or Call-sign (Optional)</label>
            <input type="text" id="trevor-note-name" class="trevor-form-input" placeholder="e.g. A Reader in Edinburgh / A Fellow Thinker" />
          </div>

          <div class="trevor-form-group">
            <label class="trevor-form-label" for="trevor-note-message">Your Note or Reflection</label>
            <textarea id="trevor-note-message" class="trevor-form-textarea" placeholder="Write your thoughts, reflections, or personal reactions..."></textarea>
          </div>

          <div class="trevor-modal-actions">
            <button type="button" id="trevor-note-send-mailto" class="trevor-btn-primary">
              <span>&#9993; Send Note via Email</span>
            </button>
            <button type="button" id="trevor-note-copy-btn" class="trevor-btn-secondary">
              <span>&#128203; Copy Note &amp; Email Address</span>
            </button>
          </div>

          <div class="trevor-modal-footer-note">
            Direct to: <strong>${TREVOR_EMAIL}</strong> &bull; Provenance data auto-attached
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Event listeners
    document.getElementById('trevor-modal-close-btn').addEventListener('click', closeTrevorNoteModal);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeTrevorNoteModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeTrevorNoteModal();
      }
    });

    // Send Mailto Button
    document.getElementById('trevor-note-send-mailto').addEventListener('click', () => {
      const name = document.getElementById('trevor-note-name').value.trim();
      const message = document.getElementById('trevor-note-message').value.trim();
      const provenance = buildProvenanceBlock();

      const subject = currentWork
        ? `Note for Trevor: "${currentWork}" (${currentContext || 'Portal'})`
        : `Note for Trevor Swistchew (${currentContext || 'Salon Portal'})`;

      let body = `Dear Trevor,\n\n`;
      if (message) {
        body += `${message}\n\n`;
      } else {
        body += `[I wanted to share my reflections on "${currentWork || currentContext}"]\n\n`;
      }
      if (name) {
        body += `From: ${name}\n`;
      }
      body += provenance;

      const mailtoUrl = `mailto:${TREVOR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;

      setTimeout(() => {
        closeTrevorNoteModal();
      }, 500);
    });

    // Copy Note & Email Button
    document.getElementById('trevor-note-copy-btn').addEventListener('click', () => {
      const name = document.getElementById('trevor-note-name').value.trim();
      const message = document.getElementById('trevor-note-message').value.trim();
      const btn = document.getElementById('trevor-note-copy-btn');
      const provenance = buildProvenanceBlock();

      const subject = currentWork
        ? `Note for Trevor: "${currentWork}" (${currentContext || 'Portal'})`
        : `Note for Trevor Swistchew (${currentContext || 'Salon Portal'})`;

      const copyText = `To: ${TREVOR_EMAIL}\nSubject: ${subject}\n\n${message || '(No note written)'}\n\nFrom: ${name || 'Anonymous reader'}${provenance}`;

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
      window.prompt('Copy your note below and email it to ' + TREVOR_EMAIL + ':', text);
    }
  }

  // Open Modal
  window.openTrevorNoteModal = function (workTitle, contextInfo, kind) {
    ensureModalExists();
    activeTriggerEl = document.activeElement;

    currentWork = workTitle || 'Trevor\'s Work';
    currentContext = contextInfo || 'The Scottish Literary Salon';
    currentKind = kind || (contextInfo && contextInfo.includes('Track') ? 'song' : 'essay');

    const pill = document.getElementById('trevor-modal-context-pill');
    if (pill) {
      if (currentWork && currentWork !== 'Trevor\'s Work') {
        pill.textContent = `Regarding: "${currentWork}" • ${currentContext}`;
      } else {
        pill.textContent = `Regarding: ${currentContext}`;
      }
    }

    const introText = document.getElementById('trevor-modal-intro-text');
    if (introText) {
      if (currentKind === 'song') {
        introText.textContent = `Have a thought, reaction to the music or lyrics, or personal reflection on this song? Send your note directly to Trevor Swistchew.`;
      } else if (currentKind === 'poem') {
        introText.textContent = `Have a reflection on this poem or its themes? Send your note directly to Trevor Swistchew.`;
      } else {
        introText.textContent = `Have a thought, counter-argument, or reflection on this essay? Send your note directly to Trevor Swistchew.`;
      }
    }

    const originPathEl = document.getElementById('trevor-origin-path');
    if (originPathEl) {
      const displayUrl = window.location.pathname.replace(/^\//, '') || 'theshadyriverbard.com/trevor-swistchew/';
      originPathEl.textContent = `Origin: ${displayUrl} (Full URL auto-attached)`;
    }

    const msgBox = document.getElementById('trevor-note-message');
    if (msgBox) {
      msgBox.value = '';
      if (currentKind === 'song') {
        msgBox.placeholder = 'Write your thoughts on this song, the arrangement, or the lyrics...';
      } else {
        msgBox.placeholder = 'Write your thoughts, reflections, questions, or counter-arguments...';
      }
    }

    const overlay = document.getElementById('trevor-note-modal-overlay');
    if (overlay) {
      overlay.classList.add('active');
      setTimeout(() => {
        if (msgBox) msgBox.focus();
      }, 50);
    }
  };

  // Close Modal
  window.closeTrevorNoteModal = function () {
    const overlay = document.getElementById('trevor-note-modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
    if (activeTriggerEl && typeof activeTriggerEl.focus === 'function') {
      activeTriggerEl.focus();
    }
  };

  // Helper for current song in player deck or global persistent player
  window.openTrevorNoteModalForCurrentDeckTrack = function () {
    const titleEl = document.getElementById('deck-song-title') || document.getElementById('bottom-track-title');
    const badgeEl = document.getElementById('deck-track-badge') || document.getElementById('bottom-track-badge');
    const songTitle = titleEl ? titleEl.textContent.trim() : 'Current Track';
    const trackBadge = badgeEl ? `Track ${badgeEl.textContent.trim()}` : 'Musical Chamber';
    window.openTrevorNoteModal(songTitle, `${trackBadge} • Trevor's Grooves`, 'song');
  };

})();
