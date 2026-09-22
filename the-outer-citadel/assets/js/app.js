/* The Outer Citadel (A Citizen's Songbook) - Application Engine */
document.addEventListener('DOMContentLoaded', () => {
  const album = window.ALBUM_DATA;
  if (!album) {
    console.error("ALBUM_DATA is missing!");
    return;
  }

  // State
  let currentTrackIndex = 0;
  let isPlaying = false;
  let currentActFilter = 'all';
  let searchQuery = '';
  let currentExhibitIndex = 0;

  // Audio Object
  const audio = new Audio();
  audio.preload = 'metadata';

  // DOM Elements
  const tracklistContainer = document.getElementById('tracklist-scroll');
  const actFilterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('track-search');

  // Deck Elements
  const deckActBadge = document.getElementById('deck-act-badge');
  const deckTitle = document.getElementById('deck-title');
  const deckVirtue = document.getElementById('deck-virtue');
  const deckSummary = document.getElementById('deck-summary');
  const deckNarrativeRole = document.getElementById('deck-narrative-role');
  const deckLyrics = document.getElementById('deck-lyrics');
  const deckQuotes = document.getElementById('deck-quotes');
  const copyLyricsBtn = document.getElementById('copy-lyrics-btn');

  // Matrix Elements
  const matrixTbody = document.getElementById('matrix-tbody');

  // Exhibit Elements
  const exhibitMainImg = document.getElementById('exhibit-main-img');
  const exhibitTitle = document.getElementById('exhibit-title');
  const exhibitSubtitle = document.getElementById('exhibit-subtitle');
  const exhibitCaption = document.getElementById('exhibit-caption');
  const exhibitThumbs = document.getElementById('exhibit-thumbs');
  const prevExhibitBtn = document.getElementById('prev-exhibit-btn');
  const nextExhibitBtn = document.getElementById('next-exhibit-btn');

  // Player Elements
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

  // Modals & Tools
  const toastEl = document.getElementById('toast');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalImg = document.getElementById('modal-img');
  const modalClose = document.getElementById('modal-close');
  const artZoomBtn = document.getElementById('art-zoom-btn');

  // A11y Toggles
  const contrastToggle = document.getElementById('contrast-toggle');
  const fontToggle = document.getElementById('font-toggle');
  const dyslexicToggle = document.getElementById('dyslexic-toggle');

  // Format Seconds helper
  function formatSeconds(sec) {
    if (isNaN(sec) || sec < 0) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Toast Helper
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2600);
  }

  // Render Tracklist
  function renderTracklist() {
    tracklistContainer.innerHTML = '';

    const filtered = album.tracks.filter(t => {
      const matchesAct = (currentActFilter === 'all') || (t.act_number === parseInt(currentActFilter, 10));
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        t.title.toLowerCase().includes(q) ||
        t.virtue.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.lyrics.toLowerCase().includes(q)
      );
      return matchesAct && matchesSearch;
    });

    if (filtered.length === 0) {
      tracklistContainer.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-dim);">No matching tracks found.</div>';
      return;
    }

    filtered.forEach(track => {
      const idx = album.tracks.findIndex(t => t.number === track.number);
      const row = document.createElement('div');
      row.className = `track-row ${idx === currentTrackIndex ? 'active' : ''} ${idx === currentTrackIndex && isPlaying ? 'playing' : ''}`;
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.setAttribute('aria-label', `Play Track ${track.number}: ${track.title}`);

      row.innerHTML = `
        <span class="track-num">${track.number < 10 ? '0' : ''}${track.number}</span>
        <div class="track-info">
          <div class="track-title">${track.title}</div>
          <div class="track-virtue">${track.virtue}</div>
        </div>
        <div class="track-duration">${track.duration}</div>
        <button class="track-play-btn" aria-label="Play ${track.title}">
          <i class="${idx === currentTrackIndex && isPlaying ? 'ph-pause-fill' : 'ph-play-fill'}"></i>
        </button>
      `;

      row.addEventListener('click', (e) => {
        if (idx === currentTrackIndex) {
          togglePlay();
        } else {
          loadTrack(idx, true);
        }
      });

      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (idx === currentTrackIndex) togglePlay();
          else loadTrack(idx, true);
        }
      });

      tracklistContainer.appendChild(row);
    });
  }

  // Load Track into Deck and Player
  function loadTrack(index, autoPlay = false) {
    if (index < 0 || index >= album.tracks.length) return;
    currentTrackIndex = index;
    window.currentTrackIndex = index;
    const track = album.tracks[index];

    // Update Deck
    deckActBadge.textContent = track.act_title;
    deckTitle.textContent = `${track.number}. ${track.title}`;
    deckVirtue.textContent = track.virtue;
    deckSummary.textContent = track.summary;
    deckNarrativeRole.textContent = track.narrative_role;
    deckLyrics.textContent = track.lyrics || "(Instrumental or spoken word)";

    const noteBtn = document.getElementById('deck-bard-note-btn');
    if (noteBtn) {
      noteBtn.onclick = () => {
        if (typeof window.openBardNoteModal === 'function') {
          window.openBardNoteModal(track.title, "The Outer Citadel", track.number);
        }
      };
      noteBtn.setAttribute('aria-label', `Drop a note to the bard about ${track.title}`);
    }

    // Update Quotes
    if (track.pull_quotes && track.pull_quotes.length > 0) {
      deckQuotes.parentElement.style.display = 'block';
      deckQuotes.innerHTML = track.pull_quotes.map(q => `<div class="quote-item">${q}</div>`).join('');
    } else {
      deckQuotes.parentElement.style.display = 'none';
    }

    // Update Sticky Player Info
    playerTitle.textContent = `${track.number}. ${track.title}`;
    playerSub.textContent = track.virtue;
    totalTimeEl.textContent = track.duration;
    currTimeEl.textContent = "00:00";
    scrubberFill.style.width = "0%";

    renderTracklist();

    // Route through Google Cast if connected
    if (window.CastManager && window.CastManager.isConnected()) {
      if (!audio.paused) audio.pause();
      isPlaying = true;
      updatePlayButtonUI();
      renderTracklist();
      window.CastManager.castTrack(index, album.tracks, album);
      return;
    }

    // Set Audio Source
    audio.src = track.audio_file;
    audio.load();

    if (autoPlay) {
      playAudio();
    }
  }

  // Audio Controls
  function playAudio() {
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.playOrPause();
      return;
    }
    audio.play().then(() => {
      isPlaying = true;
      updatePlayButtonUI();
      renderTracklist();
    }).catch(err => {
      console.warn("Audio play blocked or interrupted:", err);
      isPlaying = false;
      updatePlayButtonUI();
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
    renderTracklist();
  }

  function togglePlay() {
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.playOrPause();
      return;
    }
    if (audio.paused) {
      playAudio();
    } else {
      pauseAudio();
    }
  }

  function updatePlayButtonUI() {
    const icon = playBtn.querySelector('i');
    if (isPlaying) {
      icon.className = 'ph-pause-fill';
      playBtn.setAttribute('aria-label', 'Pause');
    } else {
      icon.className = 'ph-play-fill';
      playBtn.setAttribute('aria-label', 'Play');
    }
  }

  function nextTrack() {
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.nextTrack();
      return;
    }
    let nextIdx = (currentTrackIndex + 1) % album.tracks.length;
    loadTrack(nextIdx, true);
  }

  function prevTrack() {
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.prevTrack();
      return;
    }
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      let prevIdx = (currentTrackIndex - 1 + album.tracks.length) % album.tracks.length;
      loadTrack(prevIdx, true);
    }
  }

  // Audio Event Listeners
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      scrubberFill.style.width = `${progress}%`;
      currTimeEl.textContent = formatSeconds(audio.currentTime);
    }
  });

  audio.addEventListener('ended', () => {
    nextTrack();
  });

  // Scrubber click / seek
  scrubber.addEventListener('click', (e) => {
    const rect = scrubber.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (window.CastManager && window.CastManager.isConnected()) {
      const t = album.tracks[currentTrackIndex];
      const parts = (t && t.duration) ? t.duration.split(':') : ['3', '40'];
      const totalSec = parts.length === 2 ? parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10) : 220;
      window.CastManager.seek(pos * totalSec);
      return;
    }
    if (!audio.duration) return;
    audio.currentTime = pos * audio.duration;
  });

  // Volume & Mute
  volSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.setVolume(val);
    }
    audio.volume = val;
    audio.muted = false;
    updateMuteIcon();
  });

  // Hook Google Cast Synchronization
  if (window.CastManager) {
    window.CastManager.on('trackChange', (newIndex) => {
      if (typeof newIndex === 'number' && newIndex >= 0 && newIndex !== currentTrackIndex) {
        loadTrack(newIndex, false);
      }
    });

    window.CastManager.on('stateChange', (st) => {
      isPlaying = st.isPlaying;
      updatePlayButtonUI();
    });

    window.CastManager.on('timeUpdate', (info) => {
      if (!window.CastManager.isConnected()) return;
      if (currTimeEl) currTimeEl.textContent = formatSeconds(info.currentTime);
      if (totalTimeEl && info.duration > 0) totalTimeEl.textContent = formatSeconds(info.duration);
      if (scrubberFill && info.duration > 0) scrubberFill.style.width = `${(info.currentTime / info.duration) * 100}%`;
    });

    window.CastManager.on('connected', () => {
      if (!audio.paused) audio.pause();
      isPlaying = true;
      updatePlayButtonUI();
    });

    window.CastManager.on('disconnected', () => {
      isPlaying = !audio.paused;
      updatePlayButtonUI();
    });
  }

  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    updateMuteIcon();
  });

  function updateMuteIcon() {
    const icon = muteBtn.querySelector('i');
    if (audio.muted || audio.volume === 0) {
      icon.className = 'ph-speaker-x-fill';
    } else if (audio.volume < 0.5) {
      icon.className = 'ph-speaker-low-fill';
    } else {
      icon.className = 'ph-speaker-high-fill';
    }
  }

  // Player Buttons
  playBtn.addEventListener('click', togglePlay);
  nextBtn.addEventListener('click', nextTrack);
  prevBtn.addEventListener('click', prevTrack);

  // Act Filters
  actFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      actFilterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentActFilter = btn.dataset.act;
      renderTracklist();
    });
  });

  // Search
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTracklist();
  });

  // Copy Lyrics
  copyLyricsBtn.addEventListener('click', () => {
    const lyricsText = deckLyrics.textContent;
    navigator.clipboard.writeText(lyricsText).then(() => {
      showToast("✓ Lyrics copied to clipboard!");
    }).catch(() => {
      showToast("Unable to copy to clipboard");
    });
  });

  // Render Matrix Table
  function renderMatrix() {
    if (!matrixTbody || !album.civic_virtues_matrix) return;
    matrixTbody.innerHTML = '';
    album.civic_virtues_matrix.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <span class="virtue-tag">${row.virtue}</span>
          <span class="virtue-metaphor">${row.metaphor_title}</span>
        </td>
        <td>${row.core_causes}</td>
        <td>${row.key_manifestations}</td>
        <td>
          <div class="outcome-box">
            ${row.dramatic_outcomes}
          </div>
        </td>
      `;
      matrixTbody.appendChild(tr);
    });
  }

  // Render Visual Exhibits
  function renderExhibits() {
    if (!album.exhibits || album.exhibits.length === 0) return;
    exhibitThumbs.innerHTML = '';
    album.exhibits.forEach((ex, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `thumb-item ${idx === currentExhibitIndex ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${ex.image_webp}" alt="${ex.title}" loading="lazy" />`;
      thumb.addEventListener('click', () => setExhibit(idx));
      exhibitThumbs.appendChild(thumb);
    });
    setExhibit(0);
  }

  function setExhibit(index) {
    if (index < 0 || index >= album.exhibits.length) return;
    currentExhibitIndex = index;
    const ex = album.exhibits[index];

    exhibitMainImg.src = ex.image_webp;
    exhibitMainImg.alt = ex.title;
    exhibitTitle.textContent = ex.title;
    exhibitSubtitle.textContent = ex.subtitle;
    exhibitCaption.textContent = ex.caption;

    // update thumb active
    const thumbs = exhibitThumbs.querySelectorAll('.thumb-item');
    thumbs.forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });
  }

  prevExhibitBtn.addEventListener('click', () => {
    let nextIdx = (currentExhibitIndex - 1 + album.exhibits.length) % album.exhibits.length;
    setExhibit(nextIdx);
  });
  nextExhibitBtn.addEventListener('click', () => {
    let nextIdx = (currentExhibitIndex + 1) % album.exhibits.length;
    setExhibit(nextIdx);
  });

  // Lightbox Modal
  function openModal(src) {
    modalImg.src = src;
    modalOverlay.classList.add('open');
  }
  function closeModal() {
    modalOverlay.classList.remove('open');
  }
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  exhibitMainImg.addEventListener('click', () => openModal(exhibitMainImg.src));
  artZoomBtn.addEventListener('click', () => openModal(album.master_cover_art));

  // Accessibility Controls
  contrastToggle.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
    showToast(document.body.classList.contains('high-contrast') ? "High contrast enabled" : "High contrast disabled");
  });

  fontToggle.addEventListener('click', () => {
    if (document.body.classList.contains('font-large')) {
      document.body.classList.remove('font-large');
      showToast("Normal font size");
    } else {
      document.body.classList.add('font-large');
      showToast("Large font size enabled");
    }
  });

  dyslexicToggle.addEventListener('click', () => {
    document.body.classList.toggle('dyslexic-mode');
    showToast(document.body.classList.contains('dyslexic-mode') ? "OpenDyslexic font enabled" : "OpenDyslexic font disabled");
  });

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
      return;
    }
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      audio.currentTime = Math.max(0, audio.currentTime - 5);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
    } else if (e.key === 'N' && e.shiftKey) {
      e.preventDefault();
      nextTrack();
    } else if (e.key === 'P' && e.shiftKey) {
      e.preventDefault();
      prevTrack();
    } else if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      muteBtn.click();
    } else if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Initial Boot
  renderTracklist();
  renderMatrix();
  renderExhibits();
  loadTrack(0, false);
});
