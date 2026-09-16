/**
 * Album XX: Sanity's Edge
 * Bespoke Interactive Concept Application & Streaming Jukebox
 * The Shady River Bard
 */

(function () {
  'use strict';

  // State Management
  let currentTrackIndex = 0;
  let isPlaying = false;
  let currentActFilter = 'all';
  let searchQuery = '';
  let activeArchetype = 'pigs';
  let matrixSearchQuery = '';
  let chartsInitialized = false;

  // Audio DOM Elements
  const audio = new Audio();
  audio.preload = 'metadata';

  // DOM Elements
  let playerBar, playBtn, playIcon, prevBtn, nextBtn, trackTitleEl, trackActEl, trackTimeEl, trackDurationEl, progressBar, volumeBar, muteBtn;
  let tracksContainer, searchInput, actPillButtons;
  let archetypeButtons, archetypeDetailsEl;
  let matrixBody, matrixSearchInput;
  let voteModal, artZoomModal;

  // Initialize Application
  document.addEventListener('DOMContentLoaded', () => {
    cacheDom();
    setupAudioListeners();
    setupKeyboardShortcuts();
    renderTracks();
    initArchetypes();
    initMatrix();
    initCharts();
    initA11yToolbar();
    loadVolumePreference();
  });

  function cacheDom() {
    playerBar = document.getElementById('jukebox-bar');
    playBtn = document.getElementById('player-play-btn');
    playIcon = document.getElementById('player-play-icon');
    prevBtn = document.getElementById('player-prev-btn');
    nextBtn = document.getElementById('player-next-btn');
    trackTitleEl = document.getElementById('player-track-title');
    trackActEl = document.getElementById('player-track-act');
    trackTimeEl = document.getElementById('player-current-time');
    trackDurationEl = document.getElementById('player-total-time');
    progressBar = document.getElementById('player-progress');
    volumeBar = document.getElementById('player-volume');
    muteBtn = document.getElementById('player-mute-btn');

    tracksContainer = document.getElementById('tracks-list');
    searchInput = document.getElementById('track-search');
    actPillButtons = document.querySelectorAll('[data-act-filter]');

    archetypeButtons = document.querySelectorAll('.archetype-card');
    archetypeDetailsEl = document.getElementById('archetype-active-detail');

    matrixBody = document.getElementById('matrix-table-body');
    matrixSearchInput = document.getElementById('matrix-search');

    voteModal = document.getElementById('vote-modal');
    artZoomModal = document.getElementById('art-zoom-modal');
  }

  // --- AUDIO STREAMING ENGINE ---
  function setupAudioListeners() {
    if (!audio) return;

    audio.addEventListener('timeupdate', () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        const progress = (audio.currentTime / audio.duration) * 100;
        if (progressBar) progressBar.value = progress;
        if (trackTimeEl) trackTimeEl.textContent = formatTime(audio.currentTime);
      }
    });

    audio.addEventListener('loadedmetadata', () => {
      if (trackDurationEl && !isNaN(audio.duration)) {
        trackDurationEl.textContent = formatTime(audio.duration);
      }
    });

    audio.addEventListener('ended', () => {
      nextTrack();
    });

    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (prevBtn) prevBtn.addEventListener('click', prevTrack);
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);

    if (progressBar) {
      progressBar.addEventListener('input', (e) => {
        if (!isNaN(audio.duration) && audio.duration > 0) {
          const seekTime = (e.target.value / 100) * audio.duration;
          audio.currentTime = seekTime;
        }
      });
    }

    if (volumeBar) {
      volumeBar.addEventListener('input', (e) => {
        const vol = parseFloat(e.target.value);
        audio.volume = vol;
        audio.muted = (vol === 0);
        updateVolumeIcon(vol);
        localStorage.setItem('se_volume', vol);
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        if (audio.muted) {
          if (volumeBar) volumeBar.value = 0;
          updateVolumeIcon(0);
        } else {
          const prev = parseFloat(localStorage.getItem('se_volume') || 0.85);
          audio.volume = prev > 0 ? prev : 0.85;
          if (volumeBar) volumeBar.value = audio.volume;
          updateVolumeIcon(audio.volume);
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderTracks();
      });
    }

    actPillButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        actPillButtons.forEach(b => {
          b.classList.remove('bg-crimson-600', 'text-white', 'font-bold');
          b.classList.add('bg-slate-800', 'text-stone-300');
        });
        btn.classList.remove('bg-slate-800', 'text-stone-300');
        btn.classList.add('bg-crimson-600', 'text-white', 'font-bold');
        currentActFilter = btn.dataset.actFilter;
        renderTracks();
      });
    });
  }

  function loadVolumePreference() {
    const saved = localStorage.getItem('se_volume');
    const vol = saved !== null ? parseFloat(saved) : 0.85;
    audio.volume = vol;
    if (volumeBar) volumeBar.value = vol;
    updateVolumeIcon(vol);
  }

  function updateVolumeIcon(vol) {
    if (!muteBtn) return;
    const icon = muteBtn.querySelector('i');
    if (!icon) return;
    if (audio.muted || vol === 0) {
      icon.className = 'fa-solid fa-volume-xmark text-stone-400';
    } else if (vol < 0.5) {
      icon.className = 'fa-solid fa-volume-low text-stone-300';
    } else {
      icon.className = 'fa-solid fa-volume-high text-stone-200';
    }
  }

  window.playTrack = function (index) {
    if (!window.ALBUM_DATA || !window.ALBUM_DATA.tracks) return;
    const tracks = window.ALBUM_DATA.tracks;
    if (index < 0 || index >= tracks.length) return;

    currentTrackIndex = index;
    const track = tracks[index];

    audio.src = track.audio_file;
    audio.play().then(() => {
      isPlaying = true;
      updatePlayerUI();
      highlightActiveCard();
    }).catch(err => {
      console.warn('Playback prevented or failed:', err);
    });
  };

  function togglePlay() {
    if (!audio.src && window.ALBUM_DATA && window.ALBUM_DATA.tracks) {
      playTrack(currentTrackIndex);
      return;
    }
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.play().then(() => {
        isPlaying = true;
      }).catch(err => console.warn(err));
    }
    updatePlayerUI();
    highlightActiveCard();
  }

  function prevTrack() {
    if (!window.ALBUM_DATA) return;
    let newIndex = currentTrackIndex - 1;
    if (newIndex < 0) newIndex = window.ALBUM_DATA.tracks.length - 1;
    playTrack(newIndex);
  }

  function nextTrack() {
    if (!window.ALBUM_DATA) return;
    let newIndex = currentTrackIndex + 1;
    if (newIndex >= window.ALBUM_DATA.tracks.length) newIndex = 0;
    playTrack(newIndex);
  }

  function updatePlayerUI() {
    if (!window.ALBUM_DATA) return;
    const track = window.ALBUM_DATA.tracks[currentTrackIndex];
    if (!track) return;

    if (trackTitleEl) trackTitleEl.textContent = `${track.track_number}. ${track.title}`;
    if (trackActEl) trackActEl.textContent = `Act ${track.act_number}: ${track.act_title} • ${track.key} • ${track.tempo}`;
    if (trackDurationEl) trackDurationEl.textContent = track.duration;

    if (playIcon) {
      if (isPlaying) {
        playIcon.className = 'fa-solid fa-pause text-lg';
      } else {
        playIcon.className = 'fa-solid fa-play text-lg translate-x-0.5';
      }
    }
  }

  function highlightActiveCard() {
    document.querySelectorAll('.track-card').forEach((card, idx) => {
      const isCurrent = (idx === currentTrackIndex);
      const playBadge = card.querySelector('.card-play-badge');
      if (isCurrent && isPlaying) {
        card.classList.add('border-crimson-500', 'glow-crimson');
        if (playBadge) playBadge.innerHTML = '<i class="fa-solid fa-pause"></i>';
      } else {
        card.classList.remove('border-crimson-500', 'glow-crimson');
        if (playBadge) playBadge.innerHTML = '<i class="fa-solid fa-play translate-x-0.5"></i>';
      }
    });
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Keyboard Shortcuts
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignore when typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        audio.currentTime = Math.max(0, audio.currentTime - 5);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        const v = Math.min(1, audio.volume + 0.05);
        audio.volume = v;
        if (volumeBar) volumeBar.value = v;
        updateVolumeIcon(v);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        const v = Math.max(0, audio.volume - 0.05);
        audio.volume = v;
        if (volumeBar) volumeBar.value = v;
        updateVolumeIcon(v);
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        if (muteBtn) muteBtn.click();
      }
    });
  }

  // --- RENDER TRACKS & LYRICS VAULT ---
  function renderTracks() {
    if (!tracksContainer || !window.ALBUM_DATA || !window.ALBUM_DATA.tracks) return;

    let filtered = window.ALBUM_DATA.tracks.filter(t => {
      // Act filter
      if (currentActFilter !== 'all' && t.act_number !== parseInt(currentActFilter)) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const hay = `${t.track_number} ${t.title} ${t.summary} ${t.lyrics} ${t.vocal_profile} ${t.act_title}`.toLowerCase();
        if (!hay.includes(searchQuery)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      tracksContainer.innerHTML = `
        <div class="text-center py-16 text-stone-400 font-mono text-sm">
          <i class="fa-solid fa-circle-question text-3xl mb-3 text-stone-600 block"></i>
          No tracks found matching "${escapeHtml(searchQuery)}" in Act ${currentActFilter}.
        </div>
      `;
      return;
    }

    tracksContainer.innerHTML = filtered.map(t => {
      const realIndex = window.ALBUM_DATA.tracks.findIndex(item => item.track_number === t.track_number);
      const isCurrent = (realIndex === currentTrackIndex && isPlaying);

      return `
        <article class="track-card card-obsidian p-6 sm:p-8 rounded-2xl relative transition-all ${isCurrent ? 'border-crimson-500 glow-crimson' : ''}" id="track-${t.track_number}">
          
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div class="flex items-start gap-4 sm:gap-6">
              <!-- Play Button Badge -->
              <button onclick="playTrack(${realIndex})" class="card-play-badge w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white flex items-center justify-center text-xl shadow-lg transition-transform hover:scale-105 flex-shrink-0" aria-label="Play ${escapeHtml(t.title)}">
                <i class="fa-solid ${isCurrent ? 'fa-pause' : 'fa-play translate-x-0.5'}"></i>
              </button>

              <div class="space-y-1.5">
                <div class="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span class="px-2.5 py-0.5 rounded-full bg-crimson-950/80 border border-crimson-500/40 text-crimson-400 font-bold uppercase tracking-wider">
                    Track ${t.track_number}
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full bg-slate-800 text-stone-300">
                    Act ${t.act_number}: ${escapeHtml(t.act_title)}
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full bg-slate-900/80 text-amber-400 border border-amber-500/30">
                    ${escapeHtml(t.key)} • ${escapeHtml(t.tempo)}
                  </span>
                  <span class="text-stone-400 ml-1">
                    <i class="fa-regular fa-clock mr-1 text-[11px]"></i>${t.duration}
                  </span>
                </div>

                <h3 class="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  ${escapeHtml(t.title)}
                </h3>

                <p class="text-xs sm:text-sm font-mono text-stone-400">
                  <span class="text-stone-500 uppercase tracking-widest text-[11px]">Vocal Architecture:</span> ${escapeHtml(t.vocal_profile)}
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3 lg:self-center">
              <button onclick="copyLyrics(${t.track_number})" id="copy-btn-${t.track_number}" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-stone-200 border border-white/10 text-xs font-mono transition-colors flex items-center gap-2">
                <i class="fa-regular fa-copy"></i>
                <span>Copy Lyrics</span>
              </button>
              <button onclick="toggleLyricsDeck(${t.track_number})" id="toggle-deck-btn-${t.track_number}" class="px-4 py-2 rounded-xl bg-crimson-900/40 hover:bg-crimson-900/70 border border-crimson-500/40 text-crimson-300 text-xs font-mono font-bold transition-colors flex items-center gap-2">
                <span>View Lyrics &amp; Analysis</span>
                <i class="fa-solid fa-chevron-down text-xs transition-transform duration-300" id="chevron-${t.track_number}"></i>
              </button>
            </div>
          </div>

          <!-- Narrative Summary -->
          <div class="pt-5 text-sm sm:text-base text-stone-300 font-body leading-relaxed">
            <p>${escapeHtml(t.summary)}</p>
          </div>

          <!-- Collapsible Lyrics & Tactical Deck -->
          <div id="lyrics-deck-${t.track_number}" class="hidden mt-6 pt-6 border-t border-white/10 space-y-6">
            <div class="p-6 rounded-2xl bg-black/40 border border-white/10">
              <div class="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <span class="font-mono text-xs text-crimson-400 uppercase tracking-widest font-bold flex items-center gap-2">
                  <i class="fa-solid fa-align-left text-sm"></i> Pure Literary Lyrics (Zero AI Tags)
                </span>
                <button onclick="copyLyrics(${t.track_number})" class="text-xs font-mono text-stone-400 hover:text-white transition-colors">
                  <i class="fa-regular fa-copy mr-1"></i> Copy
                </button>
              </div>
              <pre class="font-mono text-xs sm:text-sm text-stone-200 whitespace-pre-wrap leading-relaxed selection:bg-crimson-600">${escapeHtml(t.lyrics)}</pre>
            </div>
          </div>

        </article>
      `;
    }).join('');

    highlightActiveCard();
  }

  window.toggleLyricsDeck = function (trackNum) {
    const deck = document.getElementById(`lyrics-deck-${trackNum}`);
    const chevron = document.getElementById(`chevron-${trackNum}`);
    const btn = document.getElementById(`toggle-deck-btn-${trackNum}`);
    if (!deck) return;

    if (deck.classList.contains('hidden')) {
      deck.classList.remove('hidden');
      if (chevron) chevron.style.transform = 'rotate(180deg)';
      if (btn) btn.classList.add('bg-crimson-800/80');
    } else {
      deck.classList.add('hidden');
      if (chevron) chevron.style.transform = 'rotate(0deg)';
      if (btn) btn.classList.remove('bg-crimson-800/80');
    }
  };

  window.expandAllLyrics = function () {
    if (!window.ALBUM_DATA) return;
    window.ALBUM_DATA.tracks.forEach(t => {
      const deck = document.getElementById(`lyrics-deck-${t.track_number}`);
      const chevron = document.getElementById(`chevron-${t.track_number}`);
      if (deck && deck.classList.contains('hidden')) {
        deck.classList.remove('hidden');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      }
    });
  };

  window.copyLyrics = function (trackNum) {
    if (!window.ALBUM_DATA) return;
    const track = window.ALBUM_DATA.tracks.find(t => t.track_number === trackNum);
    if (!track) return;

    const copyText = `${track.title} - The Shady River Bard\n\n${track.lyrics}\n\nAuthorized Vault: https://theshadyriverbard.com/sanitys-edge/`;
    navigator.clipboard.writeText(copyText).then(() => {
      const btn = document.getElementById(`copy-btn-${trackNum}`);
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i> <span class="text-emerald-300">Copied!</span>';
        btn.classList.add('border-emerald-500/50');
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.classList.remove('border-emerald-500/50');
        }, 2200);
      }
    }).catch(err => {
      console.warn('Clipboard copy error:', err);
    });
  };

  // --- INTERACTIVE ARCHETYPES (PIGS, DOGS, SHEEP) ---
  function initArchetypes() {
    if (!archetypeButtons || !archetypeDetailsEl || !window.ALBUM_DATA) return;
    const archPillar = window.ALBUM_DATA.thematic_pillars.find(p => p.id === 'architect');
    if (!archPillar || !archPillar.archetypes) return;

    archetypeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.archetype;
        selectArchetype(targetId);
      });
    });

    selectArchetype('pigs');
  }

  function selectArchetype(id) {
    activeArchetype = id;
    archetypeButtons.forEach(btn => {
      if (btn.dataset.archetype === id) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (!window.ALBUM_DATA) return;
    const archPillar = window.ALBUM_DATA.thematic_pillars.find(p => p.id === 'architect');
    if (!archPillar || !archPillar.archetypes) return;

    const item = archPillar.archetypes.find(a => a.id === id);
    if (!item || !archetypeDetailsEl) return;

    archetypeDetailsEl.innerHTML = `
      <div class="p-6 sm:p-8 rounded-2xl bg-black/40 border border-crimson-500/30 space-y-4 glow-crimson">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-crimson-950 border border-crimson-500/50 flex items-center justify-center text-crimson-400 text-lg">
            <i class="${item.icon}"></i>
          </div>
          <div>
            <h4 class="font-display text-xl sm:text-2xl font-bold text-white">${escapeHtml(item.name)}</h4>
            <span class="text-xs font-mono text-amber-400 uppercase tracking-wider">Musical Manifestation: ${escapeHtml(item.tracks)}</span>
          </div>
        </div>
        <blockquote class="italic text-base sm:text-lg text-stone-200 border-l-2 border-crimson-500 pl-4 py-1 font-body">
          ${escapeHtml(item.quote)}
        </blockquote>
        <p class="text-sm text-stone-300 font-body leading-relaxed">
          <strong>Systemic Role:</strong> ${escapeHtml(item.role)}
        </p>
      </div>
    `;
  }

  // --- THEMATIC MATRIX TABLE (TABLE 1) ---
  function initMatrix() {
    if (!matrixBody || !window.ALBUM_DATA || !window.ALBUM_DATA.thematic_matrix) return;

    if (matrixSearchInput) {
      matrixSearchInput.addEventListener('input', (e) => {
        matrixSearchQuery = e.target.value.toLowerCase().trim();
        renderMatrix();
      });
    }

    renderMatrix();
  }

  function renderMatrix() {
    if (!matrixBody || !window.ALBUM_DATA || !window.ALBUM_DATA.thematic_matrix) return;

    const rows = window.ALBUM_DATA.thematic_matrix.filter(r => {
      if (matrixSearchQuery) {
        const hay = `${r.element} ${r.core_causes} ${r.key_manifestations} ${r.dramatic_outcomes} ${r.track_focus}`.toLowerCase();
        if (!hay.includes(matrixSearchQuery)) return false;
      }
      return true;
    });

    if (rows.length === 0) {
      matrixBody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center py-12 text-stone-400 font-mono text-sm">
            No matrix entries match "${escapeHtml(matrixSearchQuery)}".
          </td>
        </tr>
      `;
      return;
    }

    matrixBody.innerHTML = rows.map(r => `
      <tr class="transition-colors">
        <td class="font-display font-bold text-white tracking-wide text-base">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-crimson-500"></span>
            <span>${escapeHtml(r.element)}</span>
          </div>
          <span class="text-[11px] font-mono text-amber-400 block mt-1">Focus: ${escapeHtml(r.track_focus)}</span>
        </td>
        <td class="text-stone-300 font-body text-xs sm:text-sm leading-relaxed">
          ${escapeHtml(r.core_causes)}
        </td>
        <td class="text-stone-300 font-body text-xs sm:text-sm leading-relaxed">
          ${escapeHtml(r.key_manifestations)}
        </td>
        <td class="text-stone-300 font-body text-xs sm:text-sm leading-relaxed">
          ${escapeHtml(r.dramatic_outcomes)}
        </td>
      </tr>
    `).join('');
  }

  // --- CHART.JS VISUALIZATIONS (DARK THEME) ---
  function initCharts() {
    if (chartsInitialized) return;
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not yet loaded, retrying...');
      setTimeout(initCharts, 500);
      return;
    }

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'JetBrains Mono', monospace";
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.08)';

    // 1. Overstretch Stacked Bar Chart
    const ctxOverstretch = document.getElementById('chartOverstretch');
    if (ctxOverstretch) {
      new Chart(ctxOverstretch, {
        type: 'bar',
        data: {
          labels: ['DoD Base', 'Nuclear (DOE)', 'Veterans', 'Intel & Security', 'War Debt Interest', 'True Total'],
          datasets: [{
            label: 'True Expenditure ($B)',
            data: [842, 33, 303, 115, 450, 1743],
            backgroundColor: ['#475569', '#dc2626', '#d97706', '#64748b', '#991b1b', '#ef4444'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` $${ctx.parsed.y} Billion`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.06)' },
              ticks: { callback: v => `$${v}B` }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      });
    }

    // 2. Doomsday Clock Line Chart
    const ctxDoomsday = document.getElementById('chartDoomsday');
    if (ctxDoomsday) {
      new Chart(ctxDoomsday, {
        type: 'line',
        data: {
          labels: ['1991', '1998', '2007', '2015', '2018', '2020', '2023', '2025', '2026'],
          datasets: [{
            label: 'Seconds to Midnight',
            data: [1020, 540, 300, 180, 120, 100, 90, 89, 85],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#ef4444',
            pointBorderColor: '#ffffff',
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.parsed.y} seconds (${(ctx.parsed.y / 60).toFixed(1)} mins) to midnight`
              }
            }
          },
          scales: {
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.06)' },
              ticks: { callback: v => `${v}s` }
            },
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.04)' }
            }
          }
        }
      });
    }

    // 3. Deaths of Despair Horizontal Bar Chart
    const ctxDespair = document.getElementById('chartDespair');
    if (ctxDespair) {
      new Chart(ctxDespair, {
        type: 'bar',
        data: {
          labels: ['Synthetic Opioids', 'Alcohol-Related', 'Suicide / Self-Harm', 'Stress / Cardio'],
          datasets: [{
            label: 'Mortality Growth Index',
            data: [380, 195, 160, 135],
            backgroundColor: ['#dc2626', '#d97706', '#b45309', '#475569'],
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` Index: ${ctx.parsed.x}% of Baseline`
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.06)' }
            },
            y: {
              grid: { display: false }
            }
          }
        }
      });
    }

    chartsInitialized = true;
  }

  // --- MODALS ---
  window.openArtZoom = function () {
    if (artZoomModal) artZoomModal.classList.add('open');
  };
  window.closeArtZoom = function () {
    if (artZoomModal) artZoomModal.classList.remove('open');
  };

  window.openVoteModal = function () {
    if (voteModal) voteModal.classList.add('open');
  };
  window.closeVoteModal = function () {
    if (voteModal) voteModal.classList.remove('open');
  };

  window.submitVote = function (e) {
    if (e) e.preventDefault();
    const selected = document.querySelector('input[name="release_vote"]:checked');
    if (!selected) {
      alert('Please select a release priority option.');
      return;
    }
    const val = selected.value;
    localStorage.setItem('se_user_vote', val);

    const voteForm = document.getElementById('vote-form');
    if (voteForm) {
      voteForm.innerHTML = `
        <div class="text-center py-8 space-y-3">
          <i class="fa-solid fa-circle-check text-4xl text-emerald-400"></i>
          <h4 class="font-display text-xl font-bold text-white">Vote Recorded!</h4>
          <p class="text-stone-300 text-sm font-body">
            Thank you for participating. Your priority vote for <strong>${escapeHtml(val)}</strong> has been registered.
          </p>
          <button onclick="closeVoteModal()" class="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono">
            Close Window
          </button>
        </div>
      `;
    }
  };

  // --- WCAG 2.1 AA ACCESSIBILITY TOOLBAR ---
  function initA11yToolbar() {
    const contrast = localStorage.getItem('a11y_contrast') === 'true';
    const textsize = localStorage.getItem('a11y_textsize') || 'normal';
    const underline = localStorage.getItem('a11y_underline') === 'true';
    const motion = localStorage.getItem('a11y_motion') || 'system';

    applyA11ySettings({ contrast, textsize, underline, motion });
  }

  window.toggleA11yToolbar = function () {
    const bar = document.getElementById('a11y-toolbar');
    if (bar) bar.classList.toggle('hidden');
  };

  window.toggleA11yOption = function (opt) {
    if (opt === 'contrast') {
      const cur = document.body.classList.contains('high-contrast');
      document.body.classList.toggle('high-contrast', !cur);
      localStorage.setItem('a11y_contrast', !cur);
      const el = document.getElementById('val-contrast');
      if (el) el.textContent = !cur ? 'On' : 'Off';
    } else if (opt === 'underline') {
      const cur = document.body.classList.contains('underline-links');
      document.body.classList.toggle('underline-links', !cur);
      localStorage.setItem('a11y_underline', !cur);
      const el = document.getElementById('val-underline');
      if (el) el.textContent = !cur ? 'On' : 'Off';
    } else if (opt === 'motion') {
      const cur = document.body.classList.contains('reduced-motion');
      document.body.classList.toggle('reduced-motion', !cur);
      localStorage.setItem('a11y_motion', !cur ? 'reduced' : 'system');
      const el = document.getElementById('val-motion');
      if (el) el.textContent = !cur ? 'Reduced' : 'System';
    }
  };

  window.cycleTextSize = function () {
    const isLarge = document.body.classList.contains('large-font');
    document.body.classList.toggle('large-font', !isLarge);
    localStorage.setItem('a11y_textsize', !isLarge ? 'large' : 'normal');
    const el = document.getElementById('val-textsize');
    if (el) el.textContent = !isLarge ? 'Large' : 'Normal';
  };

  window.resetA11yOptions = function () {
    document.body.classList.remove('high-contrast', 'large-font', 'underline-links', 'reduced-motion');
    localStorage.removeItem('a11y_contrast');
    localStorage.removeItem('a11y_textsize');
    localStorage.removeItem('a11y_underline');
    localStorage.removeItem('a11y_motion');
    const c = document.getElementById('val-contrast'); if (c) c.textContent = 'Off';
    const t = document.getElementById('val-textsize'); if (t) t.textContent = 'Normal';
    const u = document.getElementById('val-underline'); if (u) u.textContent = 'Off';
    const m = document.getElementById('val-motion'); if (m) m.textContent = 'System';
  };

  function applyA11ySettings({ contrast, textsize, underline, motion }) {
    if (contrast) {
      document.body.classList.add('high-contrast');
      const el = document.getElementById('val-contrast'); if (el) el.textContent = 'On';
    }
    if (textsize === 'large') {
      document.body.classList.add('large-font');
      const el = document.getElementById('val-textsize'); if (el) el.textContent = 'Large';
    }
    if (underline) {
      document.body.classList.add('underline-links');
      const el = document.getElementById('val-underline'); if (el) el.textContent = 'On';
    }
    if (motion === 'reduced') {
      document.body.classList.add('reduced-motion');
      const el = document.getElementById('val-motion'); if (el) el.textContent = 'Reduced';
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();
