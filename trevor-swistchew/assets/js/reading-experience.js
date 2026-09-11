/**
 * Trevor Swistchew Publishing Portal - Reading Experience Controller
 * Handles tri-state themes, font sizing, scroll progress, footnotes, and dossier tabs.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeManager();
  initFontSizeManager();
  initReadingProgressBar();
  initFootnoteSystem();
  initDossierTabs();
  calculateReadingMetrics();
});

/* 1. Theme Manager (Dark / Light / Sepia) */
function initThemeManager() {
  const THEME_KEY = 'trevor-portal-theme';
  const html = document.documentElement;
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';

  setTheme(savedTheme);

  // Match all theme buttons: data-set-theme, data-theme, or class theme-toggle-btn
  const themeButtons = document.querySelectorAll('[data-set-theme], [data-theme], .theme-toggle-btn');
  themeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const theme = btn.getAttribute('data-set-theme') || btn.getAttribute('data-theme');
      if (theme) setTheme(theme);
    });
  });

  function setTheme(theme) {
    if (!theme) theme = 'dark';
    
    // Remove existing theme classes
    html.classList.remove('dark', 'theme-light', 'theme-sepia');
    
    if (theme === 'light') {
      html.classList.add('theme-light');
    } else if (theme === 'sepia') {
      html.classList.add('theme-sepia');
    } else {
      theme = 'dark';
      html.classList.add('dark');
    }
    localStorage.setItem(THEME_KEY, theme);

    // Update active button indicators across all formats
    document.querySelectorAll('[data-set-theme], [data-theme], .theme-toggle-btn').forEach(b => {
      const bTheme = b.getAttribute('data-set-theme') || b.getAttribute('data-theme');
      const isCurrent = (bTheme === theme);
      b.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
      if (isCurrent) {
        b.classList.add('active-theme', 'ring-2', 'ring-amber-500', 'bg-black/20', 'text-amber-400');
        b.classList.remove('text-stone-400');
      } else {
        b.classList.remove('active-theme', 'ring-2', 'ring-amber-500', 'bg-black/20', 'text-amber-400');
        b.classList.add('text-stone-400');
      }
    });
  }
}

/* 2. Font Size Scaling */
function initFontSizeManager() {
  const FONT_KEY = 'trevor-portal-font-size';
  const html = document.documentElement;
  const fontSizes = {
    'sm': { size: '1rem', label: '16px' },
    'base': { size: '1.125rem', label: '18px' },
    'lg': { size: '1.25rem', label: '20px' },
    'xl': { size: '1.4rem', label: '22px' }
  };
  const sizeKeys = ['sm', 'base', 'lg', 'xl'];

  let savedSizeKey = localStorage.getItem(FONT_KEY) || 'base';
  if (!fontSizes[savedSizeKey]) savedSizeKey = 'base';
  setFontSize(savedSizeKey);

  // 1. Listen on [data-set-font]
  const setFontButtons = document.querySelectorAll('[data-set-font]');
  setFontButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const sizeKey = btn.getAttribute('data-set-font');
      if (fontSizes[sizeKey]) setFontSize(sizeKey);
    });
  });

  // 2. Listen on #font-size-dec, #font-size-reset, #font-size-inc
  const decBtn = document.getElementById('font-size-dec');
  const resetBtn = document.getElementById('font-size-reset');
  const incBtn = document.getElementById('font-size-inc');

  if (decBtn) {
    decBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let currentIdx = sizeKeys.indexOf(savedSizeKey);
      if (currentIdx > 0) {
        setFontSize(sizeKeys[currentIdx - 1]);
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setFontSize('base');
    });
  }

  if (incBtn) {
    incBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let currentIdx = sizeKeys.indexOf(savedSizeKey);
      if (currentIdx < sizeKeys.length - 1) {
        setFontSize(sizeKeys[currentIdx + 1]);
      }
    });
  }

  function setFontSize(sizeKey) {
    if (!fontSizes[sizeKey]) sizeKey = 'base';
    savedSizeKey = sizeKey;
    const val = fontSizes[sizeKey].size;
    html.style.setProperty('--reading-font-size', val);
    html.style.setProperty('--essay-font-size', val);
    localStorage.setItem(FONT_KEY, sizeKey);

    // Apply directly to text containers for immediate visual effect
    const articleBodies = document.querySelectorAll('#essay-article, #essay-body, .essay-content, main article .prose');
    articleBodies.forEach(el => {
      el.style.fontSize = val;
    });
    const paragraphs = document.querySelectorAll('#essay-article p, #essay-body p, .essay-content p, main article .prose p');
    paragraphs.forEach(p => {
      p.style.fontSize = val;
    });

    document.querySelectorAll('[data-set-font]').forEach(b => {
      const isCurrent = b.getAttribute('data-set-font') === sizeKey;
      b.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
      if (isCurrent) {
        b.classList.add('text-amber-500', 'font-bold');
      } else {
        b.classList.remove('text-amber-500', 'font-bold');
      }
    });
  }
}

/* 3. Reading Progress Bar */
function initReadingProgressBar() {
  const progressBar = document.getElementById('reading-progress-bar');
  const essayArticle = document.getElementById('essay-article') || document.getElementById('essay-body') || document.querySelector('article');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    if (!essayArticle) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / (docHeight || 1)) * 100;
      progressBar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
      return;
    }

    const rect = essayArticle.getBoundingClientRect();
    const articleTop = rect.top + window.scrollY;
    const articleHeight = rect.height;
    const currentScroll = window.scrollY - articleTop;
    const windowHeight = window.innerHeight;

    let percentage = 0;
    if (currentScroll > 0) {
      percentage = (currentScroll / (articleHeight - windowHeight + 200)) * 100;
    }
    progressBar.style.width = Math.min(100, Math.max(0, percentage)) + '%';
  }, { passive: true });
}

/* 4. Interactive Footnote & Annotation Popovers */
function initFootnoteSystem() {
  const footnoteRefs = document.querySelectorAll('.footnote-ref');
  let activeTooltip = null;

  footnoteRefs.forEach(ref => {
    const fnId = ref.getAttribute('href')?.replace('#', '');
    const noteContentElement = fnId ? document.getElementById(fnId) : null;
    if (!noteContentElement) return;

    ref.addEventListener('click', (e) => {
      if (window.innerWidth < 768) return;
      e.preventDefault();
      toggleTooltip(ref, noteContentElement);
    });

    ref.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 768) {
        showTooltip(ref, noteContentElement);
      }
    });

    ref.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (activeTooltip && !activeTooltip.matches(':hover') && !ref.matches(':hover')) {
          hideTooltip();
        }
      }, 250);
    });
  });

  function showTooltip(ref, contentEl) {
    hideTooltip();

    const tooltip = document.createElement('div');
    tooltip.className = 'footnote-tooltip active';
    tooltip.setAttribute('role', 'tooltip');
    
    const cleanClone = contentEl.cloneNode(true);
    const backLink = cleanClone.querySelector('.footnote-backref');
    if (backLink) backLink.remove();

    tooltip.innerHTML = `
      <div class="flex items-center justify-between pb-1.5 mb-1.5 border-b border-amber-500/30 text-xs font-mono text-amber-500">
        <span>NOTE #${ref.textContent.trim()}</span>
        <button type="button" class="close-btn text-stone-400 hover:text-stone-100">&times;</button>
      </div>
      <div class="text-sm leading-snug">${cleanClone.innerHTML}</div>
    `;

    document.body.appendChild(tooltip);
    activeTooltip = tooltip;

    const rect = ref.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    let top = rect.top + window.scrollY - tooltipRect.height - 10;
    let left = rect.left + window.scrollX - (tooltipRect.width / 2) + (rect.width / 2);

    if (top < window.scrollY + 10) {
      top = rect.bottom + window.scrollY + 10;
    }
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;

    tooltip.querySelector('.close-btn').addEventListener('click', hideTooltip);
    tooltip.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (!ref.matches(':hover')) hideTooltip();
      }, 200);
    });
  }

  function toggleTooltip(ref, contentEl) {
    if (activeTooltip) {
      hideTooltip();
    } else {
      showTooltip(ref, contentEl);
    }
  }

  function hideTooltip() {
    if (activeTooltip) {
      activeTooltip.remove();
      activeTooltip = null;
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideTooltip();
  });
  document.addEventListener('click', (e) => {
    if (activeTooltip && !activeTooltip.contains(e.target) && !e.target.classList.contains('footnote-ref')) {
      hideTooltip();
    }
  });
}

/* 5. Empirical Dossier Tabbed Interface */
function initDossierTabs() {
  const tabContainers = document.querySelectorAll('[data-dossier-tabs]');
  tabContainers.forEach(container => {
    const tabs = container.querySelectorAll('[role="tab"]');
    const panels = container.querySelectorAll('[role="tabpanel"]');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('aria-controls');
        
        tabs.forEach(t => {
          t.setAttribute('aria-selected', 'false');
          t.classList.remove('border-amber-500', 'text-amber-500', 'bg-amber-500/10');
          t.classList.add('border-transparent', 'text-stone-400');
        });

        tab.setAttribute('aria-selected', 'true');
        tab.classList.remove('border-transparent', 'text-stone-400');
        tab.classList.add('border-amber-500', 'text-amber-500', 'bg-amber-500/10');

        panels.forEach(p => {
          if (p.id === targetId) {
            p.classList.remove('hidden');
          } else {
            p.classList.add('hidden');
          }
        });
      });
    });
  });
}

/* 6. Dynamic Reading Metrics (Word Count & Reading Time) */
function calculateReadingMetrics() {
  const essayBody = document.getElementById('essay-body') || document.getElementById('essay-article');
  const wordCountElem = document.getElementById('metric-word-count');
  const readTimeElem = document.getElementById('metric-read-time');

  if (!essayBody) return;

  const text = essayBody.innerText || essayBody.textContent;
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const minutes = Math.max(1, Math.ceil(words / 220));

  if (wordCountElem) {
    wordCountElem.textContent = `${words.toLocaleString()} words`;
  }
  if (readTimeElem) {
    readTimeElem.textContent = `${minutes} min read`;
  }
}
