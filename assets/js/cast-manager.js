/**
 * ============================================================================
 * THE SHADY RIVER BARD - GOOGLE CAST CONTROLLER & QUEUE MANAGER
 * ============================================================================
 * Implements native Google Cast Web Sender SDK integration for the portal:
 * - Default Media Receiver (CC1AD845) with rich track metadata & artwork
 * - ORIGIN_SCOPED auto-join policy for seamless persistence across pages
 * - Full Album QueueLoadRequest with automatic hands-free track advance
 * - Bidirectional remote playback & timeline scrubbing synchronization
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
  let activeTracks = [];
  let activeAlbumMeta = null;

  const eventListeners = {
    stateChange: [],
    trackChange: [],
    timeUpdate: [],
    connected: [],
    disconnected: []
  };

  /**
   * Resolve relative file path to absolute URL for Google Cast receiver
   */
  function toAbsoluteUrl(path) {
    if (!path) return '';
    try {
      return new URL(path, window.location.href).href;
    } catch (e) {
      console.warn('[CastManager] Could not resolve absolute URL for:', path, e);
      return path;
    }
  }

  /**
   * Build MediaInfo for Google Cast with rich metadata
   */
  function buildMediaInfo(track, albumMeta, index) {
    const audioUrl = toAbsoluteUrl(track.audio_file || track.src || track.streamUrl);
    const mediaInfo = new chrome.cast.media.MediaInfo(audioUrl, 'audio/mp3');
    mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;

    const metadata = new chrome.cast.media.MusicTrackMediaMetadata();
    metadata.metadataType = chrome.cast.media.MetadataType.MUSIC_TRACK;
    metadata.title = track.title || 'Track ' + (index + 1);
    metadata.artist = (albumMeta && albumMeta.artist) || 'The Shady River Bard';
    metadata.albumName = (albumMeta && albumMeta.title) || "Sanity's Edge";
    metadata.trackNumber = track.track_number || (index + 1);

    const coverPath = (albumMeta && (albumMeta.master_cover_art || albumMeta.cover_art || albumMeta.cover)) || 'assets/images/album-art.webp';
    if (coverPath) {
      const coverUrl = toAbsoluteUrl(coverPath);
      metadata.images = [new chrome.cast.Image(coverUrl)];
    }

    mediaInfo.metadata = metadata;
    mediaInfo.customData = {
      trackIndex: index,
      trackNumber: track.track_number || (index + 1),
      title: track.title
    };

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

    const castContext = cast.framework.CastContext.getInstance();
    castContext.setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    });

    remotePlayer = new cast.framework.RemotePlayer();
    remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);

    // Listen for connection state changes
    remotePlayerController.addEventListener(
      cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
      onConnectedChanged
    );

    // Listen for playback state changes (PLAYING, PAUSED, IDLE, BUFFERING)
    remotePlayerController.addEventListener(
      cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
      onPlayerStateChanged
    );

    // Listen for media info changes (track advance in queue)
    remotePlayerController.addEventListener(
      cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,
      onMediaInfoChanged
    );

    // Listen for time updates from remote player
    remotePlayerController.addEventListener(
      cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,
      onCurrentTimeChanged
    );

    // Check if session already exists (e.g. from origin-scoped auto-join)
    currentSession = castContext.getCurrentSession();
    if (currentSession && remotePlayer.isConnected) {
      onConnectedChanged();
    }

    isApiAvailable = true;
    console.log('[CastManager] Google Cast framework initialized successfully');
  }

  function onConnectedChanged() {
    const castContext = cast.framework.CastContext.getInstance();
    currentSession = castContext.getCurrentSession();
    isConnected = remotePlayer ? remotePlayer.isConnected : false;

    if (isConnected && currentSession) {
      const castDevice = currentSession.getCastDevice();
      deviceName = castDevice ? castDevice.friendlyName : 'Google TV';
      console.log(`[CastManager] Connected to ${deviceName}`);

      // Pause local audio in page if any is playing
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
    console.log(`[CastManager] Remote player state: ${state}`);

    // Handle end of queue or finished item
    if (state === cast.framework.PlayerState.IDLE) {
      if (remotePlayer.idleReason === 'FINISHED') {
        console.log('[CastManager] Track finished playing on remote receiver');
      }
    }

    notifyState();
  }

  function onMediaInfoChanged() {
    if (!remotePlayer || !remotePlayer.mediaInfo) return;

    const mediaInfo = remotePlayer.mediaInfo;
    console.log('[CastManager] Media info changed:', mediaInfo);

    // Resolve which track is currently playing
    let detectedIndex = -1;
    if (mediaInfo.customData && typeof mediaInfo.customData.trackIndex === 'number') {
      detectedIndex = mediaInfo.customData.trackIndex;
    } else if (activeTracks.length > 0) {
      // Find matching track by audio URL or title
      const contentId = mediaInfo.contentId || '';
      const title = (mediaInfo.metadata && mediaInfo.metadata.title) || '';
      detectedIndex = activeTracks.findIndex(t => {
        const fullUrl = toAbsoluteUrl(t.audio_file || t.src || t.streamUrl);
        return fullUrl === contentId || (t.title && t.title === title);
      });
    }

    if (detectedIndex !== -1 && detectedIndex !== activeTrackIndex) {
      activeTrackIndex = detectedIndex;
      console.log(`[CastManager] Now active: Track ${activeTrackIndex + 1} (${activeTracks[activeTrackIndex]?.title || ''})`);
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
    // Look for any standard audio element on the page and pause it
    const audios = document.querySelectorAll('audio');
    audios.forEach(a => {
      if (!a.paused) {
        a.pause();
      }
    });
  }

  /**
   * Load entire album as a remote queue on Google TV starting from targetIndex
   */
  function loadQueueFromIndex(targetIndex, tracks, albumMeta) {
    const castContext = cast.framework.CastContext.getInstance();
    currentSession = castContext.getCurrentSession();

    if (!currentSession) {
      console.warn('[CastManager] No active cast session to load queue');
      return;
    }

    activeTracks = tracks || [];
    activeAlbumMeta = albumMeta || null;
    activeTrackIndex = targetIndex;

    pauseLocalAudio();

    // Build queue items from targetIndex to the end of the album
    const remainingTracks = activeTracks.slice(targetIndex);
    const queueItems = remainingTracks.map((t, relIdx) => {
      const realIdx = targetIndex + relIdx;
      const media = buildMediaInfo(t, activeAlbumMeta, realIdx);
      const queueItem = new chrome.cast.media.QueueItem(media);
      queueItem.autoplay = true;
      queueItem.preloadTime = 8; // Pre-buffer next track 8s before current ends for seamless gapless transition
      return queueItem;
    });

    const queueRequest = new chrome.cast.media.QueueLoadRequest(queueItems);
    queueRequest.startIndex = 0;
    queueRequest.repeatMode = chrome.cast.media.RepeatMode.OFF;

    console.log(`[CastManager] Queueing ${queueItems.length} tracks starting at index ${targetIndex} (${activeTracks[targetIndex]?.title})...`);

    currentSession.queueLoad(queueRequest).then(() => {
      console.log('[CastManager] Queue loaded onto Google TV receiver successfully');
      emit('trackChange', activeTrackIndex);
      updateAllCastUI();
      notifyState();
    }).catch(err => {
      console.warn('[CastManager] Queue load failed, attempting fallback loadMedia:', err);
      // Fallback: standard loadMedia for single track
      const singleMedia = buildMediaInfo(activeTracks[targetIndex], activeAlbumMeta, targetIndex);
      const loadRequest = new chrome.cast.media.LoadRequest(singleMedia);
      loadRequest.autoplay = true;
      currentSession.loadMedia(loadRequest).then(() => {
        emit('trackChange', activeTrackIndex);
        updateAllCastUI();
        notifyState();
      }).catch(loadErr => {
        console.error('[CastManager] Fallback loadMedia also failed:', loadErr);
      });
    });
  }

  /**
   * Request Cast and start playing from trackIndex
   */
  function castTrack(trackIndex, tracks, albumMeta) {
    activeTracks = tracks || activeTracks;
    activeAlbumMeta = albumMeta || activeAlbumMeta;

    const castContext = cast.framework.CastContext.getInstance();

    if (isConnected && currentSession) {
      // Already connected: immediately jump to and queue selected track
      loadQueueFromIndex(trackIndex, activeTracks, activeAlbumMeta);
    } else {
      // Not connected: prompt user to pick Cast receiver
      castContext.requestSession().then(() => {
        onConnectedChanged();
        loadQueueFromIndex(trackIndex, activeTracks, activeAlbumMeta);
      }).catch(err => {
        if (err !== 'cancel') {
          console.warn('[CastManager] Cast session request cancelled or failed:', err);
        }
      });
    }
  }

  /**
   * Play / Pause toggle on remote receiver
   */
  function playOrPause() {
    if (remotePlayerController && isConnected) {
      remotePlayerController.playOrPause();
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
   * Skip to next track in queue
   */
  function nextTrack() {
    if (!isConnected || !currentSession) return;
    currentSession.queueNext().catch(err => {
      console.warn('[CastManager] queueNext failed, falling back to manual advance:', err);
      if (activeTrackIndex + 1 < activeTracks.length) {
        loadQueueFromIndex(activeTrackIndex + 1, activeTracks, activeAlbumMeta);
      }
    });
  }

  /**
   * Return to previous track in queue
   */
  function prevTrack() {
    if (!isConnected || !currentSession) return;
    if (remotePlayer && remotePlayer.currentTime > 4) {
      // If played more than 4 seconds, restart track
      seek(0);
      return;
    }
    currentSession.queuePrev().catch(err => {
      console.warn('[CastManager] queuePrev failed, falling back to manual advance:', err);
      if (activeTrackIndex - 1 >= 0) {
        loadQueueFromIndex(activeTrackIndex - 1, activeTracks, activeAlbumMeta);
      }
    });
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

    // 2. Update jukebox / dock cast button
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

  // Hook Google Cast framework bootstrap
  window.__onGCastApiAvailable = function (isAvailable) {
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
      // Cast starting at current playing track or Track 1
      const curIdx = typeof window.currentTrackIndex === 'number' && window.currentTrackIndex >= 0 ? window.currentTrackIndex : 0;
      window.castTrack(curIdx);
    }
  };

})();
