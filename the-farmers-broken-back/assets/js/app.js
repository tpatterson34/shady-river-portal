/**
 * Album XX: The Farmer's Broken Back
 * Bespoke Interactive Concept Application & Streaming Jukebox Engine
 * The Shady River Bard
 */

(function () {
  'use strict';

  let data = window.ALBUM_DATA || null;
  let tracks = [];
  let currentTrackIndex = 0;
  let isPlaying = false;
  let activeAct = 'all';
  let searchQuery = '';

  const audio = new Audio();
  audio.preload = 'metadata';

  // Cached DOM Elements
  const trackListEl = document.getElementById('track-list');
  const lyricsContainerEl = document.getElementById('lyrics-container');
  const trackTitleEl = document.getElementById('active-track-title');
  const trackActEl = document.getElementById('active-track-act');
  const trackTaglineEl = document.getElementById('active-track-tagline');
  const trackSummaryEl = document.getElementById('active-track-summary');
  const trackTheoryEl = document.getElementById('active-track-theory');
  const trackTempoEl = document.getElementById('active-track-tempo');
  const trackArchetypeEl = document.getElementById('active-track-archetype');
  const trackArtEl = document.getElementById('active-track-art');

  const playerBarTitle = document.getElementById('player-track-title');
  const playerBarAct = document.getElementById('player-track-act');
  const playerBarArt = document.getElementById('player-track-art');
  const playBtn = document.getElementById('play-btn');
  const playIcon = document.getElementById('play-icon');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const progressSlider = document.getElementById('progress-slider');
  const currentTimeEl = document.getElementById('current-time');
  const totalTimeEl = document.getElementById('total-time');
  const volumeSlider = document.getElementById('volume-slider');
  const muteBtn = document.getElementById('mute-btn');
  const volumeIcon = document.getElementById('volume-icon');

  const searchInput = document.getElementById('track-search');
  const actFilterBtns = document.querySelectorAll('[data-act-filter]');
  const copyLyricsBtn = document.getElementById('btn-copy-lyrics');
  const copyFeedback = document.getElementById('copy-feedback');
  const deckShareBtn = document.getElementById('deck-share-btn');
  const playerShareBtn = document.getElementById('player-share-btn');

  const voteHeroBtn = document.getElementById('vote-hero-btn');
  const voteModal = document.getElementById('vote-modal');
  const voteBackdrop = document.getElementById('vote-backdrop');
  const closeVoteBtn = document.getElementById('close-vote-btn');
  const confirmVoteBtn = document.getElementById('confirm-vote-btn');

  const artZoomBtn = document.getElementById('art-zoom-btn');
  const artModal = document.getElementById('art-modal');
  const artBackdrop = document.getElementById('art-backdrop');
  const closeArtBtn = document.getElementById('close-art-btn');

  const exhibitTabs = document.querySelectorAll('[data-exhibit-tab]');
  const exhibitPanels = document.querySelectorAll('.exhibit-panel');

  // Accessibility Buttons
  const toggleContrastBtn = document.getElementById('toggle-high-contrast');
  const toggleFontBtn = document.getElementById('toggle-large-font');
  const toggleUnderlineBtn = document.getElementById('toggle-underline');
  const toggleMotionBtn = document.getElementById('toggle-reduced-motion');

  // --- INITIALIZATION ---
  function init() {
    if (!data && typeof window.ALBUM_DATA !== 'undefined') {
      data = window.ALBUM_DATA;
    }
    if (data && data.tracks && data.tracks.length > 0) {
      tracks = data.tracks;
      setupApp();
    } else {
      fetch('data/album-data.json')
        .then(function (res) { return res.json(); })
        .then(function (fetchedData) {
          data = fetchedData;
          tracks = data.tracks;
          setupApp();
        })
        .catch(function (err) {
          console.error('Failed to load The Farmer\'s Broken Back album data:', err);
        });
    }
  }

  function setupApp() {
    renderTrackList();
    selectTrack(0, false, false);
    bindAudioEvents();
    bindUIEvents();
    initA11yToolbar();
    loadPreferences();
    checkHash(true);
    window.addEventListener('hashchange', function () {
      checkHash(false);
    });
  }

  // --- TRACK LIST RENDERING ---
  function renderTrackList() {
    if (!trackListEl) return;
    trackListEl.innerHTML = '';

    const filtered = tracks.filter(function (t) {
      if (activeAct !== 'all' && t.act_number !== parseInt(activeAct, 10)) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const blob = (t.title + ' ' + (t.tagline || '') + ' ' + t.summary + ' ' + t.theory + ' ' + t.clean_lyrics + ' ' + t.archetype).toLowerCase();
        return blob.indexOf(query) !== -1;
      }
      return true;
    });

    if (filtered.length === 0) {
      trackListEl.innerHTML = '<div class="p-6 text-center text-stone-400 font-mono text-xs">No tracks match your query.</div>';
      return;
    }

    filtered.forEach(function (t) {
      const idx = tracks.findIndex(function (x) { return x.number === t.number; });
      const isCurrent = (idx === currentTrackIndex);
      const row = document.createElement('div');
      row.id = 'track-' + t.number;
      row.className = 'track-row flex items-center justify-between p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer ' +
        (isCurrent ? 'active bg-amber-950/40 border-amber-500/60 text-white shadow-lg shadow-amber-950/20' : 'bg-[#12140e] border-stone-800 hover:bg-[#181b13] hover:border-stone-700 text-stone-300');
      row.setAttribute('data-track-index', idx);
      row.setAttribute('data-track', t.number);
      row.setAttribute('data-slug', t.id || '');
      row.setAttribute('data-act', t.act_number);
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');

      const iconHtml = (isCurrent && isPlaying)
        ? '<i class="fa-solid fa-volume-high text-amber-400 animate-pulse"></i>'
        : String(t.number).padStart(2, '0');

      const btnIcon = (isCurrent && isPlaying) ? 'fa-pause' : 'fa-play';

      row.innerHTML =
        '<div class="flex items-center gap-3 min-w-0 pr-2">' +
          '<div class="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-stone-800 bg-stone-900 hidden sm:block">' +
            '<img src="assets/images/tracks/' + t.art_file + '" alt="" class="w-full h-full object-cover">' +
          '</div>' +
          '<div class="font-mono text-xs font-bold text-amber-400/80 w-6 shrink-0 text-center">' + iconHtml + '</div>' +
          '<div class="min-w-0">' +
            '<div class="font-display font-semibold text-sm truncate ' + (isCurrent ? 'text-amber-300 font-bold' : 'text-stone-200') + '">' +
              t.title +
            '</div>' +
            '<div class="flex items-center gap-2 text-[11px] font-mono text-stone-400 truncate mt-0.5">' +
              '<span>' + t.tempo + '</span>' +
              '<span>&bull;</span>' +
              '<span class="text-amber-400/80 truncate">' + t.archetype + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="flex items-center gap-2 shrink-0">' +
          '<span class="font-mono text-xs text-stone-400 hidden xs:inline">' + t.duration + '</span>' +
          '<button class="row-share-btn w-8 h-8 rounded-full bg-stone-900/80 hover:bg-amber-950/60 border border-stone-800 hover:border-amber-500/60 text-stone-400 hover:text-amber-400 flex items-center justify-center text-xs transition-colors" aria-label="Share link to ' + t.title + '" title="Share link to ' + t.title + '">' +
            '<i class="fa-solid fa-share-nodes text-[11px]"></i>' +
          '</button>' +
          '<button class="row-play-btn w-8 h-8 rounded-full ' + (isCurrent ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-300 hover:text-white') + ' flex items-center justify-center text-xs transition-colors" aria-label="Play ' + t.title + '">' +
            '<i class="fa-solid ' + btnIcon + '"></i>' +
          '</button>' +
        '</div>';

      row.addEventListener('click', function (e) {
        if (e.target.closest('.row-share-btn')) {
          e.stopPropagation();
          e.preventDefault();
          shareTrack(idx);
          return;
        }
        if (e.target.closest('.row-play-btn')) {
          if (idx === currentTrackIndex) {
            togglePlay();
          } else {
            selectTrack(idx, true, true);
          }
        } else {
          selectTrack(idx, true, true);
        }
      });

      row.addEventListener('keydown', function (e) {
        if (e.target.closest('.row-share-btn') || e.target.closest('.row-play-btn')) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectTrack(idx, true, true);
        }
      });

      trackListEl.appendChild(row);
    });
  }

  // --- TRACK SELECTION & DISPLAY ---
  function selectTrack(index, autoplay, updateUrl) {
    if (typeof updateUrl === 'undefined') updateUrl = true;
    if (index < 0 || index >= tracks.length) return;
    currentTrackIndex = index;
    window.currentTrackIndex = index;
    const t = tracks[currentTrackIndex];

    const noteBtn = document.getElementById('deck-bard-note-btn');
    if (noteBtn) {
      noteBtn.onclick = function () {
        if (typeof window.openBardNoteModal === 'function') {
          window.openBardNoteModal(t.title, "The Farmer's Broken Back", t.number);
        }
      };
      noteBtn.setAttribute('aria-label', 'Drop a note to the bard about ' + t.title);
    }

    if (deckShareBtn) {
      deckShareBtn.onclick = function () {
        shareTrack(currentTrackIndex);
      };
      deckShareBtn.setAttribute('aria-label', 'Share link for ' + t.title);
      deckShareBtn.setAttribute('title', 'Share link for ' + t.title);
    }

    if (playerShareBtn) {
      playerShareBtn.onclick = function () {
        shareTrack(currentTrackIndex);
      };
      playerShareBtn.setAttribute('aria-label', 'Share link for ' + t.title);
      playerShareBtn.setAttribute('title', 'Share link for ' + t.title);
    }

    // Update active track deck
    if (trackTitleEl) trackTitleEl.textContent = t.number + '. ' + t.title;
    if (trackActEl) trackActEl.textContent = 'Act ' + t.act_number + ': ' + t.act_title;
    if (trackTaglineEl) trackTaglineEl.textContent = t.tagline || '';
    if (trackSummaryEl) trackSummaryEl.textContent = t.summary;
    if (trackTheoryEl) trackTheoryEl.textContent = t.theory;
    if (trackTempoEl) trackTempoEl.textContent = t.tempo + ' • ' + t.key;
    if (trackArchetypeEl) trackArchetypeEl.textContent = t.archetype;
    if (trackArtEl) trackArtEl.src = 'assets/images/tracks/' + t.art_file;
    if (lyricsContainerEl) lyricsContainerEl.textContent = t.clean_lyrics;

    // Update bottom player bar
    if (playerBarTitle) playerBarTitle.textContent = t.number + '. ' + t.title;
    if (playerBarAct) playerBarAct.textContent = 'Act ' + t.act_number + ': ' + t.act_title;
    if (playerBarArt) playerBarArt.src = 'assets/images/tracks/' + t.art_file;

    // Update browser URL hash without jump if enabled
    if (updateUrl && window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#track-' + t.number);
    }

    // Route through Google Cast if connected
    if (window.CastManager && window.CastManager.isConnected()) {
      if (!audio.paused) audio.pause();
      if (currentTimeEl) currentTimeEl.textContent = '0:00';
      if (totalTimeEl) totalTimeEl.textContent = t.duration;
      if (progressSlider) progressSlider.value = 0;
      isPlaying = true;
      updatePlayIcons();
      renderTrackList();
      window.CastManager.castTrack(index, tracks, data);
      return;
    }

    // Load audio
    audio.src = t.audio_file;
    if (currentTimeEl) currentTimeEl.textContent = '0:00';
    if (totalTimeEl) totalTimeEl.textContent = t.duration;
    if (progressSlider) progressSlider.value = 0;

    renderTrackList();

    if (autoplay) {
      audio.play().then(function () {
        isPlaying = true;
        updatePlayIcons();
      }).catch(function (err) {
        console.warn('Autoplay blocked or audio load error:', err);
        isPlaying = false;
        updatePlayIcons();
      });
    } else {
      isPlaying = false;
      updatePlayIcons();
    }
  }

  // --- AUDIO CONTROLS ---
  function togglePlay() {
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.playOrPause();
      return;
    }

    if (audio.paused) {
      audio.play().then(function () {
        isPlaying = true;
        updatePlayIcons();
        renderTrackList();
      }).catch(function (err) {
        console.warn('Playback prevented:', err);
      });
    } else {
      audio.pause();
      isPlaying = false;
      updatePlayIcons();
      renderTrackList();
    }
  }

  function prevTrack() {
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.prevTrack();
      return;
    }
    let nextIdx = currentTrackIndex - 1;
    if (nextIdx < 0) nextIdx = tracks.length - 1;
    selectTrack(nextIdx, true);
  }

  function nextTrack() {
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.nextTrack();
      return;
    }
    let nextIdx = currentTrackIndex + 1;
    if (nextIdx >= tracks.length) nextIdx = 0;
    selectTrack(nextIdx, true);
  }

  function updatePlayIcons() {
    if (playIcon) {
      if (isPlaying) {
        playIcon.classList.remove('fa-play', 'ml-0.5');
        playIcon.classList.add('fa-pause');
      } else {
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play', 'ml-0.5');
      }
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function updateVolumeIcon(vol) {
    if (!volumeIcon) return;
    volumeIcon.className = 'fa-solid text-xs text-stone-400';
    if (audio.muted || vol === 0) {
      volumeIcon.classList.add('fa-volume-xmark', 'text-red-400');
    } else if (vol < 0.5) {
      volumeIcon.classList.add('fa-volume-low');
    } else {
      volumeIcon.classList.add('fa-volume-high');
    }
  }

  // --- EVENT LISTENERS ---
  function bindAudioEvents() {
    audio.addEventListener('timeupdate', function () {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        const pct = (audio.currentTime / audio.duration) * 100;
        if (progressSlider) progressSlider.value = pct;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
      }
    });

    audio.addEventListener('loadedmetadata', function () {
      if (!isNaN(audio.duration)) {
        if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
      }
    });

    audio.addEventListener('ended', function () {
      nextTrack();
    });

    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (prevBtn) prevBtn.addEventListener('click', prevTrack);
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);

    if (progressSlider) {
      progressSlider.addEventListener('input', function (e) {
        if (window.CastManager && window.CastManager.isConnected()) {
          const t = tracks[currentTrackIndex];
          const parts = (t && t.duration) ? t.duration.split(':') : ['5', '00'];
          const totalSec = parts.length === 2 ? parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10) : 300;
          window.CastManager.seek((e.target.value / 100) * totalSec);
          return;
        }
        if (!isNaN(audio.duration) && audio.duration > 0) {
          audio.currentTime = (e.target.value / 100) * audio.duration;
        }
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', function (e) {
        const val = parseFloat(e.target.value) / 100;
        if (window.CastManager && window.CastManager.isConnected()) {
          window.CastManager.setVolume(val);
        }
        audio.volume = val;
        audio.muted = (val === 0);
        updateVolumeIcon(val);
        localStorage.setItem('fbb_volume', val);
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', function () {
        audio.muted = !audio.muted;
        if (audio.muted) {
          if (volumeSlider) volumeSlider.value = 0;
          updateVolumeIcon(0);
        } else {
          const savedVol = parseFloat(localStorage.getItem('fbb_volume') || 0.85);
          const activeVol = savedVol > 0 ? savedVol : 0.85;
          audio.volume = activeVol;
          if (volumeSlider) volumeSlider.value = activeVol * 100;
          updateVolumeIcon(activeVol);
        }
      });
    }

    // Hook Google Cast Synchronization
    if (window.CastManager) {
      window.CastManager.on('trackChange', function (newIndex) {
        if (typeof newIndex === 'number' && newIndex >= 0 && newIndex !== currentTrackIndex) {
          selectTrack(newIndex, false);
        }
      });

      window.CastManager.on('stateChange', function (state) {
        isPlaying = state.isPlaying;
        updatePlayIcons();
      });

      window.CastManager.on('timeUpdate', function (info) {
        if (!window.CastManager.isConnected()) return;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(info.currentTime);
        if (totalTimeEl && info.duration > 0) totalTimeEl.textContent = formatTime(info.duration);
        if (progressSlider && info.duration > 0) progressSlider.value = (info.currentTime / info.duration) * 100;
      });

      window.CastManager.on('connected', function () {
        if (!audio.paused) audio.pause();
        isPlaying = true;
        updatePlayIcons();
      });

      window.CastManager.on('disconnected', function () {
        isPlaying = !audio.paused;
        updatePlayIcons();
      });
    }
  }

  function bindUIEvents() {
    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        searchQuery = e.target.value.trim();
        renderTrackList();
      });
    }

    // Act filter buttons
    actFilterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        actFilterBtns.forEach(function (b) {
          b.className = 'px-3.5 py-1.5 rounded-lg bg-stone-900 text-stone-300 hover:text-white transition-colors';
        });
        btn.className = 'px-3.5 py-1.5 rounded-lg bg-amber-500 text-stone-950 font-bold transition-colors';
        activeAct = btn.getAttribute('data-act-filter');
        renderTrackList();
      });
    });

    // Copy clean lyrics
    if (copyLyricsBtn) {
      copyLyricsBtn.addEventListener('click', function () {
        const text = tracks[currentTrackIndex].clean_lyrics;
        navigator.clipboard.writeText(text).then(function () {
          if (copyFeedback) {
            copyFeedback.classList.remove('hidden');
            setTimeout(function () {
              copyFeedback.classList.add('hidden');
            }, 2000);
          }
        }).catch(function (err) {
          console.error('Failed to copy clean lyrics:', err);
        });
      });
    }

    // Exhibit Tabs
    exhibitTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const targetId = tab.getAttribute('data-exhibit-tab');
        exhibitTabs.forEach(function (t) {
          t.className = 'exhibit-tab-btn px-4 py-3 border-b-2 border-transparent text-stone-400 hover:text-stone-200 transition-colors';
        });
        tab.className = 'exhibit-tab-btn active px-4 py-3 border-b-2 border-amber-500 text-amber-400 font-bold transition-colors';

        exhibitPanels.forEach(function (panel) {
          if (panel.id === targetId) {
            panel.classList.remove('hidden');
            panel.classList.add('grid');
          } else {
            panel.classList.add('hidden');
            panel.classList.remove('grid');
          }
        });
      });
    });

    // Community Release Ballot Modal
    function openVoteModal() {
      if (voteModal) voteModal.classList.remove('hidden');
    }
    function closeVoteModal() {
      if (voteModal) voteModal.classList.add('hidden');
    }
    if (voteHeroBtn) voteHeroBtn.addEventListener('click', openVoteModal);
    if (closeVoteBtn) closeVoteBtn.addEventListener('click', closeVoteModal);
    if (voteBackdrop) voteBackdrop.addEventListener('click', closeVoteModal);

    if (confirmVoteBtn) {
      confirmVoteBtn.addEventListener('click', function () {
        const selected = document.querySelector('input[name="release_format"]:checked');
        const formatVal = selected ? selected.value : 'vinyl';
        localStorage.setItem('fbb_vote_format', formatVal);
        confirmVoteBtn.textContent = 'Ballot Cast! Thank You';
        confirmVoteBtn.disabled = true;
        confirmVoteBtn.classList.replace('bg-amber-500', 'bg-emerald-600');
        confirmVoteBtn.classList.replace('text-stone-950', 'text-white');
        setTimeout(closeVoteModal, 1500);
      });
    }

    // High-Res Artwork Modal
    function openArtModal() {
      if (artModal) artModal.classList.remove('hidden');
    }
    function closeArtModal() {
      if (artModal) artModal.classList.add('hidden');
    }
    if (artZoomBtn) artZoomBtn.addEventListener('click', openArtModal);
    if (closeArtBtn) closeArtBtn.addEventListener('click', closeArtModal);
    if (artBackdrop) artBackdrop.addEventListener('click', closeArtModal);

    // Global Keydown shortcuts
    document.addEventListener('keydown', function (e) {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'Escape') {
        closeVoteModal();
        closeArtModal();
        return;
      }

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
        audio.volume = Math.min(1, audio.volume + 0.1);
        if (volumeSlider) volumeSlider.value = audio.volume * 100;
        updateVolumeIcon(audio.volume);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        audio.volume = Math.max(0, audio.volume - 0.1);
        if (volumeSlider) volumeSlider.value = audio.volume * 100;
        updateVolumeIcon(audio.volume);
      } else if (e.key === 'm' || e.key === 'M') {
        if (muteBtn) muteBtn.click();
      } else if (e.key === '[') {
        prevTrack();
      } else if (e.key === ']') {
        nextTrack();
      }
    });
  }

  // --- ACCESSIBILITY CONTROLS ---
  function initA11yToolbar() {
    const root = document.documentElement;

    function bindToggle(btn, storageKey, cssClass) {
      if (!btn) return;
      btn.addEventListener('click', function () {
        root.classList.toggle(cssClass);
        const isActive = root.classList.contains(cssClass);
        localStorage.setItem(storageKey, isActive ? 'true' : 'false');
        btn.classList.toggle('border-amber-500', isActive);
        btn.classList.toggle('text-amber-400', isActive);
      });

      if (localStorage.getItem(storageKey) === 'true') {
        root.classList.add(cssClass);
        btn.classList.add('border-amber-500', 'text-amber-400');
      }
    }

    bindToggle(toggleContrastBtn, 'fbb_a11y_contrast', 'high-contrast');
    bindToggle(toggleFontBtn, 'fbb_a11y_font', 'large-font');
    bindToggle(toggleUnderlineBtn, 'fbb_a11y_links', 'underlined-links');
    bindToggle(toggleMotionBtn, 'fbb_a11y_motion', 'reduced-motion');
  }

  // --- VOLUME & VOTE PREFERENCES ---
  function loadPreferences() {
    const savedVol = localStorage.getItem('fbb_volume');
    if (savedVol !== null) {
      const v = parseFloat(savedVol);
      audio.volume = v;
      if (volumeSlider) volumeSlider.value = v * 100;
      updateVolumeIcon(v);
    } else {
      audio.volume = 0.85;
      if (volumeSlider) volumeSlider.value = 85;
      updateVolumeIcon(0.85);
    }

    if (localStorage.getItem('fbb_vote_format')) {
      if (confirmVoteBtn) {
        confirmVoteBtn.textContent = 'Ballot Cast! Thank You';
        confirmVoteBtn.disabled = true;
        confirmVoteBtn.classList.replace('bg-amber-500', 'bg-emerald-600');
        confirmVoteBtn.classList.replace('text-stone-950', 'text-white');
      }
    }
  }

  // --- SHARING & DEEP LINK RESOLVER ---
  function shareTrack(index) {
    if (index < 0 || index >= tracks.length) return;
    const t = tracks[index];
    const albumTitle = "The Farmer's Broken Back";
    const songTitle = t.title;
    const trackNum = t.number;
    const anchor = 'track-' + trackNum;

    const baseUrl = window.location.origin + window.location.pathname.replace(/\/+$/, '') + '/';
    const shareUrl = baseUrl + '#' + anchor;

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#' + anchor);
    }

    const shareData = {
      title: songTitle + ' — ' + albumTitle + ' | The Shady River Bard',
      text: 'Listen to "' + songTitle + '" from The Shady River Bard\'s concept album "' + albumTitle + '"',
      url: shareUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch(function (err) {
        if (err.name !== 'AbortError') {
          copyToClipboardWithFeedback(shareUrl, songTitle);
        }
      });
    } else {
      copyToClipboardWithFeedback(shareUrl, songTitle);
    }

    const rowEl = document.getElementById('track-' + trackNum);
    if (rowEl) {
      rowEl.classList.remove('track-card-highlighted');
      void rowEl.offsetWidth;
      rowEl.classList.add('track-card-highlighted');
    }
  }

  function copyToClipboardWithFeedback(url, songTitle) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        showShareToast('Link to "' + songTitle + '" copied to clipboard!');
      }).catch(function () {
        fallbackCopy(url, songTitle);
      });
    } else {
      fallbackCopy(url, songTitle);
    }
  }

  function fallbackCopy(text, songTitle) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showShareToast('Link to "' + songTitle + '" copied to clipboard!');
    } catch (err) {
      prompt('Copy this link:', text);
    }
  }

  function showShareToast(message) {
    let toast = document.getElementById('track-share-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'track-share-toast';
      toast.className = 'track-share-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.innerHTML = '<span class="track-share-toast-icon"><i class="fa-solid fa-check text-amber-400"></i></span><span>' + message + '</span>';
    toast.classList.add('show');

    if (window._fbbShareToastTimer) {
      clearTimeout(window._fbbShareToastTimer);
    }
    window._fbbShareToastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 3000);
  }

  function checkHash(isInitialLoad) {
    let target = '';
    const hash = window.location.hash ? window.location.hash.replace(/^#/, '').trim() : '';
    const urlParams = new URLSearchParams(window.location.search);
    const queryTrack = urlParams.get('track');

    if (queryTrack) {
      target = queryTrack.trim();
    } else if (hash && hash !== 'top' && hash !== 'overview' && hash !== 'main-content' && hash !== 'jukebox' && hash !== 'exhibits' && hash !== 'matrix') {
      target = hash;
    }

    if (!target) {
      if (isInitialLoad) {
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
      }
      return;
    }

    let matchIdx = -1;

    // 1. Direct number check (e.g. "track-5", "track-05", "song-5", "5", "05")
    const numMatch = target.match(/(?:track[-_]?|song[-_]?)?(\d+)/i);
    if (numMatch) {
      const num = parseInt(numMatch[1], 10);
      matchIdx = tracks.findIndex(function (t) { return t.number === num; });
    }

    // 2. Slug check (e.g. "fencerow-to-fencerow", "the-crash-of-80")
    if (matchIdx === -1) {
      const cleanSlug = target.toLowerCase().replace(/^track[-_]/, '');
      matchIdx = tracks.findIndex(function (t) {
        return (t.id && t.id.toLowerCase() === cleanSlug) ||
               (t.id && t.id.toLowerCase() === target.toLowerCase());
      });
    }

    // 3. Title fuzzy/slug check
    if (matchIdx === -1) {
      const slugified = target.toLowerCase();
      matchIdx = tracks.findIndex(function (t) {
        const s = t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return s === slugified || s.indexOf(slugified) !== -1;
      });
    }

    if (matchIdx !== -1) {
      const selectedTrack = tracks[matchIdx];

      // Unhide act if selected track is filtered out
      if (activeAct !== 'all' && selectedTrack.act_number !== parseInt(activeAct, 10)) {
        activeAct = 'all';
        actFilterBtns.forEach(function (btn) {
          if (btn.getAttribute('data-act-filter') === 'all') {
            btn.className = 'px-3.5 py-1.5 rounded-lg bg-amber-500 text-stone-950 font-bold transition-colors';
          } else {
            btn.className = 'px-3.5 py-1.5 rounded-lg bg-stone-900 text-stone-300 hover:text-white transition-colors';
          }
        });
        renderTrackList();
      }

      // Select track without starting playback or altering hash again
      selectTrack(matchIdx, false, false);

      // Smooth scroll to track or jukebox
      setTimeout(function () {
        const trackRowEl = document.getElementById('track-' + selectedTrack.number);
        const jukeboxEl = document.getElementById('jukebox');

        if (trackRowEl) {
          trackRowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          trackRowEl.classList.remove('track-card-highlighted');
          void trackRowEl.offsetWidth;
          trackRowEl.classList.add('track-card-highlighted');
        } else if (jukeboxEl) {
          jukeboxEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }

  // Global exports for accessibility and external callers
  window.shareTrack = shareTrack;
  window.selectTrack = function (index, autoPlay, updateUrl) {
    selectTrack(index, autoPlay, updateUrl !== false);
  };

  // Self execute
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
