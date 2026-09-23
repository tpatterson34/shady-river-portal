/**
 * Soul Fire — Interactive Concept Experience App Engine
 * 15-Track Jukebox, Audio Player Dock, Lyrics Drawer, Filters, Cast Sync & Voting
 */

(function () {
  'use strict';

  let data = window.SOUL_FIRE_DATA || null;
  let tracks = [];
  let currentTrackIndex = 0;
  let isPlaying = false;
  let activeAct = 'all';
  let searchQuery = '';
  let lyricsMode = 'stanzas'; // 'stanzas' or 'clean'

  const audio = new Audio();
  audio.preload = 'metadata';

  // DOM Elements
  const trackListEl = document.getElementById('track-list');
  const lyricsContentEl = document.getElementById('lyrics-content');
  const lyricsTitleEl = document.getElementById('lyrics-track-title');
  const activeTrackTitleEl = document.getElementById('active-track-title');
  const activeTrackActEl = document.getElementById('active-track-act');
  const activeTrackKeyEl = document.getElementById('active-track-key');
  const activeTrackTempoEl = document.getElementById('active-track-tempo');
  const activeTrackConceptEl = document.getElementById('active-track-concept');
  const activeTrackMotifEl = document.getElementById('active-track-motif');
  const activeTrackSummaryEl = document.getElementById('active-track-summary');
  const activeTrackArtEl = document.getElementById('active-track-art');
  const deckPlayBtn = document.getElementById('deck-play-btn');
  const deckPlayIcon = document.getElementById('deck-play-icon');
  const deckPlayText = document.getElementById('deck-play-text');

  // Bottom Player Bar Elements
  const playerBar = document.getElementById('player-bar');
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
  const tapeReelLeft = document.getElementById('tape-reel-left');
  const tapeReelRight = document.getElementById('tape-reel-right');

  // Search & Filter
  const searchInput = document.getElementById('track-search');
  const actFilterBtns = document.querySelectorAll('[data-act-filter]');
  const copyLyricsBtn = document.getElementById('btn-copy-lyrics');
  const copyFeedback = document.getElementById('copy-feedback');
  const toggleStanzasBtn = document.getElementById('btn-toggle-stanzas');
  const toggleCleanBtn = document.getElementById('btn-toggle-clean');

  // Voting Modal
  const voteHeroBtn = document.getElementById('vote-hero-btn');
  const voteModal = document.getElementById('vote-modal');
  const voteBackdrop = document.getElementById('vote-backdrop');
  const closeVoteBtn = document.getElementById('close-vote-btn');
  const confirmVoteBtn = document.getElementById('confirm-vote-btn');

  function init() {
    if (!data && typeof window.SOUL_FIRE_DATA !== 'undefined') {
      data = window.SOUL_FIRE_DATA;
    }
    if (data && data.tracks && data.tracks.length > 0) {
      tracks = data.tracks;
      setupApp();
    } else {
      fetch('data/album-data.json')
        .then(res => res.json())
        .then(fetchedData => {
          data = fetchedData;
          tracks = data.tracks;
          setupApp();
        })
        .catch(err => {
          console.error('Failed to load Soul Fire album data:', err);
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

    const filtered = tracks.filter(t => {
      if (activeAct !== 'all' && t.act_number !== parseInt(activeAct, 10)) return false;
      if (searchQuery) {
        const blob = (t.title + ' ' + t.summary + ' ' + t.clean_lyrics + ' ' + t.sociological_concept + ' ' + t.narrative_motif).toLowerCase();
        return blob.indexOf(searchQuery) !== -1;
      }
      return true;
    });

    if (filtered.length === 0) {
      trackListEl.innerHTML = '<div class="p-8 text-center text-stone-400 font-mono text-xs">No tracks match your search query.</div>';
      return;
    }

    filtered.forEach(t => {
      const idx = tracks.findIndex(item => item.number === t.number);
      const isSelected = idx === currentTrackIndex;
      const card = document.createElement('div');
      card.className = `p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
        isSelected
          ? 'bg-amber-500/10 border-[#e05a2b] shadow-lg shadow-orange-950/20 text-white'
          : 'bg-[#12151f]/80 hover:bg-[#181c28] border-white/5 hover:border-[#e05a2b]/30 text-stone-300'
      }`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Track ${t.number_padded}: ${t.title}`);

      card.innerHTML = `
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative border border-white/10">
            <img src="${t.art_square}" alt="${t.title}" class="w-full h-full object-cover" loading="lazy">
            ${isSelected && isPlaying ? '<span class="absolute inset-0 bg-[#e05a2b]/70 flex items-center justify-center text-white text-xs"><i class="fa-solid fa-volume-high animate-pulse"></i></span>' : ''}
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-mono text-[11px] ${isSelected ? 'text-[#e05a2b] font-bold' : 'text-stone-500'}">${t.number_padded}</span>
              <h4 class="font-display text-sm font-semibold truncate ${isSelected ? 'text-orange-300' : 'text-stone-200'}">${t.title}</h4>
            </div>
            <p class="text-[11px] text-stone-400 truncate mt-0.5">${t.sociological_concept}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-stone-400 border border-white/5">${t.key}</span>
          <button class="w-8 h-8 rounded-full bg-white/5 hover:bg-[#e05a2b] hover:text-white text-stone-300 flex items-center justify-center transition-colors text-xs focus:outline-none" title="Play ${t.title}">
            <i class="fa-solid ${isSelected && isPlaying ? 'fa-pause' : 'fa-play'}"></i>
          </button>
        </div>
      `;

      card.addEventListener('click', () => {
        if (idx === currentTrackIndex) {
          togglePlay();
        } else {
          selectTrack(idx, true);
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (idx === currentTrackIndex) {
            togglePlay();
          } else {
            selectTrack(idx, true);
          }
        }
      });

      trackListEl.appendChild(card);
    });
  }

  function selectTrack(index, autoPlay) {
    if (!tracks || tracks.length === 0) return;
    if (index < 0) index = tracks.length - 1;
    if (index >= tracks.length) index = 0;

    currentTrackIndex = index;
    const t = tracks[currentTrackIndex];

    // Update active deck UI
    if (activeTrackTitleEl) activeTrackTitleEl.innerText = `${t.number_padded}. ${t.title}`;
    if (activeTrackActEl) activeTrackActEl.innerText = t.act;
    if (activeTrackKeyEl) activeTrackKeyEl.innerText = t.key;
    if (activeTrackTempoEl) activeTrackTempoEl.innerText = t.tempo;
    if (activeTrackConceptEl) activeTrackConceptEl.innerText = t.sociological_concept;
    if (activeTrackMotifEl) activeTrackMotifEl.innerText = t.narrative_motif;
    if (activeTrackSummaryEl) activeTrackSummaryEl.innerText = t.summary;
    if (activeTrackArtEl) {
      activeTrackArtEl.src = t.art_banner;
      activeTrackArtEl.alt = `${t.title} official artwork`;
    }

    // Update player bar UI
    if (playerBarTitle) playerBarTitle.innerText = `${t.number_padded}. ${t.title}`;
    if (playerBarAct) playerBarAct.innerText = `${t.act} • ${t.key}`;
    if (playerBarArt) playerBarArt.src = t.art_square;

    // Update lyrics drawer
    if (lyricsTitleEl) lyricsTitleEl.innerText = `${t.title} — Lyrics & Deconstruction`;
    renderLyrics(t);

    // Audio load
    audio.src = t.audio_file;
    audio.onerror = function () {
      console.warn(`Local audio failed for track ${t.number}, falling back to remote stream:`, t.audio_remote);
      if (t.audio_remote && audio.src !== t.audio_remote) {
        audio.src = t.audio_remote;
        if (autoPlay) audio.play();
      }
    };

    // If Cast is active, load media on receiver
    if (window.ShadyRiverCast && window.ShadyRiverCast.isCastSessionActive && window.ShadyRiverCast.isCastSessionActive()) {
      const fullAudioUrl = window.location.origin + '/' + t.audio_file.replace(/^\//, '');
      const fullArtUrl = window.location.origin + '/' + t.art_square.replace(/^\//, '');
      window.ShadyRiverCast.loadMedia({
        audioUrl: fullAudioUrl,
        title: t.title,
        album: 'Soul Fire',
        artist: 'The Shady River Bard',
        imageUrl: fullArtUrl
      });
    }

    if (autoPlay) {
      audio.play().then(() => {
        setPlayingState(true);
      }).catch(err => {
        console.warn('Autoplay prevented:', err);
        setPlayingState(false);
      });
    } else {
      setPlayingState(false);
    }

    renderTrackList();
    updateHash(t.slug);
  }

  function renderLyrics(t) {
    if (!lyricsContentEl) return;
    if (lyricsMode === 'clean') {
      const formatted = t.clean_lyrics
        .split('\n')
        .map(line => `<p class="leading-relaxed ${line.startsWith('[') ? 'font-mono text-[#e05a2b] font-bold pt-3' : 'text-stone-300'}">${line}</p>`)
        .join('');
      lyricsContentEl.innerHTML = `<div class="space-y-1 font-serif text-sm">${formatted}</div>`;
    } else {
      // Stanzas mode (decorated with performance & instrumentation notes)
      let html = '';
      if (t.stanzas && t.stanzas.length > 0) {
        t.stanzas.forEach(s => {
          html += `<div class="mb-5 p-4 rounded-xl bg-white/[0.02] border border-white/5">`;
          html += `<h5 class="font-mono text-xs font-bold text-[#e05a2b] tracking-wider uppercase mb-2 flex items-center gap-2"><i class="fa-solid fa-microphone-lines text-[10px]"></i> ${s.name}</h5>`;
          html += `<div class="space-y-1 font-serif text-sm text-stone-200">`;
          s.lines.forEach(l => {
            if (l.startsWith('[Instrument') || l.startsWith('[Key')) {
              html += `<p class="text-[11px] font-mono text-amber-400/90 italic bg-amber-950/20 px-2 py-0.5 rounded border border-amber-500/20 my-1">${l}</p>`;
            } else if (l.startsWith('[Vocalist') || l.startsWith('[Spoken') || l.startsWith('[Whispered')) {
              html += `<p class="text-[11px] font-mono text-orange-400 font-semibold my-1">${l}</p>`;
            } else {
              html += `<p class="leading-relaxed">${l}</p>`;
            }
          });
          html += `</div></div>`;
        });
      } else {
        html = `<pre class="font-mono text-xs text-stone-300 whitespace-pre-wrap leading-relaxed">${t.clean_lyrics}</pre>`;
      }
      lyricsContentEl.innerHTML = html;
    }
  }

  function togglePlay() {
    if (audio.paused) {
      audio.play().then(() => {
        setPlayingState(true);
      }).catch(err => {
        console.error('Audio playback error:', err);
      });
    } else {
      audio.pause();
      setPlayingState(false);
    }
  }

  function setPlayingState(playing) {
    isPlaying = playing;
    const playIconClass = isPlaying ? 'fa-pause' : 'fa-play';
    if (playIcon) playIcon.className = `fa-solid ${playIconClass}`;
    if (deckPlayIcon) deckPlayIcon.className = `fa-solid ${playIconClass}`;
    if (deckPlayText) deckPlayText.innerText = isPlaying ? 'Pause Track' : 'Play Track';

    if (tapeReelLeft && tapeReelRight) {
      if (isPlaying) {
        tapeReelLeft.classList.remove('animate-tape-spin-paused');
        tapeReelRight.classList.remove('animate-tape-spin-paused');
      } else {
        tapeReelLeft.classList.add('animate-tape-spin-paused');
        tapeReelRight.classList.add('animate-tape-spin-paused');
      }
    }
    renderTrackList();
  }

  function bindAudioEvents() {
    audio.addEventListener('timeupdate', () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        const pct = (audio.currentTime / audio.duration) * 100;
        if (progressSlider) progressSlider.value = pct;
        if (currentTimeEl) currentTimeEl.innerText = formatTime(audio.currentTime);
      }
    });

    audio.addEventListener('loadedmetadata', () => {
      if (totalTimeEl) totalTimeEl.innerText = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
      selectTrack(currentTrackIndex + 1, true);
    });
  }

  function bindUIEvents() {
    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (deckPlayBtn) deckPlayBtn.addEventListener('click', togglePlay);
    if (prevBtn) prevBtn.addEventListener('click', () => selectTrack(currentTrackIndex - 1, true));
    if (nextBtn) nextBtn.addEventListener('click', () => selectTrack(currentTrackIndex + 1, true));

    if (progressSlider) {
      progressSlider.addEventListener('input', () => {
        if (!isNaN(audio.duration) && audio.duration > 0) {
          audio.currentTime = (progressSlider.value / 100) * audio.duration;
        }
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value / 100;
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderTrackList();
      });
    }

    actFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        actFilterBtns.forEach(b => {
          b.classList.remove('bg-[#e05a2b]', 'text-white', 'border-[#e05a2b]');
          b.classList.add('bg-white/5', 'text-stone-300', 'border-white/10');
        });
        btn.classList.add('bg-[#e05a2b]', 'text-white', 'border-[#e05a2b]');
        btn.classList.remove('bg-white/5', 'text-stone-300', 'border-white/10');
        activeAct = btn.getAttribute('data-act-filter');
        renderTrackList();
      });
    });

    if (toggleStanzasBtn && toggleCleanBtn) {
      toggleStanzasBtn.addEventListener('click', () => {
        lyricsMode = 'stanzas';
        toggleStanzasBtn.classList.add('bg-[#e05a2b]', 'text-white');
        toggleStanzasBtn.classList.remove('text-stone-400');
        toggleCleanBtn.classList.remove('bg-[#e05a2b]', 'text-white');
        toggleCleanBtn.classList.add('text-stone-400');
        renderLyrics(tracks[currentTrackIndex]);
      });

      toggleCleanBtn.addEventListener('click', () => {
        lyricsMode = 'clean';
        toggleCleanBtn.classList.add('bg-[#e05a2b]', 'text-white');
        toggleCleanBtn.classList.remove('text-stone-400');
        toggleStanzasBtn.classList.remove('bg-[#e05a2b]', 'text-white');
        toggleStanzasBtn.classList.add('text-stone-400');
        renderLyrics(tracks[currentTrackIndex]);
      });
    }

    if (copyLyricsBtn) {
      copyLyricsBtn.addEventListener('click', () => {
        const t = tracks[currentTrackIndex];
        const textToCopy = `${t.title} — The Shady River Bard\nAlbum: Soul Fire (Album XX)\n\n${t.clean_lyrics}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
          if (copyFeedback) {
            copyFeedback.classList.remove('hidden');
            setTimeout(() => { copyFeedback.classList.add('hidden'); }, 2500);
          }
        }).catch(err => {
          console.error('Clipboard copy failed:', err);
        });
      });
    }

    // Voting modal
    if (voteHeroBtn) voteHeroBtn.addEventListener('click', openVoteModal);
    if (closeVoteBtn) closeVoteBtn.addEventListener('click', closeVoteModal);
    if (voteBackdrop) voteBackdrop.addEventListener('click', closeVoteModal);
    if (confirmVoteBtn) confirmVoteBtn.addEventListener('click', handleVote);
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function updateHash(slug) {
    if (history.replaceState) {
      history.replaceState(null, '', `#${slug}`);
    }
  }

  function checkHash() {
    const hash = window.location.hash.replace(/^#/, '').trim();
    if (!hash) return;
    const matchIdx = tracks.findIndex(t => t.slug === hash || t.number_padded === hash || String(t.number) === hash);
    if (matchIdx !== -1) {
      selectTrack(matchIdx, false);
      const el = document.getElementById('jukebox-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function openVoteModal() {
    if (!voteModal) return;
    voteModal.classList.remove('hidden');
  }

  function closeVoteModal() {
    if (!voteModal) return;
    voteModal.classList.add('hidden');
  }

  function handleVote() {
    localStorage.setItem('voted_soul-fire', 'true');
    checkVoteStatus();
    closeVoteModal();
  }

  function checkVoteStatus() {
    const hasVoted = localStorage.getItem('voted_soul-fire') === 'true';
    if (voteHeroBtn) {
      if (hasVoted) {
        voteHeroBtn.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i><span>Voted for Release</span>';
        voteHeroBtn.classList.remove('bg-amber-600', 'hover:bg-amber-500');
        voteHeroBtn.classList.add('bg-emerald-950', 'text-emerald-300', 'border-emerald-600/40', 'cursor-default');
      }
    }
  }

  // Accessibility Toolbar
  window.toggleA11yToolbar = function () {
    const toolbar = document.getElementById('a11y-toolbar');
    if (toolbar) toolbar.classList.toggle('hidden');
  };

  window.toggleContrast = function () {
    document.documentElement.classList.toggle('high-contrast');
    const isHigh = document.documentElement.classList.contains('high-contrast');
    const status = document.getElementById('contrast-status');
    if (status) status.innerText = isHigh ? 'High Contrast' : 'Standard';
  };

  window.toggleLargeText = function () {
    document.documentElement.classList.toggle('large-text');
    const isLarge = document.documentElement.classList.contains('large-text');
    const status = document.getElementById('text-size-status');
    if (status) status.innerText = isLarge ? 'Large' : 'Default';
  };

  window.toggleUnderlineLinks = function () {
    document.documentElement.classList.toggle('underline-links');
    const isUnderlined = document.documentElement.classList.contains('underline-links');
    const status = document.getElementById('underline-status');
    if (status) status.innerText = isUnderlined ? 'On' : 'Off';
  };

  // Run on load
  document.addEventListener('DOMContentLoaded', init);
})();
