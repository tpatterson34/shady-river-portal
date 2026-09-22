/**
 * The Glitch in the Machine — Album XX
 * Interactive Audio Engine, Track Deck, Curated Exhibits & Accessibility Suite
 * The Shady River Bard
 */

(function () {
  'use strict';

  // --- STATE ---
  let albumData = null;
  let currentTrackIndex = 0;
  let isPlaying = false;
  let activeFilter = 'all';
  let searchTerm = '';

  // Audio element
  const audio = new Audio();
  audio.preload = 'metadata';

  // Volume persistence
  const savedVolume = localStorage.getItem('gitm_volume');
  if (savedVolume !== null) {
    audio.volume = parseFloat(savedVolume);
  } else {
    audio.volume = 0.85;
  }

  // DOM Elements cache
  let el = {};

  function initElements() {
    el = {
      // Audio controls
      audio: audio,
      playBtn: document.getElementById('play-btn'),
      playIcon: document.getElementById('play-icon'),
      pauseIcon: document.getElementById('pause-icon'),
      prevBtn: document.getElementById('prev-btn'),
      nextBtn: document.getElementById('next-btn'),
      playerTitle: document.getElementById('player-title'),
      playerAct: document.getElementById('player-act'),
      currentTime: document.getElementById('current-time'),
      totalTime: document.getElementById('total-time'),
      seekSlider: document.getElementById('seek-slider'),
      volumeSlider: document.getElementById('volume-slider'),
      muteBtn: document.getElementById('mute-btn'),
      muteIcon: document.getElementById('mute-icon'),
      volumeIcon: document.getElementById('volume-icon'),

      // Deck controls
      deckNumber: document.getElementById('deck-track-number'),
      deckTitle: document.getElementById('deck-track-title'),
      deckAct: document.getElementById('deck-act-badge'),
      deckArchetype: document.getElementById('deck-archetype'),
      deckKeyTempo: document.getElementById('deck-key-tempo'),
      deckTagline: document.getElementById('deck-tagline'),
      deckTheory: document.getElementById('deck-theory'),
      deckSummary: document.getElementById('deck-summary'),
      deckLyrics: document.getElementById('deck-lyrics'),
      copyLyricsBtn: document.getElementById('copy-lyrics-btn'),
      toast: document.getElementById('toast-msg'),

      // Playlist
      playlistContainer: document.getElementById('playlist-container'),
      searchInput: document.getElementById('search-input'),
      filterBtns: document.querySelectorAll('.filter-btn'),

      // Exhibits
      exhibitTabs: document.querySelectorAll('.exhibit-tab-btn'),
      exhibitTitle: document.getElementById('exhibit-title'),
      exhibitSubtitle: document.getElementById('exhibit-subtitle'),
      exhibitImage: document.getElementById('exhibit-image'),
      exhibitStat1Val: document.getElementById('exhibit-stat-1-val'),
      exhibitStat1Lbl: document.getElementById('exhibit-stat-1-lbl'),
      exhibitStat2Val: document.getElementById('exhibit-stat-2-val'),
      exhibitStat2Lbl: document.getElementById('exhibit-stat-2-lbl'),
      exhibitQuote: document.getElementById('exhibit-quote'),
      exhibitQuoteAuthor: document.getElementById('exhibit-quote-author'),
      exhibitBody1: document.getElementById('exhibit-body-1'),
      exhibitBody2: document.getElementById('exhibit-body-2'),

      // Modals
      voteModal: document.getElementById('vote-modal'),
      openVoteBtn: document.getElementById('open-vote-btn'),
      closeVoteBtn: document.getElementById('close-vote-btn'),
      artModal: document.getElementById('art-modal'),
      openArtBtn: document.getElementById('art-zoom-btn'),
      closeArtBtn: document.getElementById('close-art-btn'),

      // Accessibility
      btnContrast: document.getElementById('a11y-contrast'),
      btnFont: document.getElementById('a11y-font'),
      btnUnderline: document.getElementById('a11y-underline'),
    };
  }

  // --- AUDIO LOGIC ---
  function loadTrack(index, autoPlay = false) {
    const noteBtn = document.getElementById('deck-bard-note-btn');
    if (noteBtn) {
      noteBtn.onclick = () => {
        const trackObj = (typeof albumData !== 'undefined' && albumData.tracks && albumData.tracks[index]) 
          ? albumData.tracks[index] 
          : (typeof state !== 'undefined' && state.albumData && state.albumData.tracks && state.albumData.tracks[index])
            ? state.albumData.tracks[index]
            : null;
        const sTitle = trackObj ? trackObj.title : ('Track ' + (index+1));
        const sNum = trackObj ? trackObj.number : (index+1);
        if (typeof window.openBardNoteModal === 'function') {
          window.openBardNoteModal(sTitle, "The Glitch in the Machine", sNum);
        }
      };
    }

    if (!albumData || !albumData.tracks || !albumData.tracks[index]) return;
    currentTrackIndex = index;
    window.currentTrackIndex = index;
    const track = albumData.tracks[index];

    // Route through Google Cast if connected
    if (window.CastManager && window.CastManager.isConnected()) {
      if (!audio.paused) audio.pause();
      if (el.currentTime) el.currentTime.textContent = '00:00';
      if (el.totalTime) el.totalTime.textContent = track.formatted_duration;
      if (el.seekSlider) {
        el.seekSlider.value = 0;
        el.seekSlider.max = Math.floor(track.duration || 300);
      }
      if (el.playerTitle) el.playerTitle.textContent = `${track.number}. ${track.title}`;
      if (el.playerAct) el.playerAct.textContent = `Act ${track.act_number}: ${track.act_title}`;
      isPlaying = true;
      updatePlayIcons();
      updateDeck(track);
      document.querySelectorAll('.track-row').forEach((row, i) => {
        if (parseInt(row.getAttribute('data-track-index')) === index) {
          row.classList.add('active');
          row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          row.classList.remove('active');
        }
      });
      window.CastManager.castTrack(index, albumData.tracks, albumData);
      return;
    }

    audio.src = track.audio_file;
    audio.load();

    // Update Player Bar
    if (el.playerTitle) el.playerTitle.textContent = `${track.number}. ${track.title}`;
    if (el.playerAct) el.playerAct.textContent = `Act ${track.act_number}: ${track.act_title}`;
    if (el.totalTime) el.totalTime.textContent = track.formatted_duration;
    if (el.currentTime) el.currentTime.textContent = '00:00';
    if (el.seekSlider) {
      el.seekSlider.value = 0;
      el.seekSlider.max = Math.floor(track.duration);
    }

    // Update Deck
    updateDeck(track);

    // Update Playlist UI
    document.querySelectorAll('.track-row').forEach((row, i) => {
      if (parseInt(row.getAttribute('data-track-index')) === index) {
        row.classList.add('active');
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        row.classList.remove('active');
      }
    });

    if (autoPlay) {
      audio.play().then(() => {
        isPlaying = true;
        updatePlayIcons();
      }).catch(err => console.log('Autoplay deferred:', err));
    } else {
      isPlaying = false;
      updatePlayIcons();
    }
  }

  function togglePlay() {
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.playOrPause();
      return;
    }
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.play().then(() => {
        isPlaying = true;
      }).catch(err => console.error('Audio playback error:', err));
    }
    updatePlayIcons();
  }

  function updatePlayIcons() {
    if (el.playIcon && el.pauseIcon) {
      if (isPlaying) {
        el.playIcon.classList.add('hidden');
        el.pauseIcon.classList.remove('hidden');
      } else {
        el.playIcon.classList.remove('hidden');
        el.pauseIcon.classList.add('hidden');
      }
    }
  }

  function nextTrack() {
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.nextTrack();
      return;
    }
    let nextIdx = (currentTrackIndex + 1) % albumData.tracks.length;
    loadTrack(nextIdx, isPlaying);
  }

  function prevTrack() {
    if (window.CastManager && window.CastManager.isConnected()) {
      window.CastManager.prevTrack();
      return;
    }
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      let prevIdx = (currentTrackIndex - 1 + albumData.tracks.length) % albumData.tracks.length;
      loadTrack(prevIdx, isPlaying);
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // --- ACTIVE TRACK DECK ---
  function updateDeck(track) {
    if (el.deckNumber) el.deckNumber.textContent = `TRACK ${track.number < 10 ? '0' : ''}${track.number}`;
    if (el.deckTitle) el.deckTitle.textContent = track.title;
    if (el.deckAct) el.deckAct.textContent = `Act ${track.act_number}: ${track.act_title}`;
    if (el.deckArchetype) el.deckArchetype.textContent = track.archetype;
    if (el.deckKeyTempo) el.deckKeyTempo.textContent = `${track.key}  •  ${track.tempo}`;
    if (el.deckTagline) el.deckTagline.textContent = `"${track.tagline}"`;
    if (el.deckTheory) el.deckTheory.textContent = track.theory;
    if (el.deckSummary) el.deckSummary.textContent = track.summary;

    if (el.deckLyrics) {
      // Format lyrics: preserve stanza breaks
      const stanzas = track.clean_lyrics.split('\n\n');
      const formattedHtml = stanzas.map(stanza => {
        const lines = stanza.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        return `<div class="mb-5 leading-relaxed">${lines.join('<br>')}</div>`;
      }).join('');
      el.deckLyrics.innerHTML = formattedHtml || '<p class="text-stone-500 italic">Lyrics loading...</p>';
    }
  }

  // --- PLAYLIST RENDERING & FILTERING ---
  function renderPlaylist() {
    if (!el.playlistContainer || !albumData) return;
    el.playlistContainer.innerHTML = '';

    const query = searchTerm.toLowerCase().trim();

    albumData.tracks.forEach((track, index) => {
      // Act filtering
      if (activeFilter !== 'all') {
        const actNum = parseInt(activeFilter.replace('act-', ''));
        if (track.act_number !== actNum) return;
      }

      // Search filtering
      if (query.length > 0) {
        const matchTitle = track.title.toLowerCase().includes(query);
        const matchLyrics = track.clean_lyrics.toLowerCase().includes(query);
        const matchTheory = track.theory.toLowerCase().includes(query);
        const matchSummary = track.summary.toLowerCase().includes(query);
        const matchArchetype = track.archetype.toLowerCase().includes(query);
        if (!matchTitle && !matchLyrics && !matchTheory && !matchSummary && !matchArchetype) {
          return;
        }
      }

      const row = document.createElement('div');
      row.className = `track-row group flex items-center justify-between p-3.5 rounded-xl border border-[#1e2638] bg-[#0d111a] hover:bg-[#141a27] hover:border-[#06b6d4]/50 cursor-pointer transition-all duration-200 mb-2 ${index === currentTrackIndex ? 'active' : ''}`;
      row.setAttribute('data-track-index', index);

      row.innerHTML = `
        <div class="flex items-center gap-3.5 min-w-0">
          <div class="w-8 h-8 rounded-lg bg-[#141a27] flex items-center justify-center font-mono text-xs text-stone-400 group-hover:text-cyan-400 group-hover:bg-[#06b6d4]/10 transition-colors">
            ${track.number < 10 ? '0' : ''}${track.number}
          </div>
          <div class="min-w-0">
            <h4 class="font-display font-bold text-sm sm:text-base text-slate-100 group-hover:text-cyan-300 truncate transition-colors">
              ${track.title}
            </h4>
            <p class="text-xs text-slate-400 truncate flex items-center gap-2 mt-0.5">
              <span class="text-cyan-400/80 font-mono">Act ${track.act_number}</span>
              <span>•</span>
              <span class="truncate">${track.archetype}</span>
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3 pl-3 font-mono text-xs text-slate-400 group-hover:text-slate-200">
          <span>${track.formatted_duration}</span>
          <div class="w-7 h-7 rounded-full flex items-center justify-center bg-[#1e2638]/50 group-hover:bg-[#06b6d4] group-hover:text-black transition-all">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      `;

      row.addEventListener('click', () => {
        loadTrack(index, true);
      });

      el.playlistContainer.appendChild(row);
    });

    if (el.playlistContainer.children.length === 0) {
      el.playlistContainer.innerHTML = `
        <div class="p-8 text-center text-slate-500 font-mono text-sm">
          No signals found matching "${searchTerm}".
        </div>
      `;
    }
  }

  // --- CURATED EXHIBITS ---
  function loadExhibit(exhibitId) {
    if (!albumData || !albumData.exhibits) return;
    const exhibit = albumData.exhibits.find(e => e.id === exhibitId);
    if (!exhibit) return;

    // Update tabs
    el.exhibitTabs.forEach(tab => {
      if (tab.getAttribute('data-exhibit') === exhibitId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    if (el.exhibitTitle) el.exhibitTitle.textContent = exhibit.title;
    if (el.exhibitSubtitle) el.exhibitSubtitle.textContent = exhibit.subtitle;
    if (el.exhibitImage) {
      el.exhibitImage.src = exhibit.image;
      el.exhibitImage.alt = exhibit.title;
    }
    if (el.exhibitStat1Val) el.exhibitStat1Val.textContent = exhibit.stat_1_val;
    if (el.exhibitStat1Lbl) el.exhibitStat1Lbl.textContent = exhibit.stat_1_lbl;
    if (el.exhibitStat2Val) el.exhibitStat2Val.textContent = exhibit.stat_2_val;
    if (el.exhibitStat2Lbl) el.exhibitStat2Lbl.textContent = exhibit.stat_2_lbl;
    if (el.exhibitQuote) el.exhibitQuote.textContent = `"${exhibit.quote}"`;
    if (el.exhibitQuoteAuthor) el.exhibitQuoteAuthor.textContent = `— ${exhibit.quote_author}`;
    if (el.exhibitBody1) el.exhibitBody1.textContent = exhibit.body_1;
    if (el.exhibitBody2) el.exhibitBody2.textContent = exhibit.body_2;
  }

  // --- COPY LYRICS TO CLIPBOARD ---
  function setupClipboard() {
    if (!el.copyLyricsBtn) return;
    el.copyLyricsBtn.addEventListener('click', () => {
      const track = albumData.tracks[currentTrackIndex];
      if (!track || !track.clean_lyrics) return;

      const header = `${track.title.toUpperCase()}\nThe Shady River Bard — The Glitch in the Machine (Album XX)\n\n`;
      navigator.clipboard.writeText(header + track.clean_lyrics).then(() => {
        showToast('Pure Literary Lyrics Copied to Clipboard');
      }).catch(() => {
        showToast('Unable to copy lyrics automatically');
      });
    });
  }

  function showToast(msg) {
    if (!el.toast) return;
    el.toast.textContent = msg;
    el.toast.classList.remove('opacity-0', 'pointer-events-none');
    el.toast.classList.add('opacity-100');
    setTimeout(() => {
      el.toast.classList.remove('opacity-100');
      el.toast.classList.add('opacity-0', 'pointer-events-none');
    }, 2800);
  }

  // --- ACCESSIBILITY SUITE ---
  function setupAccessibility() {
    if (el.btnContrast) {
      el.btnContrast.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
      });
    }
    if (el.btnFont) {
      el.btnFont.addEventListener('click', () => {
        document.body.classList.toggle('large-font');
      });
    }
    if (el.btnUnderline) {
      el.btnUnderline.addEventListener('click', () => {
        document.body.classList.toggle('underline-links');
      });
    }
  }

  // --- MODALS & COMMUNITY VOTING ---
  function setupModals() {
    // Release Format Ballot Modal
    if (el.openVoteBtn && el.voteModal && el.closeVoteBtn) {
      el.openVoteBtn.addEventListener('click', () => el.voteModal.classList.remove('hidden'));
      el.closeVoteBtn.addEventListener('click', () => el.voteModal.classList.add('hidden'));
      el.voteModal.addEventListener('click', (e) => {
        if (e.target === el.voteModal) el.voteModal.classList.add('hidden');
      });
    }

    // Artwork Zoom Modal
    if (el.openArtBtn && el.artModal && el.closeArtBtn) {
      el.openArtBtn.addEventListener('click', () => el.artModal.classList.remove('hidden'));
      el.closeArtBtn.addEventListener('click', () => el.artModal.classList.add('hidden'));
      el.artModal.addEventListener('click', (e) => {
        if (e.target === el.artModal) el.artModal.classList.add('hidden');
      });
    }

    // Community ballot options
    document.querySelectorAll('.vote-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-format');
        localStorage.setItem('gitm_release_vote', choice);
        document.querySelectorAll('.vote-option-btn').forEach(b => {
          b.classList.remove('border-cyan-400', 'bg-cyan-500/20');
        });
        btn.classList.add('border-cyan-400', 'bg-cyan-500/20');
        showToast('Priority Ballot Cast & Recorded');
        setTimeout(() => {
          if (el.voteModal) el.voteModal.classList.add('hidden');
        }, 800);
      });
    });

    const savedVote = localStorage.getItem('gitm_release_vote');
    if (savedVote) {
      const activeBtn = document.querySelector(`.vote-option-btn[data-format="${savedVote}"]`);
      if (activeBtn) activeBtn.classList.add('border-cyan-400', 'bg-cyan-500/20');
    }
  }

  // --- KEYBOARD SHORTCUTS ---
  function setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Ignore if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        audio.currentTime = Math.max(0, audio.currentTime - 5);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        audio.volume = Math.min(1, audio.volume + 0.05);
        if (el.volumeSlider) el.volumeSlider.value = audio.volume;
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        audio.volume = Math.max(0, audio.volume - 0.05);
        if (el.volumeSlider) el.volumeSlider.value = audio.volume;
      } else if (e.key === 'm' || e.key === 'M') {
        audio.muted = !audio.muted;
        updateMuteIcons();
      } else if (e.key === ']') {
        nextTrack();
      } else if (e.key === '[') {
        prevTrack();
      }
    });
  }

  function updateMuteIcons() {
    if (el.muteIcon && el.volumeIcon) {
      if (audio.muted || audio.volume === 0) {
        el.muteIcon.classList.remove('hidden');
        el.volumeIcon.classList.add('hidden');
      } else {
        el.muteIcon.classList.add('hidden');
        el.volumeIcon.classList.remove('hidden');
      }
    }
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Play/Pause
    if (el.playBtn) el.playBtn.addEventListener('click', togglePlay);
    if (el.nextBtn) el.nextBtn.addEventListener('click', nextTrack);
    if (el.prevBtn) el.prevBtn.addEventListener('click', prevTrack);

    // Audio time update
    audio.addEventListener('timeupdate', () => {
      if (el.currentTime) el.currentTime.textContent = formatTime(audio.currentTime);
      if (el.seekSlider && !el.seekSlider.matches(':active')) {
        el.seekSlider.value = Math.floor(audio.currentTime);
      }
    });

    audio.addEventListener('ended', () => {
      nextTrack();
    });

    // Seek scrubber
    if (el.seekSlider) {
      el.seekSlider.addEventListener('input', (e) => {
        if (window.CastManager && window.CastManager.isConnected()) {
          window.CastManager.seek(parseFloat(e.target.value));
          return;
        }
        audio.currentTime = parseFloat(e.target.value);
      });
    }

    // Volume
    if (el.volumeSlider) {
      el.volumeSlider.value = audio.volume;
      el.volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (window.CastManager && window.CastManager.isConnected()) {
          window.CastManager.setVolume(val);
        }
        audio.volume = val;
        audio.muted = false;
        localStorage.setItem('gitm_volume', audio.volume);
        updateMuteIcons();
      });
    }

    if (el.muteBtn) {
      el.muteBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        updateMuteIcons();
      });
    }

    // Hook Google Cast Synchronization
    if (window.CastManager) {
      window.CastManager.on('trackChange', (newIndex) => {
        if (typeof newIndex === 'number' && newIndex >= 0 && newIndex !== currentTrackIndex) {
          loadTrack(newIndex, false);
        }
      });

      window.CastManager.on('stateChange', (state) => {
        isPlaying = state.isPlaying;
        updatePlayIcons();
      });

      window.CastManager.on('timeUpdate', (info) => {
        if (!window.CastManager.isConnected()) return;
        if (el.currentTime) el.currentTime.textContent = formatTime(info.currentTime);
        if (el.totalTime && info.duration > 0) el.totalTime.textContent = formatTime(info.duration);
        if (el.seekSlider && info.duration > 0) {
          el.seekSlider.max = Math.floor(info.duration);
          el.seekSlider.value = Math.floor(info.currentTime);
        }
      });

      window.CastManager.on('connected', () => {
        if (!audio.paused) audio.pause();
        isPlaying = true;
        updatePlayIcons();
      });

      window.CastManager.on('disconnected', () => {
        isPlaying = !audio.paused;
        updatePlayIcons();
      });
    }

    // Filter Buttons
    el.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        el.filterBtns.forEach(b => b.classList.remove('active', 'border-cyan-400', 'bg-cyan-500/10', 'text-cyan-300'));
        btn.classList.add('active', 'border-cyan-400', 'bg-cyan-500/10', 'text-cyan-300');
        activeFilter = btn.getAttribute('data-filter');
        renderPlaylist();
      });
    });

    // Search Input
    if (el.searchInput) {
      el.searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderPlaylist();
      });
    }

    // Exhibit Tabs
    el.exhibitTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const exId = tab.getAttribute('data-exhibit');
        loadExhibit(exId);
      });
    });

    setupClipboard();
    setupAccessibility();
    setupModals();
    setupKeyboard();
  }

  // --- INITIALIZATION ---
  function init() {
    initElements();

    if (window.ALBUM_DATA) {
      albumData = window.ALBUM_DATA;
      renderPlaylist();
      loadTrack(0, false);
      loadExhibit('exhibit-1');
      setupEventListeners();
    } else {
      fetch('data/album-data.json')
        .then(res => res.json())
        .then(data => {
          albumData = data;
          renderPlaylist();
          loadTrack(0, false);
          loadExhibit('exhibit-1');
          setupEventListeners();
        })
        .catch(err => console.error('Error loading album data:', err));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
