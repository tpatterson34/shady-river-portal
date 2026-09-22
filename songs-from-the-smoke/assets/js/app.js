/**
 * Songs from the Smoke (A Firefighter Tribute Album)
 * The Shady River Bard — 14 Studio Tracks, 4 Acts, Somber Americana Folk Opera
 * Interactive Experience & Audio Streaming Jukebox Engine
 */

(function () {
  'use strict';

  let data = window.SONGS_FROM_SMOKE_DATA || null;
  let tracks = [];
  let currentTrackIndex = 0;
  let isPlaying = false;
  let activeAct = 'all';
  let searchQuery = '';

  const audio = new Audio();
  audio.preload = 'metadata';

  // DOM Elements
  const trackListEl = document.getElementById('track-list');
  const lyricsContainerEl = document.getElementById('lyrics-container');
  const trackTitleEl = document.getElementById('active-track-title');
  const trackActEl = document.getElementById('active-track-act');
  const trackTaglineEl = document.getElementById('active-track-tagline');
  const trackSummaryEl = document.getElementById('active-track-summary');
  const trackTheoryEl = document.getElementById('active-track-theory');
  const trackTempoEl = document.getElementById('active-track-tempo');
  const trackArchetypeEl = document.getElementById('active-track-archetype');

  const playerBarTitle = document.getElementById('player-track-title');
  const playerBarAct = document.getElementById('player-track-act');
  const playBtn = document.getElementById('play-btn');
  const playIcon = document.getElementById('play-icon');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const progressSlider = document.getElementById('progress-slider');
  const currentTimeEl = document.getElementById('current-time');
  const totalTimeEl = document.getElementById('total-time');
  const volumeSlider = document.getElementById('volume-slider');

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

  function init() {
    if (!data && typeof window.SONGS_FROM_SMOKE_DATA !== 'undefined') {
      data = window.SONGS_FROM_SMOKE_DATA;
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
          console.error('Failed to load Songs from the Smoke album data:', err);
        });
    }
  }

  function setupApp() {
    renderTrackList();
    selectTrack(0, false);
    bindAudioEvents();
    bindUIEvents();
    checkVoteStatus();
    checkHash();
  }

  function renderTrackList() {
    if (!trackListEl) return;
    trackListEl.innerHTML = '';

    const filtered = tracks.filter(function (t) {
      if (activeAct !== 'all' && t.actNumber !== parseInt(activeAct, 10)) return false;
      if (searchQuery) {
        const blob = (t.title + ' ' + t.summary + ' ' + t.cleanLyrics + ' ' + t.theory + ' ' + t.leadArchetype + ' ' + t.style).toLowerCase();
        return blob.indexOf(searchQuery) !== -1;
      }
      return true;
    });

    if (filtered.length === 0) {
      trackListEl.innerHTML = '<div class="p-6 text-center text-stone-400 font-mono text-xs">No tracks match your query.</div>';
      return;
    }

    filtered.forEach(function (t) {
      const idx = tracks.findIndex(function (x) { return x.id === t.id; });
      const isCurrent = (idx === currentTrackIndex);
      const row = document.createElement('div');
      row.className = 'track-row flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ' +
        (isCurrent ? 'active bg-amber-950/40 border-amber-500/60 text-white shadow-lg shadow-amber-950/20' : 'bg-[#0c0e16] border-stone-800 hover:bg-[#131722] hover:border-stone-700 text-stone-300');
      row.setAttribute('data-track-index', idx);
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');

      const iconHtml = (isCurrent && isPlaying)
        ? '<i class="fa-solid fa-volume-high text-amber-400 animate-pulse"></i>'
        : String(t.number).padStart(2, '0');

      const btnIcon = (isCurrent && isPlaying) ? 'fa-pause' : 'fa-play';

      row.innerHTML = [
        '<div class="flex items-center gap-3.5 min-w-0 pr-3">',
        '  <span class="track-num w-7 text-center font-mono text-xs ' + (isCurrent ? 'text-amber-400 font-bold' : 'text-stone-500') + '">',
        '    ' + iconHtml,
        '  </span>',
        '  <div class="min-w-0">',
        '    <div class="track-title-text font-display font-bold text-sm truncate ' + (isCurrent ? 'text-amber-300' : 'text-stone-200') + '">',
        '      ' + t.title,
        '    </div>',
        '    <div class="text-[11px] font-serif text-stone-400 truncate mt-0.5">',
        '      ' + t.tagline,
        '    </div>',
        '  </div>',
        '</div>',
        '<div class="flex items-center gap-2 shrink-0">',
        '  <span class="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-stone-900 text-stone-400 border border-stone-800">',
        '    ' + t.leadArchetype,
        '  </span>',
        '  <button class="w-8 h-8 rounded-full ' + (isCurrent && isPlaying ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300 hover:text-white') + ' flex items-center justify-center text-xs transition-colors" aria-label="Play ' + t.title + '">',
        '    <i class="fa-solid ' + btnIcon + '"></i>',
        '  </button>',
        '</div>'
      ].join('\n');

      row.addEventListener('click', function () {
        if (currentTrackIndex === idx) {
          togglePlay();
        } else {
          selectTrack(idx, true);
        }
      });

      row.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (currentTrackIndex === idx) {
            togglePlay();
          } else {
            selectTrack(idx, true);
          }
        }
      });

      trackListEl.appendChild(row);
    });
  }

  function selectTrack(index, autoPlay) {
    const noteBtn = document.getElementById('deck-bard-note-btn');
    if (noteBtn) {
      noteBtn.onclick = () => {
        const activeTrack = (typeof tracks !== 'undefined' && tracks[index]) ? tracks[index] : (typeof t !== 'undefined' ? t : null);
        const sTitle = activeTrack ? (activeTrack.title || 'Track ' + (index+1)) : 'Track ' + (index+1);
        const sNum = activeTrack ? (activeTrack.number || index+1) : (index+1);
        if (typeof window.openBardNoteModal === 'function') {
          window.openBardNoteModal(sTitle, "Songs from the Smoke", sNum);
        }
      };
      if (typeof tracks !== 'undefined' && tracks[index]) {
        noteBtn.setAttribute('aria-label', `Drop a note to the bard about ${tracks[index].title}`);
      }
    }

    if (index < 0 || index >= tracks.length) return;
    currentTrackIndex = index;
    window.currentTrackIndex = index;
    const track = tracks[currentTrackIndex];

    if (trackTitleEl) trackTitleEl.textContent = track.number + '. ' + track.title;
    if (trackActEl) trackActEl.textContent = track.act;
    if (trackTaglineEl) trackTaglineEl.textContent = track.tagline;
    if (trackSummaryEl) trackSummaryEl.textContent = track.summary;
    if (trackTheoryEl) trackTheoryEl.textContent = track.theory;
    if (trackTempoEl) trackTempoEl.textContent = track.tempo + ' • ' + track.key;
    if (trackArchetypeEl) trackArchetypeEl.textContent = track.leadArchetype;

    if (playerBarTitle) playerBarTitle.textContent = track.number + '. ' + track.title;
    if (playerBarAct) playerBarAct.textContent = track.act;

    renderLyrics();
    renderTrackList();

    if (history.replaceState) {
      history.replaceState(null, '', '#track-' + String(track.number).padStart(2, '0'));
    }

    // Route through Google Cast if connected
    if (window.CastManager && window.CastManager.isConnected()) {
      if (!audio.paused) audio.pause();
      isPlaying = true;
      updatePlayButtonUI();
      renderTrackList();
      window.CastManager.castTrack(index, tracks, data);
      return;
    }

    audio.src = track.audioFile;

    if (autoPlay) {
      playAudio();
    }
  }

  function renderLyrics() {
    if (!lyricsContainerEl) return;
    const track = tracks[currentTrackIndex];
    if (!track) return;
    lyricsContainerEl.textContent = track.cleanLyrics || 'No lyrics available.';
  }

  function playAudio() {
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.playOrPause();
      return;
    }
    audio.play().then(function () {
      isPlaying = true;
      updatePlayButtonUI();
      renderTrackList();
    }).catch(function (err) {
      console.warn('Playback notice / user interaction required:', err);
    });
  }

  function pauseAudio() {
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.playOrPause();
      return;
    }
    audio.pause();
    isPlaying = false;
    updatePlayButtonUI();
    renderTrackList();
  }

  function togglePlay() {
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.playOrPause();
      return;
    }
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function updatePlayButtonUI() {
    if (playIcon) {
      playIcon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play ml-0.5';
    }
    if (playBtn) {
      playBtn.setAttribute('aria-label', isPlaying ? 'Pause audio' : 'Play audio');
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' + s : s);
  }

  function bindAudioEvents() {
    audio.addEventListener('timeupdate', function () {
      if (progressSlider && !progressSlider.matches(':active')) {
        const pct = (audio.currentTime / (audio.duration || 1)) * 100;
        progressSlider.value = pct;
      }
      if (currentTimeEl) {
        currentTimeEl.textContent = formatTime(audio.currentTime);
      }
    });

    audio.addEventListener('loadedmetadata', function () {
      if (totalTimeEl) {
        totalTimeEl.textContent = formatTime(audio.duration);
      }
    });

    audio.addEventListener('ended', function () {
      if (currentTrackIndex < tracks.length - 1) {
        selectTrack(currentTrackIndex + 1, true);
      } else {
        pauseAudio();
      }
    });

    audio.addEventListener('play', function () {
      isPlaying = true;
      updatePlayButtonUI();
    });

    audio.addEventListener('pause', function () {
      isPlaying = false;
      updatePlayButtonUI();
    });

    if (progressSlider) {
      progressSlider.addEventListener('input', function (e) {
        if (window.CastManager && window.CastManager.isConnected()) {
          const t = tracks[currentTrackIndex];
          const parts = (t && t.duration) ? t.duration.split(':') : ['4', '15'];
          const totalSec = parts.length === 2 ? parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10) : 255;
          window.CastManager.seek((e.target.value / 100) * totalSec);
          return;
        }
        if (audio.duration) {
          audio.currentTime = (e.target.value / 100) * audio.duration;
        }
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', function (e) {
        const val = e.target.value / 100;
        if (window.CastManager && window.CastManager.isConnected()) {
          window.CastManager.setVolume(val);
        }
        audio.volume = val;
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
        updatePlayButtonUI();
        renderTrackList();
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
        updatePlayButtonUI();
        renderTrackList();
      });

      window.CastManager.on('disconnected', function () {
        isPlaying = !audio.paused;
        updatePlayButtonUI();
        renderTrackList();
      });
    }
  }

  function bindUIEvents() {
    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (prevBtn) prevBtn.addEventListener('click', function () {
      if (window.CastManager && window.CastManager.isConnected()) {
        window.CastManager.prevTrack();
        return;
      }
      if (audio.currentTime > 3) {
        audio.currentTime = 0;
      } else if (currentTrackIndex > 0) {
        selectTrack(currentTrackIndex - 1, true);
      }
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      if (window.CastManager && window.CastManager.isConnected()) {
        window.CastManager.nextTrack();
        return;
      }
      if (currentTrackIndex < tracks.length - 1) {
        selectTrack(currentTrackIndex + 1, true);
      }
    });

    if (copyLyricsBtn) {
      copyLyricsBtn.addEventListener('click', function () {
        const track = tracks[currentTrackIndex];
        const textToCopy = track ? (track.cleanLyrics || '') : '';
        navigator.clipboard.writeText(textToCopy).then(function () {
          if (copyFeedback) {
            copyFeedback.classList.remove('hidden');
            setTimeout(function () { copyFeedback.classList.add('hidden'); }, 2000);
          }
        });
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        searchQuery = e.target.value.trim().toLowerCase();
        renderTrackList();
      });
    }

    actFilterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        actFilterBtns.forEach(function (b) {
          b.classList.remove('bg-amber-500', 'text-stone-950', 'font-bold');
          b.classList.add('bg-stone-900', 'text-stone-300');
        });
        btn.classList.add('bg-amber-500', 'text-stone-950', 'font-bold');
        btn.classList.remove('bg-stone-900', 'text-stone-300');
        activeAct = btn.getAttribute('data-act-filter');
        renderTrackList();
      });
    });

    // Exhibits tabs switcher
    const tabBtns = document.querySelectorAll('[data-exhibit-tab]');
    const tabPanels = document.querySelectorAll('[data-exhibit-panel]');
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = btn.getAttribute('data-exhibit-tab');
        tabBtns.forEach(function (b) {
          b.classList.remove('border-amber-500', 'text-amber-400');
          b.classList.add('border-transparent', 'text-stone-400');
        });
        btn.classList.add('border-amber-500', 'text-amber-400');
        btn.classList.remove('border-transparent', 'text-stone-400');

        tabPanels.forEach(function (p) {
          p.classList.toggle('hidden', p.getAttribute('data-exhibit-panel') !== target);
        });
      });
    });

    // Voting modal handlers
    if (voteHeroBtn) voteHeroBtn.addEventListener('click', openVoteModal);
    if (closeVoteBtn) closeVoteBtn.addEventListener('click', closeVoteModal);
    if (voteBackdrop) voteBackdrop.addEventListener('click', closeVoteModal);
    if (confirmVoteBtn) confirmVoteBtn.addEventListener('click', submitVote);

    // Art Zoom modal handlers
    if (artZoomBtn) artZoomBtn.addEventListener('click', openArtModal);
    if (closeArtBtn) closeArtBtn.addEventListener('click', closeArtModal);
    if (artBackdrop) artBackdrop.addEventListener('click', closeArtModal);

    // Accessibility Mode toggles
    const highContrastToggle = document.getElementById('toggle-high-contrast');
    const largeFontToggle = document.getElementById('toggle-large-font');
    const underlineToggle = document.getElementById('toggle-underline');
    const reducedMotionToggle = document.getElementById('toggle-reduced-motion');

    if (highContrastToggle) {
      highContrastToggle.addEventListener('click', function () {
        document.body.classList.toggle('high-contrast');
        highContrastToggle.classList.toggle('text-amber-400');
      });
    }
    if (largeFontToggle) {
      largeFontToggle.addEventListener('click', function () {
        document.body.classList.toggle('large-font');
        largeFontToggle.classList.toggle('text-amber-400');
      });
    }
    if (underlineToggle) {
      underlineToggle.addEventListener('click', function () {
        document.body.classList.toggle('underline-links');
        underlineToggle.classList.toggle('text-amber-400');
      });
    }
    if (reducedMotionToggle) {
      reducedMotionToggle.addEventListener('click', function () {
        document.body.classList.toggle('reduced-motion');
        reducedMotionToggle.classList.toggle('text-amber-400');
      });
    }

    // Global keyboard navigation
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeVoteModal();
        closeArtModal();
      }
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        if (e.key === ' ') {
          e.preventDefault();
          togglePlay();
        } else if (e.key === 'ArrowRight') {
          audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
        } else if (e.key === 'ArrowLeft') {
          audio.currentTime = Math.max(0, audio.currentTime - 5);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (currentTrackIndex < tracks.length - 1) selectTrack(currentTrackIndex + 1, true);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (currentTrackIndex > 0) selectTrack(currentTrackIndex - 1, true);
        } else if (e.key === 'm' || e.key === 'M') {
          audio.muted = !audio.muted;
        }
      }
    });
  }

  function openVoteModal() {
    if (voteModal) voteModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeVoteModal() {
    if (voteModal) voteModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function submitVote() {
    localStorage.setItem('voted_songs_from_the_smoke', 'true');
    checkVoteStatus();
    closeVoteModal();
  }

  function checkVoteStatus() {
    const voted = localStorage.getItem('voted_songs_from_the_smoke');
    if (voteHeroBtn) {
      if (voted) {
        voteHeroBtn.innerHTML = '<i class="fa-solid fa-check text-emerald-400 mr-2"></i><span>Release Prioritized</span>';
        voteHeroBtn.classList.remove('bg-amber-500', 'hover:bg-amber-400', 'text-stone-950');
        voteHeroBtn.classList.add('bg-emerald-950/80', 'border', 'border-emerald-600/50', 'text-emerald-300', 'cursor-default');
      } else {
        voteHeroBtn.innerHTML = '<i class="fa-solid fa-vote-yea mr-2"></i><span>Vote to Prioritize Release</span>';
      }
    }
  }

  function openArtModal() {
    if (artModal) artModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeArtModal() {
    if (artModal) artModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function checkHash() {
    const hash = window.location.hash;
    if (hash && hash.indexOf('#track-') === 0) {
      const num = parseInt(hash.replace('#track-', ''), 10);
      const idx = tracks.findIndex(function (t) { return t.number === num; });
      if (idx !== -1) {
        selectTrack(idx, false);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
