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
   * Handles paths with or without trailing slash, index.html, hashes, and query params.
   */
  function toAbsoluteUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith('//')) return window.location.protocol + path;

    try {
      let base = window.location.origin + window.location.pathname;
      // Strip trailing filename if present (e.g. index.html)
      if (/\/[^/]+\.[^/]+$/.test(base)) {
        base = base.substring(0, base.lastIndexOf('/') + 1);
      } else if (!base.endsWith('/')) {
        base = base + '/';
      }
      return new URL(path, base).href;
    } catch (e) {
      console.warn('[CastManager] Could not resolve absolute URL for:', path, e);
      return path;
    }
  }

  /**
   * Build MediaInfo for Google Cast with rich metadata and track-specific artwork
   */
  function buildMediaInfo(track, albumMeta, index) {
    const rawAudio = track.audio_file || track.src || track.streamUrl;
    const audioUrl = toAbsoluteUrl(rawAudio);

    // Google Cast Default Media Receiver requires standard audio/mpeg for MP3 files
    const mediaInfo = new chrome.cast.media.MediaInfo(audioUrl, 'audio/mpeg');
    mediaInfo.contentUrl = audioUrl;
    mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;

    const metadata = new chrome.cast.media.MusicTrackMediaMetadata();
    metadata.metadataType = chrome.cast.media.MetadataType.MUSIC_TRACK;
    metadata.title = track.title || ('Track ' + (index + 1));
    metadata.artist = (albumMeta && albumMeta.artist) || 'The Shady River Bard';
    metadata.albumName = (albumMeta && albumMeta.title) || "Sanity's Edge";
    metadata.trackNumber = track.track_number || (index + 1);

    // Track-specific artwork or fallback album cover
    const coverPath = track.art_square || track.art || track.image || track.cover ||
      (albumMeta && (albumMeta.master_cover_art || albumMeta.cover_art || albumMeta.cover)) ||
      'assets/art/sanitys-edge-cover.jpg';

    if (coverPath) {
      const coverUrl = toAbsoluteUrl(coverPath);
      const castImg = new chrome.cast.Image(coverUrl);
      castImg.width = 720;
      castImg.height = 720;
      metadata.images = [castImg];
    }

    mediaInfo.metadata = metadata;
    mediaInfo.customData = {
      trackIndex: index,
      trackNumber: track.track_number || (index + 1),
      title: track.title,
      audioUrl: audioUrl
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
              break;
            case cast.framework.SessionState.SESSION_ENDED:
              currentSession = null;
              isConnected = false;
              onConnectedChanged();
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
  function loadTrackOnReceiver(trackIndex) {
    const castContext = cast.framework.CastContext.getInstance();
    currentSession = castContext.getCurrentSession();

    if (!currentSession) {
      console.warn('[CastManager] No active Cast session to load media');
      return;
    }

    activeTracks = (activeTracks && activeTracks.length) ? activeTracks : ((window.ALBUM_DATA && window.ALBUM_DATA.tracks) || []);
    activeAlbumMeta = activeAlbumMeta || window.ALBUM_DATA || null;

    if (!activeTracks[trackIndex]) {
      console.warn('[CastManager] Invalid track index to load:', trackIndex);
      return;
    }

    activeTrackIndex = trackIndex;
    pauseLocalAudio();

    const track = activeTracks[trackIndex];
    const mediaInfo = buildMediaInfo(track, activeAlbumMeta, trackIndex);

    const loadRequest = new chrome.cast.media.LoadRequest(mediaInfo);
    loadRequest.autoplay = true;
    loadRequest.currentTime = 0;

    console.log(`[CastManager] Streaming to Google TV: "${track.title}" (${mediaInfo.contentUrl})...`);

    currentSession.loadMedia(loadRequest).then((res) => {
      console.log('[CastManager] loadMedia completed. Result:', res);
      if (res) {
        console.warn('[CastManager] Receiver returned loadMedia response:', res);
      } else {
        console.log(`[CastManager] Successfully playing Track ${trackIndex + 1} on ${deviceName}`);
      }
      emit('trackChange', activeTrackIndex);
      updateAllCastUI();
      notifyState();
    }).catch(err => {
      console.error('[CastManager] loadMedia failed:', err);
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
      castContext.requestSession().then(() => {
        currentSession = castContext.getCurrentSession();
        isConnected = true;
        onConnectedChanged();
        loadTrackOnReceiver(trackIndex);
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
   * Skip to next track with auto-advance
   */
  function nextTrack() {
    if (!isConnected) return;
    if (activeTrackIndex + 1 < activeTracks.length) {
      loadTrackOnReceiver(activeTrackIndex + 1);
    }
  }

  /**
   * Return to previous track or restart current
   */
  function prevTrack() {
    if (!isConnected) return;
    if (remotePlayer && remotePlayer.currentTime > 4) {
      seek(0);
      return;
    }
    if (activeTrackIndex - 1 >= 0) {
      loadTrackOnReceiver(activeTrackIndex - 1);
    }
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
      const curIdx = typeof window.currentTrackIndex === 'number' && window.currentTrackIndex >= 0 ? window.currentTrackIndex : 0;
      window.castTrack(curIdx);
    }
  };

})();
