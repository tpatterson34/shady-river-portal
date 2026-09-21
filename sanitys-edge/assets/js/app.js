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
  function initApp() {
    cacheDom();
    setupAudioListeners();
    setupKeyboardShortcuts();
    renderTracks();
    initArchetypes();
    initMatrix();
    initCharts();
    initA11yToolbar();
    loadVolumePreference();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

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
        const pct = e.target.value / 100;
        if (window.CastManager && window.CastManager.isConnected()) {
          const track = window.ALBUM_DATA && window.ALBUM_DATA.tracks[currentTrackIndex];
          const durStr = track ? track.duration : '5:00';
          const parts = durStr.split(':');
          const totalSec = parts.length === 2 ? parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10) : 300;
          window.CastManager.seek(pct * totalSec);
          return;
        }
        if (!isNaN(audio.duration) && audio.duration > 0) {
          const seekTime = pct * audio.duration;
          audio.currentTime = seekTime;
        }
      });
    }

    if (volumeBar) {
      volumeBar.addEventListener('input', (e) => {
        const vol = parseFloat(e.target.value);
        if (window.CastManager && window.CastManager.isConnected()) {
          window.CastManager.setVolume(vol);
        }
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

    // Hook Google Cast Synchronization
    if (window.CastManager) {
      window.CastManager.on('trackChange', (newIndex) => {
        if (typeof newIndex === 'number' && newIndex >= 0) {
          currentTrackIndex = newIndex;
          window.currentTrackIndex = newIndex;
          isPlaying = true;
          updatePlayerUI();
          highlightActiveCard();
        }
      });

      window.CastManager.on('stateChange', (state) => {
        isPlaying = state.isPlaying;
        if (typeof state.trackIndex === 'number' && state.trackIndex >= 0) {
          currentTrackIndex = state.trackIndex;
          window.currentTrackIndex = state.trackIndex;
        }
        updatePlayerUI();
        highlightActiveCard();
      });

      window.CastManager.on('timeUpdate', ({ currentTime, duration }) => {
        if (!window.CastManager.isConnected()) return;
        if (trackTimeEl) trackTimeEl.textContent = formatTime(currentTime);
        if (trackDurationEl && duration > 0) trackDurationEl.textContent = formatTime(duration);
        if (progressBar && duration > 0) {
          progressBar.value = (currentTime / duration) * 100;
        }
      });

      window.CastManager.on('connected', () => {
        if (!audio.paused) audio.pause();
        highlightActiveCard();
        updatePlayerUI();
      });

      window.CastManager.on('disconnected', () => {
        highlightActiveCard();
        updatePlayerUI();
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

    // Route through Google Cast if connected
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.castTrack(index, tracks, window.ALBUM_DATA);
      return;
    }

    currentTrackIndex = index;
    window.currentTrackIndex = index;
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
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.playOrPause();
      return;
    }
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
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.prevTrack();
      return;
    }
    if (!window.ALBUM_DATA) return;
    let newIndex = currentTrackIndex - 1;
    if (newIndex < 0) newIndex = window.ALBUM_DATA.tracks.length - 1;
    playTrack(newIndex);
  }

  function nextTrack() {
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.nextTrack();
      return;
    }
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
        card.classList.add('border-amber-500/80', 'shadow-xl', 'shadow-amber-500/15');
        card.classList.remove('border-white/10');
        if (playBadge) {
          playBadge.innerHTML = '<i class="fa-solid fa-pause"></i>';
          playBadge.className = 'card-play-badge w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30 flex items-center justify-center text-base transition-all hover:scale-105 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-400';
        }
      } else {
        card.classList.remove('border-amber-500/80', 'shadow-xl', 'shadow-amber-500/15');
        card.classList.add('border-white/10');
        if (playBadge) {
          playBadge.innerHTML = '<i class="fa-solid fa-play ml-0.5"></i>';
          playBadge.className = 'card-play-badge w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-stone-900 text-amber-400 border border-amber-500/50 hover:border-amber-400 hover:bg-amber-600 hover:text-stone-950 flex items-center justify-center text-base transition-all hover:scale-105 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-400';
        }
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
  const TRACK_QUOTES = {
    1: "Welcome to the new normal\nWhere the fever is the baseline and the anchors pray",
    2: "The hand on the switch is trembling tonight\nThe fuse is burning in the sterile light",
    3: "The chaos is the weather here today\nWe watch the warning signs just wash away",
    4: "Oh the engine remembers exactly how to feed\nIt plants a profit inside a violent seed",
    5: "We cast a ballot for a steady hand\nBut now we are sowing salt across the land",
    6: "Oh there is rust beneath the painted local spire\nWe toss the neighborhood into a distant fire",
    7: "Oh the bottle and the blade, they cut so deep\nThey steal the morning and they take the sleep",
    8: "Oh the price of victory is climbing steep\nA mountain of treasure that we cannot keep",
    9: "Oh the dogs are barking at the border gate\nThey sell the anger and they push the weight",
    10: "Iran is at the door and every option starts to shrink\nWe push the heavy vessel right up to the very brink",
    11: "Eighty five seconds till the midnight bell\nWe built a staircase to the bottom well",
    12: "Oh brother on the other side of this\nWe share the tears and share the parting kiss",
    13: "The phantom of a leader walks the floor\nHe knows the peril of the open door",
    14: "Wake up the masses, we carry the load\nWe travel together upon the same road",
    15: "We are walking along sanity's edge\nPulling our feet from the crumbling ledge"
  };

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
      const quote = t.quote || TRACK_QUOTES[t.track_number] || '';

      return `
        <article class="track-card card-obsidian p-6 sm:p-8 rounded-2xl relative transition-all space-y-6 ${isCurrent ? 'border-amber-500/80 shadow-xl shadow-amber-500/15' : 'border border-white/10'}" id="track-${t.track_number}">
          
          <!-- Track Header with Artwork -->
          <div class="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 pb-5 border-b border-white/10">
            <!-- Track Artwork Square Thumbnail -->
            <div class="track-art-thumb w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg relative group bg-stone-950" style="width: 104px; height: 104px; min-width: 104px; min-height: 104px;">
              <img 
                src="${t.art_square || t.art || 'assets/art/sanitys-edge-cover.jpg'}" 
                alt="${escapeHtml(t.title)} artwork" 
                class="track-art-img w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style="width: 100%; height: 100%; object-fit: cover; display: block;"
                loading="lazy"
                width="104"
                height="104"
              >
              <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            </div>

            <!-- Track Info & Controls -->
            <div class="flex-1 space-y-2">
              <div class="flex items-center gap-3">
                <!-- Audio Play Disc (Circular, Amber Accent - Distinct from YouTube) -->
                <button 
                  onclick="playTrack(${realIndex})" 
                  class="card-play-badge w-10 h-10 sm:w-11 sm:h-11 rounded-full ${isCurrent ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30' : 'bg-stone-900 text-amber-400 border border-amber-500/50 hover:border-amber-400 hover:bg-amber-600 hover:text-stone-950'} flex items-center justify-center text-sm transition-all hover:scale-105 shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-400" 
                  aria-label="Play audio track ${escapeHtml(t.title)}"
                  title="Play audio track"
                >
                  <i class="fa-solid ${isCurrent ? 'fa-pause' : 'fa-play ml-0.5'}"></i>
                </button>

                <!-- Pills Row -->
                <div class="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span class="px-2.5 py-0.5 rounded-full bg-stone-900 border border-amber-500/40 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                    Track ${String(t.track_number).padStart(2, '0')}
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 text-[11px]">
                    Act ${t.act_number}: ${escapeHtml(t.act_title)}
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full bg-stone-900 text-stone-300 border border-white/10 text-[11px]">
                    ${escapeHtml(t.key)} &bull; ${escapeHtml(t.tempo)}
                  </span>
                  <span class="text-stone-400 text-xs flex items-center gap-1 ml-1 font-mono">
                    <i class="fa-regular fa-clock text-[11px] text-amber-400/80"></i>
                    <span>${t.duration}</span>
                  </span>
                </div>
              </div>

              <!-- Title -->
              <h3 class="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                ${escapeHtml(t.title)}
              </h3>

              <!-- Vocal Architecture -->
              <p class="text-xs sm:text-sm font-mono text-stone-400">
                <span class="text-stone-500 uppercase tracking-widest text-[11px]">Vocal Architecture:</span> ${escapeHtml(t.vocal_profile)}
              </p>
            </div>
          </div>

          <!-- 100% Verbatim Lyric Quote -->
          ${quote ? `
          <blockquote class="border-l-4 border-amber-500 bg-stone-950/80 p-4 rounded-r-xl shadow-inner">
            <p class="text-sm sm:text-base font-serif italic text-amber-100/90 leading-relaxed whitespace-pre-line">&ldquo;${escapeHtml(quote)}&rdquo;</p>
            <cite class="text-[10px] font-mono text-amber-400 mt-2 block font-normal uppercase tracking-wider">— Verbatim Movement Excerpt</cite>
          </blockquote>` : ''}

          <!-- The Bard's Story (Lore & Context) -->
          <div class="space-y-3 bg-stone-950/60 p-5 rounded-xl border border-white/5">
            <div class="flex items-center gap-2 text-xs font-mono text-stone-400 uppercase tracking-wider">
              <i aria-hidden="true" class="fa-solid fa-feather text-amber-400"></i>
              <span class="font-bold text-white">The Bard's Story &bull; Lore &amp; Context</span>
            </div>
            <div class="text-xs sm:text-sm text-stone-300 leading-relaxed space-y-2.5 font-sans">
              <p>${escapeHtml(t.summary)}</p>
            </div>
          </div>

          <!-- Action Bar & Expandable Lyrics Toggle -->
          <div class="pt-2 border-t border-white/10">
            <div class="flex items-center justify-between flex-wrap gap-3">
              <!-- Expandable Lyrics Toggle Button -->
              <button 
                onclick="toggleLyricsDeck(${t.track_number})" 
                id="toggle-deck-btn-${t.track_number}" 
                aria-expanded="false" 
                aria-controls="lyrics-deck-${t.track_number}" 
                class="inline-flex items-center gap-2 text-xs font-mono text-amber-400 hover:text-amber-300 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400 py-1 rounded transition-colors"
              >
                <i aria-hidden="true" class="fa-solid fa-chevron-down transition-transform duration-300" id="chevron-${t.track_number}"></i>
                <span>View Complete Lyrics</span>
              </button>

              <!-- Action Buttons Row: Message, Share, Copy, Cast -->
              <div class="flex items-center gap-2">
                <!-- Message / Bard Note -->
                <button 
                  type="button" 
                  onclick="openBardNoteModal('${escapeHtml(t.title).replace(/'/g, "\\'")}', 'Sanity\\'s Edge', ${t.track_number})" 
                  class="bard-note-btn" 
                  aria-label="Drop a note to the bard about ${escapeHtml(t.title)}" 
                  title="Drop a note to the bard"
                >
                  <svg class="bard-note-icon" width="16" height="16" style="width: 16px; height: 16px; max-width: 16px; max-height: 16px; min-width: 16px; min-height: 16px; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <span class="bard-note-tooltip">Drop a note to the bard</span>
                </button>

                <!-- Share Track -->
                <button 
                  type="button" 
                  onclick="shareTrackLink('${escapeHtml(t.title).replace(/'/g, "\\'")}', 'Sanity\\'s Edge', ${t.track_number})" 
                  class="bard-note-btn track-share-btn" 
                  aria-label="Share link for ${escapeHtml(t.title)}" 
                  title="Share this track"
                >
                  <svg class="bard-note-icon track-share-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                  <span class="track-share-tooltip">Share this track</span>
                </button>

                <!-- Copy Lyrics -->
                <button 
                  onclick="copyLyrics(${t.track_number})" 
                  id="copy-btn-${t.track_number}" 
                  class="text-xs font-mono text-stone-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-white px-2.5 py-1 rounded bg-stone-800 border border-white/10 hover:border-white/20 flex items-center gap-1.5" 
                  title="Copy lyrics to clipboard" 
                  aria-label="Copy lyrics for ${escapeHtml(t.title)}"
                >
                  <i aria-hidden="true" class="fa-regular fa-copy"></i>
                  <span id="copy-text-${t.track_number}">Copy</span>
                </button>

                <!-- Cast to Google TV -->
                <button 
                  type="button" 
                  onclick="castTrack(${realIndex})" 
                  class="bard-note-btn track-cast-btn" 
                  data-track-index="${realIndex}" 
                  data-track-number="${t.track_number}" 
                  aria-label="Cast ${escapeHtml(t.title)} to Google TV" 
                  title="Cast track to Google TV"
                >
                  <svg class="track-cast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/>
                    <line x1="2" y1="20" x2="2.01" y2="20"/>
                  </svg>
                  <span class="bard-note-tooltip track-cast-tooltip">Cast track to Google TV</span>
                </button>
              </div>
            </div>

            <!-- Collapsible Lyrics Drawer -->
            <div id="lyrics-deck-${t.track_number}" class="hidden mt-4 p-5 bg-stone-950/90 rounded-xl border border-white/10 font-mono text-xs sm:text-sm text-stone-200 leading-relaxed whitespace-pre-wrap select-text">
${escapeHtml(t.lyrics)}
            </div>
          </div>

        </article>
      `;
    }).join('');

    highlightActiveCard();
    if (window.CastManager) {
      window.CastManager.updateAllCastUI();
    }
  }

  window.toggleLyricsDeck = function (trackNum) {
    const deck = document.getElementById(`lyrics-deck-${trackNum}`);
    const chevron = document.getElementById(`chevron-${trackNum}`);
    const btn = document.getElementById(`toggle-deck-btn-${trackNum}`);
    if (!deck) return;

    if (deck.classList.contains('hidden')) {
      deck.classList.remove('hidden');
      if (chevron) chevron.style.transform = 'rotate(180deg)';
      if (btn) btn.setAttribute('aria-expanded', 'true');
    } else {
      deck.classList.add('hidden');
      if (chevron) chevron.style.transform = 'rotate(0deg)';
      if (btn) btn.setAttribute('aria-expanded', 'false');
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
