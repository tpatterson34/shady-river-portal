/**
 * Practice Mode — Web Audio Multi-Stem & Synchronized Tablature Engine
 * The Shady River Bard Portal
 */

(function () {
  'use strict';

  // --- STATE ---
  const state = {
    audioCtx: null,
    stems: {
      vocals: { name: 'Vocals', key: 'vocals', file: 'vocals.mp3', color: '#f59e0b', buffer: null, source: null, gainNode: null, analyser: null, volume: 1.0, muted: false, soloed: false, loaded: false, dataArray: null },
      drums:  { name: 'Drums',  key: 'drums',  file: 'drums.mp3',  color: '#ef4444', buffer: null, source: null, gainNode: null, analyser: null, volume: 1.0, muted: false, soloed: false, loaded: false, dataArray: null },
      bass:   { name: 'Bass',   key: 'bass',   file: 'bass.mp3',   color: '#a855f7', buffer: null, source: null, gainNode: null, analyser: null, volume: 1.0, muted: false, soloed: false, loaded: false, dataArray: null },
      other:  { name: 'Other',  key: 'other',  file: 'other.mp3',  color: '#10b981', buffer: null, source: null, gainNode: null, analyser: null, volume: 1.0, muted: false, soloed: false, loaded: false, dataArray: null }
    },
    masterGain: null,
    masterVolume: 1.0,
    masterMuted: false,
    isPlaying: false,
    playbackRate: 1.0,
    startTime: 0,
    pausedAt: 0,
    duration: 0,
    loop: { active: false, start: null, end: null },
    autoScroll: true,
    userScrolled: false,
    tvMode: false,
    castConnected: false,
    castDeviceName: '',
    remotePlayer: null,
    remotePlayerController: null,
    transposition: 0, // Semitones (-6 to +6)
    originalKey: 'A',
    currentKey: 'A',
    currentPackage: null,
    allPackages: [],
    tabBlocks: [],
    allChordsTimeline: [],
    activeRowIndex: -1,
    activeChordIndex: -1,
    animFrameId: null
  };

  // --- CHROMATIC NOTES FOR TRANSPOSITION ---
  const CHROMATIC_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const CHROMATIC_FLAT  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  // --- GUITAR CHORD FINGERINGS LIBRARY ---
  const CHORD_FINGERINGS = {
    'A':   { frets: 'x02220', fingers: '- 1 2 3 -', root: 'A' },
    'Am':  { frets: 'x02210', fingers: '- 2 3 1 -', root: 'A' },
    'A7':  { frets: 'x02020', fingers: '- 2 - 3 -', root: 'A' },
    'B':   { frets: 'x24442', fingers: '1 1 3 3 3 1', root: 'B' },
    'Bm':  { frets: 'x24432', fingers: '1 1 3 4 2 1', root: 'B' },
    'C':   { frets: 'x32010', fingers: '- 3 2 - 1 -', root: 'C' },
    'C#m': { frets: 'x46654', fingers: '1 1 3 4 2 1', root: 'C#' },
    'D':   { frets: 'xx0232', fingers: '- - - 1 3 2', root: 'D' },
    'Dm':  { frets: 'xx0231', fingers: '- - - 2 3 1', root: 'D' },
    'D7':  { frets: 'xx0212', fingers: '- - - 2 1 3', root: 'D' },
    'E':   { frets: '022100', fingers: '- 2 3 1 - -', root: 'E' },
    'Em':  { frets: '022000', fingers: '- 2 3 - - -', root: 'E' },
    'E7':  { frets: '020100', fingers: '- 2 - 1 - -', root: 'E' },
    'F':   { frets: '133211', fingers: '1 3 4 2 1 1', root: 'F' },
    'F#':  { frets: '244322', fingers: '1 3 4 2 1 1', root: 'F#' },
    'F#m': { frets: '244222', fingers: '1 3 4 1 1 1', root: 'F#' },
    'G':   { frets: '320003', fingers: '2 1 - - - 3', root: 'G' },
    'Gm':  { frets: '355333', fingers: '1 3 4 1 1 1', root: 'G' }
  };

  // --- DOM ELEMENTS CACHE ---
  const els = {};

  function cacheDom() {
    els.btnPlay = document.getElementById('btn-play');
    els.btnPlayIcon = document.getElementById('play-icon');
    els.btnStop = document.getElementById('btn-stop');
    els.btnRewind = document.getElementById('btn-rewind');
    els.btnForward = document.getElementById('btn-forward');
    els.btnSpeed = document.getElementById('btn-speed');
    els.speedMenu = document.getElementById('speed-menu');
    els.btnLoopToggle = document.getElementById('btn-loop-toggle');
    els.btnSetLoopIn = document.getElementById('btn-loop-in');
    els.btnSetLoopOut = document.getElementById('btn-loop-out');
    els.btnClearLoop = document.getElementById('btn-clear-loop');
    els.loopDisplay = document.getElementById('loop-display');

    els.seekBar = document.getElementById('seek-bar');
    els.seekProgress = document.getElementById('seek-progress');
    els.timeCurrent = document.getElementById('time-current');
    els.timeTotal = document.getElementById('time-total');
    els.loopRegion = document.getElementById('loop-region');
    els.loopMarkerA = document.getElementById('loop-marker-a');
    els.loopMarkerB = document.getElementById('loop-marker-b');

    els.masterVolume = document.getElementById('master-volume');
    els.masterMuteBtn = document.getElementById('master-mute');
    els.masterVu = document.getElementById('master-vu');

    els.tabContainer = document.getElementById('tab-container');
    els.hudCurrentChord = document.getElementById('hud-current-chord');
    els.hudNextChord = document.getElementById('hud-next-chord');
    els.hudLyric = document.getElementById('hud-lyric');
    els.autoScrollToggle = document.getElementById('btn-autoscroll-toggle');
    els.resumeScrollBtn = document.getElementById('btn-resume-scroll');

    els.tvModeBtn = document.getElementById('btn-tv-mode');
    els.btnTransposeDown = document.getElementById('btn-transpose-down');
    els.btnTransposeUp = document.getElementById('btn-transpose-up');
    els.transposeVal = document.getElementById('val-transpose');
    els.keyVal = document.getElementById('val-key');

    els.packageSelector = document.getElementById('package-selector');
    els.btnOpenFolder = document.getElementById('btn-open-folder');
    els.folderInput = document.getElementById('folder-input');
    els.loadingOverlay = document.getElementById('loading-overlay');
    els.loadingText = document.getElementById('loading-text');
    els.loadingBar = document.getElementById('loading-bar');

    els.chordModal = document.getElementById('chord-modal');
    els.chordModalClose = document.getElementById('chord-modal-close');
    els.chordDiagramGrid = document.getElementById('chord-diagram-grid');
    els.btnShowChords = document.getElementById('btn-show-chords');

    // Cast Elements
    els.btnCast = document.getElementById('btn-cast');
    els.btnCastBanner = document.getElementById('btn-cast-banner');
    els.btnCastTransport = document.getElementById('btn-cast-transport');
    els.btnCastTv = document.getElementById('btn-cast-tv');
    els.btnExitTv = document.getElementById('btn-exit-tv');
    els.castStatusDot = document.getElementById('cast-status-dot');

    els.castModal = document.getElementById('cast-modal');
    els.castModalClose = document.getElementById('cast-modal-close');
    els.btnModalTriggerCast = document.getElementById('btn-modal-trigger-cast');
    els.btnModalToggleTv = document.getElementById('btn-modal-toggle-tv');
    els.modalTvLabel = document.getElementById('modal-tv-label');
  }

  // --- AUDIO CONTEXT INITIALIZATION ---
  function getAudioContext() {
    if (!state.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      state.audioCtx = new AudioCtx();

      // Master Gain
      state.masterGain = state.audioCtx.createGain();
      state.masterGain.gain.setValueAtTime(state.masterVolume, state.audioCtx.currentTime);

      // Master Analyser
      state.masterAnalyser = state.audioCtx.createAnalyser();
      state.masterAnalyser.fftSize = 64;
      state.masterDataArray = new Uint8Array(state.masterAnalyser.frequencyBinCount);

      state.masterGain.connect(state.masterAnalyser);
      state.masterAnalyser.connect(state.audioCtx.destination);

      // Create stem audio nodes
      Object.keys(state.stems).forEach(function (k) {
        const stem = state.stems[k];
        stem.gainNode = state.audioCtx.createGain();
        stem.gainNode.gain.setValueAtTime(stem.volume, state.audioCtx.currentTime);

        stem.analyser = state.audioCtx.createAnalyser();
        stem.analyser.fftSize = 64;
        stem.dataArray = new Uint8Array(stem.analyser.frequencyBinCount);

        stem.gainNode.connect(stem.analyser);
        stem.analyser.connect(state.masterGain);
      });
    }

    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume().catch(function () {});
    }
    return state.audioCtx;
  }

  // --- LOAD PACKAGE (FROM REMOTE URLS OR LOCAL FOLDER) ---
  async function loadPracticePackage(pkg) {
    state.currentPackage = pkg;
    showLoading(true, 'Initializing practice package...');

    try {
      // 1. Fetch sync.json & tabs.txt
      let syncJson = null;
      let tabsTxt = '';

      if (pkg.files) {
        // Loaded from local folder File objects
        const syncFile = pkg.files.find(f => f.name.toLowerCase() === 'sync.json');
        const tabsFile = pkg.files.find(f => f.name.toLowerCase() === 'tabs.txt');
        if (syncFile) syncJson = JSON.parse(await syncFile.text());
        if (tabsFile) tabsTxt = await tabsFile.text();
      } else {
        // Loaded from remote path
        const syncRes = await fetch(pkg.sync);
        syncJson = await syncRes.json();
        try {
          const tabsRes = await fetch(pkg.tabs);
          tabsTxt = await tabsRes.text();
        } catch (e) {
          console.warn('tabs.txt not found, attempting sync.json embedded text:', e);
        }
      }

      // 2. Parse tablature & chords
      parseTablature(tabsTxt, syncJson);
      renderTablature();

      // 3. Load 4 Audio Stems
      const stemKeys = ['vocals', 'drums', 'bass', 'other'];
      let loadedCount = 0;

      const stemPromises = stemKeys.map(async function (key) {
        const stem = state.stems[key];
        stem.loaded = false;
        stem.buffer = null;

        let arrayBuffer = null;
        if (pkg.files) {
          const stemFile = pkg.files.find(f => f.name.toLowerCase().startsWith(key));
          if (stemFile) {
            arrayBuffer = await stemFile.arrayBuffer();
          } else {
            throw new Error(`Missing stem: ${key}.mp3 in selected folder`);
          }
        } else {
          const stemUrl = pkg.stems[key];
          const res = await fetch(stemUrl);
          if (!res.ok) throw new Error(`HTTP ${res.status} loading ${key} stem`);
          arrayBuffer = await res.arrayBuffer();
        }

        const ctx = getAudioContext();
        // Decode audio
        const decoded = await ctx.decodeAudioData(arrayBuffer);
        stem.buffer = decoded;
        stem.loaded = true;

        loadedCount++;
        const pct = Math.round((loadedCount / 4) * 100);
        updateLoadingProgress(pct, `Decoded ${stem.name} (${loadedCount}/4 stems ready)...`);
      });

      await Promise.all(stemPromises);

      // Determine duration
      let maxDuration = 0;
      stemKeys.forEach(k => {
        if (state.stems[k].buffer && state.stems[k].buffer.duration > maxDuration) {
          maxDuration = state.stems[k].buffer.duration;
        }
      });
      state.duration = maxDuration || 205; // Fallback ~3:25
      if (els.timeTotal) els.timeTotal.textContent = formatTime(state.duration);

      // Update package info
      document.getElementById('song-title').textContent = pkg.title;
      document.getElementById('song-album').textContent = pkg.album || 'Practice Package';
      if (pkg.cover_art && document.getElementById('song-art')) {
        document.getElementById('song-art').src = pkg.cover_art;
      }
      state.originalKey = pkg.key || 'A';
      state.currentKey = state.originalKey;
      if (els.keyVal) els.keyVal.textContent = state.currentKey;
      state.transposition = 0;
      if (els.transposeVal) els.transposeVal.textContent = '0';

      // Reset playback state
      pause();
      state.pausedAt = 0;
      updateSeekBar(0);
      updateTabHighlight(0);

      showLoading(false);
      showToast(`Ready! "${pkg.title}" stems loaded.`);
    } catch (err) {
      console.error('Failed to load practice package:', err);
      showLoading(false);
      alert('Error loading stems: ' + err.message);
    }
  }

  // --- PARSE TABLATURE & SYNCHRONIZATION ---
  function parseTablature(tabsTxt, syncData) {
    state.tabBlocks = [];
    state.allChordsTimeline = [];

    const tabLines = tabsTxt ? tabsTxt.split(/\r?\n/) : [];
    const n = Math.max(tabLines.length, syncData ? syncData.length : 0);

    let i = 0;
    while (i < n) {
      const line = i < tabLines.length ? tabLines[i] : '';
      const syncItem = (syncData && i < syncData.length) ? syncData[i] : {};
      const t = (syncItem && typeof syncItem.time === 'number') ? syncItem.time : -1.0;
      const chordsInfo = (syncItem && Array.isArray(syncItem.chords)) ? syncItem.chords : [];

      // Spacer
      if (!line.trim()) {
        state.tabBlocks.push({ type: 'spacer' });
        i++;
        continue;
      }

      // Section / Metadata Header
      if (line.startsWith('Key:') || (line.startsWith('[') && line.endsWith(']'))) {
        if (line.startsWith('Key:')) {
          const kMatch = line.match(/Key:\s*([A-Ga-g][b#]?)/);
          if (kMatch) {
            state.originalKey = kMatch[1].toUpperCase();
            state.currentKey = state.originalKey;
          }
        }
        state.tabBlocks.push({ type: 'header', text: line });
        i++;
        continue;
      }

      // Chord row + Lyric row pair
      if (chordsInfo.length > 0) {
        const chordTokens = [];
        const regex = /\S+/g;
        let match;
        while ((match = regex.exec(line)) !== null) {
          chordTokens.push({
            chord: match[0],
            originalChord: match[0],
            startCol: match.index,
            endCol: regex.lastIndex,
            time: t
          });
        }

        // Attach timestamps from syncData chords array
        chordTokens.forEach((tok, idx) => {
          if (idx < chordsInfo.length && typeof chordsInfo[idx].time === 'number') {
            tok.time = chordsInfo[idx].time;
          } else {
            tok.time = t;
          }
          state.allChordsTimeline.push(tok);
        });

        // Check if subsequent line is the matching lyrics
        let lyricText = '';
        let lyricTime = t;
        if (i + 1 < n) {
          const nextLine = tabLines[i + 1] || '';
          const nextSync = syncData[i + 1] || {};
          const nextChords = nextSync.chords || [];
          if (nextChords.length === 0 && !nextLine.startsWith('[') && !nextLine.startsWith('Key:')) {
            lyricText = nextLine;
            lyricTime = (typeof nextSync.time === 'number') ? nextSync.time : t;
            i += 2;
          } else {
            i += 1;
          }
        } else {
          i += 1;
        }

        state.tabBlocks.push({
          type: 'row',
          chordLine: line,
          chordTokens: chordTokens,
          lyricLine: lyricText,
          time: t,
          lyricTime: lyricTime
        });
      } else {
        // Standalone lyric line
        state.tabBlocks.push({
          type: 'row',
          chordLine: '',
          chordTokens: [],
          lyricLine: line,
          time: t,
          lyricTime: t
        });
        i++;
      }
    }

    // Sort global chords timeline by time
    state.allChordsTimeline.sort((a, b) => a.time - b.time);
  }

  // --- RENDER TABLATURE DOM ---
  function renderTablature() {
    if (!els.tabContainer) return;
    els.tabContainer.innerHTML = '';

    let rowIndex = 0;

    state.tabBlocks.forEach((block, bIdx) => {
      if (block.type === 'spacer') {
        const spacer = document.createElement('div');
        spacer.className = 'h-4';
        els.tabContainer.appendChild(spacer);
        return;
      }

      if (block.type === 'header') {
        const hdr = document.createElement('div');
        hdr.className = 'my-3';
        hdr.innerHTML = `<span class="section-badge"><i class="fa-solid fa-bookmark text-[10px]"></i> ${escapeHtml(block.text)}</span>`;
        els.tabContainer.appendChild(hdr);
        return;
      }

      if (block.type === 'row') {
        const rowEl = document.createElement('div');
        rowEl.className = 'tab-row py-1.5 rounded-lg my-1 transition-all cursor-pointer';
        rowEl.setAttribute('data-row-index', rowIndex);
        rowEl.setAttribute('data-time', block.time);

        // Build Chord row HTML
        let chordRowHtml = '';
        if (block.chordTokens && block.chordTokens.length > 0) {
          chordRowHtml = '<div class="tab-chord-line tab-monospace font-bold text-amber-400 text-sm sm:text-base leading-relaxed whitespace-pre select-none">';
          let lastCol = 0;
          block.chordTokens.forEach((tok, tokIdx) => {
            const spaces = ' '.repeat(Math.max(0, tok.startCol - lastCol));
            const chordName = transposeChord(tok.originalChord, state.transposition);
            tok.chord = chordName;
            chordRowHtml += spaces + `<span class="chord-token" data-time="${tok.time}" data-chord="${chordName}" data-token-idx="${tokIdx}" title="Jump to ${chordName} (${formatTime(tok.time)})">${escapeHtml(chordName)}</span>`;
            lastCol = tok.startCol + tok.originalChord.length;
          });
          chordRowHtml += '</div>';
        }

        // Build Lyric row HTML
        let lyricRowHtml = '';
        if (block.lyricLine) {
          lyricRowHtml = `<div class="tab-lyric text-stone-300 font-serif text-sm sm:text-base leading-relaxed tracking-wide">${escapeHtml(block.lyricLine)}</div>`;
        }

        // Time indicator tag
        const timeBadge = block.time >= 0
          ? `<div class="text-[10px] font-mono text-stone-500 opacity-60 hover:opacity-100 select-none">${formatTime(block.time)}</div>`
          : '';

        rowEl.innerHTML =
          `<div class="flex items-start justify-between gap-3">` +
            `<div class="flex-grow min-w-0">` +
              chordRowHtml +
              lyricRowHtml +
            `</div>` +
            timeBadge +
          `</div>`;

        // Click row to seek
        rowEl.addEventListener('click', function (e) {
          const chordToken = e.target.closest('.chord-token');
          if (chordToken) {
            const chordTime = parseFloat(chordToken.getAttribute('data-time'));
            if (!isNaN(chordTime) && chordTime >= 0) {
              seek(chordTime);
              return;
            }
          }
          if (block.time >= 0) {
            seek(block.time);
          }
        });

        els.tabContainer.appendChild(rowEl);
        rowIndex++;
      }
    });

    renderChordDiagrams();
  }

  // --- AUDIO PLAYBACK CONTROLS ---
  function play(offset) {
    const ctx = getAudioContext();
    if (state.isPlaying) {
      stopSources();
    }

    const startOffset = (typeof offset === 'number') ? offset : state.pausedAt;
    state.startTime = ctx.currentTime - (startOffset / state.playbackRate);
    state.isPlaying = true;

    // Start all 4 stems
    Object.keys(state.stems).forEach(k => {
      const stem = state.stems[k];
      if (stem.buffer) {
        stem.source = ctx.createBufferSource();
        stem.source.buffer = stem.buffer;
        stem.source.playbackRate.setValueAtTime(state.playbackRate, ctx.currentTime);
        stem.source.connect(stem.gainNode);
        stem.source.start(0, startOffset);
      }
    });

    updateMixGains();
    updatePlayIcon(true);
    startAnimLoop();
  }

  function pause() {
    if (!state.isPlaying) return;
    state.pausedAt = getCurrentTime();
    stopSources();
    state.isPlaying = false;
    updatePlayIcon(false);
    cancelAnimLoop();
  }

  function togglePlay() {
    if (state.isPlaying) {
      pause();
    } else {
      play(state.pausedAt);
    }
  }

  function stop() {
    pause();
    state.pausedAt = 0;
    updateSeekBar(0);
    updateTabHighlight(0);
  }

  function seek(targetSeconds) {
    const clamped = Math.max(0, Math.min(state.duration, targetSeconds));
    if (state.isPlaying) {
      play(clamped);
    } else {
      state.pausedAt = clamped;
      updateSeekBar(clamped);
      updateTabHighlight(clamped);
    }
  }

  function stopSources() {
    Object.keys(state.stems).forEach(k => {
      const stem = state.stems[k];
      if (stem.source) {
        try { stem.source.stop(); } catch (e) {}
        stem.source.disconnect();
        stem.source = null;
      }
    });
  }

  function getCurrentTime() {
    if (!state.isPlaying) return state.pausedAt;
    const ctx = state.audioCtx;
    if (!ctx) return 0;
    const elapsed = (ctx.currentTime - state.startTime) * state.playbackRate;
    return Math.min(state.duration, Math.max(0, elapsed));
  }

  function setPlaybackRate(rate) {
    state.playbackRate = rate;
    if (els.btnSpeed) els.btnSpeed.textContent = `${rate}x`;
    if (state.isPlaying && state.audioCtx) {
      const cur = getCurrentTime();
      play(cur);
    }
  }

  // --- MIXER & VOLUME LOGIC ---
  function updateMixGains() {
    if (!state.audioCtx) return;
    const ctx = state.audioCtx;
    const anySoloed = Object.values(state.stems).some(s => s.soloed);
    const masterVol = state.masterMuted ? 0 : state.masterVolume;

    Object.keys(state.stems).forEach(k => {
      const stem = state.stems[k];
      let targetGain = 0;

      if (anySoloed) {
        targetGain = stem.soloed && !stem.muted ? stem.volume * masterVol : 0;
      } else {
        targetGain = stem.muted ? 0 : stem.volume * masterVol;
      }

      if (stem.gainNode) {
        stem.gainNode.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.015);
      }
    });

    if (state.masterGain) {
      state.masterGain.gain.setTargetAtTime(masterVol, ctx.currentTime, 0.015);
    }
  }

  function setStemVolume(key, val) {
    if (state.stems[key]) {
      state.stems[key].volume = parseFloat(val);
      updateMixGains();
      const valEl = document.getElementById(`val-${key}`);
      if (valEl) valEl.textContent = `${Math.round(val * 100)}%`;
    }
  }

  function toggleStemMute(key) {
    const stem = state.stems[key];
    if (!stem) return;
    stem.muted = !stem.muted;
    const btn = document.getElementById(`mute-${key}`);
    if (btn) btn.classList.toggle('active', stem.muted);
    updateMixGains();
  }

  function toggleStemSolo(key) {
    const stem = state.stems[key];
    if (!stem) return;
    stem.soloed = !stem.soloed;
    const btn = document.getElementById(`solo-${key}`);
    if (btn) btn.classList.toggle('active', stem.soloed);
    updateMixGains();
  }

  function setMasterVolume(val) {
    state.masterVolume = parseFloat(val);
    updateMixGains();
    const valEl = document.getElementById('val-master');
    if (valEl) valEl.textContent = `${Math.round(state.masterVolume * 100)}%`;
  }

  function toggleMasterMute() {
    state.masterMuted = !state.masterMuted;
    if (els.masterMuteBtn) {
      els.masterMuteBtn.classList.toggle('text-red-400', state.masterMuted);
      els.masterMuteBtn.innerHTML = state.masterMuted
        ? '<i class="fa-solid fa-volume-xmark"></i>'
        : '<i class="fa-solid fa-volume-high"></i>';
    }
    updateMixGains();
  }

  // --- MIX PRESETS ---
  function applyPreset(preset) {
    Object.values(state.stems).forEach(s => { s.muted = false; s.soloed = false; });

    switch (preset) {
      case 'all':
        Object.values(state.stems).forEach(s => s.volume = 1.0);
        break;
      case 'guitar': // Mute Other/Guitar, keep drums, bass, vocals
        state.stems.vocals.volume = 1.0;
        state.stems.drums.volume = 1.0;
        state.stems.bass.volume = 1.0;
        state.stems.other.volume = 0.0;
        break;
      case 'karaoke': // Mute Vocals, keep backing band
        state.stems.vocals.volume = 0.0;
        state.stems.drums.volume = 1.0;
        state.stems.bass.volume = 1.0;
        state.stems.other.volume = 1.0;
        break;
      case 'rhythm': // Drums and Bass only
        state.stems.vocals.volume = 0.0;
        state.stems.drums.volume = 1.0;
        state.stems.bass.volume = 1.0;
        state.stems.other.volume = 0.0;
        break;
      case 'acapella': // Vocals only
        state.stems.vocals.volume = 1.0;
        state.stems.drums.volume = 0.0;
        state.stems.bass.volume = 0.0;
        state.stems.other.volume = 0.0;
        break;
    }

    // Sync sliders and UI
    Object.keys(state.stems).forEach(k => {
      const stem = state.stems[k];
      const slider = document.getElementById(`slider-${k}`);
      if (slider) slider.value = stem.volume * 100;
      const valEl = document.getElementById(`val-${k}`);
      if (valEl) valEl.textContent = `${Math.round(stem.volume * 100)}%`;
      const muteBtn = document.getElementById(`mute-${k}`);
      if (muteBtn) muteBtn.classList.remove('active');
      const soloBtn = document.getElementById(`solo-${k}`);
      if (soloBtn) soloBtn.classList.remove('active');
    });

    updateMixGains();
    showToast(`Preset applied: ${preset.toUpperCase()}`);
  }

  // --- A-B LOOPER ---
  function setLoopIn() {
    state.loop.start = getCurrentTime();
    if (state.loop.end !== null && state.loop.end <= state.loop.start) {
      state.loop.end = null;
    }
    state.loop.active = true;
    updateLoopUI();
    showToast(`Loop [A] set at ${formatTime(state.loop.start)}`);
  }

  function setLoopOut() {
    const cur = getCurrentTime();
    if (state.loop.start === null) {
      state.loop.start = 0;
    }
    state.loop.end = Math.max(state.loop.start + 0.5, cur);
    state.loop.active = true;
    updateLoopUI();
    showToast(`Loop [B] set at ${formatTime(state.loop.end)}`);
  }

  function clearLoop() {
    state.loop.active = false;
    state.loop.start = null;
    state.loop.end = null;
    updateLoopUI();
    showToast('Loop cleared');
  }

  function toggleLoop() {
    if (state.loop.start !== null && state.loop.end !== null) {
      state.loop.active = !state.loop.active;
      updateLoopUI();
    } else {
      setLoopIn();
    }
  }

  function updateLoopUI() {
    if (els.btnLoopToggle) {
      els.btnLoopToggle.classList.toggle('bg-sky-500', state.loop.active);
      els.btnLoopToggle.classList.toggle('text-stone-950', state.loop.active);
    }
    if (els.loopDisplay) {
      if (state.loop.start !== null && state.loop.end !== null) {
        els.loopDisplay.textContent = `Loop: ${formatTime(state.loop.start)} – ${formatTime(state.loop.end)}`;
        els.loopDisplay.classList.remove('hidden');
      } else if (state.loop.start !== null) {
        els.loopDisplay.textContent = `Loop: ${formatTime(state.loop.start)} – [B]`;
        els.loopDisplay.classList.remove('hidden');
      } else {
        els.loopDisplay.classList.add('hidden');
      }
    }

    // Update markers on seekbar
    if (state.duration > 0) {
      if (state.loop.start !== null && els.loopMarkerA) {
        const pctA = (state.loop.start / state.duration) * 100;
        els.loopMarkerA.style.left = `${pctA}%`;
        els.loopMarkerA.classList.remove('hidden');
      } else if (els.loopMarkerA) {
        els.loopMarkerA.classList.add('hidden');
      }

      if (state.loop.end !== null && els.loopMarkerB) {
        const pctB = (state.loop.end / state.duration) * 100;
        els.loopMarkerB.style.left = `${pctB}%`;
        els.loopMarkerB.classList.remove('hidden');
      } else if (els.loopMarkerB) {
        els.loopMarkerB.classList.add('hidden');
      }

      if (state.loop.start !== null && state.loop.end !== null && els.loopRegion) {
        const pctA = (state.loop.start / state.duration) * 100;
        const pctB = (state.loop.end / state.duration) * 100;
        els.loopRegion.style.left = `${pctA}%`;
        els.loopRegion.style.width = `${pctB - pctA}%`;
        els.loopRegion.classList.remove('hidden');
      } else if (els.loopRegion) {
        els.loopRegion.classList.add('hidden');
      }
    }
  }

  // --- TRANSPOSITION ENGINE ---
  function transpose(semitones) {
    state.transposition = Math.max(-6, Math.min(6, state.transposition + semitones));
    state.currentKey = transposeChord(state.originalKey, state.transposition);
    if (els.transposeVal) els.transposeVal.textContent = (state.transposition > 0 ? '+' : '') + state.transposition;
    if (els.keyVal) els.keyVal.textContent = state.currentKey;
    renderTablature();
  }

  function transposeChord(chord, steps) {
    if (!chord || steps === 0) return chord;
    // Match root note and modifier
    const match = chord.match(/^([A-G][b#]?)(.*)$/);
    if (!match) return chord;
    const root = match[1];
    const modifier = match[2];

    let idx = CHROMATIC_SHARP.indexOf(root);
    if (idx === -1) idx = CHROMATIC_FLAT.indexOf(root);
    if (idx === -1) return chord;

    let newIdx = (idx + steps) % 12;
    if (newIdx < 0) newIdx += 12;

    const useFlats = ['F', 'Bb', 'Eb', 'Ab', 'Db'].includes(state.currentKey);
    const newRoot = useFlats ? CHROMATIC_FLAT[newIdx] : CHROMATIC_SHARP[newIdx];
    return newRoot + modifier;
  }

  // --- ANIMATION LOOP (VU METERS & SYNC HIGHLIGHT) ---
  function startAnimLoop() {
    if (state.animFrameId) cancelAnimationFrame(state.animFrameId);

    function tick() {
      if (!state.isPlaying) return;
      const curTime = getCurrentTime();

      // Check Looper
      if (state.loop.active && state.loop.end !== null && curTime >= state.loop.end) {
        seek(state.loop.start || 0);
        return;
      }

      // Check track end
      if (curTime >= state.duration) {
        stop();
        return;
      }

      // Update seekbar
      updateSeekBar(curTime);

      // Update tablature highlights
      updateTabHighlight(curTime);

      // Animate VU meters
      updateVuMeters();

      state.animFrameId = requestAnimationFrame(tick);
    }
    state.animFrameId = requestAnimationFrame(tick);
  }

  function cancelAnimLoop() {
    if (state.animFrameId) {
      cancelAnimationFrame(state.animFrameId);
      state.animFrameId = null;
    }
    // Drop VU meters
    dropVuMeters();
  }

  function updateSeekBar(curTime) {
    if (els.timeCurrent) els.timeCurrent.textContent = formatTime(curTime);
    if (state.duration > 0 && els.seekProgress) {
      const pct = (curTime / state.duration) * 100;
      els.seekProgress.style.width = `${pct}%`;
      if (els.seekBar) els.seekBar.value = pct;
    }
  }

  function updateTabHighlight(curTime) {
    // 1. Find active tab-row
    const rows = document.querySelectorAll('.tab-row');
    let currentActiveRow = null;
    let currentActiveIndex = -1;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowTime = parseFloat(row.getAttribute('data-time'));
      const nextRow = rows[i + 1];
      const nextTime = nextRow ? parseFloat(nextRow.getAttribute('data-time')) : state.duration + 1;

      if (rowTime <= curTime && curTime < nextTime) {
        currentActiveRow = row;
        currentActiveIndex = i;
        break;
      }
    }

    if (currentActiveIndex !== state.activeRowIndex) {
      rows.forEach(r => r.classList.remove('row-active'));
      if (currentActiveRow) {
        currentActiveRow.classList.add('row-active');
        state.activeRowIndex = currentActiveIndex;

        // Auto-scroll logic
        if (state.autoScroll && !state.userScrolled && els.tabContainer) {
          const containerTop = els.tabContainer.getBoundingClientRect().top;
          const rowTop = currentActiveRow.getBoundingClientRect().top;
          const offset = rowTop - containerTop - (els.tabContainer.clientHeight * 0.35);
          els.tabContainer.scrollBy({ top: offset, behavior: 'smooth' });
        }
      }
    }

    // 2. Find active chord token & Next chord
    let activeChord = null;
    let nextChord = null;

    for (let i = 0; i < state.allChordsTimeline.length; i++) {
      const tok = state.allChordsTimeline[i];
      const nextTok = state.allChordsTimeline[i + 1];
      const chordEnd = nextTok ? nextTok.time : state.duration;

      if (tok.time <= curTime && curTime < chordEnd) {
        activeChord = tok;
        nextChord = nextTok;
        break;
      } else if (tok.time > curTime && !nextChord) {
        nextChord = tok;
      }
    }

    // Highlight individual chord token in DOM
    const allTokens = document.querySelectorAll('.chord-token');
    allTokens.forEach(t => t.classList.remove('chord-active'));

    if (activeChord) {
      const matchToken = document.querySelector(`.chord-token[data-time="${activeChord.time}"]`);
      if (matchToken) matchToken.classList.add('chord-active');
    }

    // 3. Update Teleprompter HUD
    if (els.hudCurrentChord) {
      els.hudCurrentChord.textContent = activeChord ? activeChord.chord : (state.currentKey || '—');
    }
    if (els.hudNextChord) {
      if (nextChord) {
        const delta = Math.max(0, nextChord.time - curTime).toFixed(1);
        els.hudNextChord.textContent = `→ ${nextChord.chord} (${delta}s)`;
      } else {
        els.hudNextChord.textContent = '—';
      }
    }
    if (els.hudLyric) {
      if (currentActiveRow) {
        const lyricEl = currentActiveRow.querySelector('.tab-lyric');
        els.hudLyric.textContent = lyricEl ? lyricEl.textContent : '';
      } else {
        els.hudLyric.textContent = '';
      }
    }
  }

  function updateVuMeters() {
    Object.keys(state.stems).forEach(k => {
      const stem = state.stems[k];
      if (stem.analyser && stem.dataArray) {
        stem.analyser.getByteFrequencyData(stem.dataArray);
        let sum = 0;
        for (let i = 0; i < stem.dataArray.length; i++) sum += stem.dataArray[i];
        const avg = sum / stem.dataArray.length;
        const pct = Math.min(100, Math.round((avg / 255) * 160));
        const fillEl = document.getElementById(`vu-${k}`);
        if (fillEl) fillEl.style.width = `${pct}%`;
      }
    });

    if (state.masterAnalyser && state.masterDataArray && els.masterVu) {
      state.masterAnalyser.getByteFrequencyData(state.masterDataArray);
      let sum = 0;
      for (let i = 0; i < state.masterDataArray.length; i++) sum += state.masterDataArray[i];
      const avg = sum / state.masterDataArray.length;
      const pct = Math.min(100, Math.round((avg / 255) * 160));
      els.masterVu.style.width = `${pct}%`;
    }
  }

  function dropVuMeters() {
    Object.keys(state.stems).forEach(k => {
      const fillEl = document.getElementById(`vu-${k}`);
      if (fillEl) fillEl.style.width = '0%';
    });
    if (els.masterVu) els.masterVu.style.width = '0%';
  }

  function updatePlayIcon(playing) {
    if (els.btnPlayIcon) {
      els.btnPlayIcon.className = playing ? 'fa-solid fa-pause' : 'fa-solid fa-play ml-0.5';
    }
  }

  // --- CHORD DIAGRAM MODAL ---
  function renderChordDiagrams() {
    if (!els.chordDiagramGrid) return;
    els.chordDiagramGrid.innerHTML = '';

    // Collect unique chords in song
    const uniqueChords = [...new Set(state.allChordsTimeline.map(t => t.chord))].filter(Boolean);

    uniqueChords.forEach(chordName => {
      const card = document.createElement('div');
      card.className = 'p-3 rounded-xl bg-stone-900 border border-stone-800 flex flex-col items-center gap-2';

      const fingering = CHORD_FINGERINGS[chordName] || { frets: '------', fingers: '------', root: chordName };

      card.innerHTML =
        `<div class="font-display font-bold text-lg text-amber-400">${escapeHtml(chordName)}</div>` +
        `<div class="w-24 h-28 bg-[#181410] border border-stone-700/60 rounded-lg p-2 flex flex-col justify-between text-xs font-mono">` +
          `<div class="text-[10px] text-stone-400 text-center tracking-widest">${fingering.frets}</div>` +
          `<div class="flex justify-between items-center px-1 text-[11px] text-amber-300">` +
            `<span>E A D G B e</span>` +
          `</div>` +
          `<div class="text-[9px] text-stone-500 text-center">${fingering.fingers}</div>` +
        `</div>`;

      els.chordDiagramGrid.appendChild(card);
    });
  }

  // --- LOCAL FOLDER IMPORT ---
  async function handleFolderImport(files) {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);

    const hasVocals = fileList.some(f => f.name.toLowerCase().includes('vocal'));
    const hasSync = fileList.some(f => f.name.toLowerCase() === 'sync.json');

    if (!hasVocals || !hasSync) {
      alert('Selected folder does not look like a Web Practice Package. Must contain stem mp3s and sync.json.');
      return;
    }

    const folderName = fileList[0].webkitRelativePath ? fileList[0].webkitRelativePath.split('/')[0] : 'Imported Song';
    const cleanTitle = folderName.replace(/_web_practice$/i, '').replace(/[-_]/g, ' ');

    const customPkg = {
      id: 'local-' + Date.now(),
      title: cleanTitle,
      album: 'Local Practice Export',
      key: 'A',
      files: fileList
    };

    loadPracticePackage(customPkg);
  }

  // --- UI EVENT LISTENERS ---
  function bindEvents() {
    // Play/Pause
    if (els.btnPlay) els.btnPlay.addEventListener('click', togglePlay);
    if (els.btnStop) els.btnStop.addEventListener('click', stop);
    if (els.btnRewind) els.btnRewind.addEventListener('click', () => seek(getCurrentTime() - 5));
    if (els.btnForward) els.btnForward.addEventListener('click', () => seek(getCurrentTime() + 5));

    // Seek bar
    if (els.seekBar) {
      els.seekBar.addEventListener('input', e => {
        const pct = parseFloat(e.target.value);
        const time = (pct / 100) * state.duration;
        seek(time);
      });
    }

    // Speed Controller
    if (els.btnSpeed && els.speedMenu) {
      els.btnSpeed.addEventListener('click', () => els.speedMenu.classList.toggle('hidden'));
      document.querySelectorAll('[data-speed]').forEach(btn => {
        btn.addEventListener('click', () => {
          const s = parseFloat(btn.getAttribute('data-speed'));
          setPlaybackRate(s);
          els.speedMenu.classList.add('hidden');
        });
      });
    }

    // Looper
    if (els.btnSetLoopIn) els.btnSetLoopIn.addEventListener('click', setLoopIn);
    if (els.btnSetLoopOut) els.btnSetLoopOut.addEventListener('click', setLoopOut);
    if (els.btnClearLoop) els.btnClearLoop.addEventListener('click', clearLoop);
    if (els.btnLoopToggle) els.btnLoopToggle.addEventListener('click', toggleLoop);

    // Master Volume & Mute
    if (els.masterVolume) {
      els.masterVolume.addEventListener('input', e => setMasterVolume(e.target.value / 100));
    }
    if (els.masterMuteBtn) {
      els.masterMuteBtn.addEventListener('click', toggleMasterMute);
    }

    // Stem Faders & Buttons
    ['vocals', 'drums', 'bass', 'other'].forEach(k => {
      const slider = document.getElementById(`slider-${k}`);
      if (slider) slider.addEventListener('input', e => setStemVolume(k, e.target.value / 100));

      const muteBtn = document.getElementById(`mute-${k}`);
      if (muteBtn) muteBtn.addEventListener('click', () => toggleStemMute(k));

      const soloBtn = document.getElementById(`solo-${k}`);
      if (soloBtn) soloBtn.addEventListener('click', () => toggleStemSolo(k));
    });

    // Presets
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => applyPreset(btn.getAttribute('data-preset')));
    });

    // Transposition
    if (els.btnTransposeDown) els.btnTransposeDown.addEventListener('click', () => transpose(-1));
    if (els.btnTransposeUp) els.btnTransposeUp.addEventListener('click', () => transpose(1));

    // TV Mode
    if (els.tvModeBtn) {
      els.tvModeBtn.addEventListener('click', toggleTvMode);
    }

    // Auto-Scroll Toggle & Resume
    if (els.autoScrollToggle) {
      els.autoScrollToggle.addEventListener('click', () => {
        state.autoScroll = !state.autoScroll;
        state.userScrolled = false;
        els.autoScrollToggle.classList.toggle('text-amber-400', state.autoScroll);
        els.autoScrollToggle.classList.toggle('text-stone-500', !state.autoScroll);
        if (els.resumeScrollBtn) els.resumeScrollBtn.classList.add('hidden');
      });
    }
    if (els.resumeScrollBtn) {
      els.resumeScrollBtn.addEventListener('click', () => {
        state.userScrolled = false;
        els.resumeScrollBtn.classList.add('hidden');
      });
    }

    // User scroll detection inside tab container
    if (els.tabContainer) {
      els.tabContainer.addEventListener('wheel', () => {
        if (state.autoScroll && state.isPlaying) {
          state.userScrolled = true;
          if (els.resumeScrollBtn) els.resumeScrollBtn.classList.remove('hidden');
        }
      });
    }

    // Local Folder Picker
    if (els.btnOpenFolder && els.folderInput) {
      els.btnOpenFolder.addEventListener('click', () => els.folderInput.click());
      els.folderInput.addEventListener('change', e => handleFolderImport(e.target.files));
    }

    // Chord Diagrams Modal
    if (els.btnShowChords && els.chordModal) {
      els.btnShowChords.addEventListener('click', () => els.chordModal.classList.remove('hidden'));
    }
    if (els.chordModalClose && els.chordModal) {
      els.chordModalClose.addEventListener('click', () => els.chordModal.classList.add('hidden'));
    }

    // Google Cast Buttons
    const castButtons = [els.btnCast, els.btnCastBanner, els.btnCastTransport, els.btnCastTv];
    castButtons.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', e => {
          if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'google-cast-launcher') {
            return; // Native element handles click directly
          }
          e.preventDefault();
          handleCastClick(e);
        });
      }
    });

    // Cast Modal "Launch Cast Picker" button: close modal first so browser focus is clear
    if (els.btnModalTriggerCast) {
      els.btnModalTriggerCast.addEventListener('click', e => {
        e.preventDefault();
        closeCastModal();
        setTimeout(() => {
          handleCastClick();
        }, 60);
      });
    }

    // Exit TV Mode Button
    if (els.btnExitTv) {
      els.btnExitTv.addEventListener('click', toggleTvMode);
    }

    // Modal Toggle TV Button
    if (els.btnModalToggleTv) {
      els.btnModalToggleTv.addEventListener('click', () => {
        toggleTvMode();
      });
    }

    // Cast Modal Close
    if (els.castModalClose && els.castModal) {
      els.castModalClose.addEventListener('click', closeCastModal);
    }
    if (els.castModal) {
      els.castModal.addEventListener('click', e => {
        if (e.target === els.castModal) closeCastModal();
      });
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', e => {
      const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(getCurrentTime() - 5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(getCurrentTime() + 5);
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMasterMute();
          break;
        case 'KeyT':
          e.preventDefault();
          toggleTvMode();
          break;
        case 'KeyC':
          e.preventDefault();
          handleCastClick();
          break;
        case 'Escape':
          closeCastModal();
          if (els.chordModal) els.chordModal.classList.add('hidden');
          break;
        case 'BracketLeft':
          e.preventDefault();
          setLoopIn();
          break;
        case 'BracketRight':
          e.preventDefault();
          setLoopOut();
          break;
        case 'KeyL':
          e.preventDefault();
          toggleLoop();
          break;
        case 'Digit1':
          toggleStemSolo('vocals');
          break;
        case 'Digit2':
          toggleStemSolo('drums');
          break;
        case 'Digit3':
          toggleStemSolo('bass');
          break;
        case 'Digit4':
          toggleStemSolo('other');
          break;
      }
    });
  }

  function toggleTvMode() {
    state.tvMode = !state.tvMode;
    document.body.classList.toggle('tv-mode', state.tvMode);
    if (els.tvModeBtn) {
      els.tvModeBtn.classList.toggle('bg-amber-500', state.tvMode);
      els.tvModeBtn.classList.toggle('text-stone-950', state.tvMode);
    }
    updateModalTvLabel();
    showToast(state.tvMode ? 'TV Mode Active (Cast Tab Ready)' : 'Standard Display Mode');
  }

  function updateModalTvLabel() {
    if (els.modalTvLabel) {
      els.modalTvLabel.textContent = state.tvMode ? 'Exit TV Mode' : 'Turn on TV Mode';
    }
  }

  // --- GOOGLE CAST & TAB STREAMING ---
  const DEFAULT_MEDIA_RECEIVER_APP_ID = 'CC1AD845';

  function initCastFramework() {
    if (!window.cast || !window.cast.framework) return;
    try {
      const castContext = cast.framework.CastContext.getInstance();
      const targetAppId = (window.chrome && chrome.cast && chrome.cast.media && chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID) || DEFAULT_MEDIA_RECEIVER_APP_ID;
      const targetAutoJoin = (window.chrome && chrome.cast && chrome.cast.AutoJoinPolicy && chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED) || 'origin_scoped';

      castContext.setOptions({
        receiverApplicationId: targetAppId,
        autoJoinPolicy: targetAutoJoin
      });

      // Maintain RemotePlayer & Controller for complete CAF framework lifecycle
      state.remotePlayer = new cast.framework.RemotePlayer();
      state.remotePlayerController = new cast.framework.RemotePlayerController(state.remotePlayer);

      state.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        function () {
          const isConn = !!(state.remotePlayer && state.remotePlayer.isConnected);
          const session = castContext.getCurrentSession();
          const devName = (session && session.getCastDevice && session.getCastDevice())
            ? session.getCastDevice().friendlyName
            : 'Google TV';
          setCastConnected(isConn, devName);
        }
      );

      castContext.addEventListener(
        cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
        function (event) {
          const sessionState = event.sessionState;
          if (sessionState === cast.framework.SessionState.SESSION_STARTED ||
              sessionState === cast.framework.SessionState.SESSION_RESUMED) {
            const currentSession = castContext.getCurrentSession();
            const devName = (currentSession && currentSession.getCastDevice && currentSession.getCastDevice())
              ? currentSession.getCastDevice().friendlyName
              : 'Google TV';
            setCastConnected(true, devName);
          } else if (sessionState === cast.framework.SessionState.SESSION_ENDED) {
            setCastConnected(false);
          }
        }
      );

      // Check current session on arrival
      const currentSession = castContext.getCurrentSession();
      if (currentSession) {
        const devName = (currentSession.getCastDevice && currentSession.getCastDevice())
          ? currentSession.getCastDevice().friendlyName
          : 'Google TV';
        setCastConnected(true, devName);
      }

      document.body.classList.add('cast-ready');
      console.log('Google Cast framework ready for Practice Mode');
    } catch (err) {
      console.warn('Google Cast init warning:', err);
    }
  }

  function setCastConnected(connected, devName) {
    state.castConnected = connected;
    state.castDeviceName = devName || '';

    const castButtons = [els.btnCast, els.btnCastBanner, els.btnCastTransport, els.btnCastTv];
    castButtons.forEach(btn => {
      if (btn) {
        btn.classList.toggle('btn-cast-connected', connected);
      }
    });

    if (els.castStatusDot) {
      els.castStatusDot.className = connected
        ? 'w-1.5 h-1.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400 transition-colors'
        : 'w-1.5 h-1.5 rounded-full bg-stone-600 transition-colors';
    }

    if (connected) {
      showToast(`Connected to ${devName || 'Google TV'}! Chords & audio streaming.`);
      if (!state.tvMode) {
        toggleTvMode();
      }
    } else {
      showToast('Cast session ended');
    }
  }

  function handleCastClick(e) {
    // If the click directly hit a native <google-cast-launcher>, let Chrome handle it
    if (e && e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'google-cast-launcher') {
      return;
    }

    // If already connected, clicking Cast toggles/ends session cleanly
    if (state.castConnected) {
      try {
        if (window.cast && window.cast.framework) {
          cast.framework.CastContext.getInstance().endCurrentSession(true);
        }
      } catch (err) {}
      setCastConnected(false);
      return;
    }

    // 1. Try finding and clicking the native <google-cast-launcher> element
    let launcher = null;
    if (e && e.currentTarget) {
      launcher = e.currentTarget.querySelector('google-cast-launcher');
    }
    if (!launcher) {
      launcher = document.querySelector('google-cast-launcher');
    }
    if (launcher && launcher.style.display !== 'none' && typeof launcher.click === 'function') {
      try {
        launcher.click();
      } catch (err) {}
    }

    // 2. Programmatic CAF requestSession() - standard Google Cast Web SDK
    if (window.cast && window.cast.framework) {
      try {
        const castContext = cast.framework.CastContext.getInstance();
        showToast('Select your Google TV or Chromecast to Cast...', 'info', 4000);
        castContext.requestSession().then(session => {
          const devName = (session && session.getCastDevice && session.getCastDevice())
            ? session.getCastDevice().friendlyName
            : 'Google TV';
          setCastConnected(true, devName);
        }).catch(err => {
          const isCancel = err === 'cancel' || err === 'cancel_session_request' || (err && (err.code === 'cancel' || err.message === 'cancel'));
          if (!isCancel && err !== 'session_error') {
            console.log('Cast request dismissed:', err);
          }
        });
        return;
      } catch (err) {
        console.warn('cast.requestSession failed:', err);
      }
    }

    // 3. Fallback: chrome.cast base API
    if (window.chrome && chrome.cast && chrome.cast.requestSession) {
      try {
        chrome.cast.requestSession(session => {
          setCastConnected(true);
        }, err => {});
        return;
      } catch (err) {}
    }

    // 4. Fallback: Presentation API
    if (window.PresentationRequest) {
      try {
        const request = new PresentationRequest([window.location.href]);
        request.start().catch(() => {});
        return;
      } catch (e) {}
    }

    // 5. If completely unsupported browser, show informative modal
    openCastModal();
  }

  function openCastModal() {
    if (els.castModal) {
      updateModalTvLabel();
      els.castModal.classList.remove('hidden');
    }
  }

  function closeCastModal() {
    if (els.castModal) {
      els.castModal.classList.add('hidden');
    }
  }

  // --- HELPERS ---
  function formatTime(sec) {
    if (isNaN(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showLoading(show, text) {
    if (els.loadingOverlay) {
      els.loadingOverlay.classList.toggle('hidden', !show);
    }
    if (els.loadingText && text) {
      els.loadingText.textContent = text;
    }
  }

  function updateLoadingProgress(pct, text) {
    if (els.loadingBar) {
      els.loadingBar.style.width = `${pct}%`;
    }
    if (els.loadingText && text) {
      els.loadingText.textContent = text;
    }
  }

  function showToast(msg) {
    let toast = document.getElementById('practice-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'practice-toast';
      toast.className = 'fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-stone-900 border border-amber-500/50 text-amber-300 font-mono text-xs shadow-2xl transition-all duration-300 transform translate-y-8 opacity-0 pointer-events-none flex items-center gap-2';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-amber-400"></i><span>${escapeHtml(msg)}</span>`;
    toast.classList.remove('translate-y-8', 'opacity-0', 'pointer-events-none');

    if (window._practiceToastTimer) clearTimeout(window._practiceToastTimer);
    window._practiceToastTimer = setTimeout(() => {
      toast.classList.add('translate-y-8', 'opacity-0', 'pointer-events-none');
    }, 2800);
  }

  // --- INIT ---
  async function init() {
    cacheDom();
    bindEvents();

    // Load available packages
    try {
      const res = await fetch('data/practice-packages.json');
      state.allPackages = await res.json();
    } catch (e) {
      console.warn('Could not load practice-packages.json, using bundled package:', e);
      state.allPackages = [{
        id: 'a-different-kind-of-love',
        title: 'A Different Kind of Love',
        album: "Mama's Boy (Album 13)",
        key: 'A',
        stems: {
          vocals: 'assets/practice/a-different-kind-of-love/vocals.mp3',
          drums: 'assets/practice/a-different-kind-of-love/drums.mp3',
          bass: 'assets/practice/a-different-kind-of-love/bass.mp3',
          other: 'assets/practice/a-different-kind-of-love/other.mp3'
        },
        sync: 'assets/practice/a-different-kind-of-love/sync.json',
        tabs: 'assets/practice/a-different-kind-of-love/tabs.txt'
      }];
    }

    // Populate dropdown
    if (els.packageSelector && state.allPackages.length > 0) {
      els.packageSelector.innerHTML = state.allPackages
        .map(p => `<option value="${p.id}">${escapeHtml(p.title)} (${escapeHtml(p.album)})</option>`)
        .join('');

      els.packageSelector.addEventListener('change', () => {
        const found = state.allPackages.find(p => p.id === els.packageSelector.value);
        if (found) loadPracticePackage(found);
      });
    }

    // Load initial package (check URL query param ?song=... or default to first)
    const urlParams = new URLSearchParams(window.location.search);
    const querySong = urlParams.get('song') || urlParams.get('package');
    const initialPkg = (querySong ? state.allPackages.find(p => p.id === querySong) : null) || state.allPackages[0];

    if (initialPkg) {
      loadPracticePackage(initialPkg);
    }

    // Initialize Google Cast framework hook
    window.onCastAvailableHook = function (isAvailable) {
      if (isAvailable) initCastFramework();
    };
    if (window._gcastIsAvailable || (window.cast && window.cast.framework)) {
      initCastFramework();
    }
  }

  // Self execute
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global controller
  window.PracticeApp = {
    state,
    play,
    pause,
    seek,
    togglePlay,
    setStemVolume,
    toggleStemMute,
    toggleStemSolo,
    applyPreset,
    transpose,
    toggleTvMode,
    openCast: handleCastClick,
    openCastModal,
    closeCastModal
  };

})();
