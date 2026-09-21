/**
 * ============================================================================
 * THE SHADY RIVER BARD - GOOGLE CAST CONTROLLER & AUDIO STREAMER
 * ============================================================================
 * Implements native Google Cast Web Sender SDK integration for the portal:
 * - Default Media Receiver (CC1AD845) with rich track metadata & bespoke 720p artwork
 * - ORIGIN_SCOPED auto-join policy for seamless persistence across pages
 * - Resilient connection state tracking (checkIsConnected) - no false disconnects
 * - Native progressive audio/mp3 streaming (omits streamType BUFFERED to prevent MSE failure)
 * - Strictly serialized, concurrency-safe loadMedia requests (prevents collision hangs)
 * - Safe receiver cold-boot timing buffer (600ms) for Google TV app mount
 * - Automatic hands-free continuous track advance on remote track completion
 * - Bidirectional remote playback, track navigation, & timeline sync
 * - On-screen visual feedback toast & live status badge
 */

(function () {
  'use strict';

  // Internal state
  let isApiAvailable = false;
  let isConnected = false;
  let isMediaLoading = false;
  let loadSequence = 0;
  let initialBootTimer = null;
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
   * Determine true connection state with Google Cast framework.
   * Resilient against RemotePlayer state delay.
   */
  function checkIsConnected() {
    if (!window.cast || !window.cast.framework) return false;
    try {
      const castContext = cast.framework.CastContext.getInstance();
      const session = castContext.getCurrentSession();
      if (session) {
        const state = session.getSessionState();
        if (state === cast.framework.SessionState.SESSION_STARTED ||
            state === cast.framework.SessionState.SESSION_RESUMED) {
          return true;
        }
        if (state !== cast.framework.SessionState.SESSION_ENDING &&
            state !== cast.framework.SessionState.SESSION_ENDED) {
          return true;
        }
      }
      if (remotePlayer && remotePlayer.isConnected) {
        return true;
      }
    } catch (e) {
      console.warn('[CastManager] checkIsConnected exception:', e);
    }
    return false;
  }

  /**
   * Build MediaInfo for Google Cast Default Media Receiver.
   * Note: Uses audio/mp3 MIME type without streamType BUFFERED to let
   * Google TV decode standard progressive audio natively without MediaSource buffer errors.
   */
  function buildMediaInfo(track, albumMeta, index, forceGeneric = false) {
    const rawAudio = track.audio_file || track.src || track.streamUrl;
    const audioUrl = toAbsoluteUrl(rawAudio);

    // Progressive MP3 specification for CAF Default Media Receiver
    const mediaInfo = new chrome.cast.media.MediaInfo(audioUrl, 'audio/mp3');
    mediaInfo.contentUrl = audioUrl;
    mediaInfo.contentId = audioUrl;
    mediaInfo.contentType = 'audio/mp3';

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
      metadata.artist = artist;
      metadata.albumName = albumTitle;
      metadata.trackNumber = trackNum;
    }

    if (coverUrl) {
      metadata.images = [new chrome.cast.Image(coverUrl)];
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
        receiverApplicationId: (window.chrome && chrome.cast && chrome.cast.media && chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID) || 'CC1AD845',
        autoJoinPolicy: (window.chrome && chrome.cast && chrome.cast.AutoJoinPolicy && chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED) || 'origin_scoped'
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

      // Listen for pause/play/volume changes
      remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,
        () => { notifyState(); updateAllCastUI(); }
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

              // Determine initial track to play
              const targetIdx = (pendingTrackIndex !== null && pendingTrackIndex >= 0)
                ? pendingTrackIndex
                : ((typeof window.currentTrackIndex === 'number' && window.currentTrackIndex >= 0) ? window.currentTrackIndex : 0);
              pendingTrackIndex = null;

              console.log(`[CastManager] Session established with ${deviceName || 'Google TV'}, queuing Track ${targetIdx + 1}`);
              showToast(`Connected to ${deviceName || 'Google TV'}. Loading track...`, 'info', 3500);

              // Clear any pending boot timer
              if (initialBootTimer) {
                clearTimeout(initialBootTimer);
                initialBootTimer = null;
              }

              // 600ms buffer allows Default Media Receiver on Google TV to finish DOM mount & audio engine initialization
              initialBootTimer = setTimeout(() => {
                loadTrackOnReceiver(targetIdx);
              }, 600);
              break;

            case cast.framework.SessionState.SESSION_START_FAILED:
              console.warn('[CastManager] Session start failed');
              showToast('Cast connection failed. Please try again.', 'error');
              pendingTrackIndex = null;
              isMediaLoading = false;
              onConnectedChanged();
              break;

            case cast.framework.SessionState.SESSION_ENDED:
              console.log('[CastManager] Session ended');
              if (initialBootTimer) {
                clearTimeout(initialBootTimer);
                initialBootTimer = null;
              }
              currentSession = null;
              isConnected = false;
              isMediaLoading = false;
              pendingTrackIndex = null;
              onConnectedChanged();
              showToast('Cast session ended', 'info', 3000);
              break;
          }
        }
      );

      // Check if session already exists
      currentSession = castContext.getCurrentSession();
      if (currentSession) {
        isConnected = checkIsConnected();
        if (isConnected) {
          onConnectedChanged();
        }
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
    isConnected = checkIsConnected();

    if (isConnected && currentSession) {
      const castDevice = currentSession.getCastDevice();
      if (castDevice && castDevice.friendlyName) {
        deviceName = castDevice.friendlyName;
      } else if (!deviceName) {
        deviceName = 'Google TV';
      }
      console.log(`[CastManager] Connected to ${deviceName}`);

      // Pause local audio in page
      pauseLocalAudio();

      emit('connected', { deviceName });
      updateAllCastUI();
    } else if (!isConnected) {
      console.log('[CastManager] Disconnected from Cast device');
      deviceName = '';
      activeTrackIndex = -1;
      isMediaLoading = false;
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

    if (state === cast.framework.PlayerState.IDLE) {
      isMediaLoading = false;
      if (idleReason === 'FINISHED') {
        console.log('[CastManager] Track completed playing on Google TV receiver');
        if (activeTrackIndex >= 0 && activeTrackIndex < activeTracks.length - 1) {
          const nextIdx = activeTrackIndex + 1;
          console.log(`[CastManager] Auto-advancing to Track ${nextIdx + 1}: "${activeTracks[nextIdx]?.title}"`);
          showToast(`Next: ${activeTracks[nextIdx]?.title || 'Track ' + (nextIdx + 1)}`, 'info', 3000);
          loadTrackOnReceiver(nextIdx);
        }
      } else if (idleReason === 'ERROR') {
        console.error('[CastManager] Receiver reported PlayerState IDLE with idleReason ERROR');
        showToast('Playback error on TV (Receiver reported error)', 'error', 5000);
      }
    }

    updateAllCastUI();
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
    const duration = remotePlayer.duration || 0;
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
   * Load and stream an individual track directly onto Google TV.
   * Serialized and concurrency-guarded to prevent receiver collisions.
   */
  function loadTrackOnReceiver(trackIndex, seekTime = 0, isRetry = false) {
    const castContext = cast.framework.CastContext.getInstance();
    currentSession = castContext.getCurrentSession();
    isConnected = checkIsConnected();

    if (!currentSession) {
      console.warn('[CastManager] No active Cast session. Queuing as pendingTrackIndex:', trackIndex);
      pendingTrackIndex = trackIndex;
      showToast('Connecting to Cast device...', 'info', 4000);
      return;
    }

    // Concurrency guard: if another load is active, queue this track and return
    if (isMediaLoading && !isRetry) {
      console.log(`[CastManager] Media load currently in flight. Queuing Track ${trackIndex + 1}`);
      pendingTrackIndex = trackIndex;
      return;
    }

    activeTracks = (activeTracks && activeTracks.length) ? activeTracks : ((window.ALBUM_DATA && window.ALBUM_DATA.tracks) || []);
    activeAlbumMeta = activeAlbumMeta || window.ALBUM_DATA || null;

    if (!activeTracks || !activeTracks[trackIndex]) {
      console.warn('[CastManager] Invalid track index to load:', trackIndex);
      return;
    }

    isMediaLoading = true;
    const currentSeq = ++loadSequence;
    activeTrackIndex = trackIndex;
    window.currentTrackIndex = trackIndex;
    pauseLocalAudio();

    const track = activeTracks[trackIndex];
    const mediaInfo = buildMediaInfo(track, activeAlbumMeta, trackIndex, isRetry);

    const loadRequest = new chrome.cast.media.LoadRequest(mediaInfo);
    loadRequest.autoplay = true;
    loadRequest.currentTime = seekTime || 0;

    const dev = deviceName || 'Google TV';
    console.log(`[CastManager] [Seq ${currentSeq}] Streaming to ${dev}: "${track.title}" (${mediaInfo.contentUrl})...`);
    showToast(`Streaming "${track.title}" to ${dev}...`, 'info', 4000);
    updateAllCastUI();

    currentSession.loadMedia(loadRequest).then((res) => {
      isMediaLoading = false;
      if (currentSeq !== loadSequence) {
        console.log(`[CastManager] [Seq ${currentSeq}] Stale load completion ignored (latest: ${loadSequence})`);
        return;
      }

      // Check if CAF resolved with an error string (e.g. 'cancel')
      if (res && typeof res === 'string') {
        console.warn(`[CastManager] [Seq ${currentSeq}] loadMedia resolved with code:`, res);
        if (res === 'cancel') {
          console.log('[CastManager] Load request was cancelled');
        } else {
          showToast(`Cast load notice: ${res}`, 'warn', 4000);
        }
        return;
      }

      console.log(`[CastManager] [Seq ${currentSeq}] Successfully playing Track ${trackIndex + 1} on ${dev}`);
      showToast(`✓ Playing "${track.title}" on ${dev}`, 'success', 5000);
      emit('trackChange', activeTrackIndex);
      updateAllCastUI();
      notifyState();

      // If another track was queued while loading, fire it now
      if (pendingTrackIndex !== null && pendingTrackIndex !== activeTrackIndex) {
        const nextIdx = pendingTrackIndex;
        pendingTrackIndex = null;
        setTimeout(() => loadTrackOnReceiver(nextIdx), 250);
      }
    }).catch(err => {
      isMediaLoading = false;
      if (currentSeq !== loadSequence) return;

      console.error(`[CastManager] [Seq ${currentSeq}] loadMedia failed:`, err);
      const errStr = (err && (err.description || err.message || err.name)) || (typeof err === 'string' ? err : 'Media load error');

      if (!isRetry && err !== 'cancel') {
        console.log('[CastManager] Primary load failed, retrying in 500ms with generic metadata...');
        showToast(`Retrying playback on ${dev}...`, 'warn', 3000);
        setTimeout(() => {
          loadTrackOnReceiver(trackIndex, seekTime, true);
        }, 500);
        return;
      }

      if (err !== 'cancel') {
        showToast(`Cast failed: ${errStr}`, 'error', 6000);
      }
    });
  }

  /**
   * Request Cast session and start playing from trackIndex.
   */
  function castTrack(trackIndex, tracks, albumMeta) {
    activeTracks = (tracks && tracks.length) ? tracks : activeTracks;
    activeAlbumMeta = albumMeta || activeAlbumMeta;

    const castContext = cast.framework.CastContext.getInstance();
    currentSession = castContext.getCurrentSession();
    isConnected = checkIsConnected();

    if (isConnected && currentSession) {
      // Session is already running: load requested track immediately
      console.log(`[CastManager] Session already running with ${deviceName || 'Google TV'}. Loading track ${trackIndex + 1}`);
      loadTrackOnReceiver(trackIndex);
      updateAllCastUI();
    } else {
      // No active session: store track as pending, then open device chooser
      pendingTrackIndex = trackIndex;
      showToast('Select your Google TV or Chromecast...', 'info', 5000);

      castContext.requestSession().then(() => {
        console.log('[CastManager] requestSession picker resolved successfully');
        currentSession = castContext.getCurrentSession();
        isConnected = checkIsConnected();
        onConnectedChanged();
      }).catch(err => {
        pendingTrackIndex = null;
        isMediaLoading = false;
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
    isConnected = checkIsConnected();
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
    if (remotePlayer && remotePlayerController && checkIsConnected()) {
      remotePlayer.currentTime = timeInSeconds;
      remotePlayerController.seek();
    }
  }

  /**
   * Skip to next track with auto-advance
   */
  function nextTrack() {
    if (!checkIsConnected()) return;
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
    if (!checkIsConnected()) return;
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
    if (remotePlayer && remotePlayerController && checkIsConnected()) {
      remotePlayer.volumeLevel = Math.max(0, Math.min(1, level));
      remotePlayerController.setVolumeLevel();
    }
  }

  /**
   * Disconnect from active Cast session
   */
  function disconnect() {
    if (!checkIsConnected()) return;
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
      isConnected: checkIsConnected(),
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
    isConnected = checkIsConnected();

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

    // 2. Update jukebox dock cast button and status badge
    const jukeboxCastBtn = document.getElementById('jukebox-cast-btn');
    if (jukeboxCastBtn) {
      const label = document.getElementById('jukebox-cast-device');

      if (isConnected) {
        jukeboxCastBtn.classList.add('text-amber-400', 'border-amber-500/50', 'bg-amber-950/40');
        jukeboxCastBtn.classList.remove('text-stone-400');
        jukeboxCastBtn.setAttribute('title', `Connected to ${deviceName || 'Google TV'} (Click to disconnect)`);
        if (label) {
          const pState = remotePlayer ? remotePlayer.playerState : '';
          let stateTag = '';
          if (pState === cast.framework.PlayerState.PLAYING) stateTag = ' • Playing';
          else if (pState === cast.framework.PlayerState.PAUSED) stateTag = ' • Paused';
          else if (pState === cast.framework.PlayerState.BUFFERING) stateTag = ' • Buffering';

          label.textContent = `${deviceName || 'Google TV'}${stateTag}`;
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
    isConnected: function () { return checkIsConnected(); },
    getDeviceName: function () { return deviceName || 'Google TV'; },
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
