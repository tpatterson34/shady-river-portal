// Progressive Disclosure & Interactive App Controller

(function() {
  'use strict';

  // Toggle Thematic Door Drawers
  window.toggleDoor = function(doorId) {
    const drawer = document.getElementById(`door-drawer-${doorId}`);
    const btn = document.getElementById(`door-btn-${doorId}`);
    const icon = document.getElementById(`door-icon-${doorId}`);
    const label = document.getElementById(`door-label-${doorId}`);

    if (!drawer) return;

    const isOpen = drawer.classList.contains('open');

    // Close other doors for clean focus
    document.querySelectorAll('.accordion-content').forEach(el => {
      if (el !== drawer) {
        el.classList.remove('open');
        const otherId = el.id.replace('door-drawer-', '');
        const otherBtn = document.getElementById(`door-btn-${otherId}`);
        const otherIcon = document.getElementById(`door-icon-${otherId}`);
        const otherLabel = document.getElementById(`door-label-${otherId}`);
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherIcon) otherIcon.className = 'fa-solid fa-chevron-down text-xs transition-transform';
        if (otherLabel) otherLabel.textContent = 'Explore Depth';
      }
    });

    if (isOpen) {
      drawer.classList.remove('open');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (icon) icon.className = 'fa-solid fa-chevron-down text-xs transition-transform';
      if (label) label.textContent = 'Explore Depth';
    } else {
      drawer.classList.add('open');
      if (btn) btn.setAttribute('aria-expanded', 'true');
      if (icon) icon.className = 'fa-solid fa-chevron-up text-xs transition-transform';
      if (label) label.textContent = 'Collapse Pathway';

      // Smooth scroll into focus if needed
      setTimeout(() => {
        drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }
  };

  // Filter Thematic Constellations in Music Door
  window.filterConstellation = function(tag) {
    const items = document.querySelectorAll('.constellation-card');
    const btns = document.querySelectorAll('.constellation-btn');

    btns.forEach(b => {
      if (b.dataset.tag === tag) {
        b.className = 'constellation-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-amber-600 text-stone-950 transition-all';
      } else {
        b.className = 'constellation-btn px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition-all';
      }
    });

    items.forEach(it => {
      if (tag === 'all' || it.dataset.tags.includes(tag)) {
        it.classList.remove('hidden');
      } else {
        it.classList.add('hidden');
      }
    });
  };

  // Accessibility Modal
  window.toggleA11yModal = function() {
    const m = document.getElementById('a11y-modal');
    if (m) m.classList.toggle('hidden');
  };
  window.closeA11yModal = function() {
    const m = document.getElementById('a11y-modal');
    if (m) m.classList.add('hidden');
  };

  // Close modals on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeA11yModal();
    }
  });

})();
