/**
 * ============================================================================
 * THE SHADY RIVER ECOSYSTEM - UNIFIED ACCESSIBILITY (WCAG 2.1 AA) CONTROLLER
 * ============================================================================
 */

(function () {
  'use strict';

  if (window.__A11Y_INITIALIZED__) return;
  window.__A11Y_INITIALIZED__ = true;

  // 1. Accessibility State Management & LocalStorage Persistence
  const STORAGE_KEY = 'bard_a11y_prefs';

  const a11yState = {
    contrast: false,
    textSizeIndex: 0, // 0: Normal, 1: font-lg (+15%), 2: font-xl (+30%)
    underline: false,
    motion: false
  };

  let previousActiveElement = null;

  function loadA11yState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.contrast === 'boolean') a11yState.contrast = parsed.contrast;
        if (typeof parsed.textSizeIndex === 'number') a11yState.textSizeIndex = parsed.textSizeIndex;
        if (typeof parsed.underline === 'boolean') a11yState.underline = parsed.underline;
        if (typeof parsed.motion === 'boolean') a11yState.motion = parsed.motion;
      } catch (e) {}
    }
    applyA11yState();
  }

  function saveA11yState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(a11yState));
    } catch (e) {}
    applyA11yState();
  }

  // Apply classes to <html> tag
  function applyA11yState() {
    const root = document.documentElement;
    if (!root) return;

    // Contrast
    if (a11yState.contrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Text Size
    root.classList.remove('font-lg', 'font-xl');
    if (a11yState.textSizeIndex === 1) root.classList.add('font-lg');
    if (a11yState.textSizeIndex === 2) root.classList.add('font-xl');

    // Underline Links
    if (a11yState.underline) {
      root.classList.add('underline-links');
    } else {
      root.classList.remove('underline-links');
    }

    // Motion
    if (a11yState.motion) {
      root.classList.add('user-reduced-motion');
    } else {
      root.classList.remove('user-reduced-motion');
    }

    updateToolbarUI();
  }

  // Update Toolbar UI Elements if present in DOM
  function updateToolbarUI() {
    const elContrast = document.getElementById('val-contrast');
    if (elContrast) {
      elContrast.innerText = a11yState.contrast ? 'ON' : 'Off';
      elContrast.className = a11yState.contrast ? 'text-amber-400 font-bold' : 'text-stone-400';
    }

    const elTextsize = document.getElementById('val-textsize');
    if (elTextsize) {
      const labels = ['Normal', 'Large (+15%)', 'Extra Large (+30%)'];
      elTextsize.innerText = labels[a11yState.textSizeIndex] || 'Normal';
      elTextsize.className = a11yState.textSizeIndex > 0 ? 'text-amber-400 font-bold' : 'text-stone-400';
    }

    const elUnderline = document.getElementById('val-underline');
    if (elUnderline) {
      elUnderline.innerText = a11yState.underline ? 'ON' : 'Off';
      elUnderline.className = a11yState.underline ? 'text-amber-400 font-bold' : 'text-stone-400';
    }

    const elMotion = document.getElementById('val-motion');
    if (elMotion) {
      elMotion.innerText = a11yState.motion ? 'Reduced' : 'System';
      elMotion.className = a11yState.motion ? 'text-amber-400 font-bold' : 'text-stone-400';
    }
  }

  // 1.5 Ensure Accessibility Preferences Toolbar Exists in DOM
  function ensureA11yToolbarExists() {
    let toolbar = document.getElementById('a11y-toolbar');
    if (toolbar) return toolbar;

    const toolbarHtml = `
      <div id="a11y-toolbar" class="hidden border-b border-amber-500/40 py-3 px-4 text-xs transition-all shadow-2xl relative z-40 bg-stone-900" role="region" aria-label="Accessibility Display Preferences" style="background-color: #0b0f14;">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs" style="background-color: rgba(69, 26, 3, 0.8);">
              <i class="fa-solid fa-universal-access" aria-hidden="true"></i>
            </div>
            <div>
              <span class="font-bold text-stone-100 block" style="font-family: serif, system-ui;">Accessibility Preferences</span>
              <span class="text-stone-400 text-[11px]">Custom display controls for readability &amp; vision assistance</span>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-xs">
            <button id="btn-contrast" onclick="toggleA11yOption('contrast')" class="px-3 py-1.5 rounded-lg text-stone-200 border border-white/10 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500" style="background-color: #171e2a;">
              High Contrast: <span id="val-contrast" class="text-stone-400">Off</span>
            </button>
            <button id="btn-textsize" onclick="cycleTextSize()" class="px-3 py-1.5 rounded-lg text-stone-200 border border-white/10 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500" style="background-color: #171e2a;">
              Text Size: <span id="val-textsize" class="text-stone-400">Normal</span>
            </button>
            <button id="btn-underline" onclick="toggleA11yOption('underline')" class="px-3 py-1.5 rounded-lg text-stone-200 border border-white/10 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500" style="background-color: #171e2a;">
              Underline Links: <span id="val-underline" class="text-stone-400">Off</span>
            </button>
            <button id="btn-motion" onclick="toggleA11yOption('motion')" class="px-3 py-1.5 rounded-lg text-stone-200 border border-white/10 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500" style="background-color: #171e2a;">
              Reduced Motion: <span id="val-motion" class="text-stone-400">System</span>
            </button>
            <button onclick="resetA11yOptions()" class="px-2 py-1 text-stone-400 hover:text-white underline transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white">
              Reset
            </button>
          </div>
        </div>
      </div>
    `;

    // Anchor after header or nav or body start
    const headerEl = document.querySelector('header');
    const navEl = document.querySelector('nav');
    const targetAnchor = headerEl || navEl;

    if (targetAnchor && targetAnchor.parentNode) {
      targetAnchor.insertAdjacentHTML('afterend', toolbarHtml);
    } else if (document.body) {
      document.body.insertAdjacentHTML('afterbegin', toolbarHtml);
    }

    toolbar = document.getElementById('a11y-toolbar');
    updateToolbarUI();
    return toolbar;
  }

  // Toggle Accessibility Preferences Toolbar
  window.toggleA11yToolbar = function () {
    const toolbar = ensureA11yToolbarExists();
    if (!toolbar) return;

    const toggleBtn = document.getElementById('a11y-toggle-btn') || 
                      document.getElementById('a11y-trigger-btn') || 
                      document.getElementById('a11y-trigger') || 
                      document.querySelector('button[aria-controls="a11y-toolbar"]');

    const isHidden = toolbar.classList.contains('hidden');
    if (isHidden) {
      toolbar.classList.remove('hidden');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
      const firstBtn = toolbar.querySelector('button');
      if (firstBtn) firstBtn.focus();
      toolbar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      toolbar.classList.add('hidden');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    }
  };

  // Toggle individual option
  window.toggleA11yOption = function (option) {
    if (option === 'contrast') {
      a11yState.contrast = !a11yState.contrast;
    } else if (option === 'underline') {
      a11yState.underline = !a11yState.underline;
    } else if (option === 'motion') {
      a11yState.motion = !a11yState.motion;
    }
    saveA11yState();
  };

  // Cycle text size: Normal -> Large -> XL -> Normal
  window.cycleTextSize = function () {
    a11yState.textSizeIndex = (a11yState.textSizeIndex + 1) % 3;
    saveA11yState();
  };

  // Reset all options
  window.resetA11yOptions = function () {
    a11yState.contrast = false;
    a11yState.textSizeIndex = 0;
    a11yState.underline = false;
    a11yState.motion = false;
    saveA11yState();
  };

  // 2. Accessibility Statement Modal
  function ensureA11yModalExists() {
    if (document.getElementById('a11y-modal')) return;

    const modalHtml = `
      <div id="a11y-modal" role="dialog" aria-modal="true" aria-labelledby="a11y-modal-title" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md hidden transition-opacity duration-300">
        <div class="relative w-full max-w-2xl bg-soil-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          <div class="p-6 border-b border-white/10 bg-soil-850 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 text-sm">
                <i class="fa-solid fa-universal-access" aria-hidden="true"></i>
              </div>
              <h3 id="a11y-modal-title" class="text-xl font-display font-bold text-stone-100">Accessibility Statement</h3>
            </div>
            <button id="a11y-close-btn" onclick="closeA11yModal()" aria-label="Close accessibility statement modal" class="p-2 text-stone-400 hover:text-white transition-colors rounded-lg focus-visible:ring-2 focus-visible:ring-amber-500">
              <i class="fa-solid fa-xmark text-lg" aria-hidden="true"></i>
            </button>
          </div>

          <div class="p-6 sm:p-8 overflow-y-auto space-y-5 text-stone-300 text-sm leading-relaxed font-body">
            <div class="p-4 bg-amber-950/40 border border-amber-500/40 rounded-2xl text-xs font-mono text-amber-300">
              <strong>Conformance Standard:</strong> Conformance with Level AA of the World Wide Web Consortium (W3C) Web Content Accessibility Guidelines 2.1 (WCAG 2.1 AA) and the Americans with Disabilities Act (ADA Title III).
            </div>

            <h4 class="font-display font-bold text-stone-100 text-base">Our Commitment</h4>
            <p>
              The Shady River Bard is dedicated to ensuring that our creative music catalog, concept vaults, investigative dossiers, and homestead stories remain fully accessible to all individuals, including those with visual, auditory, motor, and cognitive disabilities.
            </p>

            <h4 class="font-display font-bold text-stone-100 text-base">Key Accessibility Features</h4>
            <ul class="list-disc pl-5 space-y-2 text-xs text-stone-300 font-body">
              <li><strong>Comprehensive Keyboard Navigation:</strong> All cards, interactive links, lyrics accordions, and dialog drawers can be navigated seamlessly using <kbd class="px-1.5 py-0.5 rounded bg-soil-800 border border-white/10 font-mono text-[11px]">Tab</kbd>, <kbd class="px-1.5 py-0.5 rounded bg-soil-800 border border-white/10 font-mono text-[11px]">Enter</kbd>, and <kbd class="px-1.5 py-0.5 rounded bg-soil-800 border border-white/10 font-mono text-[11px]">Escape</kbd> with prominent focus rings.</li>
              <li><strong>Screen Reader Optimization:</strong> Complete WAI-ARIA dialog specifications, accessible labels on all media players, live region announcements during track searches, and descriptive alternative text.</li>
              <li><strong>Custom Display Preferences:</strong> Instant high-contrast toggles, text scaling up to 130% without distortion, persistent link underlines, and reduced motion overrides.</li>
              <li><strong>Skip Navigation:</strong> A direct "Skip to main content" bypass link for keyboard users.</li>
            </ul>

            <h4 class="font-display font-bold text-stone-100 text-base">Accessibility Feedback &amp; Assistance</h4>
            <p>
              We actively welcome your feedback. If you encounter any barriers or need assistance accessing any track, lyrics, or historical record, please reach out directly:
            </p>
            <div class="p-4 bg-soil-850 rounded-2xl border border-white/10 text-xs font-mono text-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span>theshadyriverbard@gmail.com</span>
              <a href="mailto:theshadyriverbard@gmail.com?subject=Accessibility%20Assistance" class="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition-colors">
                Send Email →
              </a>
            </div>
            <p class="text-xs text-stone-400">
              We treat all accessibility requests as high priority and aim to respond and provide alternative formats within 1 to 2 business days.
            </p>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  window.openA11yModal = function () {
    ensureA11yModalExists();
    const modal = document.getElementById('a11y-modal');
    if (!modal) return;
    previousActiveElement = document.activeElement;
    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('a11y-close-btn');
    if (closeBtn) closeBtn.focus();
  };

  window.closeA11yModal = function () {
    const modal = document.getElementById('a11y-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  };

  // 3. Copyright, Fair Use & Sampling Policy Modal
  function ensureCopyrightModalExists() {
    if (document.getElementById('copyright-modal')) return;

    const modalHtml = `
      <div id="copyright-modal" role="dialog" aria-modal="true" aria-labelledby="copyright-modal-title" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md hidden transition-opacity duration-300">
        <div class="relative w-full max-w-2xl bg-soil-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          <div class="p-6 border-b border-white/10 bg-soil-850 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 text-sm">
                <i class="fa-solid fa-scale-balanced" aria-hidden="true"></i>
              </div>
              <div>
                <h3 id="copyright-modal-title" class="text-xl font-display font-bold text-stone-100">Copyright, Fair Use &amp; Sampling Policy</h3>
                <span class="text-[11px] font-mono text-stone-400">The Shady River Homestead, LLC &bull; Western Washington State</span>
              </div>
            </div>
            <button id="copyright-close-btn" onclick="closeCopyrightModal()" aria-label="Close licensing and sampling policy modal" class="p-2 text-stone-400 hover:text-white transition-colors rounded-lg focus-visible:ring-2 focus-visible:ring-amber-500">
              <i class="fa-solid fa-xmark text-lg" aria-hidden="true"></i>
            </button>
          </div>

          <div class="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-300 text-sm leading-relaxed font-body">
            
            <div class="p-4 bg-soil-850 border border-white/10 rounded-2xl text-xs font-mono text-stone-300 space-y-1">
              <div class="text-amber-400 font-bold uppercase tracking-wider">&copy; 2026 The Shady River Homestead, LLC &amp; The Shady River Bard</div>
              <p class="text-stone-400">All sound recordings, musical compositions, lyrics, written prose, and visual artwork are protected under United States and international copyright law. All rights reserved.</p>
            </div>

            <!-- Section 1: Fair Use & Cultural Commentary -->
            <div>
              <h4 class="font-display font-bold text-stone-100 text-base flex items-center gap-2 mb-2">
                <i class="fa-solid fa-graduation-cap text-amber-400 text-xs" aria-hidden="true"></i>
                <span>1. Fair Use &amp; Educational Commentary</span>
              </h4>
              <p class="text-xs sm:text-sm text-stone-300 leading-relaxed font-body">
                We believe in open cultural critique and rigorous civic discussion. Quoting song lyrics, referencing historical dossiers, or utilizing excerpted audio snippets for commentary, scholarship, podcast reviews, academic research, or educational instruction is warmly supported under traditional Fair Use principles (17 U.S.C. &sect; 107).
              </p>
            </div>

            <!-- Section 2: Sampling Policy for Hip-Hop Artists, Beatmakers & DJs -->
            <div>
              <h4 class="font-display font-bold text-stone-100 text-base flex items-center gap-2 mb-2">
                <i class="fa-solid fa-compact-disc text-amber-400 text-xs" aria-hidden="true"></i>
                <span>2. Sampling Policy for Producers, Beatmakers &amp; DJs</span>
              </h4>
              <p class="text-xs sm:text-sm text-stone-300 leading-relaxed font-body mb-3">
                The Shady River Bard honors the American musical tradition: songs are meant to live in the air and speak to new generations. Independent music producers, hip-hop artists, remixers, and DJs are granted <strong>explicit non-commercial permission</strong> to sample vocal stanzas, acoustic hooks, or instrumental phrases from any released album for:
              </p>
              <ul class="list-disc pl-5 space-y-1.5 text-xs text-stone-300 font-body mb-3">
                <li>Non-commercial mixtapes, SoundCloud/Bandcamp beat tapes, and remix showcases.</li>
                <li>Live DJ sets, club routines, and performance mixes.</li>
                <li>Social media production breakdowns, beat-making videos, and studio process reels.</li>
              </ul>
              <div class="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-mono">
                <strong>Required Attribution:</strong> Include credit in your track description or liner notes: <br>
                <span class="text-white mt-1 block font-mono">&ldquo;Sampled from The Shady River Bard &ndash; [Song Title] (theshadyriverbard.com)&rdquo;</span>
              </div>
            </div>

            <!-- Section 3: Commercial Releases & Master Sync Clearance -->
            <div>
              <h4 class="font-display font-bold text-stone-100 text-base flex items-center gap-2 mb-2">
                <i class="fa-solid fa-file-signature text-amber-400 text-xs" aria-hidden="true"></i>
                <span>3. Commercial Releases &amp; Master Sync Licensing</span>
              </h4>
              <p class="text-xs sm:text-sm text-stone-300 leading-relaxed font-body mb-3">
                If you are planning a commercial release (monetized streaming distribution, physical vinyl/CD pressing) or seeking synchronization rights for independent documentary films, video games, podcasts, or broadcast media:
              </p>
              <div class="p-4 bg-soil-850 rounded-2xl border border-white/10 text-xs font-mono text-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div class="text-stone-400 text-[11px]">Direct Licensing Inquiries:</div>
                  <span class="font-bold text-amber-400">theshadyriverbard@gmail.com</span>
                </div>
                <a href="mailto:theshadyriverbard@gmail.com?subject=Licensing%20%2F%20Sampling%20Clearance%20Inquiry" class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition-colors text-xs whitespace-nowrap shadow-md">
                  Contact for Licensing &rarr;
                </a>
              </div>
              <p class="text-xs text-stone-400 mt-2">
                We support fellow independent creators with straightforward, fair-rate, and accessible clearance terms.
              </p>
            </div>

          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  window.openCopyrightModal = function () {
    ensureCopyrightModalExists();
    const modal = document.getElementById('copyright-modal');
    if (!modal) return;
    previousActiveElement = document.activeElement;
    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('copyright-close-btn');
    if (closeBtn) closeBtn.focus();
  };

  window.closeCopyrightModal = function () {
    const modal = document.getElementById('copyright-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  };

  // 4. Global Modal Trapping & Escape Key Handlers
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      // Close copyright modal
      const cModal = document.getElementById('copyright-modal');
      if (cModal && !cModal.classList.contains('hidden')) {
        closeCopyrightModal();
        return;
      }
      // Close accessibility modal
      const a11yModal = document.getElementById('a11y-modal');
      if (a11yModal && !a11yModal.classList.contains('hidden')) {
        closeA11yModal();
        return;
      }
      // Close video modal if open
      if (typeof window.closeVideoModal === 'function') {
        const vidModal = document.getElementById('video-modal');
        if (vidModal && !vidModal.classList.contains('hidden')) {
          window.closeVideoModal();
          return;
        }
      }
      // Close vault modals if open
      if (typeof window.closeModal === 'function') {
        window.closeModal();
      }
      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        const mobileBtn = document.getElementById('mobile-menu-btn');
        if (mobileBtn) {
          mobileBtn.setAttribute('aria-expanded', 'false');
          mobileBtn.focus();
        }
      }
    }

    // Modal Focus Trapping
    const openModals = Array.from(document.querySelectorAll('[role="dialog"]:not(.hidden), #video-modal:not(.hidden), #a11y-modal:not(.hidden)'));
    if (openModals.length > 0 && e.key === 'Tab') {
      const activeModal = openModals[openModals.length - 1];
      const focusables = activeModal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]');
      if (focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  // Apply on immediate load
  loadA11yState();

  function initA11y() {
    loadA11yState();
    ensureA11yToolbarExists();

    // Auto-bind any accessibility toggle triggers across all portal/subsite pages
    const triggerButtons = document.querySelectorAll('#a11y-toggle-btn, #a11y-trigger-btn, #a11y-trigger, button[aria-controls="a11y-toolbar"], button[aria-controls="a11y-toolbar-modal"]');
    triggerButtons.forEach(btn => {
      const existingOnclick = btn.getAttribute('onclick') || '';
      if (!existingOnclick || existingOnclick.indexOf('toggleA11yToolbar') === -1) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          window.toggleA11yToolbar();
        });
      }
    });

    // Auto-open Copyright / Sampling Policy modal if hash matches
    if (window.location.hash === '#copyright-policy' || window.location.hash === '#licensing-sampling-policy' || window.location.hash === '#sampling-policy') {
      setTimeout(() => {
        if (typeof window.openCopyrightModal === 'function') {
          window.openCopyrightModal();
        }
      }, 350);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initA11y);
  } else {
    initA11y();
  }
})();
