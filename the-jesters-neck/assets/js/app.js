/**
 * The Jester's Neck — Bespoke Concept Web Application
 * Audio Engine, Interactive Lyric Stage, 4-Act Narrative Filter,
 * 7-Pillar Systemic Matrix, Exhibits Lightbox & Accessibility Controls
 */

(function() {
  'use strict';

  // State
  const state = {
    albumData: window.ALBUM_DATA || null,
    currentTrackIndex: 0,
    isPlaying: false,
    currentActFilter: 'all',
    currentExhibitIndex: 0,
    isMuted: false,
    volume: 0.85,
    fontSizeStep: 0, // -1, 0, 1, 2
    highContrast: false,
    dyslexicFont: false,
    reducedMotion: false
  };

  // Audio Object
  const audio = new Audio();
  audio.preload = 'metadata';

  // DOM Elements
  const elements = {
    // Top & Hero
    heroPlayBtn: document.getElementById('hero-play-btn'),
    // Act Filter Tabs
    actFilterButtons: document.querySelectorAll('[data-act-filter]'),
    trackListContainer: document.getElementById('track-list-container'),
    // Active Track Stage
    stageTrackNum: document.getElementById('stage-track-num'),
    stageTrackTitle: document.getElementById('stage-track-title'),
    stageTrackTagline: document.getElementById('stage-track-tagline'),
    stageActBadge: document.getElementById('stage-act-badge'),
    stagePillarBadge: document.getElementById('stage-pillar-badge'),
    stageDuration: document.getElementById('stage-duration'),
    stageSummary: document.getElementById('stage-summary'),
    stageNarrative: document.getElementById('stage-narrative'),
    stageLyrics: document.getElementById('stage-lyrics'),
    stageTagsContainer: document.getElementById('stage-tags-container'),
    copyLyricsBtn: document.getElementById('copy-lyrics-btn'),
    copyToast: document.getElementById('copy-toast'),
    stagePlayBtn: document.getElementById('stage-play-btn'),
    stagePlayIcon: document.getElementById('stage-play-icon'),
    // Sticky Player
    stickyPlayer: document.getElementById('sticky-player'),
    stickyPlayBtn: document.getElementById('sticky-play-btn'),
    stickyPlayIcon: document.getElementById('sticky-play-icon'),
    stickyPrevBtn: document.getElementById('sticky-prev-btn'),
    stickyNextBtn: document.getElementById('sticky-next-btn'),
    stickyMuteBtn: document.getElementById('sticky-mute-btn'),
    stickyMuteIcon: document.getElementById('sticky-mute-icon'),
    stickyTrackTitle: document.getElementById('sticky-track-title'),
    stickyTrackMeta: document.getElementById('sticky-track-meta'),
    stickyProgress: document.getElementById('sticky-progress'),
    stickyCurrentTime: document.getElementById('sticky-current-time'),
    stickyTotalTime: document.getElementById('sticky-total-time'),
    stickyVolume: document.getElementById('sticky-volume'),
    stickyCoverArt: document.getElementById('sticky-cover-art'),
    // Exhibits
    exhibitMainImg: document.getElementById('exhibit-main-img'),
    exhibitMainTitle: document.getElementById('exhibit-main-title'),
    exhibitMainAct: document.getElementById('exhibit-main-act'),
    exhibitMainCaption: document.getElementById('exhibit-main-caption'),
    exhibitMainQuote: document.getElementById('exhibit-main-quote'),
    exhibitPrevBtn: document.getElementById('exhibit-prev-btn'),
    exhibitNextBtn: document.getElementById('exhibit-next-btn'),
    exhibitCounter: document.getElementById('exhibit-counter'),
    exhibitThumbnails: document.getElementById('exhibit-thumbnails'),
    exhibitLightboxModal: document.getElementById('exhibit-lightbox-modal'),
    exhibitLightboxImg: document.getElementById('exhibit-lightbox-img'),
    exhibitLightboxCaption: document.getElementById('exhibit-lightbox-caption'),
    closeLightboxBtn: document.getElementById('close-lightbox-btn'),
    // Systemic Matrix
    matrixTableBody: document.getElementById('matrix-table-body'),
    // A11y Toolbar
    fontSizeDownBtn: document.getElementById('a11y-font-down'),
    fontSizeResetBtn: document.getElementById('a11y-font-reset'),
    fontSizeUpBtn: document.getElementById('a11y-font-up'),
    contrastToggleBtn: document.getElementById('a11y-contrast-toggle'),
    dyslexicToggleBtn: document.getElementById('a11y-dyslexic-toggle'),
    motionToggleBtn: document.getElementById('a11y-motion-toggle'),
    liveRegion: document.getElementById('a11y-live-region')
  };

  // Helper: Announce for Screen Readers
  function announce(msg) {
    if (elements.liveRegion) {
      elements.liveRegion.textContent = msg;
    }
  }

  // Helper: Format Time (seconds -> mm:ss)
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Load Preferences from localStorage
  function loadPreferences() {
    try {
      const savedVolume = localStorage.getItem('jesters_volume');
      if (savedVolume !== null) {
        state.volume = parseFloat(savedVolume);
        audio.volume = state.volume;
        if (elements.stickyVolume) elements.stickyVolume.value = state.volume;
      }

      if (localStorage.getItem('jesters_contrast') === 'true') {
        state.highContrast = true;
        document.body.classList.add('high-contrast');
      }

      if (localStorage.getItem('jesters_dyslexic') === 'true') {
        state.dyslexicFont = true;
        document.body.classList.add('dyslexic-font');
      }

      if (localStorage.getItem('jesters_motion') === 'true') {
        state.reducedMotion = true;
        document.body.classList.add('reduced-motion');
      }

      const savedFontStep = localStorage.getItem('jesters_font_step');
      if (savedFontStep !== null) {
        state.fontSizeStep = parseInt(savedFontStep, 10);
        applyFontSize();
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  function applyFontSize() {
    const root = document.documentElement;
    const base = 16;
    const newSize = base + (state.fontSizeStep * 2);
    root.style.setProperty('--base-font-size', `${newSize}px`);
    localStorage.setItem('jesters_font_step', state.fontSizeStep);
  }

  // Initialize Application
  function init() {
    if (!state.albumData || !state.albumData.tracks || state.albumData.tracks.length === 0) {
      console.error("Album data is missing or empty.");
      return;
    }

    loadPreferences();
    renderTrackList();
    renderMatrixTable();
    setupExhibits();
    loadTrack(0, false);
    setupEventListeners();

    console.log("The Jester's Neck initialized with", state.albumData.tracks.length, "tracks.");
  }

  // Render Track List Cards
  function renderTrackList() {
    if (!elements.trackListContainer) return;
    elements.trackListContainer.innerHTML = '';

    state.albumData.tracks.forEach((track, index) => {
      const card = document.createElement('div');
      card.className = `track-card p-3 sm:p-4 rounded-lg flex items-center justify-between gap-3 cursor-pointer group select-none ${index === state.currentTrackIndex ? 'active' : ''}`;
      card.id = `track-card-${index}`;
      card.setAttribute('data-track-index', index);
      card.setAttribute('data-act-num', track.act_number);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Track ${track.number}: ${track.title}, duration ${track.duration}`);

      card.innerHTML = `
        <div class="flex items-center gap-3 min-w-0">
          <span class="track-num-badge w-8 h-8 rounded flex items-center justify-center font-mono text-xs text-stone-400 bg-stone-900 border border-stone-800 transition-colors flex-shrink-0 group-hover:border-amber-500/50">
            ${track.number < 10 ? '0' + track.number : track.number}
          </span>
          <div class="min-w-0">
            <h4 class="font-display font-bold text-sm sm:text-base text-stone-200 truncate group-hover:text-amber-400 transition-colors">
              ${track.title}
            </h4>
            <div class="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
              <span class="text-amber-500/90 font-mono text-[11px]">Act ${track.act_number}</span>
              <span>•</span>
              <span class="truncate hidden sm:inline text-stone-400">${track.thematic_pillar}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2.5 flex-shrink-0">
          <span class="font-mono text-xs text-stone-400">${track.duration}</span>
          <button class="w-8 h-8 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center hover:bg-amber-600 hover:text-black transition-all track-play-btn" data-track-index="${index}" aria-label="Play ${track.title}">
            <i class="fa-solid fa-play text-xs ml-0.5" id="card-play-icon-${index}"></i>
          </button>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (!e.target.closest('.track-play-btn')) {
          loadTrack(index, true);
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          loadTrack(index, true);
        }
      });

      const playBtn = card.querySelector('.track-play-btn');
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (state.currentTrackIndex === index) {
          togglePlay();
        } else {
          loadTrack(index, true);
        }
      });

      elements.trackListContainer.appendChild(card);
    });

    applyActFilter(state.currentActFilter);
  }

  // Act Filtering Logic
  function applyActFilter(actValue) {
    state.currentActFilter = actValue;
    const cards = elements.trackListContainer.querySelectorAll('.track-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const cardAct = card.getAttribute('data-act-num');
      if (actValue === 'all' || actValue === cardAct) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    elements.actFilterButtons.forEach(btn => {
      const btnAct = btn.getAttribute('data-act-filter');
      if (btnAct === actValue) {
        btn.classList.remove('bg-stone-900', 'text-stone-400', 'border-stone-800');
        btn.classList.add('bg-amber-600', 'text-black', 'border-amber-500', 'font-bold');
      } else {
        btn.classList.remove('bg-amber-600', 'text-black', 'border-amber-500', 'font-bold');
        btn.classList.add('bg-stone-900', 'text-stone-400', 'border-stone-800');
      }
    });

    announce(`Showing ${visibleCount} tracks for ${actValue === 'all' ? 'All Acts' : 'Act ' + actValue}`);
  }

  // Load a Track
  function loadTrack(index, autoPlay = false) {
    if (index < 0 || index >= state.albumData.tracks.length) return;

    state.currentTrackIndex = index;
    const track = state.albumData.tracks[index];

    audio.src = track.audio_url;
    audio.load();

    // Update Active Track Stage
    if (elements.stageTrackNum) elements.stageTrackNum.textContent = `TRACK ${track.number < 10 ? '0' + track.number : track.number} OF ${state.albumData.track_count}`;
    if (elements.stageTrackTitle) elements.stageTrackTitle.textContent = track.title;
    if (elements.stageTrackTagline) elements.stageTrackTagline.textContent = track.tagline;
    if (elements.stageActBadge) elements.stageActBadge.textContent = `Act ${track.act_number}: ${track.act_title}`;
    if (elements.stagePillarBadge) elements.stagePillarBadge.textContent = track.thematic_pillar;
    if (elements.stageDuration) elements.stageDuration.textContent = track.duration;
    if (elements.stageSummary) elements.stageSummary.textContent = track.summary;
    if (elements.stageNarrative) elements.stageNarrative.textContent = track.narrative_role || track.summary;
    if (elements.stageLyrics) elements.stageLyrics.textContent = track.lyrics;

    // Render Tags
    if (elements.stageTagsContainer) {
      elements.stageTagsContainer.innerHTML = '';
      if (track.tags && track.tags.length > 0) {
        track.tags.forEach(tag => {
          const chip = document.createElement('span');
          chip.className = 'px-2 py-0.5 rounded text-[11px] font-mono bg-stone-900 border border-stone-800 text-stone-400';
          chip.textContent = `#${tag}`;
          elements.stageTagsContainer.appendChild(chip);
        });
      }
    }

    // Update Sticky Player
    if (elements.stickyTrackTitle) elements.stickyTrackTitle.textContent = track.title;
    if (elements.stickyTrackMeta) elements.stickyTrackMeta.textContent = `Track ${track.number} • Act ${track.act_number} • ${track.thematic_pillar}`;
    if (elements.stickyTotalTime) elements.stickyTotalTime.textContent = track.duration;
    if (elements.stickyCurrentTime) elements.stickyCurrentTime.textContent = '0:00';
    if (elements.stickyProgress) elements.stickyProgress.value = 0;

    // Update Active Card in List
    document.querySelectorAll('.track-card').forEach((c, i) => {
      if (i === index) {
        c.classList.add('active');
        c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        c.classList.remove('active');
      }
    });

    announce(`Loaded Track ${track.number}: ${track.title}`);

    if (autoPlay) {
      playAudio();
    } else {
      updatePlayIcons(false);
    }
  }

  // Audio Playback Controls
  function playAudio() {
    audio.play().then(() => {
      state.isPlaying = true;
      updatePlayIcons(true);
      announce(`Playing ${state.albumData.tracks[state.currentTrackIndex].title}`);
    }).catch(err => {
      console.warn("Audio play prevented:", err);
      state.isPlaying = false;
      updatePlayIcons(false);
    });
  }

  function pauseAudio() {
    audio.pause();
    state.isPlaying = false;
    updatePlayIcons(false);
    announce("Audio paused");
  }

  function togglePlay() {
    if (state.isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function nextTrack() {
    if (state.currentTrackIndex < state.albumData.tracks.length - 1) {
      loadTrack(state.currentTrackIndex + 1, true);
    } else {
      // Loop back to track 1
      loadTrack(0, true);
    }
  }

  function prevTrack() {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else if (state.currentTrackIndex > 0) {
      loadTrack(state.currentTrackIndex - 1, true);
    } else {
      audio.currentTime = 0;
    }
  }

  function updatePlayIcons(playing) {
    const playIconClass = playing ? 'fa-pause' : 'fa-play';
    const pauseIconClass = playing ? 'fa-play' : 'fa-pause';

    if (elements.stickyPlayIcon) {
      elements.stickyPlayIcon.classList.remove(pauseIconClass);
      elements.stickyPlayIcon.classList.add(playIconClass);
    }
    if (elements.stagePlayIcon) {
      elements.stagePlayIcon.classList.remove(pauseIconClass);
      elements.stagePlayIcon.classList.add(playIconClass);
    }
    if (elements.heroPlayBtn) {
      const heroIcon = elements.heroPlayBtn.querySelector('i');
      if (heroIcon) {
        heroIcon.classList.remove(pauseIconClass);
        heroIcon.classList.add(playIconClass);
      }
    }

    // Update list card play icons
    state.albumData.tracks.forEach((_, i) => {
      const icon = document.getElementById(`card-play-icon-${i}`);
      if (icon) {
        if (i === state.currentTrackIndex && playing) {
          icon.classList.remove('fa-play');
          icon.classList.add('fa-pause');
        } else {
          icon.classList.remove('fa-pause');
          icon.classList.add('fa-play');
        }
      }
    });

    const eq = document.getElementById('audio-eq-bars');
    if (eq) {
      if (playing) {
        eq.classList.remove('paused');
      } else {
        eq.classList.add('paused');
      }
    }
  }

  // Render Table 0 Systemic Matrix
  function renderMatrixTable() {
    if (!elements.matrixTableBody || !state.albumData.systemic_matrix) return;
    elements.matrixTableBody.innerHTML = '';

    state.albumData.systemic_matrix.forEach(p => {
      const row = document.createElement('tr');
      row.className = 'transition-colors';
      row.innerHTML = `
        <td class="font-display font-bold text-amber-400 whitespace-nowrap">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-amber-950/60 border border-amber-600/50 flex items-center justify-center text-xs font-mono text-amber-300">${p.letter}</span>
            <span>${p.name}</span>
          </div>
        </td>
        <td class="text-xs sm:text-sm text-stone-300">${p.core_causes}</td>
        <td class="text-xs sm:text-sm text-stone-300">${p.key_manifestations}</td>
        <td class="text-xs sm:text-sm text-stone-400">${p.dramatic_outcomes}</td>
      `;
      elements.matrixTableBody.appendChild(row);
    });
  }

  // Setup Exhibits
  function setupExhibits() {
    if (!state.albumData.exhibits || state.albumData.exhibits.length === 0) return;

    if (elements.exhibitThumbnails) {
      elements.exhibitThumbnails.innerHTML = '';
      state.albumData.exhibits.forEach((ex, idx) => {
        const thumb = document.createElement('button');
        thumb.className = `w-16 h-10 sm:w-20 sm:h-12 rounded border-2 overflow-hidden transition-all flex-shrink-0 ${idx === state.currentExhibitIndex ? 'border-amber-500 scale-105' : 'border-stone-800 opacity-60 hover:opacity-100'}`;
        thumb.id = `exhibit-thumb-${idx}`;
        thumb.setAttribute('aria-label', `View exhibit ${idx + 1}: ${ex.title}`);
        thumb.innerHTML = `<img src="${ex.image}" alt="${ex.title}" class="w-full h-full object-cover">`;
        thumb.addEventListener('click', () => setExhibit(idx));
        elements.exhibitThumbnails.appendChild(thumb);
      });
    }

    setExhibit(0);
  }

  function setExhibit(idx) {
    if (!state.albumData.exhibits || idx < 0 || idx >= state.albumData.exhibits.length) return;
    state.currentExhibitIndex = idx;
    const ex = state.albumData.exhibits[idx];

    if (elements.exhibitMainImg) {
      elements.exhibitMainImg.src = ex.image;
      elements.exhibitMainImg.alt = ex.title;
    }
    if (elements.exhibitMainTitle) elements.exhibitMainTitle.textContent = ex.title;
    if (elements.exhibitMainAct) elements.exhibitMainAct.textContent = ex.act;
    if (elements.exhibitMainCaption) elements.exhibitMainCaption.textContent = ex.caption;
    if (elements.exhibitMainQuote) elements.exhibitMainQuote.textContent = `"${ex.quote}"`;
    if (elements.exhibitCounter) elements.exhibitCounter.textContent = `${idx + 1} / ${state.albumData.exhibits.length}`;

    // Update thumbnail borders
    state.albumData.exhibits.forEach((_, i) => {
      const t = document.getElementById(`exhibit-thumb-${i}`);
      if (t) {
        if (i === idx) {
          t.className = 'w-16 h-10 sm:w-20 sm:h-12 rounded border-2 border-amber-500 scale-105 overflow-hidden transition-all flex-shrink-0';
        } else {
          t.className = 'w-16 h-10 sm:w-20 sm:h-12 rounded border-2 border-stone-800 opacity-60 hover:opacity-100 overflow-hidden transition-all flex-shrink-0';
        }
      }
    });
  }

  function nextExhibit() {
    const nextIdx = (state.currentExhibitIndex + 1) % state.albumData.exhibits.length;
    setExhibit(nextIdx);
  }

  function prevExhibit() {
    const prevIdx = (state.currentExhibitIndex - 1 + state.albumData.exhibits.length) % state.albumData.exhibits.length;
    setExhibit(prevIdx);
  }

  function openLightbox() {
    const ex = state.albumData.exhibits[state.currentExhibitIndex];
    if (!ex || !elements.exhibitLightboxModal) return;
    elements.exhibitLightboxImg.src = ex.image;
    elements.exhibitLightboxCaption.textContent = `${ex.title} (${ex.act}) — ${ex.caption}`;
    elements.exhibitLightboxModal.classList.remove('hidden');
    elements.exhibitLightboxModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!elements.exhibitLightboxModal) return;
    elements.exhibitLightboxModal.classList.add('hidden');
    elements.exhibitLightboxModal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  // Copy Lyrics
  function copyLyrics() {
    const track = state.albumData.tracks[state.currentTrackIndex];
    if (!track || !track.lyrics) return;

    const fullLyricText = `"${track.title}" by The Shady River Bard\nFrom Album XX: The Jester's Neck\n\n${track.lyrics}\n\n© 2026 The Shady River Bard. All rights reserved.`;

    navigator.clipboard.writeText(fullLyricText).then(() => {
      if (elements.copyToast) {
        elements.copyToast.classList.remove('opacity-0', 'pointer-events-none');
        setTimeout(() => {
          elements.copyToast.classList.add('opacity-0', 'pointer-events-none');
        }, 2200);
      }
      announce(`Lyrics for ${track.title} copied to clipboard.`);
    }).catch(err => {
      console.warn("Clipboard copy failed:", err);
    });
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Audio Time Update
    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const progress = (audio.currentTime / audio.duration) * 100;
      if (elements.stickyProgress) elements.stickyProgress.value = progress;
      if (elements.stickyCurrentTime) elements.stickyCurrentTime.textContent = formatTime(audio.currentTime);
    });

    // Audio Metadata Loaded
    audio.addEventListener('loadedmetadata', () => {
      if (elements.stickyTotalTime && audio.duration) {
        elements.stickyTotalTime.textContent = formatTime(audio.duration);
      }
    });

    // Audio Track Ended -> Auto Advance
    audio.addEventListener('ended', () => {
      nextTrack();
    });

    // Seek Slider
    if (elements.stickyProgress) {
      elements.stickyProgress.addEventListener('input', (e) => {
        if (!audio.duration) return;
        const seekTo = (e.target.value / 100) * audio.duration;
        audio.currentTime = seekTo;
      });
    }

    // Volume Slider
    if (elements.stickyVolume) {
      elements.stickyVolume.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        audio.volume = val;
        state.volume = val;
        state.isMuted = (val === 0);
        updateMuteIcon();
        try { localStorage.setItem('jesters_volume', val); } catch(e) {}
      });
    }

    // Mute Button
    if (elements.stickyMuteBtn) {
      elements.stickyMuteBtn.addEventListener('click', () => {
        state.isMuted = !state.isMuted;
        audio.muted = state.isMuted;
        updateMuteIcon();
      });
    }

    function updateMuteIcon() {
      if (!elements.stickyMuteIcon) return;
      if (state.isMuted || audio.volume === 0) {
        elements.stickyMuteIcon.className = 'fa-solid fa-volume-xmark text-xs text-red-400';
      } else if (audio.volume < 0.5) {
        elements.stickyMuteIcon.className = 'fa-solid fa-volume-low text-xs text-stone-300';
      } else {
        elements.stickyMuteIcon.className = 'fa-solid fa-volume-high text-xs text-stone-300';
      }
    }

    // Play Buttons
    if (elements.heroPlayBtn) elements.heroPlayBtn.addEventListener('click', togglePlay);
    if (elements.stagePlayBtn) elements.stagePlayBtn.addEventListener('click', togglePlay);
    if (elements.stickyPlayBtn) elements.stickyPlayBtn.addEventListener('click', togglePlay);
    if (elements.stickyNextBtn) elements.stickyNextBtn.addEventListener('click', nextTrack);
    if (elements.stickyPrevBtn) elements.stickyPrevBtn.addEventListener('click', prevTrack);

    // Copy Lyrics Button
    if (elements.copyLyricsBtn) elements.copyLyricsBtn.addEventListener('click', copyLyrics);

    // Act Filters
    elements.actFilterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const act = btn.getAttribute('data-act-filter');
        applyActFilter(act);
      });
    });

    // Exhibits Controls
    if (elements.exhibitNextBtn) elements.exhibitNextBtn.addEventListener('click', nextExhibit);
    if (elements.exhibitPrevBtn) elements.exhibitPrevBtn.addEventListener('click', prevExhibit);
    if (elements.exhibitMainImg) elements.exhibitMainImg.addEventListener('click', openLightbox);
    if (elements.closeLightboxBtn) elements.closeLightboxBtn.addEventListener('click', closeLightbox);
    if (elements.exhibitLightboxModal) {
      elements.exhibitLightboxModal.addEventListener('click', (e) => {
        if (e.target === elements.exhibitLightboxModal) closeLightbox();
      });
    }

    // A11y Controls
    if (elements.fontSizeUpBtn) {
      elements.fontSizeUpBtn.addEventListener('click', () => {
        if (state.fontSizeStep < 2) {
          state.fontSizeStep++;
          applyFontSize();
        }
      });
    }
    if (elements.fontSizeResetBtn) {
      elements.fontSizeResetBtn.addEventListener('click', () => {
        state.fontSizeStep = 0;
        applyFontSize();
      });
    }
    if (elements.fontSizeDownBtn) {
      elements.fontSizeDownBtn.addEventListener('click', () => {
        if (state.fontSizeStep > -1) {
          state.fontSizeStep--;
          applyFontSize();
        }
      });
    }

    if (elements.contrastToggleBtn) {
      elements.contrastToggleBtn.addEventListener('click', () => {
        state.highContrast = !state.highContrast;
        document.body.classList.toggle('high-contrast', state.highContrast);
        try { localStorage.setItem('jesters_contrast', state.highContrast); } catch(e) {}
      });
    }

    if (elements.dyslexicToggleBtn) {
      elements.dyslexicToggleBtn.addEventListener('click', () => {
        state.dyslexicFont = !state.dyslexicFont;
        document.body.classList.toggle('dyslexic-font', state.dyslexicFont);
        try { localStorage.setItem('jesters_dyslexic', state.dyslexicFont); } catch(e) {}
      });
    }

    if (elements.motionToggleBtn) {
      elements.motionToggleBtn.addEventListener('click', () => {
        state.reducedMotion = !state.reducedMotion;
        document.body.classList.toggle('reduced-motion', state.reducedMotion);
        try { localStorage.setItem('jesters_motion', state.reducedMotion); } catch(e) {}
      });
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Ignore when inside inputs
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight' && !e.shiftKey) {
        audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
      } else if (e.code === 'ArrowLeft' && !e.shiftKey) {
        audio.currentTime = Math.max(0, audio.currentTime - 5);
      } else if ((e.key === 'n' || e.key === 'N') || (e.code === 'ArrowRight' && e.shiftKey)) {
        e.preventDefault();
        nextTrack();
      } else if ((e.key === 'p' || e.key === 'P') || (e.code === 'ArrowLeft' && e.shiftKey)) {
        e.preventDefault();
        prevTrack();
      } else if (e.key === 'm' || e.key === 'M') {
        state.isMuted = !state.isMuted;
        audio.muted = state.isMuted;
        updateMuteIcon();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    });
  }

  // Boot on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
