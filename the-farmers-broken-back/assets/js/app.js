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
    selectTrack(0, false);
    bindAudioEvents();
    bindUIEvents();
    initA11yToolbar();
    loadPreferences();
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
      row.className = 'track-row flex items-center justify-between p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer ' +
        (isCurrent ? 'active bg-amber-950/40 border-amber-500/60 text-white shadow-lg shadow-amber-950/20' : 'bg-[#12140e] border-stone-800 hover:bg-[#181b13] hover:border-stone-700 text-stone-300');
      row.setAttribute('data-track-index', idx);
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
        '<div class="flex items-center gap-3 shrink-0">' +
          '<span class="font-mono text-xs text-stone-400 hidden xs:inline">' + t.duration + '</span>' +
          '<button class="row-play-btn w-8 h-8 rounded-full ' + (isCurrent ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-300 hover:text-white') + ' flex items-center justify-center text-xs transition-colors" aria-label="Play ' + t.title + '">' +
            '<i class="fa-solid ' + btnIcon + '"></i>' +
          '</button>' +
        '</div>';

      row.addEventListener('click', function (e) {
        if (e.target.closest('.row-play-btn')) {
          if (idx === currentTrackIndex) {
            togglePlay();
          } else {
            selectTrack(idx, true);
          }
        } else {
          selectTrack(idx, true);
        }
      });

      row.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectTrack(idx, true);
        }
      });

      trackListEl.appendChild(row);
    });
  }

  // --- TRACK SELECTION & DISPLAY ---
  function selectTrack(index, autoplay) {
    if (index < 0 || index >= tracks.length) return;
    currentTrackIndex = index;
    const t = tracks[currentTrackIndex];

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
    let nextIdx = currentTrackIndex - 1;
    if (nextIdx < 0) nextIdx = tracks.length - 1;
    selectTrack(nextIdx, true);
  }

  function nextTrack() {
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
        if (!isNaN(audio.duration) && audio.duration > 0) {
          audio.currentTime = (e.target.value / 100) * audio.duration;
        }
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', function (e) {
        const val = parseFloat(e.target.value) / 100;
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

  // Self execute
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
