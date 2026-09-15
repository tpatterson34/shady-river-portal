/**
 * The Shady River Homestead — Living Plant Catalog JS
 * Manages search, multi-axis filtering, modal botanical dossiers, and keyboard navigation.
 */

(function () {
  'use strict';

  // State
  let allPlants = window.HOMESTEAD_PLANTS || [];
  let searchQuery = '';
  let activeCategory = 'all';
  let activeUse = 'all';

  // DOM Elements
  const gridEl = document.getElementById('plant-grid');
  const emptyStateEl = document.getElementById('empty-state');
  const resultsCountEl = document.getElementById('results-count');
  const searchInput = document.getElementById('plant-search');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  const modalEl = document.getElementById('plant-modal');
  const modalContentEl = document.getElementById('modal-content');
  const modalBackdrop = document.getElementById('modal-backdrop');

  // Fallback SVG for plant image errors
  window.handleImgError = function (img) {
    img.onerror = null;
    img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231c1917"/><path d="M200 70 C140 100 130 180 180 220 C220 220 270 180 260 110 C240 80 210 70 200 70 Z" fill="%2310b981" opacity="0.2"/><path d="M200 230 L200 100" stroke="%2310b981" stroke-width="4" opacity="0.4"/><text x="200" y="260" font-family="sans-serif" font-size="14" fill="%23a8a29e" text-anchor="middle">Botanical Specimen</text></svg>';
  };

  function init() {
    renderPlants();
    bindEvents();
    checkUrlHash();
  }

  function bindEvents() {
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        searchQuery = e.target.value.trim().toLowerCase();
        if (clearSearchBtn) {
          clearSearchBtn.classList.toggle('hidden', searchQuery.length === 0);
        }
        applyFilters();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', function () {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.add('hidden');
        applyFilters();
        searchInput.focus();
      });
    }

    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', resetAllFilters);
    }

    // Category filter pills
    document.querySelectorAll('[data-category-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('[data-category-filter]').forEach(function (b) {
          b.classList.remove('bg-emerald-600', 'text-stone-950', 'font-bold');
          b.classList.add('bg-stone-900', 'text-stone-300');
        });
        btn.classList.add('bg-emerald-600', 'text-stone-950', 'font-bold');
        btn.classList.remove('bg-stone-900', 'text-stone-300');
        activeCategory = btn.getAttribute('data-category-filter');
        applyFilters();
      });
    });

    // Functional Use pills
    document.querySelectorAll('[data-use-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('[data-use-filter]').forEach(function (b) {
          b.classList.remove('bg-amber-600', 'text-stone-950', 'font-bold');
          b.classList.add('bg-stone-900', 'text-stone-300');
        });
        btn.classList.add('bg-amber-600', 'text-stone-950', 'font-bold');
        btn.classList.remove('bg-stone-900', 'text-stone-300');
        activeUse = btn.getAttribute('data-use-filter');
        applyFilters();
      });
    });

    // Modal Close
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalEl && !modalEl.classList.contains('hidden')) {
        closeModal();
      }
    });

    window.addEventListener('hashchange', checkUrlHash);
  }

  function resetAllFilters() {
    searchQuery = '';
    if (searchInput) searchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
    activeCategory = 'all';
    activeUse = 'all';

    document.querySelectorAll('[data-category-filter]').forEach(function (b) {
      const isAll = b.getAttribute('data-category-filter') === 'all';
      b.classList.toggle('bg-emerald-600', isAll);
      b.classList.toggle('text-stone-950', isAll);
      b.classList.toggle('font-bold', isAll);
      b.classList.toggle('bg-stone-900', !isAll);
      b.classList.toggle('text-stone-300', !isAll);
    });

    document.querySelectorAll('[data-use-filter]').forEach(function (b) {
      const isAll = b.getAttribute('data-use-filter') === 'all';
      b.classList.toggle('bg-amber-600', isAll);
      b.classList.toggle('text-stone-950', isAll);
      b.classList.toggle('font-bold', isAll);
      b.classList.toggle('bg-stone-900', !isAll);
      b.classList.toggle('text-stone-300', !isAll);
    });

    applyFilters();
  }

  function filterPlant(p) {
    if (activeCategory !== 'all' && p.category !== activeCategory) {
      return false;
    }

    if (activeUse !== 'all') {
      if (activeUse === 'edible' && (!p.tags.includes('Edible') || p.edibility.includes('NON-EDIBLE'))) return false;
      if (activeUse === 'medicinal' && !p.tags.includes('Medicinal')) return false;
      if (activeUse === 'recipes' && (!p.recipes || p.recipes.includes('None'))) return false;
      if (activeUse === 'dye' && !p.tags.includes('Natural Dye')) return false;
      if (activeUse === 'soil' && !p.tags.includes('Nitrogen Fixer') && !p.tags.includes('Dynamic Accumulator')) return false;
    }

    if (searchQuery) {
      const searchBlob = [
        p.commonName,
        p.latinName,
        p.description,
        p.planting,
        p.harvest,
        p.hardiness,
        p.edibility,
        p.medicinalUse,
        p.recipes,
        p.craftAndUtilitarian,
        p.dyeColor,
        p.category,
        p.layer,
        p.tags.join(' ')
      ].join(' ').toLowerCase();

      return searchBlob.indexOf(searchQuery) !== -1;
    }

    return true;
  }

  function applyFilters() {
    const filtered = allPlants.filter(filterPlant);
    renderGrid(filtered);

    if (resultsCountEl) {
      resultsCountEl.textContent = 'Showing ' + filtered.length + ' of ' + allPlants.length + ' cultivars';
    }

    if (emptyStateEl) {
      emptyStateEl.classList.toggle('hidden', filtered.length > 0);
    }
  }

  function renderPlants() {
    applyFilters();
  }

  function renderGrid(plants) {
    if (!gridEl) return;
    gridEl.innerHTML = '';

    plants.forEach(function (plant) {
      const card = document.createElement('div');
      card.className = 'plant-card bg-stone-900/85 border border-stone-800 hover:border-emerald-600/50 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg';

      const tagsHtml = plant.tags.slice(0, 4).map(function (t) {
        let cls = 'bg-stone-800 text-stone-300 border-stone-700';
        if (t === 'Edible') cls = 'tag-edible';
        if (t === 'Medicinal') cls = 'tag-medicinal';
        if (t === 'Natural Dye') cls = 'tag-natural-dye';
        if (t === 'Nitrogen Fixer' || t === 'Dynamic Accumulator') cls = 'tag-nitrogen-fixer';
        if (t === 'Homestead Planting') cls = 'tag-planted';
        return '<span class="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ' + cls + '">' + t + '</span>';
      }).join(' ');

      const plantingBadge = '<div class="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-emerald-950/85 text-emerald-400 border border-emerald-500/40 font-mono text-xs shadow-md flex items-center gap-1.5 backdrop-blur-sm"><i class="fa-solid fa-seedling text-[10px]" aria-hidden="true"></i><span>Planted</span></div>';

      const cleanHardiness = (plant.hardiness || '')
        .replace('Hardy to approx. ', '')
        .replace('Hardiness: ', '')
        .split('so long')[0]
        .trim();

      const hardinessBadge = cleanHardiness
        ? '<div class="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-stone-950/80 text-amber-400 border border-amber-500/30 font-mono text-xs shadow-md backdrop-blur-sm">' + cleanHardiness + '</div>'
        : '';

      const harvestInfo = plant.harvest
        ? '<div class="flex items-center gap-1.5 text-xs font-mono text-amber-400/90 mt-1"><i class="fa-regular fa-calendar-check text-[10px]"></i><span>Harvest: ' + plant.harvest + '</span></div>'
        : '';

      card.innerHTML = [
        '<div>',
        '  <div class="relative aspect-video w-full overflow-hidden bg-stone-950 border-b border-stone-800 group">',
        '    ' + plantingBadge,
        '    ' + hardinessBadge,
        '    <img src="' + plant.imageUrl + '" alt="' + plant.commonName + '" loading="lazy" onerror="handleImgError(this)" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100">',
        '    <div class="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-60"></div>',
        '  </div>',
        '  <div class="p-5 sm:p-6">',
        '    <div class="flex items-center justify-between gap-2 mb-1.5">',
        '      <span class="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">' + plant.layer + '</span>',
        '      <span class="text-[10px] font-mono text-stone-400">' + plant.category + '</span>',
        '    </div>',
        '    <h3 class="text-xl font-display font-bold text-stone-100 group-hover:text-amber-400 transition-colors">' + plant.commonName + '</h3>',
        '    <p class="text-xs font-serif italic text-stone-400 mb-3">' + plant.latinName + '</p>',
        '    ' + harvestInfo,
        '    <p class="text-xs font-serif text-stone-300 line-clamp-3 leading-relaxed mt-3">' + (plant.description || plant.edibility) + '</p>',
        '    <div class="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-stone-800/80">' + tagsHtml + '</div>',
        '  </div>',
        '</div>',
        '<div class="p-5 sm:p-6 pt-0">',
        '  <button onclick="window.openPlantModal(\'' + plant.id + '\')" class="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-emerald-600 hover:text-stone-950 text-stone-200 text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 border border-stone-700 hover:border-emerald-500 shadow-sm">',
        '    <i class="fa-solid fa-book-bookmark text-[11px]" aria-hidden="true"></i>',
        '    <span>Botanical Dossier</span>',
        '  </button>',
        '</div>'
      ].join('\n');

      gridEl.appendChild(card);
    });
  }

  window.openPlantModal = function (plantId) {
    const plant = allPlants.find(function (p) { return p.id === plantId; });
    if (!plant || !modalEl || !modalContentEl) return;

    window.location.hash = 'plant-' + plant.id;

    const tagsHtml = plant.tags.map(function (t) {
      let cls = 'bg-stone-800 text-stone-300 border-stone-700';
      if (t === 'Edible') cls = 'tag-edible';
      if (t === 'Medicinal') cls = 'tag-medicinal';
      if (t === 'Natural Dye') cls = 'tag-natural-dye';
      if (t === 'Nitrogen Fixer' || t === 'Dynamic Accumulator') cls = 'tag-nitrogen-fixer';
      if (t === 'Homestead Planting') cls = 'tag-planted';
      return '<span class="px-2.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider ' + cls + '">' + t + '</span>';
    }).join(' ');

    const plantedNotice =
      '<div class="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between mb-6">' +
      '  <div class="flex items-center gap-3">' +
      '    <div class="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">' +
      '      <i class="fa-solid fa-seedling text-lg" aria-hidden="true"></i>' +
      '    </div>' +
      '    <div>' +
      '      <div class="font-display font-bold text-emerald-300 text-sm">Established Homestead Cultivar</div>' +
      '      <div class="font-serif text-stone-300 text-xs">Actively cultivated and thriving on the 7-acre Shady River homestead &middot; USDA Zone 8b.</div>' +
      '    </div>' +
      '  </div>' +
      '  <span class="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-semibold">Planted</span>' +
      '</div>';

    modalContentEl.innerHTML = [
      '<div class="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-950">',
      '  <img src="' + plant.imageUrl + '" alt="' + plant.commonName + '" onerror="handleImgError(this)" class="w-full h-full object-cover opacity-90">',
      '  <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>',
      '  <button id="modal-close-x" onclick="window.closePlantModal()" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-stone-950/80 hover:bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors z-20 border border-stone-700" aria-label="Close modal">',
      '    <i class="fa-solid fa-xmark text-lg" aria-hidden="true"></i>',
      '  </button>',
      '  <div class="absolute bottom-6 left-6 right-6 z-10">',
      '    <span class="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">' + plant.layer + ' &middot; ' + plant.category + '</span>',
      '    <h2 class="text-3xl sm:text-4xl font-display font-bold text-stone-100 mt-1">' + plant.commonName + '</h2>',
      '    <p class="text-sm sm:text-base font-serif italic text-stone-300 mt-0.5">' + plant.latinName + '</p>',
      '  </div>',
      '</div>',
      '<div class="p-6 sm:p-8 space-y-8">',
      '  ' + plantedNotice,
      '  <div class="flex flex-wrap gap-2">' + tagsHtml + '</div>',
      '  <div>',
      '    <h3 class="text-sm font-mono uppercase tracking-widest text-amber-500 font-semibold mb-2">Botanical &amp; Horticultural Overview</h3>',
      '    <p class="font-serif text-stone-200 text-sm sm:text-base leading-relaxed">' + (plant.description || 'A key cultivar grown and monitored in the Shady River Homestead food forest.') + '</p>',
      '  </div>',
      '  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">',
      '    <div class="bg-stone-900/90 border border-stone-800 rounded-xl p-5">',
      '      <div class="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase mb-2">',
      '        <i class="fa-solid fa-utensils" aria-hidden="true"></i>',
      '        <span>Edibility &amp; Flavor Profile</span>',
      '      </div>',
      '      <p class="font-serif text-stone-300 text-xs sm:text-sm leading-relaxed">' + plant.edibility + '</p>',
      '    </div>',
      '    <div class="bg-stone-900/90 border border-stone-800 rounded-xl p-5">',
      '      <div class="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase mb-2">',
      '        <i class="fa-solid fa-fire-burner" aria-hidden="true"></i>',
      '        <span>Homestead Kitchen &amp; Recipes</span>',
      '      </div>',
      '      <p class="font-serif text-stone-300 text-xs sm:text-sm leading-relaxed">' + plant.recipes + '</p>',
      '    </div>',
      '  </div>',
      '  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">',
      '    <div class="bg-stone-900/90 border border-stone-800 rounded-xl p-5">',
      '      <div class="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase mb-2">',
      '        <i class="fa-solid fa-mortar-pestle" aria-hidden="true"></i>',
      '        <span>Historic Ethnobotany &amp; Medicine</span>',
      '      </div>',
      '      <p class="font-serif text-stone-300 text-xs sm:text-sm leading-relaxed">' + plant.medicinalUse + '</p>',
      '    </div>',
      '    <div class="bg-stone-900/90 border border-stone-800 rounded-xl p-5">',
      '      <div class="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase mb-2">',
      '        <i class="fa-solid fa-palette" aria-hidden="true"></i>',
      '        <span>Natural Dye, Fiber &amp; Craft</span>',
      '      </div>',
      '      <p class="font-serif text-stone-300 text-xs sm:text-sm leading-relaxed mb-2">' + plant.craftAndUtilitarian + '</p>',
      '      <div class="text-xs font-mono text-stone-400 mt-2 pt-2 border-t border-stone-800">',
      '        <span class="text-purple-300 font-semibold">Dye Hues:</span> ' + plant.dyeColor + '',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <div class="bg-stone-900/60 border border-stone-800 rounded-xl p-5">',
      '    <h4 class="text-xs font-mono uppercase tracking-widest text-stone-400 font-semibold mb-4">Field Specifications &amp; Culture</h4>',
      '    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">',
      '      <div><span class="text-stone-400 block">Cold Hardiness:</span><span class="text-stone-200 font-semibold">' + (plant.hardiness || 'Zone 8b Hardy') + '</span></div>',
      '      <div><span class="text-stone-400 block">Mature Dimensions:</span><span class="text-stone-200 font-semibold">' + (plant.size || 'Standard') + '</span></div>',
      '      <div><span class="text-stone-400 block">Bloom Window:</span><span class="text-stone-200 font-semibold">' + (plant.blooms || 'Spring') + '</span></div>',
      '      <div><span class="text-stone-400 block">Harvest Period:</span><span class="text-stone-200 font-semibold">' + (plant.harvest || 'Autumn') + '</span></div>',
      '      <div><span class="text-stone-400 block">Permaculture Guild Role:</span><span class="text-stone-200 font-semibold">' + plant.layer + '</span></div>',
      '      <div><span class="text-stone-400 block">Pest &amp; Disease Profile:</span><span class="text-stone-200 font-semibold">' + (plant.pests || 'Resilient') + '</span></div>',
      '    </div>',
      (plant.planting ? '    <div class="mt-4 pt-3 border-t border-stone-800/80 text-xs font-serif text-stone-400"><strong class="font-mono text-stone-300 uppercase">Planting &amp; Soil Notes:</strong> ' + plant.planting + '</div>' : ''),
      '  </div>',
      '</div>'
    ].join('\n');

    modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  window.closePlantModal = function () {
    if (!modalEl) return;
    modalEl.classList.add('hidden');
    document.body.style.overflow = '';
    history.pushState('', document.title, window.location.pathname + window.location.search);
  };

  function closeModal() {
    window.closePlantModal();
  }

  function checkUrlHash() {
    const hash = window.location.hash;
    if (hash && hash.indexOf('#plant-') === 0) {
      const slug = hash.replace('#plant-', '');
      window.openPlantModal(slug);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
