/**
 * ============================================================================
 * THE SHADY RIVER BARD - GOOGLE CAST CONTROLLER & AUDIO STREAMER
 * ============================================================================
 * Implements native Google Cast Web Sender SDK integration for the portal:
 * - Default Media Receiver (CC1AD845) with rich track metadata & bespoke 720p artwork
 * - ORIGIN_SCOPED auto-join policy for seamless persistence across pages
 * - initiateSessionPlayback: Single-flight guarantee (never missed, never duplicated)
 * - Resilient connection state tracking (checkIsConnected) - no false disconnects
 * - Native progressive audio/mp3 streaming (omits streamType BUFFERED to prevent MSE failure)
 * - Strictly serialized, concurrency-safe loadMedia requests (prevents collision hangs)
 * - Safe receiver cold-boot timing buffer (400ms) for Google TV app mount
 * - Automatic hands-free continuous track advance on remote track completion
 * - Bidirectional remote playback, track navigation, & timeline sync
 * - On-screen visual feedback toast & live status badge
 */

(function () {
  'use strict';

  // Registry of all Audio instances created on the page to guarantee silence during Cast
  const activeAudioInstances = new Set();
  const OrigAudio = window.Audio;
  if (OrigAudio) {
    window.Audio = function (...args) {
      const inst = new OrigAudio(...args);
      activeAudioInstances.add(inst);
      return inst;
    };
    window.Audio.prototype = OrigAudio.prototype;
  }

  // Internal state
  let isApiAvailable = false;
  let isConnected = false;
  let isMediaLoading = false;
  let loadSequence = 0;
  let sessionLoadedMediaId = null;
  let remotePlayer = null;
  let remotePlayerController = null;
  let currentSession = null;
  let deviceName = '';
  let activeTrackIndex = -1;
  let pendingTrackIndex = null;
  let activeTracks = [];
  let activeAlbumMeta = null;
  let toastTimeout = null;
  let mediaLoadTimeout = null;
  let isUserInitiatedRequest = false;
  let lastToggleTime = 0;
  let lastKnownTime = 0;
  let lastKnownDuration = 0;
  const debugLogs = [];

  // Safe PlayerState enum (Google Cast Web SDK CAF sender does not expose PlayerState on cast.framework)
  const CastPlayerState = {
    IDLE: 'IDLE',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    BUFFERING: 'BUFFERING'
  };

  const eventListeners = {
    stateChange: [],
    trackChange: [],
    timeUpdate: [],
    connected: [],
    disconnected: []
  };

  function isDebugEnabled() {
    try {
      if (window.CAST_DEBUG === true) return true;
      if (typeof window.location !== 'undefined' && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        if (params.get('debug') === 'cast' || params.get('cast_debug') === 'true') return true;
      }
      if (typeof localStorage !== 'undefined' && localStorage.getItem('SRB_CAST_DEBUG') === 'true') {
        return true;
      }
    } catch (e) {}
    return false;
  }

  function applyDebugVisibility() {
    const isEnabled = isDebugEnabled();
    let style = document.getElementById('srb-cast-debug-hide');
    if (!isEnabled) {
      if (!style) {
        style = document.createElement('style');
        style.id = 'srb-cast-debug-hide';
        style.textContent = '#cast-debug-pill { display: none !important; }';
        (document.head || document.documentElement).appendChild(style);
      }
      const pill = document.getElementById('cast-debug-pill');
      if (pill) {
        pill.style.display = 'none';
      }
    } else {
      if (style) {
        style.remove();
      }
      const pill = document.getElementById('cast-debug-pill');
      if (pill) {
        pill.style.display = 'flex';
      }
    }
  }

  // Ensure diagnostics pill is hidden by default immediately on arrival
  applyDebugVisibility();

  function logDebug(msg) {
    const time = new Date().toLocaleTimeString();
    const formatted = `[${time}] ${msg}`;
    debugLogs.push(formatted);
    if (debugLogs.length > 20) debugLogs.shift();
    console.log('[CastManager]', msg);
    updateDebugPill(msg);
  }

  function updateDebugPill(latestMsg) {
    applyDebugVisibility();
    if (!isDebugEnabled()) return;

    let pill = document.getElementById('cast-debug-pill');
    if (!pill) {
      if (!document.body) return; // Guard: script executed in <head> before <body>
      pill = document.createElement('div');
      pill.id = 'cast-debug-pill';
      pill.className = 'fixed bottom-24 left-6 z-50 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-sky-400/40 text-sky-400 font-mono text-[11px] shadow-2xl backdrop-blur-md cursor-pointer flex items-center gap-2 hover:border-sky-400 transition-colors';
      pill.title = 'Click to view Cast diagnostics';
      pill.onclick = showDebugModal;
      document.body.appendChild(pill);
    }

    pill.style.display = 'flex';

    const iconSpan = document.getElementById('cast-debug-pill-icon');
    const devSpan = document.getElementById('cast-debug-pill-dev');
    const msgSpan = document.getElementById('cast-debug-pill-msg');

    const iconColor = isConnected ? '#10b981' : '#64748b';
    const iconSymbol = isConnected ? '●' : '○';
    const dev = deviceName || (isConnected ? 'Connected' : 'Cast Standby');
    const msg = latestMsg || 'Ready';

    if (iconSpan && devSpan && msgSpan) {
      iconSpan.style.color = iconColor;
      iconSpan.textContent = iconSymbol;
      devSpan.textContent = dev;
      msgSpan.textContent = msg;
    } else {
      pill.innerHTML = `<span style="color:${iconColor};">${iconSymbol}</span> <span style="color:#f1f5f9;font-weight:600;">Cast:</span> <span style="color:#38bdf8;">${dev}</span> <span style="color:#64748b;">|</span> <span style="color:#94a3b8;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${msg}</span>`;
    }
  }

  function showDebugModal() {
    if (!document.body) return;
    let modal = document.getElementById('cast-debug-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cast-debug-modal';
      modal.style.position = 'fixed';
      modal.style.inset = '0';
      modal.style.zIndex = '999999';
      modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.padding = '16px';
      modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

      const content = document.createElement('div');
      content.id = 'cast-debug-content';
      content.style.backgroundColor = '#0f172a';
      content.style.border = '1px solid #38bdf8';
      content.style.borderRadius = '12px';
      content.style.padding = '20px';
      content.style.maxWidth = '600px';
      content.style.width = '100%';
      content.style.maxHeight = '80vh';
      content.style.overflowY = 'auto';
      content.style.fontFamily = 'monospace';
      content.style.fontSize = '12px';
      content.style.color = '#e2e8f0';
      content.onclick = (e) => e.stopPropagation();

      modal.appendChild(content);
      document.body.appendChild(modal);
    }

    const content = document.getElementById('cast-debug-content');
    content.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid #334155;padding-bottom:8px;">
        <span style="font-weight:bold;color:#38bdf8;font-size:14px;">Google Cast Diagnostics</span>
        <button onclick="document.getElementById('cast-debug-modal').style.display='none'" style="color:#94a3b8;background:none;border:none;cursor:pointer;font-size:16px;">✕</button>
      </div>
      <div style="margin-bottom:10px;line-height:1.6;">
        <div><strong>Cast API:</strong> ${isApiAvailable ? 'Available' : 'Pending/Unavailable'}</div>
        <div><strong>Connected:</strong> ${checkIsConnected() ? 'YES' : 'NO'} (${deviceName || 'None'})</div>
        <div><strong>Active Track:</strong> ${activeTrackIndex >= 0 ? 'Track ' + (activeTrackIndex + 1) : 'None'}</div>
        <div><strong>Remote Player State:</strong> ${remotePlayer ? remotePlayer.playerState : 'N/A'} (idleReason: ${remotePlayer ? remotePlayer.idleReason : 'N/A'})</div>
        <div><strong>Current Time / Duration:</strong> ${remotePlayer ? remotePlayer.currentTime.toFixed(1) : 0}s / ${remotePlayer ? remotePlayer.duration.toFixed(1) : 0}s</div>
      </div>
      <div style="font-weight:bold;color:#f59e0b;margin-bottom:6px;">Event Log (Last 20):</div>
      <div style="background:#020617;padding:10px;border-radius:6px;max-height:220px;overflow-y:auto;line-height:1.5;color:#cbd5e1;font-size:11px;">
        ${debugLogs.map(l => `<div>${l}</div>`).join('')}
      </div>
      <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;">
        <button onclick="window.castTrack(0)" style="padding:6px 12px;background:#0284c7;color:white;border:none;border-radius:6px;cursor:pointer;font-size:11px;">Test Cast Track 1</button>
        <button onclick="if(window.CastManager && window.CastManager.getDiagnostics){navigator.clipboard.writeText(JSON.stringify(window.CastManager.getDiagnostics(),null,2)).then(()=>alert('Diagnostics copied! Paste in chat.'))}else{alert('Diagnostics not ready');}" style="padding:6px 12px;background:#059669;color:white;border:none;border-radius:6px;cursor:pointer;font-size:11px;">Copy Diagnostics</button>
        <button onclick="document.getElementById('cast-debug-modal').style.display='none'" style="padding:6px 12px;background:#334155;color:white;border:none;border-radius:6px;cursor:pointer;font-size:11px;">Close</button>
      </div>
    `;

    modal.style.display = 'flex';
  }

  /**
   * On-screen Toast notification system for instant Cast feedback
   */
  function showToast(message, type = 'info', durationMs = 5000) {
    logDebug(`Toast (${type}): ${message}`);
    if (!document.body) return;
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
   */
  function toAbsoluteUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith('//')) return window.location.protocol + path;

    try {
      let base = document.baseURI || window.location.href;
      base = base.split('?')[0].split('#')[0];
      if (!base.endsWith('/') && !/\/[^/]+\.[a-zA-Z0-9]+$/.test(base)) {
        base += '/';
      }
      return new URL(path, base).href;
    } catch (e) {
      console.warn('[CastManager] URL resolve error:', path, e);
      return path;
    }
  }

  /**
   * Determine true connection state with Google Cast framework.
   * Robust against RemotePlayer connection event delays.
   */
  function checkIsConnected() {
    if (!window.cast || !window.cast.framework) return false;
    try {
      const castContext = cast.framework.CastContext.getInstance();
      const session = castContext.getCurrentSession();
      if (session && session.getSessionId && session.getSessionId()) {
        const sessionState = castContext.getSessionState ? castContext.getSessionState() : null;
        if (sessionState !== cast.framework.SessionState.SESSION_ENDING &&
            sessionState !== cast.framework.SessionState.SESSION_ENDED) {
          if (!deviceName && session.getCastDevice && session.getCastDevice()) {
            const castDev = session.getCastDevice();
            if (castDev && castDev.friendlyName) deviceName = castDev.friendlyName;
          }
          return true;
        }
      }
      if (castContext.getCastState && castContext.getCastState() === cast.framework.CastState.CONNECTED) {
        return true;
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
   * Universal resolution for current album data and tracks across any incubator album.
   */
  function getActiveAlbumData() {
    if (activeAlbumMeta) return activeAlbumMeta;
    return window.ALBUM_DATA ||
           window.FORGOTTEN_CROWN_DATA ||
           window.HEAVY_LOAD_DATA ||
           window.PLEONEXIA_DATA ||
           window.RED_WHITE_ROBBED_DATA ||
           window.NEW_GODS_DATA ||
           window.SONGS_FROM_SMOKE_DATA ||
           window.GOLDEN_MIRRORS_DATA ||
           null;
  }

  function getActiveTracks() {
    if (activeTracks && activeTracks.length) return activeTracks;
    const data = getActiveAlbumData();
    if (data) {
      if (Array.isArray(data.tracks)) return data.tracks;
      if (data.album && Array.isArray(data.album.tracks)) return data.album.tracks;
    }
    return [];
  }

  /**
   * Build MediaInfo for Google Cast Default Media Receiver.
   * - Uses audio/mpeg MIME type matching server Content-Type and Google Cast spec
   * - Sets StreamType.BUFFERED (required for Default Media Receiver audio player)
   * - Supports MusicTrackMediaMetadata with GenericMediaMetadata fallback
   */
  function buildMediaInfo(track, albumMeta, index, forceGeneric = false) {
    const rawAudio = track.audio_file || track.audioFile || track.audio_url || track.src || track.streamUrl || track.file || track.audio || track.url || '';
    const audioUrl = toAbsoluteUrl(rawAudio);

    const mediaInfo = new chrome.cast.media.MediaInfo(audioUrl, 'audio/mpeg');
    mediaInfo.contentUrl = audioUrl;
    mediaInfo.contentId = audioUrl;
    mediaInfo.contentType = 'audio/mpeg';
    mediaInfo.streamType = (window.chrome && chrome.cast && chrome.cast.media && chrome.cast.media.StreamType && chrome.cast.media.StreamType.BUFFERED) || 'BUFFERED';
    mediaInfo.customData = { trackIndex: index };

    const activeData = albumMeta || getActiveAlbumData() || {};
    const metaAlbum = activeData.album || activeData;
    const albumTitle = (metaAlbum && (metaAlbum.title || metaAlbum.albumTitle || metaAlbum.workingTitle)) || (document.title ? document.title.split('|')[0].trim() : "Sanity's Edge");
    const artist = (metaAlbum && metaAlbum.artist) || 'The Shady River Bard';
    const trackTitle = track.title || track.name || ('Track ' + (index + 1));
    const trackNum = track.track_number || track.number || (index + 1);

    // 1. Bespoke Track Artwork (720x720) - displayed in primary/large view
    const trackCoverPath = track.art_square || track.art_file || track.artFile || track.art || track.image || track.cover ||
      (metaAlbum && (metaAlbum.master_cover_art || metaAlbum.cover_art || metaAlbum.coverImage || metaAlbum.cover)) ||
      'assets/art/album-cover.jpg';
    const trackCoverUrl = toAbsoluteUrl(trackCoverPath);

    // 2. Master Album Cover Artwork - displayed in top-right thumbnail
    const albumCoverPath = (metaAlbum && (metaAlbum.master_cover_art || metaAlbum.cover_art || metaAlbum.coverImage || metaAlbum.cover)) ||
      trackCoverPath;
    const albumCoverUrl = toAbsoluteUrl(albumCoverPath);

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
      // Google TV DMR card renders Line 1: title, Line 2: artist.
      // Incorporating albumTitle into artist ensures Album Name appears directly on the 1/6 card!
      metadata.artist = `${albumTitle} • ${artist}`;
      metadata.albumArtist = artist;
      metadata.albumName = albumTitle;
      metadata.trackNumber = trackNum;
    }

    // Support display preference: show master album cover if window.CAST_SHOW_ALBUM_ART is true
    const chosenArtUrl = (window.CAST_SHOW_ALBUM_ART === true) ? albumCoverUrl : (trackCoverUrl || albumCoverUrl);
    const safeCastArtUrl = chosenArtUrl ? chosenArtUrl.replace(/\.webp($|\?)/i, '.jpg$1') : '';
    if (safeCastArtUrl) {
      const castImg = new chrome.cast.Image(safeCastArtUrl);
      castImg.width = 720;
      castImg.height = 720;
      metadata.images = [castImg];
    }

    mediaInfo.metadata = metadata;
    return mediaInfo;
  }

  /**
   * Single-flight session playback initializer.
   * Both SESSION_STARTED and requestSession().then() call this,
   * but it is guaranteed to execute only once per connected session.
   */
  function initiateSessionPlayback(trackIdx, triggerSource) {
    const castContext = cast.framework.CastContext.getInstance();
    currentSession = castContext.getCurrentSession();

    if (!currentSession) {
      logDebug(`initiateSessionPlayback (${triggerSource}) skipped: no active session`);
      return;
    }

    const sessionId = (currentSession.getSessionId && currentSession.getSessionId()) || 'current_session';
    if (sessionLoadedMediaId === sessionId) {
      logDebug(`initiateSessionPlayback (${triggerSource}) ignored: already initiated for session ${sessionId}`);
      return;
    }
    sessionLoadedMediaId = sessionId;

    isConnected = true;
    const castDevice = currentSession.getCastDevice();
    deviceName = (castDevice && castDevice.friendlyName) ? castDevice.friendlyName : 'Google TV';
    logDebug(`Session established with ${deviceName} (via ${triggerSource}). Cueing Track ${trackIdx + 1}`);

    pauseLocalAudio();
    onConnectedChanged();
    showToast(`Connected to ${deviceName}. Loading track...`, 'info', 3500);

    // 500ms buffer gives Google TV receiver DOM & audio player time to mount cleanly
    setTimeout(() => {
      loadTrackOnReceiver(trackIdx);
    }, 500);
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

      // Connection event
      remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        () => {
          logDebug(`RemotePlayer isConnected changed: ${remotePlayer.isConnected}`);
          onConnectedChanged();
        }
      );

      // Playback state (PLAYING, PAUSED, IDLE, BUFFERING)
      remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
        onPlayerStateChanged
      );

      // Media info change
      remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,
        onMediaInfoChanged
      );

      // Current time update
      remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,
        onCurrentTimeChanged
      );

      // Pause/play state toggle
      remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,
        () => { notifyState(); updateAllCastUI(); }
      );

      // CastContext session state transitions
      castContext.addEventListener(
        cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
        (event) => {
          logDebug(`SESSION_STATE_CHANGED: ${event.sessionState}`);
          switch (event.sessionState) {
            case cast.framework.SessionState.SESSION_STARTED:
            case cast.framework.SessionState.SESSION_RESUMED:
              isUserInitiatedRequest = false;
              const targetIdx = (pendingTrackIndex !== null && pendingTrackIndex >= 0)
                ? pendingTrackIndex
                : ((typeof window.currentTrackIndex === 'number' && window.currentTrackIndex >= 0) ? window.currentTrackIndex : 0);
              pendingTrackIndex = null;
              initiateSessionPlayback(targetIdx, 'SESSION_STATE_CHANGED');
              break;

            case cast.framework.SessionState.SESSION_START_FAILED:
              logDebug('SESSION_START_FAILED');
              if (isUserInitiatedRequest) {
                showToast('Cast connection failed. Please check device and try again.', 'error', 4500);
              }
              isUserInitiatedRequest = false;
              pendingTrackIndex = null;
              isMediaLoading = false;
              sessionLoadedMediaId = null;
              onConnectedChanged();
              break;

            case cast.framework.SessionState.SESSION_ENDED:
              logDebug('SESSION_ENDED');
              currentSession = null;
              isConnected = false;
              isMediaLoading = false;
              sessionLoadedMediaId = null;
              pendingTrackIndex = null;
              onConnectedChanged();
              showToast('Cast session ended', 'info', 3000);
              break;
          }
        }
      );

      // Restore if session already exists
      currentSession = castContext.getCurrentSession();
      if (currentSession) {
        isConnected = checkIsConnected();
        if (isConnected) {
          onConnectedChanged();
        }
      }

      isApiAvailable = true;
      logDebug('Google Cast framework initialized');
    } catch (e) {
      console.error('[CastManager] Initialization failed:', e);
      logDebug(`Init error: ${e.message}`);
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
      pauseLocalAudio();
      emit('connected', { deviceName });
      updateAllCastUI();
    } else if (!isConnected) {
      deviceName = '';
      activeTrackIndex = -1;
      isMediaLoading = false;
      sessionLoadedMediaId = null;
      emit('disconnected', {});
      updateAllCastUI();
    }

    notifyState();
  }

  function onPlayerStateChanged() {
    if (!remotePlayer) return;

    const state = remotePlayer.playerState;
    const mediaSession = (currentSession && currentSession.getMediaSession) ? currentSession.getMediaSession() : null;
    const idleReason = (mediaSession && mediaSession.idleReason) || remotePlayer.idleReason || '';
    const curTime = remotePlayer.currentTime || 0;
    const duration = remotePlayer.duration || 0;
    logDebug(`PlayerState: ${state} (idleReason: ${idleReason || 'none'}, time: ${curTime.toFixed(1)}s / ${duration.toFixed(1)}s, lastKnown: ${lastKnownTime.toFixed(1)}s / ${lastKnownDuration.toFixed(1)}s)`);

    // Any active playback or buffering means media load has succeeded
    if (state === CastPlayerState.PLAYING || state === CastPlayerState.BUFFERING) {
      isMediaLoading = false;
      if (mediaLoadTimeout) {
        clearTimeout(mediaLoadTimeout);
        mediaLoadTimeout = null;
      }
    }

    if (state === CastPlayerState.IDLE) {
      isMediaLoading = false;
      if (mediaLoadTimeout) {
        clearTimeout(mediaLoadTimeout);
        mediaLoadTimeout = null;
      }
      const isFinished = (idleReason === 'FINISHED') ||
                         (lastKnownDuration > 10 && lastKnownTime >= (lastKnownDuration - 5)) ||
                         (duration > 0 && curTime >= (duration - 3));

      if (isFinished) {
        logDebug('Track finished playing on TV receiver');
        lastKnownTime = 0;
        lastKnownDuration = 0;
        activeTracks = getActiveTracks();
        if (activeTrackIndex >= 0 && activeTrackIndex < activeTracks.length - 1) {
          const nextIdx = activeTrackIndex + 1;
          logDebug(`Auto-advancing to Track ${nextIdx + 1}`);
          showToast(`Next: ${activeTracks[nextIdx]?.title || 'Track ' + (nextIdx + 1)}`, 'info', 3000);
          loadTrackOnReceiver(nextIdx);
        }
      } else if (idleReason === 'ERROR') {
        logDebug('Receiver reported ERROR state');
        showToast('Playback error on TV (Receiver reported error)', 'error', 5000);
      }
    }

    updateAllCastUI();
    notifyState();
  }

  function onMediaInfoChanged() {
    if (!remotePlayer || !remotePlayer.mediaInfo) return;

    const mediaInfo = remotePlayer.mediaInfo;
    let detectedIndex = -1;
    if (mediaInfo.customData && typeof mediaInfo.customData.trackIndex === 'number') {
      detectedIndex = mediaInfo.customData.trackIndex;
    } else {
      const tracks = getActiveTracks();
      if (tracks.length > 0) {
        const contentId = mediaInfo.contentId || '';
        const title = (mediaInfo.metadata && mediaInfo.metadata.title) || '';
        detectedIndex = tracks.findIndex(t => {
          const rawA = t.audio_file || t.audioFile || t.audio_url || t.src || t.streamUrl || t.file || t.audio || t.url || '';
          const fullUrl = toAbsoluteUrl(rawA);
          return (fullUrl && fullUrl === contentId) || (t.title && t.title === title);
        });
      }
    }

    if (detectedIndex !== -1 && detectedIndex !== activeTrackIndex) {
      activeTrackIndex = detectedIndex;
      logDebug(`Active track on TV: Track ${activeTrackIndex + 1} (${activeTracks[activeTrackIndex]?.title || ''})`);
      emit('trackChange', activeTrackIndex);
      updateAllCastUI();
    }

    notifyState();
  }

  function onCurrentTimeChanged() {
    if (!remotePlayer) return;
    const curTime = remotePlayer.currentTime || 0;
    const duration = remotePlayer.duration || 0;
    if (curTime > 0) lastKnownTime = curTime;
    if (duration > 0) lastKnownDuration = duration;
    emit('timeUpdate', { currentTime: curTime, duration });
  }

  function pauseLocalAudio() {
    // 1. DOM audio elements
    const audios = document.querySelectorAll('audio');
    audios.forEach(a => {
      try {
        if (!a.paused) {
          a.pause();
        }
      } catch (e) {}
    });

    // 2. Tracked JS Audio instances
    activeAudioInstances.forEach(a => {
      try {
        if (a && !a.paused) {
          a.pause();
        }
      } catch (e) {}
    });

    // 3. Known global audio instances
    if (window.audio && typeof window.audio.pause === 'function') {
      try {
        if (!window.audio.paused) window.audio.pause();
      } catch (e) {}
    }
    if (window._appAudio && typeof window._appAudio.pause === 'function') {
      try {
        if (!window._appAudio.paused) window._appAudio.pause();
      } catch (e) {}
    }
  }

  /**
   * Load and stream an individual track directly onto Google TV.
   */
  function loadTrackOnReceiver(trackIndex, seekTime = 0, isRetry = false) {
    const castContext = cast.framework.CastContext.getInstance();
    currentSession = castContext.getCurrentSession();
    isConnected = checkIsConnected();

    if (!currentSession) {
      logDebug(`loadTrackOnReceiver: No active session. Storing pending track ${trackIndex + 1}`);
      pendingTrackIndex = trackIndex;
      showToast('Connecting to Cast device...', 'info', 4000);
      return;
    }

    if (isMediaLoading && !isRetry) {
      if (trackIndex === activeTrackIndex) {
        logDebug(`loadTrackOnReceiver: Track ${trackIndex + 1} already loading`);
        return;
      }
      logDebug(`loadTrackOnReceiver: Preempting in-flight load for new Track ${trackIndex + 1}`);
      isMediaLoading = false;
      if (mediaLoadTimeout) {
        clearTimeout(mediaLoadTimeout);
        mediaLoadTimeout = null;
      }
    }

    activeTracks = (activeTracks && activeTracks.length) ? activeTracks : getActiveTracks();
    activeAlbumMeta = activeAlbumMeta || getActiveAlbumData();

    if (!activeTracks || !activeTracks[trackIndex]) {
      logDebug(`loadTrackOnReceiver: Invalid track index ${trackIndex}`);
      return;
    }

    isMediaLoading = true;
    const currentSeq = ++loadSequence;
    activeTrackIndex = trackIndex;
    window.currentTrackIndex = trackIndex;
    lastKnownTime = 0;
    lastKnownDuration = 0;
    pauseLocalAudio();

    // 4-second safety watchdog: ensures isMediaLoading never stays permanently locked
    if (mediaLoadTimeout) clearTimeout(mediaLoadTimeout);
    mediaLoadTimeout = setTimeout(() => {
      if (isMediaLoading && currentSeq === loadSequence) {
        logDebug(`[Seq ${currentSeq}] Watchdog: loadMedia promise timed out after 4s - releasing lock`);
        isMediaLoading = false;
        if (pendingTrackIndex !== null && pendingTrackIndex !== activeTrackIndex) {
          const nextIdx = pendingTrackIndex;
          pendingTrackIndex = null;
          loadTrackOnReceiver(nextIdx);
        }
      }
    }, 4000);

    const track = activeTracks[trackIndex];
    const mediaInfo = buildMediaInfo(track, activeAlbumMeta, trackIndex, isRetry);

    const loadRequest = new chrome.cast.media.LoadRequest(mediaInfo);
    loadRequest.autoplay = true;
    loadRequest.currentTime = seekTime || 0;

    const dev = deviceName || 'Google TV';
    logDebug(`[Seq ${currentSeq}] Streaming to ${dev}: "${track.title}" -> ${mediaInfo.contentUrl}`);
    showToast(`Streaming "${track.title}" to ${dev}...`, 'info', 4000);
    try {
      updateAllCastUI();
    } catch (uiErr) {
      console.warn('[CastManager] Non-fatal UI update error before loadMedia:', uiErr);
    }

    currentSession.loadMedia(loadRequest).then((res) => {
      if (mediaLoadTimeout) {
        clearTimeout(mediaLoadTimeout);
        mediaLoadTimeout = null;
      }
      isMediaLoading = false;
      if (currentSeq !== loadSequence) {
        logDebug(`[Seq ${currentSeq}] Stale load response ignored`);
        return;
      }

      if (res && typeof res === 'string') {
        logDebug(`[Seq ${currentSeq}] loadMedia resolved with code: ${res}`);
        if (res === 'cancel') {
          logDebug('Load request cancelled');
        } else {
          showToast(`Cast notice: ${res}`, 'warn', 4000);
        }
        return;
      }

      logDebug(`[Seq ${currentSeq}] ✓ loadMedia succeeded for Track ${trackIndex + 1} on ${dev}`);
      showToast(`✓ Playing "${track.title}" on ${dev}`, 'success', 5000);
      emit('trackChange', activeTrackIndex);
      updateAllCastUI();
      notifyState();

      if (pendingTrackIndex !== null && pendingTrackIndex !== activeTrackIndex) {
        const nextIdx = pendingTrackIndex;
        pendingTrackIndex = null;
        setTimeout(() => loadTrackOnReceiver(nextIdx), 250);
      }
    }).catch(err => {
      if (mediaLoadTimeout) {
        clearTimeout(mediaLoadTimeout);
        mediaLoadTimeout = null;
      }
      isMediaLoading = false;
      if (currentSeq !== loadSequence) return;

      logDebug(`[Seq ${currentSeq}] loadMedia failed: ${JSON.stringify(err)}`);
      const errStr = (err && (err.description || err.message || err.name)) || (typeof err === 'string' ? err : 'Media load error');

      if (!isRetry && err !== 'cancel') {
        logDebug('Primary load failed, retrying in 500ms with generic metadata...');
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
    if (!window.cast || !window.cast.framework) {
      logDebug('castTrack called but Google Cast framework is not yet available');
      showToast('Google Cast is initializing, please try again in a moment...', 'info', 3000);
      return;
    }

    activeTracks = (tracks && tracks.length) ? tracks : activeTracks;
    activeAlbumMeta = albumMeta || activeAlbumMeta;

    const castContext = cast.framework.CastContext.getInstance();
    currentSession = castContext.getCurrentSession();
    isConnected = checkIsConnected();

    if (isConnected && currentSession) {
      logDebug(`Already connected to ${deviceName || 'Google TV'}. Loading track ${trackIndex + 1}`);
      loadTrackOnReceiver(trackIndex);
      updateAllCastUI();
    } else {
      pendingTrackIndex = trackIndex;
      isUserInitiatedRequest = true;

      const sessionState = castContext.getSessionState ? castContext.getSessionState() : null;
      if (sessionState === cast.framework.SessionState.SESSION_STARTING) {
        logDebug('Session is currently starting; waiting for connection to complete');
        showToast('Connecting to Google TV...', 'info', 4000);
        return;
      }

      showToast('Select your Google TV or Chromecast...', 'info', 5000);

      castContext.requestSession().then(() => {
        logDebug('requestSession picker resolved');
        isUserInitiatedRequest = false;
        const target = (pendingTrackIndex !== null && pendingTrackIndex >= 0) ? pendingTrackIndex : trackIndex;
        pendingTrackIndex = null;
        initiateSessionPlayback(target, 'REQUEST_SESSION_THEN');
      }).catch(err => {
        isUserInitiatedRequest = false;
        pendingTrackIndex = null;
        isMediaLoading = false;
        const isCancel = err === 'cancel' || err === 'cancel_session_request' || (err && (err.code === 'cancel' || err.message === 'cancel'));
        if (!isCancel) {
          logDebug(`Cast session request rejected/cancelled: ${JSON.stringify(err)}`);
          showToast('Cast request cancelled or unavailable', 'warn', 3000);
        } else {
          logDebug('Cast session picker dismissed by user');
        }
      });
    }
  }

  /**
   * Play / Pause toggle on remote receiver
   */
  function playOrPause() {
    isConnected = checkIsConnected();
    if (isConnected) {
      if (remotePlayer && (remotePlayer.playerState === CastPlayerState.PLAYING || remotePlayer.playerState === CastPlayerState.PAUSED)) {
        if (remotePlayerController) {
          remotePlayerController.playOrPause();
        }
      } else {
        const curIdx = (typeof activeTrackIndex === 'number' && activeTrackIndex >= 0)
          ? activeTrackIndex
          : ((typeof window.currentTrackIndex === 'number' && window.currentTrackIndex >= 0) ? window.currentTrackIndex : 0);
        logDebug(`playOrPause invoked while idle. Loading track ${curIdx + 1}`);
        loadTrackOnReceiver(curIdx);
      }
    }
  }

  function seek(timeInSeconds) {
    if (remotePlayer && remotePlayerController && checkIsConnected()) {
      remotePlayer.currentTime = timeInSeconds;
      remotePlayerController.seek();
    }
  }

  function nextTrack() {
    if (!checkIsConnected()) return;
    activeTracks = getActiveTracks();
    if (!activeTracks || activeTracks.length === 0) return;
    let nextIdx = (activeTrackIndex >= 0 ? activeTrackIndex : 0) + 1;
    if (nextIdx >= activeTracks.length) nextIdx = 0;
    loadTrackOnReceiver(nextIdx);
  }

  function prevTrack() {
    if (!checkIsConnected()) return;
    activeTracks = getActiveTracks();
    if (!activeTracks || activeTracks.length === 0) return;
    if (remotePlayer && remotePlayer.currentTime > 4) {
      seek(0);
      return;
    }
    let prevIdx = (activeTrackIndex >= 0 ? activeTrackIndex : 0) - 1;
    if (prevIdx < 0) prevIdx = activeTracks.length - 1;
    loadTrackOnReceiver(prevIdx);
  }

  function setVolume(level) {
    if (remotePlayer && remotePlayerController && checkIsConnected()) {
      remotePlayer.volumeLevel = Math.max(0, Math.min(1, level));
      remotePlayerController.setVolumeLevel();
    }
  }

  function disconnect() {
    if (!checkIsConnected()) return;
    const targetDev = deviceName || 'TV';
    try {
      const castContext = cast.framework.CastContext.getInstance();
      castContext.endCurrentSession(true);
      showToast('Disconnected from ' + targetDev, 'info', 3000);
    } catch (e) {
      console.warn('[CastManager] Error during disconnect:', e);
    }
    // Force immediate local disconnect state so UI resets without waiting for framework callbacks
    isConnected = false;
    currentSession = null;
    deviceName = '';
    activeTrackIndex = -1;
    isMediaLoading = false;
    sessionLoadedMediaId = null;
    pendingTrackIndex = null;
    emit('disconnected', {});
    updateAllCastUI();
    notifyState();
  }

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
    const isPlaying = remotePlayer ? (remotePlayer.playerState === CastPlayerState.PLAYING) : false;
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
      if (!jukeboxCastBtn._hasCastListener) {
        jukeboxCastBtn._hasCastListener = true;
        jukeboxCastBtn.removeAttribute('onclick');
        jukeboxCastBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          window.toggleJukeboxCast();
        });
      }
      const label = document.getElementById('jukebox-cast-device');
      const castWord = document.getElementById('jukebox-cast-label');

      if (isConnected) {
        jukeboxCastBtn.classList.add('text-amber-400', 'border-amber-500/50', 'bg-amber-950/40');
        jukeboxCastBtn.classList.remove('text-stone-400');
        jukeboxCastBtn.setAttribute('title', `Connected to ${deviceName || 'Google TV'} (Click to disconnect)`);
        if (castWord) castWord.textContent = 'Casting:';
        if (label) {
          const pState = remotePlayer ? remotePlayer.playerState : '';
          let stateTag = '';
          if (pState === CastPlayerState.PLAYING) stateTag = ' • Playing';
          else if (pState === CastPlayerState.PAUSED) stateTag = ' • Paused';
          else if (pState === CastPlayerState.BUFFERING) stateTag = ' • Buffering';

          label.textContent = `${deviceName || 'Google TV'}${stateTag}`;
          label.classList.remove('hidden');
          label.style.display = 'inline-block';
        }
      } else {
        jukeboxCastBtn.classList.remove('text-amber-400', 'border-amber-500/50', 'bg-amber-950/40');
        jukeboxCastBtn.classList.add('text-stone-400');
        jukeboxCastBtn.setAttribute('title', 'Cast to Google TV');
        if (castWord) castWord.textContent = 'Cast';
        if (label) {
          label.classList.add('hidden');
          label.style.display = 'none';
        }
      }
    }

    updateDebugPill(isConnected ? `Connected: ${deviceName || 'Google TV'}` : 'Standby');
  }

  // Hook Google Cast framework bootstrap - MUST be defined globally
  window.__onGCastApiAvailable = function (isAvailable) {
    logDebug(`__onGCastApiAvailable called with: ${isAvailable}`);
    if (isAvailable) {
      initCast();
    }
  };

  // If already available on script arrival, init immediately
  if (window.cast && window.cast.framework) {
    initCast();
  }

  // Synchronize UI elements once DOM is fully parsed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateAllCastUI();
      updateDebugPill(isConnected ? `Connected: ${deviceName || 'Google TV'}` : 'Standby');
    });
  } else {
    updateAllCastUI();
    updateDebugPill(isConnected ? `Connected: ${deviceName || 'Google TV'}` : 'Standby');
  }

  function getDiagnostics() {
    const castContext = (window.cast && cast.framework && cast.framework.CastContext) ? cast.framework.CastContext.getInstance() : null;
    return {
      timestamp: new Date().toISOString(),
      isApiAvailable,
      isConnected: checkIsConnected(),
      deviceName: deviceName || 'None',
      activeTrackIndex,
      remotePlayer: remotePlayer ? {
        playerState: remotePlayer.playerState,
        idleReason: remotePlayer.idleReason,
        currentTime: remotePlayer.currentTime,
        duration: remotePlayer.duration,
        isConnected: remotePlayer.isConnected
      } : null,
      sessionState: castContext ? (castContext.getSessionState ? castContext.getSessionState() : 'N/A') : 'N/A',
      castState: castContext ? (castContext.getCastState ? castContext.getCastState() : 'N/A') : 'N/A',
      recentLogs: debugLogs
    };
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
    toggleSession: function () { window.toggleJukeboxCast(); },
    requestSession: function () { window.toggleJukeboxCast(); },
    toggleCast: function () { window.toggleJukeboxCast(); },
    updateAllCastUI,
    showToast,
    showDebugModal,
    getDiagnostics,
    on,
    isConnected: function () { return checkIsConnected(); },
    getDeviceName: function () { return deviceName || 'Google TV'; },
    getActiveTrackIndex: function () { return activeTrackIndex; },
    isAvailable: function () { return isApiAvailable; },
    toggleDebug: function (enable) {
      const current = isDebugEnabled();
      const target = typeof enable === 'boolean' ? enable : !current;
      try {
        if (target) {
          localStorage.setItem('SRB_CAST_DEBUG', 'true');
        } else {
          localStorage.removeItem('SRB_CAST_DEBUG');
        }
      } catch (e) {}
      window.CAST_DEBUG = target;
      applyDebugVisibility();
      if (target) {
        updateDebugPill('Debug enabled');
        showToast('Cast diagnostics enabled', 'info', 2500);
      } else {
        showToast('Cast diagnostics hidden', 'info', 2500);
      }
      return target;
    },
    showDebugPill: function () { return window.CastManager.toggleDebug(true); },
    hideDebugPill: function () { return window.CastManager.toggleDebug(false); },
    isDebugEnabled: isDebugEnabled
  };

  // Secret keyboard shortcut: Ctrl + Alt + D to toggle Cast diagnostics badge
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'd' || e.key === 'D')) {
      e.preventDefault();
      if (window.CastManager && window.CastManager.toggleDebug) {
        window.CastManager.toggleDebug();
      }
    }
  });

  // Helper shortcut for onclick handlers
  window.castTrack = function (index) {
    const tracks = getActiveTracks();
    const meta = getActiveAlbumData() || {};
    CastManager.castTrack(index, tracks, meta);
  };

  window.toggleJukeboxCast = function () {
    const now = Date.now();
    if (now - lastToggleTime < 500) return; // Debounce rapid click triggers
    lastToggleTime = now;

    if (CastManager.isConnected()) {
      CastManager.disconnect();
    } else {
      const curIdx = typeof window.currentTrackIndex === 'number' && window.currentTrackIndex >= 0 ? window.currentTrackIndex : 0;
      window.castTrack(curIdx);
    }
  };

})();
