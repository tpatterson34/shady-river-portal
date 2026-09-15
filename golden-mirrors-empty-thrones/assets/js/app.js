/* ==========================================================================
   Album XX: Golden Mirrors & Empty Thrones (The End of Virtue)
   The Shady River Bard - Interactive Player & Narrative Engine
   ========================================================================== */

(function () {
  'use strict';

  // Application State
  const state = {
    album: null,
    tracks: [],
    currentTrackIndex: 0,
    isPlaying: false,
    lyricMode: 'clean', // 'clean' or 'studio'
    activeDetailTab: 'lyrics', // 'lyrics', 'summary', 'prompt'
    activeActFilter: 'all',
    searchQuery: '',
    audio: new Audio(),
    a11y: {
      highContrast: false,
      largeFont: false,
      underlineLinks: false,
      reducedMotion: false
    }
  };

  // DOM Cache
  const DOM = {};

  function init() {
    cacheDOM();
    loadA11yPreferences();
    loadAlbumData()
      .then(data => {
        state.album = data;
        state.tracks = data.tracks;
        setupAudioEngine();
        bindEvents();
        renderTrackList();
        renderCurrentTrack();
        renderVirtuesTable();
        initExhibits();
        checkExistingVote();
      })
      .catch(err => {
        console.error('Failed to initialize album data:', err);
      });
  }

  function cacheDOM() {
    DOM.masterPlayer = document.getElementById('masterPlayer');
    DOM.currentTrackTitle = document.getElementById('currentTrackTitle');
    DOM.currentTrackAct = document.getElementById('currentTrackAct');
    DOM.btnPlayPause = document.getElementById('btnPlayPause');
    DOM.btnPrev = document.getElementById('btnPrev');
    DOM.btnNext = document.getElementById('btnNext');
    DOM.btnMute = document.getElementById('btnMute');
    DOM.currentTimeLabel = document.getElementById('currentTime');
    DOM.totalDurationLabel = document.getElementById('totalDuration');
    DOM.progressBar = document.getElementById('progressBar');
    DOM.progressFill = document.getElementById('progressFill');
    DOM.volumeSlider = document.getElementById('volumeSlider');

    DOM.trackSearchInput = document.getElementById('trackSearchInput');
    DOM.actPills = document.querySelectorAll('.act-pill');
    DOM.trackListContainer = document.getElementById('trackList');

    DOM.trackDisplayTitle = document.getElementById('trackDisplayTitle');
    DOM.trackDisplayAct = document.getElementById('trackDisplayAct');
    DOM.trackDisplayTagline = document.getElementById('trackDisplayTagline');
    DOM.specKey = document.getElementById('specKey');
    DOM.specTempo = document.getElementById('specTempo');
    DOM.specMood = document.getElementById('specMood');
    DOM.specElement = document.getElementById('specElement');

    DOM.lyricsBody = document.getElementById('lyricsBody');
    DOM.narrativeSummaryBox = document.getElementById('narrativeSummaryBox');
    DOM.promptInspectorBox = document.getElementById('promptInspectorBox');

    DOM.btnTabLyrics = document.getElementById('tabLyrics');
    DOM.btnTabSummary = document.getElementById('tabSummary');
    DOM.btnTabPrompt = document.getElementById('tabPrompt');
    DOM.btnLyricModeClean = document.getElementById('lyricModeClean');
    DOM.btnLyricModeStudio = document.getElementById('lyricModeStudio');
    DOM.btnCopyLyrics = document.getElementById('btnCopyLyrics');

    DOM.toastNotice = document.getElementById('toastNotice');
    DOM.virtuesTableBody = document.getElementById('virtuesTableBody');

    // Modals
    DOM.voteModal = document.getElementById('voteModal');
    DOM.btnOpenVote = document.getElementById('btnOpenVote');
    DOM.btnHeroVote = document.getElementById('btnHeroVote');
    DOM.btnCloseVote = document.getElementById('btnCloseVote');
    DOM.btnSubmitVote = document.getElementById('btnSubmitVote');

    DOM.coverModal = document.getElementById('coverModal');
    DOM.heroCoverImg = document.getElementById('heroCoverImg');
    DOM.btnCloseCover = document.getElementById('btnCloseCover');
  }

  async function loadAlbumData() {
    if (window.GOLDEN_MIRRORS_DATA) {
      return window.GOLDEN_MIRRORS_DATA;
    }
    const response = await fetch('data/album-data.json');
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status);
    }
    return await response.json();
  }

  function setupAudioEngine() {
    state.audio.preload = 'metadata';

    state.audio.addEventListener('loadedmetadata', () => {
      DOM.totalDurationLabel.textContent = formatTime(state.audio.duration);
    });

    state.audio.addEventListener('timeupdate', () => {
      if (!state.audio.duration) return;
      const progress = (state.audio.currentTime / state.audio.duration) * 100;
      DOM.progressFill.style.width = progress + '%';
      DOM.currentTimeLabel.textContent = formatTime(state.audio.currentTime);
    });

    state.audio.addEventListener('ended', () => {
      playNextTrack();
    });

    state.audio.addEventListener('play', () => {
      state.isPlaying = true;
      updatePlayButtonUI();
      updateTrackListActiveState();
    });

    state.audio.addEventListener('pause', () => {
      state.isPlaying = false;
      updatePlayButtonUI();
      updateTrackListActiveState();
    });

    state.audio.addEventListener('error', (e) => {
      console.warn('Audio playback error or file not yet loaded:', e);
      showToast('Audio file loading or unavailable');
    });
  }

  function bindEvents() {
    // Playback Controls
    DOM.btnPlayPause.addEventListener('click', togglePlay);
    DOM.btnPrev.addEventListener('click', playPrevTrack);
    DOM.btnNext.addEventListener('click', playNextTrack);

    DOM.btnMute.addEventListener('click', () => {
      state.audio.muted = !state.audio.muted;
      DOM.btnMute.innerHTML = state.audio.muted 
        ? '<i class="fas fa-volume-mute"></i>' 
        : '<i class="fas fa-volume-up"></i>';
    });

    DOM.volumeSlider.addEventListener('input', (e) => {
      state.audio.volume = parseFloat(e.target.value);
      state.audio.muted = false;
      DOM.btnMute.innerHTML = '<i class="fas fa-volume-up"></i>';
    });

    DOM.progressBar.addEventListener('click', (e) => {
      const rect = DOM.progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const targetTime = (clickX / width) * state.audio.duration;
      if (!isNaN(targetTime)) {
        state.audio.currentTime = targetTime;
      }
    });

    // Act Filter Pills
    DOM.actPills.forEach(pill => {
      pill.addEventListener('click', () => {
        DOM.actPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.activeActFilter = pill.dataset.act;
        renderTrackList();
      });
    });

    // Search Input
    DOM.trackSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderTrackList();
    });

    // Detail Tabs
    DOM.btnTabLyrics.addEventListener('click', () => switchDetailTab('lyrics'));
    DOM.btnTabSummary.addEventListener('click', () => switchDetailTab('summary'));
    DOM.btnTabPrompt.addEventListener('click', () => switchDetailTab('prompt'));

    // Lyric Mode Toggle
    DOM.btnLyricModeClean.addEventListener('click', () => setLyricMode('clean'));
    DOM.btnLyricModeStudio.addEventListener('click', () => setLyricMode('studio'));

    // Copy Lyrics
    DOM.btnCopyLyrics.addEventListener('click', copyCurrentLyrics);

    // Vote Modal
    const openVote = () => { DOM.voteModal.classList.add('active'); };
    const closeVote = () => { DOM.voteModal.classList.remove('active'); };
    if (DOM.btnOpenVote) DOM.btnOpenVote.addEventListener('click', openVote);
    if (DOM.btnHeroVote) DOM.btnHeroVote.addEventListener('click', openVote);
    if (DOM.btnCloseVote) DOM.btnCloseVote.addEventListener('click', closeVote);
    DOM.btnSubmitVote.addEventListener('click', submitVote);

    // Cover Zoom Modal
    if (DOM.heroCoverImg) {
      DOM.heroCoverImg.addEventListener('click', () => {
        DOM.coverModal.classList.add('active');
      });
    }
    if (DOM.btnCloseCover) {
      DOM.btnCloseCover.addEventListener('click', () => {
        DOM.coverModal.classList.remove('active');
      });
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        state.audio.currentTime = Math.max(0, state.audio.currentTime - 5);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        state.audio.currentTime = Math.min(state.audio.duration || 0, state.audio.currentTime + 5);
      } else if (e.code === 'KeyM') {
        DOM.btnMute.click();
      }
    });

    // Accessibility Controls
    setupA11yToolbar();
  }

  function renderTrackList() {
    DOM.trackListContainer.innerHTML = '';

    const filtered = state.tracks.filter(track => {
      // Act filter
      if (state.activeActFilter !== 'all' && track.actNumber !== parseInt(state.activeActFilter)) {
        return false;
      }
      // Search filter
      if (state.searchQuery) {
        const titleMatch = track.title.toLowerCase().includes(state.searchQuery);
        const subMatch = (track.subtitle || '').toLowerCase().includes(state.searchQuery);
        const elementMatch = track.thematicElement.toLowerCase().includes(state.searchQuery);
        const lyricsMatch = track.cleanLyrics.toLowerCase().includes(state.searchQuery);
        return titleMatch || subMatch || elementMatch || lyricsMatch;
      }
      return true;
    });

    if (filtered.length === 0) {
      DOM.trackListContainer.innerHTML = '<div style="padding:1.5rem; text-align:center; color:var(--text-muted);">No tracks matching criteria</div>';
      return;
    }

    filtered.forEach(track => {
      const idx = track.number - 1;
      const isActive = idx === state.currentTrackIndex;
      const isCurrentlyPlaying = isActive && state.isPlaying;

      const item = document.createElement('div');
      item.className = 'track-item' + (isActive ? ' active' : '');
      item.dataset.index = idx;

      item.innerHTML = `
        <div class="track-meta">
          <div class="track-num">${isCurrentlyPlaying ? '<i class="fas fa-volume-up" style="color:var(--gold-primary)"></i>' : String(track.number).padStart(2, '0')}</div>
          <div>
            <div class="track-name">${track.title}</div>
            ${track.subtitle ? `<div class="track-sub">${track.subtitle}</div>` : ''}
          </div>
        </div>
        <div class="track-chips">
          <span class="chip-tag">${track.key}</span>
          <span class="chip-tag">${track.tempo}</span>
        </div>
      `;

      item.addEventListener('click', () => {
        setTrack(idx, true);
      });

      DOM.trackListContainer.appendChild(item);
    });
  }

  function updateTrackListActiveState() {
    const items = DOM.trackListContainer.querySelectorAll('.track-item');
    items.forEach(item => {
      const idx = parseInt(item.dataset.index);
      const isCurrent = idx === state.currentTrackIndex;
      const numEl = item.querySelector('.track-num');
      
      if (isCurrent) {
        item.classList.add('active');
        if (numEl) {
          numEl.innerHTML = state.isPlaying 
            ? '<i class="fas fa-volume-up" style="color:var(--gold-primary)"></i>' 
            : String(idx + 1).padStart(2, '0');
        }
      } else {
        item.classList.remove('active');
        if (numEl) {
          numEl.textContent = String(idx + 1).padStart(2, '0');
        }
      }
    });
  }

  function setTrack(index, autoplay = false) {
    if (index < 0 || index >= state.tracks.length) return;
    state.currentTrackIndex = index;
    const track = state.tracks[index];

    state.audio.src = track.audioFile;
    state.audio.load();

    renderCurrentTrack();
    updateTrackListActiveState();

    if (autoplay) {
      state.audio.play().catch(e => console.log('Autoplay deferred:', e));
    }
  }

  function renderCurrentTrack() {
    const track = state.tracks[state.currentTrackIndex];
    if (!track) return;

    // Master Player Bar
    DOM.currentTrackTitle.textContent = `${track.number}. ${track.title}`;
    DOM.currentTrackAct.textContent = track.act;

    // Track Detail Pane
    DOM.trackDisplayTitle.textContent = `${track.number}. ${track.title}`;
    DOM.trackDisplayAct.textContent = track.act;
    DOM.trackDisplayTagline.textContent = track.actDescription || '';

    DOM.specKey.textContent = track.key;
    DOM.specTempo.textContent = track.tempo;
    DOM.specMood.textContent = track.mood || 'Brooding & Relentless';
    DOM.specElement.textContent = track.thematicElement;

    // Lyrics & Content
    updateLyricsDisplay();
    DOM.narrativeSummaryBox.textContent = track.summary;
    DOM.promptInspectorBox.textContent = track.musicalPrompt;
  }

  function updateLyricsDisplay() {
    const track = state.tracks[state.currentTrackIndex];
    if (!track) return;

    if (state.lyricMode === 'clean') {
      DOM.lyricsBody.classList.remove('studio-mode');
      DOM.lyricsBody.textContent = track.cleanLyrics;
    } else {
      DOM.lyricsBody.classList.add('studio-mode');
      DOM.lyricsBody.textContent = track.decoratedLyrics;
    }
  }

  function togglePlay() {
    if (!state.audio.src) {
      setTrack(state.currentTrackIndex, true);
      return;
    }
    if (state.isPlaying) {
      state.audio.pause();
    } else {
      state.audio.play().catch(e => console.log('Playback error:', e));
    }
  }

  function playPrevTrack() {
    let nextIdx = state.currentTrackIndex - 1;
    if (nextIdx < 0) nextIdx = state.tracks.length - 1;
    setTrack(nextIdx, true);
  }

  function playNextTrack() {
    let nextIdx = state.currentTrackIndex + 1;
    if (nextIdx >= state.tracks.length) nextIdx = 0;
    setTrack(nextIdx, true);
  }

  function updatePlayButtonUI() {
    if (state.isPlaying) {
      DOM.btnPlayPause.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      DOM.btnPlayPause.innerHTML = '<i class="fas fa-play"></i>';
    }
  }

  function switchDetailTab(tabName) {
    state.activeDetailTab = tabName;
    DOM.btnTabLyrics.classList.toggle('active', tabName === 'lyrics');
    DOM.btnTabSummary.classList.toggle('active', tabName === 'summary');
    DOM.btnTabPrompt.classList.toggle('active', tabName === 'prompt');

    DOM.lyricsBody.style.display = tabName === 'lyrics' ? 'block' : 'none';
    DOM.narrativeSummaryBox.style.display = tabName === 'summary' ? 'block' : 'none';
    DOM.promptInspectorBox.style.display = tabName === 'prompt' ? 'block' : 'none';
  }

  function setLyricMode(mode) {
    state.lyricMode = mode;
    DOM.btnLyricModeClean.classList.toggle('active', mode === 'clean');
    DOM.btnLyricModeStudio.classList.toggle('active', mode === 'studio');
    updateLyricsDisplay();
  }

  function copyCurrentLyrics() {
    const track = state.tracks[state.currentTrackIndex];
    if (!track) return;

    const textToCopy = state.lyricMode === 'clean' ? track.cleanLyrics : track.decoratedLyrics;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('Lyrics copied to clipboard!');
    }).catch(err => {
      console.error('Clipboard copy failed:', err);
    });
  }

  function renderVirtuesTable() {
    if (!DOM.virtuesTableBody || !state.album.thematicMatrix) return;
    DOM.virtuesTableBody.innerHTML = '';

    state.album.thematicMatrix.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="col-virtue">${row.classicalVirtue}</td>
        <td class="col-rot">${row.gildedDecline}</td>
        <td>${row.manifestation}</td>
        <td class="col-track">${row.albumTrack}</td>
      `;
      DOM.virtuesTableBody.appendChild(tr);
    });
  }

  function initExhibits() {
    const tabs = document.querySelectorAll('.exhibit-tab');
    const panes = document.querySelectorAll('.exhibit-pane');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetId = 'exhibit-' + tab.dataset.exhibit;
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });

    // Wire track jumper buttons inside exhibit sidebar
    const exhibitPlayBtns = document.querySelectorAll('[data-jump-track]');
    exhibitPlayBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const trackNum = parseInt(btn.dataset.jumpTrack);
        setTrack(trackNum - 1, true);
        const jukeEl = document.getElementById('jukebox');
        if (jukeEl) jukeEl.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function submitVote() {
    const selected = document.querySelector('input[name="voteTier"]:checked');
    if (!selected) {
      alert('Please select a release recommendation option.');
      return;
    }

    const voteVal = selected.value;
    localStorage.setItem('srb_vote_golden_mirrors', JSON.stringify({
      choice: voteVal,
      date: new Date().toISOString()
    }));

    DOM.voteModal.classList.remove('active');
    showToast('Your vote for Golden Mirrors & Empty Thrones has been recorded!');
    updateVoteUI(voteVal);
  }

  function checkExistingVote() {
    const saved = localStorage.getItem('srb_vote_golden_mirrors');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        updateVoteUI(data.choice);
      } catch (e) {}
    }
  }

  function updateVoteUI(choice) {
    const heroBtn = DOM.btnHeroVote;
    if (heroBtn) {
      heroBtn.textContent = 'Voted: ' + choice;
      heroBtn.classList.add('voted');
    }
  }

  function showToast(msg) {
    if (!DOM.toastNotice) return;
    DOM.toastNotice.textContent = msg;
    DOM.toastNotice.style.display = 'block';
    setTimeout(() => {
      DOM.toastNotice.style.display = 'none';
    }, 2800);
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Accessibility Controls
  function setupA11yToolbar() {
    const btnContrast = document.getElementById('btnHighContrast');
    const btnFontUp = document.getElementById('btnFontUp');
    const btnFontDown = document.getElementById('btnFontDown');
    const btnUnderline = document.getElementById('btnUnderlineLinks');
    const btnMotion = document.getElementById('btnReducedMotion');

    if (btnContrast) {
      btnContrast.addEventListener('click', () => {
        state.a11y.highContrast = !state.a11y.highContrast;
        document.body.classList.toggle('high-contrast', state.a11y.highContrast);
        btnContrast.classList.toggle('active', state.a11y.highContrast);
        saveA11yPreferences();
      });
    }

    if (btnFontUp) {
      btnFontUp.addEventListener('click', () => {
        state.a11y.largeFont = true;
        document.body.classList.add('large-font');
        saveA11yPreferences();
      });
    }

    if (btnFontDown) {
      btnFontDown.addEventListener('click', () => {
        state.a11y.largeFont = false;
        document.body.classList.remove('large-font');
        saveA11yPreferences();
      });
    }

    if (btnUnderline) {
      btnUnderline.addEventListener('click', () => {
        state.a11y.underlineLinks = !state.a11y.underlineLinks;
        document.body.classList.toggle('underline-links', state.a11y.underlineLinks);
        btnUnderline.classList.toggle('active', state.a11y.underlineLinks);
        saveA11yPreferences();
      });
    }

    if (btnMotion) {
      btnMotion.addEventListener('click', () => {
        state.a11y.reducedMotion = !state.a11y.reducedMotion;
        document.body.classList.toggle('reduced-motion', state.a11y.reducedMotion);
        btnMotion.classList.toggle('active', state.a11y.reducedMotion);
        saveA11yPreferences();
      });
    }
  }

  function loadA11yPreferences() {
    try {
      const saved = JSON.parse(localStorage.getItem('srb_a11y_prefs') || '{}');
      state.a11y = { ...state.a11y, ...saved };
      if (state.a11y.highContrast) document.body.classList.add('high-contrast');
      if (state.a11y.largeFont) document.body.classList.add('large-font');
      if (state.a11y.underlineLinks) document.body.classList.add('underline-links');
      if (state.a11y.reducedMotion) document.body.classList.add('reduced-motion');
    } catch (e) {}
  }

  function saveA11yPreferences() {
    try {
      localStorage.setItem('srb_a11y_prefs', JSON.stringify(state.a11y));
    } catch (e) {}
  }

  // Launch on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
