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
    transposition: 0, // Semitones (-11 to +11)
    originalKey: 'A',
    currentKey: 'A',
    currentAlbumFilter: 'all',
    easyChords: false,
    viewMode: (function() {
      try { return localStorage.getItem('shady_practice_view_mode') || 'bars'; } catch (e) { return 'bars'; }
    })(),
    capoFret: 0,
    estimatedBpm: 110,
    timeSignature: 4,
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
    'A#':  { frets: 'x13331', fingers: '- 1 3 3 3 1', root: 'A#' },
    'Bb':  { frets: 'x13331', fingers: '- 1 3 3 3 1', root: 'Bb' },
    'A#m': { frets: 'x13321', fingers: '- 1 3 4 2 1', root: 'A#' },
    'Bbm': { frets: 'x13321', fingers: '- 1 3 4 2 1', root: 'Bb' },
    'B':   { frets: 'x24442', fingers: '1 1 3 3 3 1', root: 'B' },
    'Bm':  { frets: 'x24432', fingers: '1 1 3 4 2 1', root: 'B' },
    'C':   { frets: 'x32010', fingers: '- 3 2 - 1 -', root: 'C' },
    'C#':  { frets: 'x46664', fingers: '- 1 3 3 3 1', root: 'C#' },
    'Db':  { frets: 'x46664', fingers: '- 1 3 3 3 1', root: 'Db' },
    'Cm':  { frets: 'x35543', fingers: '- 1 3 4 2 1', root: 'C' },
    'C#m': { frets: 'x46654', fingers: '1 1 3 4 2 1', root: 'C#' },
    'D':   { frets: 'xx0232', fingers: '- - - 1 3 2', root: 'D' },
    'Dm':  { frets: 'xx0231', fingers: '- - - 2 3 1', root: 'D' },
    'D7':  { frets: 'xx0212', fingers: '- - - 2 1 3', root: 'D' },
    'D#':  { frets: 'x68886', fingers: '- 1 3 3 3 1', root: 'D#' },
    'Eb':  { frets: 'x68886', fingers: '- 1 3 3 3 1', root: 'Eb' },
    'D#m': { frets: 'x68876', fingers: '- 1 3 4 2 1', root: 'D#' },
    'Ebm': { frets: 'x68876', fingers: '- 1 3 4 2 1', root: 'Eb' },
    'E':   { frets: '022100', fingers: '- 2 3 1 - -', root: 'E' },
    'Em':  { frets: '022000', fingers: '- 2 3 - - -', root: 'E' },
    'E7':  { frets: '020100', fingers: '- 2 - 1 - -', root: 'E' },
    'F':   { frets: '133211', fingers: '1 3 4 2 1 1', root: 'F' },
    'Fm':  { frets: '133111', fingers: '1 3 4 1 1 1', root: 'F' },
    'F#':  { frets: '244322', fingers: '1 3 4 2 1 1', root: 'F#' },
    'F#m': { frets: '244222', fingers: '1 3 4 1 1 1', root: 'F#' },
    'G':   { frets: '320003', fingers: '2 1 - - - 3', root: 'G' },
    'Gm':  { frets: '355333', fingers: '1 3 4 1 1 1', root: 'G' },
    'G#':  { frets: '466544', fingers: '1 3 4 2 1 1', root: 'G#' },
    'Ab':  { frets: '466544', fingers: '1 3 4 2 1 1', root: 'Ab' },
    'G#m': { frets: '466444', fingers: '1 3 4 1 1 1', root: 'G#' },
    'Abm': { frets: '466444', fingers: '1 3 4 1 1 1', root: 'Ab' },
    'B7':  { frets: 'x21202', fingers: '- 2 1 3 - 4', root: 'B' },
    'C7':  { frets: 'x32310', fingers: '- 3 2 4 1 -', root: 'C' },
    'G7':  { frets: '320001', fingers: '3 2 - - - 1', root: 'G' },
    'Em7': { frets: '022030', fingers: '- 2 3 - 4 -', root: 'E' },
    'Am7': { frets: 'x02010', fingers: '- 2 - 1 - -', root: 'A' },
    'Dm7': { frets: 'xx0211', fingers: '- - - 2 1 1', root: 'D' },
    'Cadd9': { frets: 'x32033', fingers: '- 2 1 - 3 4', root: 'C' },
    'Dsus4': { frets: 'xx0233', fingers: '- - - 1 2 4', root: 'D' }
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

    els.albumFilter = document.getElementById('album-filter');
    els.packageSelector = document.getElementById('package-selector');
    els.mobileAlbumFilter = document.getElementById('mobile-album-filter');
    els.mobilePackageSelector = document.getElementById('mobile-package-selector');
    els.btnOpenFolder = document.getElementById('btn-open-folder');
    els.folderInput = document.getElementById('folder-input');
    els.loadingOverlay = document.getElementById('loading-overlay');
    els.loadingText = document.getElementById('loading-text');
    els.loadingBar = document.getElementById('loading-bar');

    els.chordModal = document.getElementById('chord-modal');
    els.chordModalClose = document.getElementById('chord-modal-close');
    els.chordDiagramGrid = document.getElementById('chord-diagram-grid');
    els.btnShowChords = document.getElementById('btn-show-chords');

    // Easy Chords & Capo
    els.btnEasyChords = document.getElementById('btn-easy-chords');
    els.mobileBtnEasyChords = document.getElementById('mobile-btn-easy-chords');
    els.btnViewBars = document.getElementById('btn-view-bars');
    els.btnViewUg = document.getElementById('btn-view-ug');
    els.mobileBtnToggleView = document.getElementById('mobile-btn-toggle-view');
    els.mobileViewIcon = document.getElementById('mobile-view-icon');
    els.mobileViewText = document.getElementById('mobile-view-text');
    els.btnCapo = document.getElementById('btn-capo');
    els.capoMenu = document.getElementById('capo-menu');
    els.capoOptionsList = document.getElementById('capo-options-list');
    els.capoText = document.getElementById('capo-text');
    els.capoSongKey = document.getElementById('capo-song-key');
    els.mobileCapoDisplay = document.getElementById('mobile-capo-display');

    // Rhythm, Measure & Beat
    els.hudBarNum = document.getElementById('hud-bar-num');
    els.mobileHudBar = document.getElementById('mobile-hud-bar');
    els.hudTempoBadge = document.getElementById('hud-tempo-badge');
    els.hudBeatDots = document.querySelectorAll('#hud-beat-dots .beat-dot');

    // TV Mode Controls
    els.btnExitTv = document.getElementById('btn-exit-tv');
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

  // --- CACHESTORAGE & STREAMING STEM LOADER ---
  const STEM_CACHE_NAME = 'shady-river-practice-stems-v1';

  async function fetchStemBuffer(key, pkg, onProgress) {
    if (pkg.files) {
      const stemFile = pkg.files.find(f => f.name.toLowerCase().startsWith(key));
      if (!stemFile) throw new Error(`Missing stem: ${key}.mp3 in selected folder`);
      const buf = await stemFile.arrayBuffer();
      return { buffer: buf, fromCache: false };
    }

    const stemUrl = pkg.stems[key];
    if (!stemUrl) throw new Error(`No URL for ${key} stem`);

    let cache = null;
    if ('caches' in window) {
      try {
        cache = await caches.open(STEM_CACHE_NAME);
        const cachedRes = await cache.match(stemUrl);
        if (cachedRes) {
          const buf = await cachedRes.arrayBuffer();
          return { buffer: buf, fromCache: true };
        }
      } catch (e) {
        console.warn('CacheStorage read error:', e);
      }
    }

    const res = await fetch(stemUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} loading ${key} stem`);

    const contentLength = parseInt(res.headers.get('content-length') || '0', 10);
    if (!res.body || !contentLength) {
      const buf = await res.arrayBuffer();
      if (cache) {
        try {
          cache.put(stemUrl, new Response(buf.slice(0), {
            headers: { 'Content-Type': 'audio/mpeg', 'Content-Length': buf.byteLength.toString() }
          }));
        } catch (e) {}
      }
      return { buffer: buf, fromCache: false };
    }

    const reader = res.body.getReader();
    const chunks = [];
    let receivedBytes = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      receivedBytes += value.length;
      if (onProgress) {
        onProgress(key, receivedBytes, contentLength);
      }
    }

    const fullBuffer = new Uint8Array(receivedBytes);
    let offset = 0;
    for (const chunk of chunks) {
      fullBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    if (cache) {
      try {
        const respToCache = new Response(fullBuffer.buffer.slice(0), {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': receivedBytes.toString()
          }
        });
        cache.put(stemUrl, respToCache);
      } catch (e) {
        console.warn('CacheStorage write error:', e);
      }
    }

    return { buffer: fullBuffer.buffer, fromCache: false };
  }

  // --- LOAD PACKAGE (FROM REMOTE URLS OR LOCAL FOLDER) ---
  async function loadPracticePackage(pkg) {
    state.currentPackage = pkg;
    showLoading(true, 'Initializing practice package...');

    // Immediately update header info & URL state for snappy responsive UI
    const titleEl = document.getElementById('song-title');
    if (titleEl) titleEl.textContent = pkg.title;
    const albumEl = document.getElementById('song-album');
    if (albumEl) albumEl.textContent = pkg.album || 'Practice Package';
    const artEl = document.getElementById('song-art');
    if (pkg.cover_art && artEl) artEl.src = pkg.cover_art;
    document.title = `${pkg.title} — Practice Mode | The Shady River Bard`;
    if (els.packageSelector && pkg.id) {
      els.packageSelector.value = pkg.id;
    }
    if (els.mobilePackageSelector && pkg.id) {
      els.mobilePackageSelector.value = pkg.id;
    }
    if (window.history && window.history.replaceState && pkg.id) {
      const url = new URL(window.location);
      if (state.currentAlbumFilter && state.currentAlbumFilter !== 'all') {
        url.searchParams.set('album', state.currentAlbumFilter);
      } else {
        url.searchParams.delete('album');
      }
      url.searchParams.set('song', pkg.id);
      window.history.replaceState({}, '', url);
    }
    state.originalKey = pkg.key || 'A';
    state.currentKey = state.originalKey;
    if (els.keyVal) els.keyVal.textContent = state.currentKey;
    state.transposition = 0;
    if (els.transposeVal) els.transposeVal.textContent = '0';

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
        const cacheBuster = `?v=${Date.now()}`;
        const syncRes = await fetch(pkg.sync + cacheBuster, { cache: 'no-cache' });
        syncJson = await syncRes.json();
        try {
          const tabsRes = await fetch(pkg.tabs + cacheBuster, { cache: 'no-cache' });
          tabsTxt = await tabsRes.text();
        } catch (e) {
          console.warn('tabs.txt not found, attempting sync.json embedded text:', e);
        }
      }

      // 2. Parse tablature & chords
      parseTablature(tabsTxt, syncJson);
      renderTablature();

      // 3. Load 4 Audio Stems with CacheStorage & Real-time Progress Tracking
      const stemKeys = ['vocals', 'drums', 'bass', 'other'];
      let loadedCount = 0;
      let cachedCount = 0;

      const progressState = {
        vocals: { rec: 0, tot: 0 },
        drums:  { rec: 0, tot: 0 },
        bass:   { rec: 0, tot: 0 },
        other:  { rec: 0, tot: 0 }
      };

      const loadStartTime = performance.now();

      function updateNetProgress(stemKey, rec, tot) {
        progressState[stemKey].rec = rec;
        progressState[stemKey].tot = tot;

        let totalRec = 0;
        let totalTot = 0;
        stemKeys.forEach(k => {
          totalRec += progressState[k].rec;
          totalTot += progressState[k].tot;
        });

        if (totalTot > 0) {
          const pct = Math.min(90, Math.round((totalRec / totalTot) * 100));
          const mbDone = (totalRec / (1024 * 1024)).toFixed(1);
          const mbTotal = (totalTot / (1024 * 1024)).toFixed(1);
          const elapsedSec = (performance.now() - loadStartTime) / 1000;
          const kbps = elapsedSec > 0 ? Math.round(totalRec / 1024 / elapsedSec) : 0;
          updateLoadingProgress(pct, `Downloading stems: ${mbDone} / ${mbTotal} MB (${pct}%) • ${kbps} KB/s`);
        }
      }

      const stemPromises = stemKeys.map(async function (key) {
        const stem = state.stems[key];
        stem.loaded = false;
        stem.buffer = null;

        const { buffer, fromCache } = await fetchStemBuffer(key, pkg, updateNetProgress);
        if (fromCache) cachedCount++;

        const ctx = getAudioContext();
        const decoded = await ctx.decodeAudioData(buffer);
        stem.buffer = decoded;
        stem.loaded = true;

        loadedCount++;
        const pct = 90 + Math.round((loadedCount / 4) * 10);
        if (cachedCount === 4) {
          updateLoadingProgress(pct, `⚡ Loaded from cache: ${stem.name} (${loadedCount}/4)...`);
        } else {
          updateLoadingProgress(pct, `Decoded ${stem.name} (${loadedCount}/4 ready)...`);
        }
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

      // Reset playback state & scrolling
      pause();
      state.pausedAt = 0;
      state.userScrolled = false;
      state.activeRowIndex = -1;
      state.activeChordIndex = -1;
      if (els.resumeScrollBtn) els.resumeScrollBtn.classList.add('hidden');
      if (els.tabContainer) els.tabContainer.scrollTop = 0;

      // Estimate tempo & reset Capo for new song
      state.estimatedBpm = estimateSongTempo(state.allChordsTimeline, state.duration);
      if (els.hudTempoBadge) {
        els.hudTempoBadge.textContent = `~${state.estimatedBpm} BPM`;
      }
      state.capoFret = 0;
      state.transposition = 0;
      if (els.transposeVal) els.transposeVal.textContent = '0';
      if (els.capoText) els.capoText.textContent = 'Capo: None';
      if (els.mobileCapoDisplay) els.mobileCapoDisplay.textContent = 'Capo 0';
      renderCapoMenu();

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

    // Check if syncData is Measure-Based (has bar_number or beats)
    const isMeasureBased = Boolean(syncData && syncData.length > 0 && ('bar_number' in syncData[0] || 'beats' in syncData[0]));

    if (isMeasureBased) {
      // -------------------------------------------------------------
      // NEW MEASURE-BASED SCHEMA (Album 07+)
      // -------------------------------------------------------------
      let barIdx = 0;
      let i = 0;
      const n = tabLines.length;

      // Extract BPM & Time Signature from line 0 if present
      if (tabLines.length > 0 && /BPM:/i.test(tabLines[0])) {
        const bpmMatch = tabLines[0].match(/BPM:\s*~?(\d+)/i);
        if (bpmMatch) {
          state.estimatedBpm = parseInt(bpmMatch[1], 10);
          if (els.hudTempoBadge) els.hudTempoBadge.textContent = `~${state.estimatedBpm} BPM`;
        }
        const timeSigMatch = tabLines[0].match(/(\d+)\/(\d+)\s*Time/i);
        if (timeSigMatch) {
          state.timeSignature = parseInt(timeSigMatch[1], 10);
        }
      }

      while (i < n) {
        const line = tabLines[i];
        const trimmed = line.trim();

        if (!trimmed) {
          state.tabBlocks.push({ type: 'spacer' });
          i++;
          continue;
        }

        // Section / Metadata Header
        if (line.startsWith('Key:') || (line.startsWith('[') && line.endsWith(']')) || /BPM:/i.test(line)) {
          if (line.startsWith('Key:')) {
            const kMatch = line.match(/Key:\s*([A-Ga-g][b#]?m?)/i);
            if (kMatch) {
              state.originalKey = kMatch[1].charAt(0).toUpperCase() + kMatch[1].slice(1);
              state.currentKey = state.originalKey;
              if (els.keyVal) els.keyVal.textContent = state.currentKey;
              renderCapoMenu();
            }
          }
          state.tabBlocks.push({ type: 'header', text: line });
          i++;
          continue;
        }

        // Measure row (contains '|')
        if (line.includes('|')) {
          const rawBars = line.split('|').map(s => s.trim()).filter(Boolean);
          let rowTime = -1.0;
          const chordTokens = [];
          const barsData = [];

          rawBars.forEach((barStr) => {
            const barSync = (barIdx < syncData.length) ? syncData[barIdx] : { time: -1.0, chords: [], beats: [] };
            barIdx++;

            if (rowTime < 0 && barSync.time >= 0) {
              rowTime = barSync.time;
            }

            const barChords = barStr.split(/\s+/).filter(Boolean);
            const beats = barSync.beats || [];
            const bTime = (typeof barSync.time === 'number' && barSync.time >= 0) ? barSync.time : -1.0;
            const barTokens = [];

            barChords.forEach((chordName, cIdx) => {
              let cTime = bTime;
              if (beats.length > 0 && barChords.length > 1) {
                const beatPos = Math.floor(cIdx * (beats.length / barChords.length));
                cTime = beats[beatPos] !== undefined ? beats[beatPos] : bTime;
              }

              const tok = {
                chord: chordName,
                originalChord: chordName,
                time: cTime,
                barNumber: barSync.bar_number
              };
              chordTokens.push(tok);
              barTokens.push(tok);
              state.allChordsTimeline.push(tok);
            });

            barsData.push({
              barNumber: barSync.bar_number,
              time: bTime,
              chords: barChords,
              tokens: barTokens,
              beats: beats,
              lyrics: barSync.lyrics || '',
              chord_cols: barSync.chord_cols || null
            });
          });

          // Check if subsequent line is the matching lyrics
          let lyricText = '';
          let lyricTime = rowTime;
          if (i + 1 < n) {
            const nextLine = tabLines[i + 1].trim();
            if (nextLine && !nextLine.startsWith('[') && !nextLine.startsWith('Key:') && !nextLine.includes('|')) {
              lyricText = nextLine;
              i += 2;
            } else {
              i += 1;
            }
          } else {
            i += 1;
          }

          // Partition lyrics across barsData if not already provided in sync.json
          if (lyricText && barsData.length > 0) {
            const needsPartitioning = barsData.every(b => !b.lyrics || !b.lyrics.trim());
            if (needsPartitioning) {
              const words = lyricText.trim().split(/\s+/);
              if (barsData.length === 1) {
                barsData[0].lyrics = lyricText.trim();
              } else if (words.length > 0) {
                const wordsPerBar = Math.ceil(words.length / barsData.length);
                barsData.forEach((bar, bIdx) => {
                  const startW = bIdx * wordsPerBar;
                  const endW = (bIdx === barsData.length - 1) ? words.length : Math.min(startW + wordsPerBar, words.length);
                  bar.lyrics = words.slice(startW, endW).join(' ');
                });
              }
            }
          }

          state.tabBlocks.push({
            type: 'row',
            chordLine: line,
            chordTokens: chordTokens,
            barsData: barsData,
            lyricLine: lyricText,
            time: rowTime,
            lyricTime: lyricTime
          });
        } else {
          // Plain lyric or narrative row
          state.tabBlocks.push({
            type: 'row',
            chordLine: '',
            chordTokens: [],
            lyricLine: line,
            time: -1.0,
            lyricTime: -1.0
          });
          i++;
        }
      }

      state.allChordsTimeline.sort((a, b) => a.time - b.time);
      return;
    }

    // -------------------------------------------------------------
    // LEGACY LINE-BY-LINE SCHEMA (Albums 01-06, 13, 23)
    // -------------------------------------------------------------
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
          const kMatch = line.match(/Key:\s*([A-Ga-g][b#]?m?)/i);
          if (kMatch) {
            state.originalKey = kMatch[1].charAt(0).toUpperCase() + kMatch[1].slice(1);
            state.currentKey = state.originalKey;
            if (els.keyVal) els.keyVal.textContent = state.currentKey;
            renderCapoMenu();
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

        const isInstrumental = !block.lyricLine || !block.lyricLine.trim();
        const hasBars = block.barsData && block.barsData.length > 0;
        let contentHtml = '';

        if (state.viewMode === 'bars') {
          // ============================================================
          // VIEW 1: MEASURE BARS MODE (Traditional Lead Sheet with Barlines)
          // ============================================================
          let chordRowHtml = '';
          if (block.chordTokens && block.chordTokens.length > 0) {
            chordRowHtml = '<div class="tab-chord-line tab-monospace font-bold text-amber-400 text-sm sm:text-base leading-relaxed whitespace-pre select-none">';
            let lastBarNum = null;
            block.chordTokens.forEach((tok, tokIdx) => {
              const rawTransposed = transposeChord(tok.originalChord, state.transposition);
              const chordName = state.easyChords ? simplifyChord(rawTransposed) : rawTransposed;
              tok.chord = chordName;

              if (tok.barNumber !== undefined) {
                if (tokIdx === 0 || tok.barNumber !== lastBarNum) {
                  chordRowHtml += '<span class="text-stone-400 font-medium">| </span>';
                  lastBarNum = tok.barNumber;
                } else {
                  chordRowHtml += ' ';
                }
                chordRowHtml += `<span class="chord-token px-1.5 py-0.5 rounded hover:bg-stone-800 transition-colors" data-time="${tok.time}" data-chord="${chordName}" data-token-idx="${tokIdx}" data-bar-num="${tok.barNumber}" title="Bar ${tok.barNumber || '—'} • Jump to ${chordName} (${formatTime(tok.time)})">${escapeHtml(chordName)}</span> `;
              } else {
                if (tokIdx === 0) chordRowHtml += '<span class="text-stone-400 font-medium">| </span>';
                chordRowHtml += `<span class="chord-token px-1.5 py-0.5 rounded hover:bg-stone-800 transition-colors" data-time="${tok.time}" data-chord="${chordName}" data-token-idx="${tokIdx}" title="Jump to ${chordName} (${formatTime(tok.time)})">${escapeHtml(chordName)}</span>`;
                chordRowHtml += '<span class="text-stone-400 font-medium"> | </span>';
              }
            });
            if (lastBarNum !== null) {
              chordRowHtml += '<span class="text-stone-400 font-medium">|</span>';
            }
            chordRowHtml += '</div>';
          }

          let lyricRowHtml = '';
          if (block.lyricLine) {
            lyricRowHtml = `<div class="tab-lyric text-stone-300 font-serif text-sm sm:text-base leading-relaxed tracking-wide">${escapeHtml(block.lyricLine)}</div>`;
          }

          contentHtml = chordRowHtml + lyricRowHtml;
        } else {
          // ============================================================
          // VIEW 2: ULTIMATE GUITAR MODE (Chords Floating Over Syllables with Measure Barlines)
          // ============================================================
          if (!isInstrumental && (hasBars || (block.chordTokens && block.chordTokens.length > 0))) {
            let chordBadgesHtml = '';
            const lineText = (block.lyricLine || '').trim();

            if (hasBars) {
              let searchPos = 0;
              let prevRowCol = -1;
              block.barsData.forEach((bar, barIdx) => {
                let barStartCol = searchPos;
                if (bar.lyrics && bar.lyrics.trim()) {
                  const firstWord = bar.lyrics.trim().split(/\s+/)[0];
                  const foundIdx = lineText.indexOf(firstWord, searchPos);
                  if (foundIdx !== -1) {
                    barStartCol = foundIdx;
                    searchPos = barStartCol + bar.lyrics.trim().length;
                  }
                } else {
                  barStartCol = Math.max(searchPos + 2, lineText.length + 1);
                  searchPos = barStartCol + 8;
                }

                // Place measure divider barline '|'
                const dividerCol = Math.max(0, barStartCol);
                if (barIdx === 0 || dividerCol > prevRowCol) {
                  chordBadgesHtml += `<span class="ug-bar-divider" style="left: ${dividerCol}ch;" title="Bar ${bar.barNumber || '—'}">|</span>`;
                  if (prevRowCol < dividerCol) {
                    prevRowCol = dividerCol;
                  }
                }

                const tokens = bar.tokens || [];
                const barLyricLen = (bar.lyrics && bar.lyrics.length > 0) ? bar.lyrics.length : 12;
                const barText = (bar.lyrics && bar.lyrics.trim()) ? bar.lyrics.trim() : '';

                // Identify start positions of individual words within the bar lyrics
                const wordStarts = [];
                let inWord = false;
                for (let wIdx = 0; wIdx < barText.length; wIdx++) {
                  const isSpace = /\s/.test(barText[wIdx]);
                  if (!isSpace && !inWord) {
                    wordStarts.push(wIdx);
                    inWord = true;
                  } else if (isSpace) {
                    inWord = false;
                  }
                }

                tokens.forEach((tok, cIdx) => {
                  let col = barStartCol;
                  if (Array.isArray(bar.chord_cols) && typeof bar.chord_cols[cIdx] === 'number' && bar.chord_cols[cIdx] >= 0) {
                    col = barStartCol + bar.chord_cols[cIdx];
                  } else if (cIdx === 0) {
                    col = barStartCol;
                  } else if (tokens.length >= 2) {
                    const nominal = Math.floor(cIdx * (barLyricLen / tokens.length));
                    const candidateStarts = wordStarts.filter(w => w > 0);
                    if (candidateStarts.length > 0) {
                      let bestWord = candidateStarts[0];
                      let bestDiff = Math.abs(bestWord - nominal);
                      for (let k = 1; k < candidateStarts.length; k++) {
                        const diff = Math.abs(candidateStarts[k] - nominal);
                        if (diff < bestDiff) {
                          bestDiff = diff;
                          bestWord = candidateStarts[k];
                        }
                      }
                      col = barStartCol + bestWord;
                    } else {
                      col = barStartCol + Math.max(3, nominal);
                    }
                  }

                  // Offset chord slightly from divider so badge doesn't cover '|'
                  if (col <= dividerCol) {
                    col = dividerCol + 1.5;
                  }

                  if (prevRowCol >= 0 && col < prevRowCol + 4) {
                    col = prevRowCol + 4;
                  }
                  prevRowCol = col;

                  const rawTransposed = transposeChord(tok.originalChord, state.transposition);
                  const chordName = state.easyChords ? simplifyChord(rawTransposed) : rawTransposed;
                  tok.chord = chordName;

                  chordBadgesHtml += `<span class="chord-token ug-chord-badge" style="left: ${col}ch;" data-time="${tok.time}" data-chord="${chordName}" data-bar-num="${bar.barNumber}" title="Bar ${bar.barNumber || '—'} • Jump to ${chordName} (${formatTime(tok.time)})">${escapeHtml(chordName)}</span>`;
                });
              });

              // Closing measure divider barline '|'
              const closingCol = Math.max(searchPos, lineText.length, prevRowCol + 4) + 1;
              chordBadgesHtml += `<span class="ug-bar-divider" style="left: ${closingCol}ch;">|</span>`;
            } else {
              // Legacy UG chords with startCol
              block.chordTokens.forEach((tok) => {
                const rawTransposed = transposeChord(tok.originalChord, state.transposition);
                const chordName = state.easyChords ? simplifyChord(rawTransposed) : rawTransposed;
                tok.chord = chordName;
                const col = (typeof tok.startCol === 'number') ? tok.startCol : 0;

                chordBadgesHtml += `<span class="chord-token ug-chord-badge" style="left: ${col}ch;" data-time="${tok.time}" data-chord="${chordName}" title="Jump to ${chordName} (${formatTime(tok.time)})">${escapeHtml(chordName)}</span>`;
              });
            }

            contentHtml = `
              <div class="ug-row-wrapper font-mono select-none my-1">
                <div class="ug-chord-track relative">${chordBadgesHtml}</div>
                <div class="ug-lyric-track text-stone-200">${escapeHtml(lineText)}</div>
              </div>
            `;
          } else {
            // Instrumental row in UG mode (pill badges inline)
            let chordRowHtml = '<div class="tab-chord-line font-mono text-sm sm:text-base leading-relaxed select-none py-1 flex flex-wrap items-center gap-1.5">';
            chordRowHtml += '<span class="text-stone-400 font-medium">| </span>';
            let lastBarNum = null;

            (block.chordTokens || []).forEach((tok) => {
              const rawTransposed = transposeChord(tok.originalChord, state.transposition);
              const chordName = state.easyChords ? simplifyChord(rawTransposed) : rawTransposed;
              tok.chord = chordName;

              if (tok.barNumber !== undefined && lastBarNum !== null && tok.barNumber !== lastBarNum) {
                chordRowHtml += '<span class="text-stone-400 font-medium"> | </span>';
              }
              lastBarNum = tok.barNumber;

              chordRowHtml += `<span class="chord-token ug-chord-badge !static !inline-flex" data-time="${tok.time}" data-chord="${chordName}" data-bar-num="${tok.barNumber}" title="Bar ${tok.barNumber || '—'} • Jump to ${chordName} (${formatTime(tok.time)})">${escapeHtml(chordName)}</span>`;
            });

            chordRowHtml += '<span class="text-stone-400 font-medium"> |</span></div>';
            contentHtml = chordRowHtml;
          }
        }

        // Time indicator tag
        const timeBadge = block.time >= 0
          ? `<div class="text-[10px] font-mono text-stone-500 opacity-60 hover:opacity-100 select-none ml-2 shrink-0">${formatTime(block.time)}</div>`
          : '';

        rowEl.innerHTML =
          `<div class="flex items-start justify-between gap-2">` +
            `<div class="flex-grow min-w-0">` +
              contentHtml +
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
          const barCell = e.target.closest('.measure-bar-cell');
          if (barCell) {
            const barTime = parseFloat(barCell.getAttribute('data-time'));
            if (!isNaN(barTime) && barTime >= 0) {
              seek(barTime);
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
    state.userScrolled = false;
    if (els.resumeScrollBtn) els.resumeScrollBtn.classList.add('hidden');
    if (els.tabContainer) els.tabContainer.scrollTop = 0;
    updateSeekBar(0);
    updateTabHighlight(0);
  }

  function seek(targetSeconds) {
    const clamped = Math.max(0, Math.min(state.duration, targetSeconds));
    state.userScrolled = false;
    if (els.resumeScrollBtn) els.resumeScrollBtn.classList.add('hidden');
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
    state.transposition = Math.max(-11, Math.min(11, state.transposition + semitones));
    state.currentKey = transposeChord(state.originalKey, state.transposition);
    if (els.transposeVal) els.transposeVal.textContent = (state.transposition > 0 ? '+' : '') + state.transposition;
    if (els.keyVal) els.keyVal.textContent = state.currentKey;
    renderTablature();
    updateTabHighlight(getCurrentTime());
    renderChordDiagrams();
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

  // --- EASY CHORDS & SIMPLIFICATION ---
  function simplifyChord(chord) {
    if (!chord) return '';
    let c = chord.trim();
    // Drop slash bass note (e.g. D/F# -> D, G/B -> G, C/E -> C, A/C# -> A)
    if (c.includes('/')) {
      c = c.split('/')[0];
    }
    // Remove brackets if any
    c = c.replace(/[\[\]]/g, '');
    // Strip complex jazz/pop extensions
    c = c.replace(/maj7|maj9|maj|M7/g, '');
    c = c.replace(/m7b5|dim7|dim|ø/g, 'm');
    c = c.replace(/m7|m9|m11|m6/g, 'm');
    c = c.replace(/sus4|sus2|7sus4/g, '');
    c = c.replace(/add9|add2|add4|6|9|11|13/g, '');
    if (c.endsWith('5')) {
      c = c.slice(0, -1);
    }
    // Simplify 7ths to plain triads (except B7 which is an open chord standard)
    if (c.endsWith('7') && c !== 'B7') {
      c = c.slice(0, -1);
    }
    return c;
  }

  function toggleEasyChords() {
    state.easyChords = !state.easyChords;

    // Toggle desktop button styling
    if (els.btnEasyChords) {
      els.btnEasyChords.classList.toggle('bg-emerald-950/80', state.easyChords);
      els.btnEasyChords.classList.toggle('border-emerald-500/60', state.easyChords);
      els.btnEasyChords.classList.toggle('text-emerald-300', state.easyChords);
      els.btnEasyChords.classList.toggle('shadow-emerald-950/50', state.easyChords);
    }
    // Toggle mobile button styling
    if (els.mobileBtnEasyChords) {
      els.mobileBtnEasyChords.classList.toggle('bg-emerald-950/80', state.easyChords);
      els.mobileBtnEasyChords.classList.toggle('border-emerald-500/60', state.easyChords);
      els.mobileBtnEasyChords.classList.toggle('text-emerald-300', state.easyChords);
    }

    renderTablature();
    updateTabHighlight(getCurrentTime());
    renderChordDiagrams();

    showToast(state.easyChords 
      ? '🎸 Easy Chords ON: Simplified extensions & bass notes' 
      : 'Standard Chords: Showing original chord voicings'
    );
  }

  // --- CAPO RECOMMENDATION ENGINE ---
  function getCapoRecommendations(rootKey) {
    if (!rootKey) return [];
    const isMinor = rootKey.endsWith('m');
    const cleanRoot = isMinor ? rootKey.slice(0, -1) : rootKey;
    
    let keyIdx = CHROMATIC_SHARP.indexOf(cleanRoot);
    if (keyIdx === -1) keyIdx = CHROMATIC_FLAT.indexOf(cleanRoot);
    if (keyIdx === -1) keyIdx = 0;

    const recommendations = [];

    // Always include No Capo
    recommendations.push({
      fret: 0,
      shape: rootKey,
      label: `No Capo (Original Key: ${rootKey})`,
      shapesFamily: isMinor ? `${rootKey} standard voicings` : `${rootKey} standard voicings`
    });

    if (!isMinor) {
      const openShapes = [
        { name: 'G', idx: 7, chords: 'Open G, C, D, Em, Am shapes' },
        { name: 'C', idx: 0, chords: 'Open C, F, G, Am, Dm shapes' },
        { name: 'D', idx: 2, chords: 'Open D, G, A, Bm, Em shapes' },
        { name: 'E', idx: 4, chords: 'Open E, A, B7, C#m, F#m shapes' },
        { name: 'A', idx: 9, chords: 'Open A, D, E, F#m shapes' }
      ];

      openShapes.forEach(shape => {
        if (shape.name === cleanRoot) return;
        const fret = (keyIdx - shape.idx + 12) % 12;
        if (fret >= 1 && fret <= 7) {
          recommendations.push({
            fret: fret,
            shape: shape.name,
            label: `Capo ${fret} (Play in ${shape.name})`,
            shapesFamily: shape.chords
          });
        }
      });
    } else {
      const openShapes = [
        { name: 'Am', idx: 9, chords: 'Open Am, C, Dm, Em, F, G shapes' },
        { name: 'Em', idx: 4, chords: 'Open Em, G, Am, Bm, C, D shapes' },
        { name: 'Dm', idx: 2, chords: 'Open Dm, F, Gm, Am, Bb shapes' }
      ];

      openShapes.forEach(shape => {
        if (shape.name === rootKey) return;
        const fret = (keyIdx - shape.idx + 12) % 12;
        if (fret >= 1 && fret <= 7) {
          recommendations.push({
            fret: fret,
            shape: shape.name,
            label: `Capo ${fret} (Play in ${shape.name})`,
            shapesFamily: shape.chords
          });
        }
      });
    }

    recommendations.sort((a, b) => a.fret - b.fret);
    return recommendations;
  }

  function renderCapoMenu() {
    if (!els.capoOptionsList) return;
    if (els.capoSongKey) els.capoSongKey.textContent = `Key: ${state.originalKey}`;

    const recs = getCapoRecommendations(state.originalKey);
    let html = '';

    recs.forEach(rec => {
      const isCurrent = (state.capoFret === rec.fret);
      html += `
        <button type="button" data-capo-fret="${rec.fret}" data-capo-shape="${rec.shape}" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-800 transition-colors flex flex-col ${isCurrent ? 'bg-amber-950/40 border border-amber-500/40 text-amber-300' : 'text-stone-300'}">
          <div class="flex items-center justify-between font-bold text-xs">
            <span>${escapeHtml(rec.label)}</span>
            ${isCurrent ? '<i class="fa-solid fa-check text-amber-400 text-[10px]"></i>' : ''}
          </div>
          <div class="text-[10px] text-stone-500 font-sans mt-0.5">${escapeHtml(rec.shapesFamily)}</div>
        </button>
      `;
    });

    els.capoOptionsList.innerHTML = html;

    els.capoOptionsList.querySelectorAll('[data-capo-fret]').forEach(btn => {
      btn.addEventListener('click', () => {
        const fret = parseInt(btn.getAttribute('data-capo-fret'), 10);
        const shape = btn.getAttribute('data-capo-shape');
        applyCapo(fret, shape);
        if (els.capoMenu) els.capoMenu.classList.add('hidden');
      });
    });
  }

  function applyCapo(fret, shape) {
    state.capoFret = fret;
    state.transposition = -fret;
    state.currentKey = transposeChord(state.originalKey, state.transposition);

    if (els.transposeVal) els.transposeVal.textContent = (state.transposition > 0 ? '+' : '') + state.transposition;
    if (els.keyVal) els.keyVal.textContent = state.currentKey;
    if (els.capoText) {
      els.capoText.textContent = fret === 0 ? 'Capo: None' : `Capo ${fret} (${shape})`;
    }
    if (els.mobileCapoDisplay) {
      els.mobileCapoDisplay.textContent = fret === 0 ? 'Capo 0' : `Capo ${fret} (${shape})`;
    }

    renderTablature();
    updateTabHighlight(getCurrentTime());
    renderCapoMenu();
    renderChordDiagrams();

    if (fret > 0) {
      showToast(`🎸 Capo on Fret ${fret}! Play ${shape} shapes along with the music.`);
    } else {
      showToast(`Capo removed. Standard ${state.originalKey} shapes.`);
    }
  }

  // --- TEMPO ESTIMATION ---
  function estimateSongTempo(timeline, duration) {
    if (!timeline || timeline.length < 2) return 110;
    const intervals = [];
    for (let i = 1; i < timeline.length; i++) {
      const dt = timeline[i].time - timeline[i - 1].time;
      if (dt >= 0.8 && dt <= 8.0) {
        intervals.push(dt);
      }
    }
    if (intervals.length === 0) return 110;
    intervals.sort((a, b) => a - b);
    const medianDt = intervals[Math.floor(intervals.length / 2)];
    let bpm = Math.round((4 / medianDt) * 60);
    while (bpm < 70) bpm *= 2;
    while (bpm > 165) bpm = Math.round(bpm / 2);
    return Math.max(60, Math.min(180, bpm));
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
    // Presentation lead offset: Web Audio hardware DAC buffering & display refresh latency
    // introduces ~50-80ms perception lag. A slight lead ensures highlight hits on acoustic onset.
    const visualTime = state.isPlaying ? Math.min(state.duration, curTime + 0.080) : curTime;

    // 1. Find active tab-row
    const rows = document.querySelectorAll('.tab-row');
    let currentActiveRow = null;
    let currentActiveIndex = -1;

    if (rows.length > 0) {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowTime = parseFloat(row.getAttribute('data-time'));
        if (isNaN(rowTime) || rowTime < 0) continue;

        let nextTime = state.duration + 1;
        for (let j = i + 1; j < rows.length; j++) {
          const nt = parseFloat(rows[j].getAttribute('data-time'));
          if (!isNaN(nt) && nt >= 0) {
            nextTime = nt;
            break;
          }
        }

        if (rowTime <= visualTime && visualTime < nextTime) {
          currentActiveRow = row;
          currentActiveIndex = i;
          break;
        }
      }

      // If visualTime is within intro before the first timed row, activate row 0
      if (!currentActiveRow && rows.length > 0 && visualTime >= 0) {
        currentActiveRow = rows[0];
        currentActiveIndex = 0;
      }
    }

    if (currentActiveIndex !== state.activeRowIndex) {
      rows.forEach(r => r.classList.remove('row-active'));
      if (currentActiveRow) {
        currentActiveRow.classList.add('row-active');
        state.activeRowIndex = currentActiveIndex;

        // Auto-scroll logic
        if (state.autoScroll && !state.userScrolled && els.tabContainer) {
          if (state.isPlaying || curTime > 0) {
            const containerTop = els.tabContainer.getBoundingClientRect().top;
            const rowTop = currentActiveRow.getBoundingClientRect().top;
            const offset = rowTop - containerTop - (els.tabContainer.clientHeight * 0.35);
            els.tabContainer.scrollBy({ top: offset, behavior: 'smooth' });
          } else {
            // Initial load at time 0: keep pinned to top
            els.tabContainer.scrollTop = 0;
          }
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

      if (tok.time <= visualTime && visualTime < chordEnd) {
        activeChord = tok;
        nextChord = nextTok;
        break;
      } else if (tok.time > visualTime && !nextChord) {
        nextChord = tok;
      }
    }

    // Highlight individual chord token in DOM
    const allTokens = document.querySelectorAll('.chord-token');
    allTokens.forEach(t => t.classList.remove('chord-active'));

    if (activeChord) {
      const matchTokens = document.querySelectorAll(`.chord-token[data-time="${activeChord.time}"]`);
      matchTokens.forEach(t => t.classList.add('chord-active'));
    }

    // Highlight active measure cell in Bars view
    const allBarCells = document.querySelectorAll('.measure-bar-cell');
    allBarCells.forEach(cell => cell.classList.remove('bar-active'));
    if (activeChord && activeChord.barNumber !== undefined) {
      const activeBarCell = document.querySelector(`.measure-bar-cell[data-bar-num="${activeChord.barNumber}"]`);
      if (activeBarCell) activeBarCell.classList.add('bar-active');
    }

    // 3. Update Teleprompter HUD
    if (els.hudCurrentChord) {
      const curChordRaw = activeChord ? activeChord.chord : (state.currentKey || '—');
      els.hudCurrentChord.textContent = state.easyChords ? simplifyChord(curChordRaw) : curChordRaw;
    }
    if (els.hudNextChord) {
      if (nextChord) {
        const delta = Math.max(0, nextChord.time - curTime).toFixed(1);
        const nextChordRaw = state.easyChords ? simplifyChord(nextChord.chord) : nextChord.chord;
        els.hudNextChord.textContent = `→ ${nextChordRaw} (${delta}s)`;
      } else {
        els.hudNextChord.textContent = '—';
      }
    }
    if (els.hudLyric) {
      if (currentActiveRow) {
        const lyricEl = currentActiveRow.querySelector('.tab-lyric') || currentActiveRow.querySelector('.ug-lyric-track');
        els.hudLyric.textContent = lyricEl ? lyricEl.textContent.trim() : '';
      } else {
        els.hudLyric.textContent = '';
      }
    }

    // 4. Update Measure & Beat Metronome Visualizer
    const bpm = state.estimatedBpm || 110;
    const beatsPerSec = bpm / 60;
    const currentBeatTotal = Math.floor(curTime * beatsPerSec);
    const timeSig = state.timeSignature || 4;
    const currentBar = Math.floor(currentBeatTotal / timeSig) + 1;
    const currentBeat = (currentBeatTotal % timeSig) + 1;

    if (els.hudBarNum) els.hudBarNum.textContent = currentBar;
    if (els.mobileHudBar) els.mobileHudBar.textContent = currentBar;

    if (els.hudBeatDots && els.hudBeatDots.length > 0) {
      els.hudBeatDots.forEach((dot, idx) => {
        const dotBeat = idx + 1;
        if (dotBeat === currentBeat) {
          if (currentBeat === 1) {
            dot.className = 'beat-dot w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)] scale-125 transition-all duration-75';
          } else {
            dot.className = 'beat-dot w-2 h-2 rounded-full bg-amber-200/90 shadow-[0_0_4px_rgba(245,158,11,0.6)] scale-110 transition-all duration-75';
          }
        } else {
          dot.className = 'beat-dot w-2 h-2 rounded-full bg-stone-700/80 transition-all duration-75';
        }
      });
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

    // Easy Chords Toggle
    if (els.btnEasyChords) {
      els.btnEasyChords.addEventListener('click', toggleEasyChords);
    }
    if (els.mobileBtnEasyChords) {
      els.mobileBtnEasyChords.addEventListener('click', toggleEasyChords);
    }

    // Capo Menu Toggle & Outside Click
    if (els.btnCapo && els.capoMenu) {
      els.btnCapo.addEventListener('click', (e) => {
        e.stopPropagation();
        els.capoMenu.classList.toggle('hidden');
      });
      document.addEventListener('click', (e) => {
        if (!els.capoMenu.contains(e.target) && !els.btnCapo.contains(e.target)) {
          els.capoMenu.classList.add('hidden');
        }
      });
    }

    // Tempo Badge Quick Cycling (80 -> 95 -> 110 -> 125 -> 140)
    if (els.hudTempoBadge) {
      const BPM_CYCLE = [80, 95, 110, 125, 140];
      els.hudTempoBadge.addEventListener('click', () => {
        let curIdx = BPM_CYCLE.indexOf(state.estimatedBpm);
        if (curIdx === -1) {
          let closestDist = 999;
          BPM_CYCLE.forEach((b, idx) => {
            const dist = Math.abs(b - state.estimatedBpm);
            if (dist < closestDist) { closestDist = dist; curIdx = idx; }
          });
        }
        const nextIdx = (curIdx + 1) % BPM_CYCLE.length;
        state.estimatedBpm = BPM_CYCLE[nextIdx];
        els.hudTempoBadge.textContent = `~${state.estimatedBpm} BPM`;
        showToast(`Tempo adjusted to ${state.estimatedBpm} BPM`);
      });
    }

    // Transposition
    if (els.btnTransposeDown) els.btnTransposeDown.addEventListener('click', () => transpose(-1));
    if (els.btnTransposeUp) els.btnTransposeUp.addEventListener('click', () => transpose(1));

    // TV Mode
    if (els.tvModeBtn) {
      els.tvModeBtn.addEventListener('click', toggleTvMode);
    }

    // View Mode Toggle (Bars vs UG Lyrics)
    if (els.btnViewBars) {
      els.btnViewBars.addEventListener('click', () => setViewMode('bars'));
    }
    if (els.btnViewUg) {
      els.btnViewUg.addEventListener('click', () => setViewMode('ug'));
    }
    if (els.mobileBtnToggleView) {
      els.mobileBtnToggleView.addEventListener('click', () => {
        setViewMode(state.viewMode === 'bars' ? 'ug' : 'bars');
      });
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

    // TV Mode Buttons
    if (els.tvModeBtn) {
      els.tvModeBtn.addEventListener('click', toggleTvMode);
    }
    if (els.btnExitTv) {
      els.btnExitTv.addEventListener('click', toggleTvMode);
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
        case 'KeyE':
          e.preventDefault();
          toggleEasyChords();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMasterMute();
          break;
        case 'KeyT':
          e.preventDefault();
          toggleTvMode();
          break;
        case 'Escape':
          if (state.tvMode) toggleTvMode();
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
    if (state.tvMode) {
      showToast('TV Mode active! Right-click anywhere and select "Cast..." to mirror this tab directly to your Google TV.', 'info', 6000);
    } else {
      showToast('Standard Display Mode');
    }
  }

  // --- VIEW MODE CONTROLS (Bars vs UG Lyrics) ---
  function setViewMode(mode) {
    state.viewMode = mode;
    try {
      localStorage.setItem('shady_practice_view_mode', mode);
    } catch (e) {}
    updateViewModeButtons();
    renderTablature();
    updateTabHighlight(getCurrentTime());
  }

  function updateViewModeButtons() {
    const isBars = state.viewMode === 'bars';
    if (els.btnViewBars && els.btnViewUg) {
      if (isBars) {
        els.btnViewBars.className = 'px-2.5 py-1.5 rounded-md text-amber-400 bg-stone-800 font-semibold flex items-center gap-1.5 transition-all shadow-sm';
        els.btnViewUg.className = 'px-2.5 py-1.5 rounded-md text-stone-400 hover:text-stone-200 flex items-center gap-1.5 transition-all';
      } else {
        els.btnViewBars.className = 'px-2.5 py-1.5 rounded-md text-stone-400 hover:text-stone-200 flex items-center gap-1.5 transition-all';
        els.btnViewUg.className = 'px-2.5 py-1.5 rounded-md text-amber-400 bg-stone-800 font-semibold flex items-center gap-1.5 transition-all shadow-sm';
      }
    }
    if (els.mobileViewIcon && els.mobileViewText) {
      if (isBars) {
        els.mobileViewIcon.className = 'fa-solid fa-bars-staggered text-amber-400 text-xs';
        els.mobileViewText.textContent = 'Bars';
      } else {
        els.mobileViewIcon.className = 'fa-solid fa-font text-amber-400 text-xs';
        els.mobileViewText.textContent = 'UG Lyrics';
      }
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

  // --- ALBUM & SONG DROPDOWN HELPERS ---
  function normalizePracticeTitle(t) {
    return (t || '').toLowerCase().replace(/^(the|a|an)\s+/i, '').replace(/[^a-z0-9]/g, '');
  }

  function getUniqueAlbums(packages) {
    const albumsMap = new Map();
    packages.forEach(p => {
      const albId = p.album_id || (p.album ? p.album.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'unknown');
      const albNum = p.album_number || (p.album && p.album.match(/Album\s+(\d+)/i) ? parseInt(p.album.match(/Album\s+(\d+)/i)[1], 10) : 999);
      const albTitle = p.album || 'Unknown Album';
      if (!albumsMap.has(albId)) {
        albumsMap.set(albId, {
          albumId: albId,
          albumNumber: albNum,
          albumTitle: albTitle,
          count: 0
        });
      }
      albumsMap.get(albId).count++;
    });
    return Array.from(albumsMap.values()).sort((a, b) => a.albumNumber - b.albumNumber);
  }

  function populateAlbumDropdowns(albums) {
    const totalCount = state.allPackages.length;
    const optionsHtml = `<option value="all">All Albums (${totalCount})</option>` + 
      albums.map(a => `<option value="${a.albumId}">${escapeHtml(a.albumTitle)} (${a.count})</option>`).join('');

    [els.albumFilter, els.mobileAlbumFilter].forEach(sel => {
      if (sel) {
        sel.innerHTML = optionsHtml;
        sel.value = state.currentAlbumFilter;
      }
    });
  }

  function populateSongDropdowns(selectedSongId) {
    const isFiltered = state.currentAlbumFilter && state.currentAlbumFilter !== 'all';
    const filteredPkgs = isFiltered
      ? state.allPackages.filter(p => (
          p.album_id === state.currentAlbumFilter || 
          String(p.album_number) === state.currentAlbumFilter || 
          normalizePracticeTitle(p.album_id) === normalizePracticeTitle(state.currentAlbumFilter)
        ))
      : state.allPackages;

    let html = '';
    if (isFiltered) {
      html = filteredPkgs.map(p => {
        const trackNum = p.track_number ? `${String(p.track_number).padStart(2, '0')}. ` : '';
        return `<option value="${p.id}">${trackNum}${escapeHtml(p.title)}</option>`;
      }).join('');
    } else {
      const albumsMap = new Map();
      state.allPackages.forEach(p => {
        const albTitle = p.album || 'Other Songs';
        if (!albumsMap.has(albTitle)) albumsMap.set(albTitle, []);
        albumsMap.get(albTitle).push(p);
      });
      albumsMap.forEach((songs, albTitle) => {
        html += `<optgroup label="${escapeHtml(albTitle)}">`;
        html += songs.map(p => {
          const trackNum = p.track_number ? `${String(p.track_number).padStart(2, '0')}. ` : '';
          return `<option value="${p.id}">${trackNum}${escapeHtml(p.title)}</option>`;
        }).join('');
        html += `</optgroup>`;
      });
    }

    const targetId = selectedSongId || (filteredPkgs.length > 0 ? filteredPkgs[0].id : '');

    [els.packageSelector, els.mobilePackageSelector].forEach(sel => {
      if (sel) {
        sel.innerHTML = html;
        if (targetId) sel.value = targetId;
      }
    });
  }

  function onAlbumFilterChange(newAlbumId) {
    state.currentAlbumFilter = newAlbumId;

    [els.albumFilter, els.mobileAlbumFilter].forEach(sel => {
      if (sel) sel.value = newAlbumId;
    });

    const isFiltered = state.currentAlbumFilter && state.currentAlbumFilter !== 'all';
    const filteredPkgs = isFiltered
      ? state.allPackages.filter(p => (
          p.album_id === state.currentAlbumFilter || 
          String(p.album_number) === state.currentAlbumFilter || 
          normalizePracticeTitle(p.album_id) === normalizePracticeTitle(state.currentAlbumFilter)
        ))
      : state.allPackages;

    let targetSong = filteredPkgs.find(p => p.id === (state.currentPackage ? state.currentPackage.id : null));
    if (!targetSong && filteredPkgs.length > 0) {
      targetSong = filteredPkgs[0];
    }

    populateSongDropdowns(targetSong ? targetSong.id : null);

    if (targetSong && (!state.currentPackage || state.currentPackage.id !== targetSong.id)) {
      loadPracticePackage(targetSong);
    } else if (state.currentPackage) {
      const url = new URL(window.location);
      if (isFiltered) {
        url.searchParams.set('album', state.currentAlbumFilter);
      } else {
        url.searchParams.delete('album');
      }
      url.searchParams.set('song', state.currentPackage.id);
      window.history.replaceState({}, '', url);
    }
  }

  // --- INIT ---
  async function init() {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    cacheDom();
    bindEvents();
    updateViewModeButtons();

    // Load available packages
    try {
      const res = await fetch('data/practice-packages.json?v=20261003_05');
      state.allPackages = await res.json();
    } catch (e) {
      console.warn('Could not load practice-packages.json, using bundled package:', e);
      state.allPackages = [{
        id: 'a-different-kind-of-love',
        title: 'A Different Kind of Love',
        track_number: 1,
        album: "Mama's Boy (Album 13)",
        album_id: "mamas-boy",
        album_number: 13,
        key: 'A',
        stems: {
          vocals: 'https://stems.theshadyriverbard.com/a-different-kind-of-love/vocals.mp3',
          drums: 'https://stems.theshadyriverbard.com/a-different-kind-of-love/drums.mp3',
          bass: 'https://stems.theshadyriverbard.com/a-different-kind-of-love/bass.mp3',
          other: 'https://stems.theshadyriverbard.com/a-different-kind-of-love/other.mp3'
        },
        sync: 'assets/practice/a-different-kind-of-love/sync.json',
        tabs: 'assets/practice/a-different-kind-of-love/tabs.txt'
      }];
    }

    const albums = getUniqueAlbums(state.allPackages);

    // Load initial package (check URL query param ?album=... and ?song=...)
    const urlParams = new URLSearchParams(window.location.search);
    const queryAlbum = urlParams.get('album');
    const querySong = urlParams.get('song') || urlParams.get('package');

    let initialPkg = null;
    let initialAlbum = 'all';

    if (querySong) {
      initialPkg = state.allPackages.find(p => p.id === querySong);
    }

    if (queryAlbum) {
      const matchedAlbum = albums.find(a => 
        a.albumId === queryAlbum || 
        String(a.albumNumber) === queryAlbum || 
        normalizePracticeTitle(a.albumId) === normalizePracticeTitle(queryAlbum)
      );
      if (matchedAlbum) {
        initialAlbum = matchedAlbum.albumId;
      }
    } else if (initialPkg && initialPkg.album_id) {
      initialAlbum = initialPkg.album_id;
    }

    state.currentAlbumFilter = initialAlbum;

    if (!initialPkg) {
      const filteredPkgs = (initialAlbum !== 'all')
        ? state.allPackages.filter(p => (
            p.album_id === initialAlbum || 
            String(p.album_number) === initialAlbum || 
            normalizePracticeTitle(p.album_id) === normalizePracticeTitle(initialAlbum)
          ))
        : state.allPackages;
      initialPkg = filteredPkgs[0] || state.allPackages[0];
    }

    populateAlbumDropdowns(albums);
    populateSongDropdowns(initialPkg ? initialPkg.id : null);

    // Event listeners for Album Filter
    [els.albumFilter, els.mobileAlbumFilter].forEach(sel => {
      if (sel) {
        sel.addEventListener('change', (e) => onAlbumFilterChange(e.target.value));
      }
    });

    // Event listeners for Song Selector
    [els.packageSelector, els.mobilePackageSelector].forEach(sel => {
      if (sel) {
        sel.addEventListener('change', (e) => {
          const songId = e.target.value;
          const found = state.allPackages.find(p => p.id === songId);
          if (found) {
            [els.packageSelector, els.mobilePackageSelector].forEach(s => { if (s) s.value = songId; });
            loadPracticePackage(found);
          }
        });
      }
    });

    if (initialPkg) {
      loadPracticePackage(initialPkg);
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
    toggleEasyChords,
    applyCapo,
    simplifyChord,
    loadPracticePackage
  };

})();
