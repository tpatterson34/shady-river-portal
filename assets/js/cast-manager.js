/**
 * ============================================================================
 * THE SHADY RIVER BARD - GOOGLE CAST CONTROLLER & AUDIO STREAMER
 * ============================================================================
 * Implements native Google Cast Web Sender SDK integration for the portal:
 * - Default Media Receiver (CC1AD845) with rich track metadata & bespoke 720p artwork
 * - ORIGIN_SCOPED auto-join policy for seamless persistence across pages
 * - Direct robust MediaInfo streaming via loadMedia(LoadRequest)
 * - Automatic hands-free continuous track advance on remote track completion
 * - Universal audio/mpeg MIME formatting with normalized absolute URLs
 * - Bidirectional remote playback, track navigation, & timeline sync
 * - On-screen visual feedback toast with connection & playback diagnostic states
 */

(function () {
  'use strict';

  // Internal state
  let isApiAvailable = false;
  let isConnected = false;
  let remotePlayer = null;
  let remotePlayerController = null;
  let currentSession = null;
  let deviceName = '';
  let activeTrackIndex = -1;
  let pendingTrackIndex = null;
  let activeTracks = [];
  let activeAlbumMeta = null;
  let toastTimeout = null;

  const eventListeners = {
    stateChange: [],
    trackChange: [],
    timeUpdate: [],
    connected: [],
    disconnected: []
  };

  /**
   * On-screen Toast notification system for instant Cast feedback
   */
  function showToast(message, type = 'info', durationMs = 5000) {
    let toast = document.getElementById('cast-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cast-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    if (toastTimeout) {
      clearTimeout(toastTimeout);
      toastTimeout = null;
    }

    const bg = type === 'success' ? 'rgba(6, 78, 59, 0.96)' : (type === 'error' ? 'rgba(136, 19, 55, 0.96)' : (type === 'warn' ? 'rgba(120, 53, 15, 0.96)' : 'rgba(15, 23, 42, 0.96)'));
    const border = type === 'success' ? '#10b981' : (type === 'error' ? '#f43f5e' : (type === 'warn' ? '#f59e0b' : '#38bdf8'));
    const text = type === 'success' ? '#a7f3d0' : (type === 'error' ? '#fecdd3' : (type === 'warn' ? '#fef3c7' : '#bae6fd'));
    const icon = type === 'success' ? '<i class="fa-solid fa-circle-check text-emerald-400"></i>' : (type === 'error' ? '<i class="fa-solid fa-circle-exclamation text-rose-400"></i>' : (type === 'warn' ? '<i class="fa-solid fa-triangle-exclamation text-amber-400"></i>' : '<i class="fa-solid fa-satellite-dish text-sky-400 animate-pulse"></i>'));

    toast.style.position = 'fixed';
    toast.style.bottom = '84px';
    toast.style.right = '20px';
    toast.style.zIndex = '999999';
    toast.style.backgroundColor = bg;
    toast.style.border = `1.5px solid ${border}`;
    toast.style.borderRadius = '12px';
    toast.style.padding = '10px 18px';
    toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.85)';
    toast.style.fontFamily = 'monospace';
    toast.style.fontSize = '12px';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    toast.style.pointerEvents = 'auto';
    toast.style.backdropFilter = 'blur(12px)';
    toast.style.webkitBackdropFilter = 'blur(12px)';

    toast.innerHTML = `
      <div style="width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${icon}</div>
      <div style="color: ${text}; font-weight: 500; letter-spacing: 0.02em;">${message}</div>
    `;

    if (durationMs > 0) {
      toastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(16px)';
        toast.style.pointerEvents = 'none';
      }, durationMs);
    }
  }

  /**
   * Resolve relative file path to absolute URL for Google Cast receiver.
   * Rock-solid across trailing slashes, index.html, query strings, and hash fragments.
   */
  function toAbsoluteUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith('//')) return window.location.protocol + path;

    try {
      let base = document.baseURI || window.location.href;
      // Strip query string and hash
      base = base.split('?')[0].split('#')[0];
      // If not ending in slash and not ending in a file extension (.html, etc), add slash
      if (!base.endsWith('/') && !/\/[^/]+\.[a-zA-Z0-9]+$/.test(base)) {
        base += '/';
      }
      return new URL(path, base).href;
    } catch (e) {
      console.warn('[CastManager] Could not resolve absolute URL for:', path, e);
      try {
        const a = document.createElement('a');
        a.href = path;
        return a.href;
      } catch (err) {
        return path;
      }
    }
  }

  /**
   * Build MediaInfo for Google Cast with MusicTrackMediaMetadata, contentUrl, and bespoke artwork
   */
  function buildMediaInfo(track, albumMeta, index, forceGeneric = false) {
    const rawAudio = track.audio_file || track.src || track.streamUrl;
    const audioUrl = toAbsoluteUrl(rawAudio);

    // Explicitly set both contentId and contentUrl for CAF Default Media Receiver
    const mediaInfo = new chrome.cast.media.MediaInfo(audioUrl, 'audio/mpeg');
    mediaInfo.contentUrl = audioUrl;
    mediaInfo.contentId = audioUrl;
    mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
    mediaInfo.contentType = 'audio/mpeg';

    const albumTitle = (albumMeta && albumMeta.title) || "Sanity's Edge";
    const artist = (albumMeta && albumMeta.artist) || 'The Shady River Bard';
    const trackTitle = track.title || ('Track ' + (index + 1));
    const trackNum = track.track_number || (index + 1);

    // Track-specific artwork or fallback album cover
    const coverPath = track.art_square || track.art || track.image || track.cover ||
      (albumMeta && (albumMeta.master_cover_art || albumMeta.cover_art || albumMeta.cover)) ||
      'assets/art/sanitys-edge-cover.jpg';
    const coverUrl = toAbsoluteUrl(coverPath);

    let metadata;
    if (forceGeneric) {
      metadata = new chrome.cast.media.GenericMediaMetadata();
      metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
      metadata.title = trackTitle;
      metadata.subtitle = `${albumTitle} • ${artist}`;
    } else {
      metadata = new chrome.cast.media.MusicTrackMediaMetadata();
      metadata.metadataType = chrome.cast.media.MetadataType.MUSIC_TRACK; // 3
      metadata.title = trackTitle;
      metadata.songName = trackTitle;
      metadata.artist = artist;
      metadata.albumArtist = artist;
      metadata.albumName = albumTitle;
      metadata.trackNumber = trackNum;
    }

    if (coverUrl) {
      const castImg = new chrome.cast.Image(coverUrl);
      castImg.width = 720;
      castImg.height = 720;
      metadata.images = [castImg];
    }

    mediaInfo.metadata = metadata;
    return mediaInfo;
  }

  /**
   * Initialize Cast SDK once framework is ready
   */
  function initCast() {
    if (!window.cast || !window.cast.framework) {
      console.warn('[CastManager] Google Cast framework not available in window');
      return;
    }

    try {
      const castContext = cast.framework.CastContext.getInstance();
      castContext.setOptions({
        receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
      });

      remotePlayer = new cast.framework.RemotePlayer();
      remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);

      // Listen for connection state changes via RemotePlayer
      remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        onConnectedChanged
      );

      // Listen for playback state changes (PLAYING, PAUSED, IDLE, BUFFERING)
      remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
        onPlayerStateChanged
      );

      // Listen for media info changes (track advance)
      remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,
        onMediaInfoChanged
      );

      // Listen for time updates from remote player
      remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,
        onCurrentTimeChanged
      );

      // Listen for CastContext session state transitions
      castContext.addEventListener(
        cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
        (event) => {
          console.log('[CastManager] Cast session state changed:', event.sessionState);
          switch (event.sessionState) {
            case cast.framework.SessionState.SESSION_STARTED:
            case cast.framework.SessionState.SESSION_RESUMED:
              currentSession = castContext.getCurrentSession();
              isConnected = true;
              onConnectedChanged();
              // Determine target track: pending track, or current selected track, or track 0
              const targetIdx = (pendingTrackIndex !== null && pendingTrackIndex >= 0)
                ? pendingTrackIndex
                : ((typeof window.currentTrackIndex === 'number' && window.currentTrackIndex >= 0) ? window.currentTrackIndex : 0);
              pendingTrackIndex = null;
              console.log(`[CastManager] Session established with ${deviceName || 'Google TV'}, initiating Track ${targetIdx + 1}`);
              showToast(`Connected to ${deviceName || 'Google TV'}. Loading track...`, 'info', 3500);
              // Safe 300ms delay to ensure remote receiver WebSocket channel is ready for media load
              setTimeout(() => {
                loadTrackOnReceiver(targetIdx);
              }, 300);
              break;
            case cast.framework.SessionState.SESSION_START_FAILED:
              console.warn('[CastManager] Session start failed');
              showToast('Cast connection failed. Please try again.', 'error');
              pendingTrackIndex = null;
              break;
            case cast.framework.SessionState.SESSION_ENDED:
              currentSession = null;
              isConnected = false;
              pendingTrackIndex = null;
              onConnectedChanged();
              showToast('Cast session ended', 'info', 3000);
              break;
          }
        }
      );

      // Check if session already exists
      currentSession = castContext.getCurrentSession();
      if (currentSession && remotePlayer.isConnected) {
        onConnectedChanged();
      }

      isApiAvailable = true;
      console.log('[CastManager] Google Cast framework initialized successfully');
    } catch (e) {
      console.error('[CastManager] Initialization failed:', e);
    }
  }

  function onConnectedChanged() {
    const castContext = cast.framework.CastContext.getInstance();
    currentSession = castContext.getCurrentSession();
    isConnected = remotePlayer ? remotePlayer.isConnected : !!currentSession;

    if (isConnected && currentSession) {
      const castDevice = currentSession.getCastDevice();
      deviceName = castDevice ? castDevice.friendlyName : 'Google TV';
      console.log(`[CastManager] Connected to ${deviceName}`);

      // Pause local audio in page
      pauseLocalAudio();

      emit('connected', { deviceName });
      updateAllCastUI();
    } else {
      console.log('[CastManager] Disconnected from Cast device');
      deviceName = '';
      activeTrackIndex = -1;
      emit('disconnected', {});
      updateAllCastUI();
    }

    notifyState();
  }

  function onPlayerStateChanged() {
    if (!remotePlayer) return;

    const state = remotePlayer.playerState;
    const idleReason = remotePlayer.idleReason;
    console.log(`[CastManager] Remote player state: ${state}, idleReason: ${idleReason}`);

    // Seamless continuous playback: automatically advance to next track when finished
    if (state === cast.framework.PlayerState.IDLE && idleReason === 'FINISHED') {
      console.log('[CastManager] Track completed playing on Google TV receiver');
      if (activeTrackIndex >= 0 && activeTrackIndex < activeTracks.length - 1) {
        const nextIdx = activeTrackIndex + 1;
        console.log(`[CastManager] Auto-advancing to Track ${nextIdx + 1}: "${activeTracks[nextIdx]?.title}"`);
        showToast(`Next: ${activeTracks[nextIdx]?.title || 'Track ' + (nextIdx + 1)}`, 'info', 3000);
        loadTrackOnReceiver(nextIdx);
      }
    }

    notifyState();
  }

  function onMediaInfoChanged() {
    if (!remotePlayer || !remotePlayer.mediaInfo) return;

    const mediaInfo = remotePlayer.mediaInfo;
    console.log('[CastManager] Remote media info changed:', mediaInfo);

    let detectedIndex = -1;
    if (mediaInfo.customData && typeof mediaInfo.customData.trackIndex === 'number') {
      detectedIndex = mediaInfo.customData.trackIndex;
    } else if (activeTracks.length > 0) {
      const contentId = mediaInfo.contentId || '';
      const title = (mediaInfo.metadata && mediaInfo.metadata.title) || '';
      detectedIndex = activeTracks.findIndex(t => {
        const fullUrl = toAbsoluteUrl(t.audio_file || t.src || t.streamUrl);
        return fullUrl === contentId || (t.title && t.title === title);
      });
    }

    if (detectedIndex !== -1 && detectedIndex !== activeTrackIndex) {
      activeTrackIndex = detectedIndex;
      console.log(`[CastManager] Now active on Google TV: Track ${activeTrackIndex + 1} (${activeTracks[activeTrackIndex]?.title || ''})`);
      emit('trackChange', activeTrackIndex);
      updateAllCastUI();
    }

    notifyState();
  }

  function onCurrentTimeChanged() {
    if (!remotePlayer) return;
    const curTime = remotePlayer.currentTime || 0;
    const duration = remotePlayer.duration || (activeTracks[activeTrackIndex]?.durationSec) || 0;
    emit('timeUpdate', { currentTime: curTime, duration });
  }

  function pauseLocalAudio() {
    const audios = document.querySelectorAll('audio');
    audios.forEach(a => {
      if (!a.paused) {
        a.pause();
      }
    });
  }

  /**
   * Load and stream an individual track directly onto Google TV
   */
  function loadTrackOnReceiver(trackIndex, seekTime = 0, isRetry = false) {
    const castContext = cast.framework.CastContext.getInstance();
    currentSession = castContext.getCurrentSession();

    if (!currentSession) {
      console.warn('[CastManager] No active Cast session yet. Storing as pendingTrackIndex:', trackIndex);
      pendingTrackIndex = trackIndex;
      showToast('Connecting to Cast device...', 'info', 4000);
      return;
    }

    activeTracks = (activeTracks && activeTracks.length) ? activeTracks : ((window.ALBUM_DATA && window.ALBUM_DATA.tracks) || []);
    activeAlbumMeta = activeAlbumMeta || window.ALBUM_DATA || null;

    if (!activeTracks || !activeTracks[trackIndex]) {
      console.warn('[CastManager] Invalid track index to load:', trackIndex);
      return;
    }

    activeTrackIndex = trackIndex;
    window.currentTrackIndex = trackIndex;
    pauseLocalAudio();

    const track = activeTracks[trackIndex];
    const mediaInfo = buildMediaInfo(track, activeAlbumMeta, trackIndex, isRetry);

    const loadRequest = new chrome.cast.media.LoadRequest(mediaInfo);
    loadRequest.autoplay = true;
    loadRequest.currentTime = seekTime || 0;

    const dev = deviceName || 'Google TV';
    console.log(`[CastManager] Streaming to ${dev}: "${track.title}" (${mediaInfo.contentUrl})...`);
    showToast(`Streaming "${track.title}" to ${dev}...`, 'info', 4000);

    currentSession.loadMedia(loadRequest).then((res) => {
      console.log('[CastManager] loadMedia completed. Result:', res);
      if (res && typeof res === 'string' && res !== 'cancel') {
        console.warn('[CastManager] Receiver returned loadMedia response:', res);
        showToast(`Cast notice: ${res}`, 'warn', 4000);
      } else {
        console.log(`[CastManager] Successfully playing Track ${trackIndex + 1} on ${dev}`);
        showToast(`✓ Playing "${track.title}" on ${dev}`, 'success', 4000);
      }
      emit('trackChange', activeTrackIndex);
      updateAllCastUI();
      notifyState();
    }).catch(err => {
      console.error('[CastManager] loadMedia failed:', err);
      if (!isRetry) {
        console.log('[CastManager] Primary load failed, retrying with universal generic metadata...');
        loadTrackOnReceiver(trackIndex, seekTime, true);
        return;
      }
      const errMsg = (err && (err.description || err.message)) || (typeof err === 'string' ? err : 'Media load error');
      showToast(`Cast failed: ${errMsg}`, 'error', 6000);
    });
  }

  /**
   * Request Cast session and start playing from trackIndex
   */
  function castTrack(trackIndex, tracks, albumMeta) {
    activeTracks = (tracks && tracks.length) ? tracks : activeTracks;
    activeAlbumMeta = albumMeta || activeAlbumMeta;

    const castContext = cast.framework.CastContext.getInstance();
    currentSession = castContext.getCurrentSession();
    isConnected = remotePlayer ? remotePlayer.isConnected : !!currentSession;

    if (isConnected && currentSession) {
      loadTrackOnReceiver(trackIndex);
    } else {
      pendingTrackIndex = trackIndex;
      showToast('Select your Google TV or Chromecast...', 'info', 5000);
      castContext.requestSession().then(() => {
        currentSession = castContext.getCurrentSession();
        isConnected = true;
        onConnectedChanged();
        const idx = (pendingTrackIndex !== null && pendingTrackIndex >= 0) ? pendingTrackIndex : trackIndex;
        pendingTrackIndex = null;
        setTimeout(() => {
          loadTrackOnReceiver(idx);
        }, 300);
      }).catch(err => {
        pendingTrackIndex = null;
        if (err !== 'cancel') {
          console.warn('[CastManager] Cast session request cancelled or failed:', err);
          showToast('Cast cancelled or unavailable', 'warn', 3000);
        }
      });
    }
  }

  /**
   * Play / Pause toggle on remote receiver (loads current track if idle)
   */
  function playOrPause() {
    if (isConnected) {
      if (remotePlayer && (remotePlayer.playerState === cast.framework.PlayerState.PLAYING || remotePlayer.playerState === cast.framework.PlayerState.PAUSED)) {
        if (remotePlayerController) {
          remotePlayerController.playOrPause();
        }
      } else {
        // If receiver is connected but idle or has no media loaded, load current track immediately
        const curIdx = (typeof activeTrackIndex === 'number' && activeTrackIndex >= 0)
          ? activeTrackIndex
          : ((typeof window.currentTrackIndex === 'number' && window.currentTrackIndex >= 0) ? window.currentTrackIndex : 0);
        console.log(`[CastManager] playOrPause invoked while idle. Loading track ${curIdx + 1}`);
        loadTrackOnReceiver(curIdx);
      }
    }
  }

  /**
   * Seek remote playback to specific time in seconds
   */
  function seek(timeInSeconds) {
    if (remotePlayer && remotePlayerController && isConnected) {
      remotePlayer.currentTime = timeInSeconds;
      remotePlayerController.seek();
    }
  }

  /**
   * Skip to next track with auto-advance
   */
  function nextTrack() {
    if (!isConnected) return;
    activeTracks = (activeTracks && activeTracks.length) ? activeTracks : ((window.ALBUM_DATA && window.ALBUM_DATA.tracks) || []);
    if (!activeTracks || activeTracks.length === 0) return;
    let nextIdx = (activeTrackIndex >= 0 ? activeTrackIndex : 0) + 1;
    if (nextIdx >= activeTracks.length) nextIdx = 0;
    loadTrackOnReceiver(nextIdx);
  }

  /**
   * Return to previous track or restart current
   */
  function prevTrack() {
    if (!isConnected) return;
    activeTracks = (activeTracks && activeTracks.length) ? activeTracks : ((window.ALBUM_DATA && window.ALBUM_DATA.tracks) || []);
    if (!activeTracks || activeTracks.length === 0) return;
    if (remotePlayer && remotePlayer.currentTime > 4) {
      seek(0);
      return;
    }
    let prevIdx = (activeTrackIndex >= 0 ? activeTrackIndex : 0) - 1;
    if (prevIdx < 0) prevIdx = activeTracks.length - 1;
    loadTrackOnReceiver(prevIdx);
  }

  /**
   * Adjust remote volume level (0.0 to 1.0)
   */
  function setVolume(level) {
    if (remotePlayer && remotePlayerController && isConnected) {
      remotePlayer.volumeLevel = Math.max(0, Math.min(1, level));
      remotePlayerController.setVolumeLevel();
    }
  }

  /**
   * Disconnect from active Cast session
   */
  function disconnect() {
    if (!isConnected) return;
    try {
      const castContext = cast.framework.CastContext.getInstance();
      castContext.endCurrentSession(true);
      showToast('Disconnected from ' + (deviceName || 'TV'), 'info', 3000);
    } catch (e) {
      console.warn('[CastManager] Error during disconnect:', e);
    }
  }

  /**
   * Subscribe to CastManager events
   */
  function on(eventName, callback) {
    if (eventListeners[eventName]) {
      eventListeners[eventName].push(callback);
    }
  }

  function emit(eventName, data) {
    if (eventListeners[eventName]) {
      eventListeners[eventName].forEach(fn => {
        try { fn(data); } catch (e) { console.error(e); }
      });
    }
  }

  function notifyState() {
    const isPlaying = remotePlayer ? (remotePlayer.playerState === cast.framework.PlayerState.PLAYING) : false;
    emit('stateChange', {
      isConnected,
      isPlaying,
      trackIndex: activeTrackIndex,
      deviceName,
      currentTime: remotePlayer ? remotePlayer.currentTime : 0,
      duration: remotePlayer ? remotePlayer.duration : 0
    });
  }

  /**
   * Update visual states of all Cast buttons and indicators on the page
   */
  function updateAllCastUI() {
    // 1. Update track card cast buttons
    document.querySelectorAll('.track-cast-btn').forEach(btn => {
      const trackIdx = parseInt(btn.dataset.trackIndex, 10);
      const tooltip = btn.querySelector('.track-cast-tooltip');
      const isThisTrackCasting = (isConnected && trackIdx === activeTrackIndex);

      if (isThisTrackCasting) {
        btn.classList.add('casting-active');
        if (tooltip) tooltip.textContent = `✓ Casting to ${deviceName || 'Google TV'}`;
      } else {
        btn.classList.remove('casting-active');
        if (tooltip) {
          tooltip.textContent = isConnected ? `Cast this track to ${deviceName || 'TV'}` : 'Cast track to Google TV';
        }
      }
    });

    // 2. Update jukebox dock cast button
    const jukeboxCastBtn = document.getElementById('jukebox-cast-btn');
    if (jukeboxCastBtn) {
      const label = document.getElementById('jukebox-cast-device');

      if (isConnected) {
        jukeboxCastBtn.classList.add('text-amber-400', 'border-amber-500/50', 'bg-amber-950/40');
        jukeboxCastBtn.classList.remove('text-stone-400');
        jukeboxCastBtn.setAttribute('title', `Connected to ${deviceName} (Click to disconnect)`);
        if (label) {
          label.textContent = deviceName || 'Google TV';
          label.classList.remove('hidden');
        }
      } else {
        jukeboxCastBtn.classList.remove('text-amber-400', 'border-amber-500/50', 'bg-amber-950/40');
        jukeboxCastBtn.classList.add('text-stone-400');
        jukeboxCastBtn.setAttribute('title', 'Cast to Google TV');
        if (label) {
          label.classList.add('hidden');
        }
      }
    }
  }

  // Hook Google Cast framework bootstrap - MUST be defined globally
  window.__onGCastApiAvailable = function (isAvailable) {
    console.log('[CastManager] __onGCastApiAvailable called with:', isAvailable);
    if (isAvailable) {
      initCast();
    }
  };

  // If already available on script arrival, init immediately
  if (window.cast && window.cast.framework) {
    initCast();
  }

  // Public API
  window.CastManager = {
    castTrack,
    playOrPause,
    seek,
    setVolume,
    nextTrack,
    prevTrack,
    disconnect,
    updateAllCastUI,
    showToast,
    on,
    isConnected: function () { return isConnected; },
    getDeviceName: function () { return deviceName; },
    getActiveTrackIndex: function () { return activeTrackIndex; },
    isAvailable: function () { return isApiAvailable; }
  };

  // Helper shortcut for onclick handlers
  window.castTrack = function (index) {
    const tracks = (window.ALBUM_DATA && window.ALBUM_DATA.tracks) || [];
    const meta = window.ALBUM_DATA || {};
    CastManager.castTrack(index, tracks, meta);
  };

  window.toggleJukeboxCast = function () {
    if (CastManager.isConnected()) {
      if (confirm(`Disconnect from ${CastManager.getDeviceName()}?`)) {
        CastManager.disconnect();
      }
    } else {
      const curIdx = typeof window.currentTrackIndex === 'number' && window.currentTrackIndex >= 0 ? window.currentTrackIndex : 0;
      window.castTrack(curIdx);
    }
  };

})();
