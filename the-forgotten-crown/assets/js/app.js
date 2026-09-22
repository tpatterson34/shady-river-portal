/* ==========================================================================
   THE FORGOTTEN CROWN - APPLICATION ENGINE
   Reactive Jukebox, Lyrics Studio, Native Audio Engine & Google Cast Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const album = window.FORGOTTEN_CROWN_DATA || window.ALBUM_DATA;
  if (!album) {
    console.error('[The Forgotten Crown] Album data is missing!');
    return;
  }

  // Application State
  let currentTrackIndex = 0;
  let isPlaying = false;
  let currentActFilter = 'all';
  let searchQuery = '';
  let currentExhibitIndex = 0;

  // Native Audio Element
  const audio = new Audio();
  audio.preload = 'metadata';
  window.audio = audio;
  window._appAudio = audio;

  // DOM Elements - Navigation & A11y
  const btnHighContrast = document.getElementById('btnHighContrast');
  const btnFontUp = document.getElementById('btnFontUp');
  const btnFontDown = document.getElementById('btnFontDown');
  const btnDyslexic = document.getElementById('btnDyslexic');
  const btnUnderline = document.getElementById('btnUnderline');

  // DOM Elements - Jukebox
  const tracklistScroll = document.getElementById('tracklist-scroll');
  const actFilterBtns = document.querySelectorAll('.filter-btn');
  const trackSearchInput = document.getElementById('track-search');

  // DOM Elements - Active Deck
  const deckActBadge = document.getElementById('deck-act-badge');
  const deckTitle = document.getElementById('deck-title');
  const deckStyles = document.getElementById('deck-styles');
  const deckSummary = document.getElementById('deck-summary');
  const deckLyrics = document.getElementById('deck-lyrics');
  const deckQuotes = document.getElementById('deck-quotes');
  const copyLyricsBtn = document.getElementById('copy-lyrics-btn');
  const deckBardNoteBtn = document.getElementById('deck-bard-note-btn');

  // DOM Elements - Visual Exhibits
  const exhibitMainImg = document.getElementById('exhibit-main-img');
  const exhibitTitle = document.getElementById('exhibit-title');
  const exhibitSubtitle = document.getElementById('exhibit-subtitle');
  const exhibitCaption = document.getElementById('exhibit-caption');
  const exhibitThumbs = document.getElementById('exhibit-thumbs');
  const prevExhibitBtn = document.getElementById('prev-exhibit-btn');
  const nextExhibitBtn = document.getElementById('next-exhibit-btn');

  // DOM Elements - Constitutional Matrix
  const matrixTbody = document.getElementById('matrix-tbody');

  // DOM Elements - Audio Player Bar
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const scrubber = document.getElementById('scrubber');
  const scrubberFill = document.getElementById('scrubber-fill');
  const currTimeEl = document.getElementById('curr-time');
  const totalTimeEl = document.getElementById('total-time');
  const volSlider = document.getElementById('vol-slider');
  const muteBtn = document.getElementById('mute-btn');
  const playerTitle = document.getElementById('player-title');
  const playerSub = document.getElementById('player-sub');

  // DOM Elements - Modals & Toast
  const toastEl = document.getElementById('toast');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalImg = document.getElementById('modal-img');
  const modalClose = document.getElementById('modal-close');
  const artZoomBtn = document.getElementById('art-zoom-btn');
  const heroCoverImg = document.getElementById('heroCoverImg');

  // Helpers
  function formatSeconds(sec) {
    if (isNaN(sec) || sec < 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function showToast(msg, duration = 2800) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, duration);
  }

  // ==========================================================================
  // PLAYBACK & DECK CONTROLLER
  // ==========================================================================
  function loadTrack(index, autoPlay = false) {
    if (index < 0 || index >= album.tracks.length) return;
    currentTrackIndex = index;
    window.currentTrackIndex = index;

    const track = album.tracks[index];

    // Update Bottom Player Deck
    if (playerTitle) playerTitle.textContent = `${track.number}. ${track.title}`;
    if (playerSub) playerSub.textContent = `${track.act_title} • ${track.duration}`;
    if (totalTimeEl) totalTimeEl.textContent = track.duration;
    if (currTimeEl) currTimeEl.textContent = '00:00';
    if (scrubberFill) scrubberFill.style.width = '0%';

    // Update Active Deck UI
    renderActiveDeck(track);

    // Update Tracklist UI
    renderTracklist();

    // Route through Google Cast if actively connected
    if (window.CastManager && window.CastManager.isConnected()) {
      if (!audio.paused) audio.pause();
      isPlaying = true;
      updatePlayBtnState();
      renderTracklist();
      window.CastManager.castTrack(index, album.tracks, album);
      return;
    }

    // Set Native Audio Source
    audio.src = track.audio_file;
    audio.load();

    if (autoPlay) {
      playAudio();
    } else {
      pauseAudio();
    }
  }

  function playAudio() {
    if (window.CastManager && window.CastManager.isConnected()) {
      if (!audio.paused) {
        audio.pause();
      }
      window.CastManager.playOrPause();
      return;
    }

    audio.play()
      .then(() => {
        isPlaying = true;
        updatePlayBtnState();
        renderTracklist();
      })
      .catch((err) => {
        console.warn('[Playback] Autoplay or playback prevented:', err);
      });
  }

  function pauseAudio() {
    // Always pause the local PC audio element
    if (!audio.paused) {
      audio.pause();
    }

    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.playOrPause();
      return;
    }

    isPlaying = false;
    updatePlayBtnState();
    renderTracklist();
  }

  function togglePlayPause() {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function updatePlayBtnState() {
    if (!playBtn) return;
    const icon = playBtn.querySelector('i');
    if (isPlaying) {
      if (icon) icon.className = 'fas fa-pause';
      playBtn.setAttribute('aria-label', 'Pause Track (Space)');
      playBtn.setAttribute('title', 'Pause Track (Space)');
    } else {
      if (icon) icon.className = 'fas fa-play';
      playBtn.setAttribute('aria-label', 'Play Track (Space)');
      playBtn.setAttribute('title', 'Play Track (Space)');
    }
  }

  function nextTrack() {
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.nextTrack();
      return;
    }

    let nextIdx = currentTrackIndex + 1;
    if (nextIdx >= album.tracks.length) nextIdx = 0;
    loadTrack(nextIdx, isPlaying);
  }

  function prevTrack() {
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.prevTrack();
      return;
    }

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    let prevIdx = currentTrackIndex - 1;
    if (prevIdx < 0) prevIdx = album.tracks.length - 1;
    loadTrack(prevIdx, isPlaying);
  }

  // Native Audio Event Listeners
  audio.addEventListener('timeupdate', () => {
    const cur = audio.currentTime || 0;
    const dur = audio.duration || album.tracks[currentTrackIndex]?.duration_seconds || 240;
    if (currTimeEl) currTimeEl.textContent = formatSeconds(cur);
    if (dur > 0 && scrubberFill) {
      const pct = (cur / dur) * 100;
      scrubberFill.style.width = `${pct}%`;
      if (scrubber) scrubber.setAttribute('aria-valuenow', Math.round(pct));
    }
  });

  audio.addEventListener('ended', () => {
    nextTrack();
  });

  // Scrubber Seeking
  if (scrubber) {
    scrubber.addEventListener('click', (e) => {
      const rect = scrubber.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const targetDuration = (audio.duration && !isNaN(audio.duration) && audio.duration > 0) 
        ? audio.duration 
        : (album.tracks[currentTrackIndex]?.duration_seconds || 240);
      const targetTime = pos * targetDuration;

      if (window.CastManager && window.CastManager.isConnected()) {
        window.CastManager.seek(targetTime);
        return;
      }

      audio.currentTime = targetTime;
    });
  }

  // Volume Controller
  if (volSlider) {
    volSlider.addEventListener('input', () => {
      const val = parseFloat(volSlider.value);
      audio.volume = val;
      if (muteBtn) {
        const icon = muteBtn.querySelector('i');
        if (val === 0) {
          if (icon) icon.className = 'fas fa-volume-mute';
        } else if (val < 0.5) {
          if (icon) icon.className = 'fas fa-volume-down';
        } else {
          if (icon) icon.className = 'fas fa-volume-up';
        }
      }
      if (window.CastManager && window.CastManager.setVolume) {
        window.CastManager.setVolume(val);
      }
    });
  }

  let lastVolume = 0.85;
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      if (audio.volume > 0) {
        lastVolume = audio.volume;
        audio.volume = 0;
        if (volSlider) volSlider.value = 0;
        muteBtn.querySelector('i').className = 'fas fa-volume-mute';
      } else {
        audio.volume = lastVolume;
        if (volSlider) volSlider.value = lastVolume;
        muteBtn.querySelector('i').className = 'fas fa-volume-up';
      }
    });
  }

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // Ignore when typing in search input
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.code === 'Space') {
      e.preventDefault();
      togglePlayPause();
    } else if (e.shiftKey && e.code === 'KeyN') {
      e.preventDefault();
      nextTrack();
    } else if (e.shiftKey && e.code === 'KeyP') {
      e.preventDefault();
      prevTrack();
    } else if (e.code === 'KeyM') {
      e.preventDefault();
      if (muteBtn) muteBtn.click();
    }
  });

  // Buttons Event Listeners
  if (playBtn) playBtn.addEventListener('click', togglePlayPause);
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);
  if (prevBtn) prevBtn.addEventListener('click', prevTrack);

  // ==========================================================================
  // ACTIVE DECK RENDERER
  // ==========================================================================
  function renderActiveDeck(track) {
    if (!track) return;

    if (deckActBadge) deckActBadge.textContent = `${track.act_title} (Track ${track.number} of 15)`;
    if (deckTitle) deckTitle.textContent = `${track.number}. ${track.title}`;

    if (deckStyles) {
      deckStyles.innerHTML = '';
      if (Array.isArray(track.style_tags)) {
        track.style_tags.forEach(tag => {
          const span = document.createElement('span');
          span.className = 'deck-style-tag';
          span.textContent = tag;
          deckStyles.appendChild(span);
        });
      }
    }

    if (deckSummary) {
      deckSummary.textContent = track.summary || track.narrative_role || '';
    }

    if (deckLyrics) {
      deckLyrics.textContent = track.lyrics || 'Lyrics pending studio finalization.';
      deckLyrics.scrollTop = 0;
    }

    if (deckQuotes) {
      deckQuotes.innerHTML = '';
      if (Array.isArray(track.pull_quotes) && track.pull_quotes.length > 0) {
        track.pull_quotes.forEach(q => {
          const p = document.createElement('div');
          p.className = 'deck-quote-item';
          p.textContent = `"${q}"`;
          deckQuotes.appendChild(p);
        });
      } else {
        const p = document.createElement('div');
        p.className = 'deck-quote-item';
        p.textContent = '"No parliament is sovereign here. The people are the crown."';
        deckQuotes.appendChild(p);
      }
    }

    if (deckBardNoteBtn) {
      deckBardNoteBtn.onclick = () => {
        if (typeof window.openBardNoteModal === 'function') {
          window.openBardNoteModal(track.title, album.title, track.number);
        } else {
          showToast('Bard Notes modal loading...');
        }
      };
      deckBardNoteBtn.setAttribute('aria-label', `Drop a note to the bard about ${track.title}`);
    }
  }

  // Copy Lyrics Button
  if (copyLyricsBtn) {
    copyLyricsBtn.addEventListener('click', () => {
      const track = album.tracks[currentTrackIndex];
      if (!track || !track.lyrics) return;
      const textToCopy = `${track.title} - The Shady River Bard\n\n${track.lyrics}`;
      navigator.clipboard.writeText(textToCopy)
        .then(() => showToast('Lyrics copied to clipboard!'))
        .catch(() => showToast('Unable to copy lyrics.'));
    });
  }

  // ==========================================================================
  // TRACKLIST RENDERER & SEARCH/FILTER
  // ==========================================================================
  function renderTracklist() {
    if (!tracklistScroll) return;
    tracklistScroll.innerHTML = '';

    const filtered = album.tracks.filter(t => {
      const matchesAct = (currentActFilter === 'all') || (t.act_number === parseInt(currentActFilter, 10));
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        t.title.toLowerCase().includes(q) ||
        (t.summary && t.summary.toLowerCase().includes(q)) ||
        (t.lyrics && t.lyrics.toLowerCase().includes(q)) ||
        (t.style_tags && t.style_tags.some(tag => tag.toLowerCase().includes(q)))
      );
      return matchesAct && matchesSearch;
    });

    if (filtered.length === 0) {
      tracklistScroll.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-dim); font-family: var(--font-serif); font-style: italic;">No matching songs found in the archives.</div>';
      return;
    }

    filtered.forEach(t => {
      const realIdx = album.tracks.findIndex(x => x.number === t.number);
      const isActive = realIdx === currentTrackIndex;

      const item = document.createElement('div');
      item.className = `track-item ${isActive ? 'active' : ''}`;
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `Track ${t.number}: ${t.title}`);

      item.innerHTML = `
        <div class="track-num">${t.number < 10 ? '0' + t.number : t.number}</div>
        <div class="track-info">
          <h4>${t.title}</h4>
          <div class="track-tags">
            ${(t.style_tags || []).slice(0, 2).map(tag => `<span class="track-tag-pill">${tag}</span>`).join('')}
          </div>
        </div>
        <div class="track-meta">
          <span class="track-dur">${t.duration}</span>
          <div class="track-play-icon" aria-hidden="true">
            <i class="fas ${isActive && isPlaying ? 'fa-pause' : 'fa-play'}"></i>
          </div>
        </div>
      `;

      item.addEventListener('click', () => {
        if (realIdx === currentTrackIndex) {
          togglePlayPause();
        } else {
          loadTrack(realIdx, true);
        }
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });

      tracklistScroll.appendChild(item);
    });
  }

  // Act Filter Buttons
  actFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      actFilterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentActFilter = btn.dataset.act || 'all';
      renderTracklist();
    });
  });

  // Live Search
  if (trackSearchInput) {
    trackSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderTracklist();
    });
  }

  // ==========================================================================
  // CONSTITUTIONAL MATRIX RENDERER
  // ==========================================================================
  function renderMatrix() {
    if (!matrixTbody || !Array.isArray(album.constitutional_matrix)) return;
    matrixTbody.innerHTML = '';

    album.constitutional_matrix.forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="width: 25%;">
          <div class="matrix-pillar-title">${item.pillar}</div>
          <div class="matrix-pillar-meta"><i class="fas fa-shield-alt"></i> ${item.metaphor || 'The Sovereign Safeguard'}</div>
        </td>
        <td style="width: 25%;">
          <strong style="color: var(--gold-bright); display: block; margin-bottom: 4px; font-size: 0.75rem; text-transform: uppercase;">Legal Foundation:</strong>
          ${item.core_causes}
        </td>
        <td style="width: 25%;">
          <strong style="color: var(--thistle-crimson); display: block; margin-bottom: 4px; font-size: 0.75rem; text-transform: uppercase;">Contemporary Suppression:</strong>
          ${item.manifestation}
        </td>
        <td style="width: 25%;">
          <strong style="color: var(--text-main); display: block; margin-bottom: 4px; font-size: 0.75rem; text-transform: uppercase;">Popular Awakening:</strong>
          ${item.societal_outcome}
        </td>
      `;
      matrixTbody.appendChild(tr);
    });
  }

  // ==========================================================================
  // VISUAL EXHIBITS SHOWCASE
  // ==========================================================================
  function renderExhibit(index) {
    if (!album.exhibits || index < 0 || index >= album.exhibits.length) return;
    currentExhibitIndex = index;
    const ex = album.exhibits[index];

    if (exhibitMainImg) {
      exhibitMainImg.src = ex.image_webp || ex.image_jpg;
      exhibitMainImg.alt = ex.title;
    }
    if (exhibitTitle) exhibitTitle.textContent = ex.title;
    if (exhibitSubtitle) exhibitSubtitle.textContent = ex.subtitle;
    if (exhibitCaption) exhibitCaption.textContent = ex.caption;

    // Update Thumbs
    if (exhibitThumbs) {
      const thumbEls = exhibitThumbs.querySelectorAll('.exhibit-thumb');
      thumbEls.forEach((th, idx) => {
        if (idx === index) {
          th.classList.add('active');
        } else {
          th.classList.remove('active');
        }
      });
    }
  }

  function initExhibitThumbs() {
    if (!exhibitThumbs || !Array.isArray(album.exhibits)) return;
    exhibitThumbs.innerHTML = '';

    album.exhibits.forEach((ex, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `exhibit-thumb ${idx === 0 ? 'active' : ''}`;
      thumb.setAttribute('role', 'button');
      thumb.setAttribute('tabindex', '0');
      thumb.setAttribute('aria-label', `View ${ex.title}`);
      thumb.innerHTML = `<img src="${ex.image_webp || ex.image_jpg}" alt="${ex.title} Thumbnail" />`;

      thumb.addEventListener('click', () => renderExhibit(idx));
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          renderExhibit(idx);
        }
      });
      exhibitThumbs.appendChild(thumb);
    });
  }

  if (prevExhibitBtn) {
    prevExhibitBtn.addEventListener('click', () => {
      let idx = currentExhibitIndex - 1;
      if (idx < 0) idx = album.exhibits.length - 1;
      renderExhibit(idx);
    });
  }

  if (nextExhibitBtn) {
    nextExhibitBtn.addEventListener('click', () => {
      let idx = currentExhibitIndex + 1;
      if (idx >= album.exhibits.length) idx = 0;
      renderExhibit(idx);
    });
  }

  // Lightbox Modal
  function openLightbox(src, alt) {
    if (!modalOverlay || !modalImg) return;
    modalImg.src = src;
    modalImg.alt = alt;
    modalOverlay.classList.add('open');
  }

  function closeLightbox() {
    if (modalOverlay) modalOverlay.classList.remove('open');
  }

  if (modalClose) modalClose.addEventListener('click', closeLightbox);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeLightbox();
    });
  }
  if (artZoomBtn) {
    artZoomBtn.addEventListener('click', () => {
      openLightbox('assets/art/album-cover.webp', 'The Forgotten Crown Master Artwork');
    });
  }
  if (heroCoverImg) {
    heroCoverImg.addEventListener('click', () => {
      openLightbox('assets/art/album-cover.webp', 'The Forgotten Crown Master Artwork');
    });
  }

  // ==========================================================================
  // ACCESSIBILITY TOOLBAR CONTROLLERS
  // ==========================================================================
  function initA11y() {
    if (localStorage.getItem('SRB_A11Y_CONTRAST') === 'true') {
      document.body.classList.add('high-contrast');
      if (btnHighContrast) btnHighContrast.classList.add('active');
    }
    if (localStorage.getItem('SRB_A11Y_DYSLEXIC') === 'true') {
      document.body.classList.add('dyslexic-mode');
      if (btnDyslexic) btnDyslexic.classList.add('active');
    }
    if (localStorage.getItem('SRB_A11Y_UNDERLINE') === 'true') {
      document.body.classList.add('underline-links');
      if (btnUnderline) btnUnderline.classList.add('active');
    }

    const savedFont = localStorage.getItem('SRB_A11Y_FONT');
    if (savedFont === 'large') document.body.classList.add('font-large');
    if (savedFont === 'xlarge') document.body.classList.add('font-xlarge');
  }

  if (btnHighContrast) {
    btnHighContrast.addEventListener('click', () => {
      const active = document.body.classList.toggle('high-contrast');
      btnHighContrast.classList.toggle('active', active);
      localStorage.setItem('SRB_A11Y_CONTRAST', active);
    });
  }

  if (btnDyslexic) {
    btnDyslexic.addEventListener('click', () => {
      const active = document.body.classList.toggle('dyslexic-mode');
      btnDyslexic.classList.toggle('active', active);
      localStorage.setItem('SRB_A11Y_DYSLEXIC', active);
    });
  }

  if (btnUnderline) {
    btnUnderline.addEventListener('click', () => {
      const active = document.body.classList.toggle('underline-links');
      btnUnderline.classList.toggle('active', active);
      localStorage.setItem('SRB_A11Y_UNDERLINE', active);
    });
  }

  if (btnFontUp) {
    btnFontUp.addEventListener('click', () => {
      if (document.body.classList.contains('font-large')) {
        document.body.classList.remove('font-large');
        document.body.classList.add('font-xlarge');
        localStorage.setItem('SRB_A11Y_FONT', 'xlarge');
      } else {
        document.body.classList.add('font-large');
        localStorage.setItem('SRB_A11Y_FONT', 'large');
      }
    });
  }

  if (btnFontDown) {
    btnFontDown.addEventListener('click', () => {
      if (document.body.classList.contains('font-xlarge')) {
        document.body.classList.remove('font-xlarge');
        document.body.classList.add('font-large');
        localStorage.setItem('SRB_A11Y_FONT', 'large');
      } else {
        document.body.classList.remove('font-large');
        document.body.classList.remove('font-xlarge');
        localStorage.removeItem('SRB_A11Y_FONT');
      }
    });
  }

  // ==========================================================================
  // GOOGLE CAST EVENT HOOKS
  // ==========================================================================
  if (window.CastManager) {
    window.CastManager.on('connected', (data) => {
      // Instantly pause local PC audio when Cast connects
      if (!audio.paused) {
        audio.pause();
      }
      isPlaying = true;
      updatePlayBtnState();
      renderTracklist();
    });

    window.CastManager.on('disconnected', () => {
      // Ensure audio is stopped on disconnect
      if (!audio.paused) {
        audio.pause();
      }
      isPlaying = false;
      updatePlayBtnState();
      renderTracklist();
    });

    window.CastManager.on('stateChange', (data) => {
      if (window.CastManager.isConnected()) {
        if (!audio.paused) {
          audio.pause();
        }
      }
      isPlaying = data.isPlaying;
      updatePlayBtnState();
      renderTracklist();
    });

    window.CastManager.on('trackChange', (trackIdx) => {
      if (trackIdx >= 0 && trackIdx < album.tracks.length && trackIdx !== currentTrackIndex) {
        currentTrackIndex = trackIdx;
        window.currentTrackIndex = trackIdx;
        loadTrack(trackIdx, false);
      }
    });

    window.CastManager.on('timeUpdate', (data) => {
      if (window.CastManager.isConnected() && data.duration > 0) {
        if (currTimeEl) currTimeEl.textContent = formatSeconds(data.currentTime);
        if (totalTimeEl) totalTimeEl.textContent = formatSeconds(data.duration);
        if (scrubberFill) {
          const pct = (data.currentTime / data.duration) * 100;
          scrubberFill.style.width = `${pct}%`;
        }
      }
    });
  }

  // Initial Boot
  initA11y();
  initExhibitThumbs();
  renderExhibit(0);
  renderMatrix();
  loadTrack(0, false);
});
