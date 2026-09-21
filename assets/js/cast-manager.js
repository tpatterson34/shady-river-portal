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
  const debugLogs = [];

  const eventListeners = {
    stateChange: [],
    trackChange: [],
    timeUpdate: [],
    connected: [],
    disconnected: []
  };

  function logDebug(msg) {
    const time = new Date().toLocaleTimeString();
    const formatted = `[${time}] ${msg}`;
    debugLogs.push(formatted);
    if (debugLogs.length > 20) debugLogs.shift();
    console.log('[CastManager]', msg);
    updateDebugPill(msg);
  }

  function updateDebugPill(latestMsg) {
    let pill = document.getElementById('cast-debug-pill');
    if (!pill) {
      pill = document.createElement('div');
      pill.id = 'cast-debug-pill';
      pill.style.position = 'fixed';
      pill.style.bottom = '84px';
      pill.style.left = '20px';
      pill.style.zIndex = '999990';
      pill.style.backgroundColor = 'rgba(15, 23, 42, 0.92)';
      pill.style.border = '1px solid rgba(56, 189, 248, 0.35)';
      pill.style.borderRadius = '20px';
      pill.style.padding = '5px 14px';
      pill.style.fontFamily = 'monospace';
      pill.style.fontSize = '11px';
      pill.style.color = '#38bdf8';
      pill.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.7)';
      pill.style.display = 'flex';
      pill.style.alignItems = 'center';
      pill.style.gap = '8px';
      pill.style.cursor = 'pointer';
      pill.style.backdropFilter = 'blur(8px)';
      pill.style.webkitBackdropFilter = 'blur(8px)';
      pill.title = 'Click to view Cast diagnostics';
      pill.onclick = showDebugModal;
      document.body.appendChild(pill);
    }

    const icon = isConnected ? '<span style="color:#10b981;">●</span>' : '<span style="color:#64748b;">○</span>';
    const dev = deviceName || (isConnected ? 'Connected' : 'Cast Standby');
    pill.innerHTML = `${icon} <span style="color:#f1f5f9;font-weight:600;">Cast:</span> <span style="color:#38bdf8;">${dev}</span> <span style="color:#64748b;">|</span> <span style="color:#94a3b8;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${latestMsg || 'Ready'}</span>`;
  }

  function showDebugModal() {
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
      modal.onclick = () => { modal.style.display = 'none'; };

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
      <div style="margin-top:14px;display:flex;gap:10px;">
        <button onclick="window.castTrack(0)" style="padding:6px 12px;background:#0284c7;color:white;border:none;border-radius:6px;cursor:pointer;font-size:11px;">Test Cast Track 1</button>
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
      if (session) {
        const state = session.getSessionState();
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
   * - Uses audio/mp3 MIME type
   * - Omits streamType BUFFERED so Google TV uses native progressive audio decoding
   */
  function buildMediaInfo(track, albumMeta, index, forceMinimal = false) {
    const rawAudio = track.audio_file || track.src || track.streamUrl;
    const audioUrl = toAbsoluteUrl(rawAudio);

    const mediaInfo = new chrome.cast.media.MediaInfo(audioUrl, 'audio/mp3');
    mediaInfo.contentUrl = audioUrl;
    mediaInfo.contentId = audioUrl;
    mediaInfo.contentType = 'audio/mp3';

    if (forceMinimal) {
      return mediaInfo;
    }

    const albumTitle = (albumMeta && albumMeta.title) || "Sanity's Edge";
    const artist = (albumMeta && albumMeta.artist) || 'The Shady River Bard';
    const trackTitle = track.title || ('Track ' + (index + 1));
    const trackNum = track.track_number || (index + 1);

    const coverPath = track.art_square || track.art || track.image || track.cover ||
      (albumMeta && (albumMeta.master_cover_art || albumMeta.cover_art || albumMeta.cover)) ||
      'assets/art/sanitys-edge-cover.jpg';
    const coverUrl = toAbsoluteUrl(coverPath);

    const metadata = new chrome.cast.media.MusicTrackMediaMetadata();
    metadata.metadataType = chrome.cast.media.MetadataType.MUSIC_TRACK; // 3
    metadata.title = trackTitle;
    metadata.artist = artist;
    metadata.albumName = albumTitle;
    metadata.trackNumber = trackNum;

    if (coverUrl) {
      metadata.images = [new chrome.cast.Image(coverUrl)];
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

    const sessionId = currentSession.getSessionId() || 'current_session';
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

    // 400ms buffer gives Google TV receiver DOM & audio player time to mount cleanly
    setTimeout(() => {
      loadTrackOnReceiver(trackIdx);
    }, 400);
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
              const targetIdx = (pendingTrackIndex !== null && pendingTrackIndex >= 0)
                ? pendingTrackIndex
                : ((typeof window.currentTrackIndex === 'number' && window.currentTrackIndex >= 0) ? window.currentTrackIndex : 0);
              pendingTrackIndex = null;
              initiateSessionPlayback(targetIdx, 'SESSION_STATE_CHANGED');
              break;

            case cast.framework.SessionState.SESSION_START_FAILED:
              logDebug('SESSION_START_FAILED');
              showToast('Cast connection failed. Please try again.', 'error');
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
    const idleReason = remotePlayer.idleReason;
    logDebug(`PlayerState: ${state} (${idleReason || 'active'})`);

    if (state === cast.framework.PlayerState.IDLE) {
      isMediaLoading = false;
      if (idleReason === 'FINISHED') {
        logDebug('Track finished playing on TV receiver');
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
      logDebug(`loadTrackOnReceiver: Load in flight. Queuing track ${trackIndex + 1}`);
      pendingTrackIndex = trackIndex;
      return;
    }

    activeTracks = (activeTracks && activeTracks.length) ? activeTracks : ((window.ALBUM_DATA && window.ALBUM_DATA.tracks) || []);
    activeAlbumMeta = activeAlbumMeta || window.ALBUM_DATA || null;

    if (!activeTracks || !activeTracks[trackIndex]) {
      logDebug(`loadTrackOnReceiver: Invalid track index ${trackIndex}`);
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
    logDebug(`[Seq ${currentSeq}] Streaming to ${dev}: "${track.title}" -> ${mediaInfo.contentUrl}`);
    showToast(`Streaming "${track.title}" to ${dev}...`, 'info', 4000);
    updateAllCastUI();

    currentSession.loadMedia(loadRequest).then((res) => {
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
      isMediaLoading = false;
      if (currentSeq !== loadSequence) return;

      logDebug(`[Seq ${currentSeq}] loadMedia failed: ${JSON.stringify(err)}`);
      const errStr = (err && (err.description || err.message || err.name)) || (typeof err === 'string' ? err : 'Media load error');

      if (!isRetry && err !== 'cancel') {
        logDebug('Primary load failed, retrying in 500ms with minimal media payload...');
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
      logDebug(`Already connected to ${deviceName || 'Google TV'}. Loading track ${trackIndex + 1}`);
      loadTrackOnReceiver(trackIndex);
      updateAllCastUI();
    } else {
      pendingTrackIndex = trackIndex;
      showToast('Select your Google TV or Chromecast...', 'info', 5000);

      castContext.requestSession().then(() => {
        logDebug('requestSession picker resolved');
        const target = (pendingTrackIndex !== null && pendingTrackIndex >= 0) ? pendingTrackIndex : trackIndex;
        pendingTrackIndex = null;
        initiateSessionPlayback(target, 'REQUEST_SESSION_THEN');
      }).catch(err => {
        pendingTrackIndex = null;
        isMediaLoading = false;
        if (err !== 'cancel') {
          logDebug(`Cast session request rejected/cancelled: ${JSON.stringify(err)}`);
          showToast('Cast cancelled or unavailable', 'warn', 3000);
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
      if (remotePlayer && (remotePlayer.playerState === cast.framework.PlayerState.PLAYING || remotePlayer.playerState === cast.framework.PlayerState.PAUSED)) {
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
    activeTracks = (activeTracks && activeTracks.length) ? activeTracks : ((window.ALBUM_DATA && window.ALBUM_DATA.tracks) || []);
    if (!activeTracks || activeTracks.length === 0) return;
    let nextIdx = (activeTrackIndex >= 0 ? activeTrackIndex : 0) + 1;
    if (nextIdx >= activeTracks.length) nextIdx = 0;
    loadTrackOnReceiver(nextIdx);
  }

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

  function setVolume(level) {
    if (remotePlayer && remotePlayerController && checkIsConnected()) {
      remotePlayer.volumeLevel = Math.max(0, Math.min(1, level));
      remotePlayerController.setVolumeLevel();
    }
  }

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
      const castWord = document.getElementById('jukebox-cast-label');

      if (isConnected) {
        jukeboxCastBtn.classList.add('text-amber-400', 'border-amber-500/50', 'bg-amber-950/40');
        jukeboxCastBtn.classList.remove('text-stone-400');
        jukeboxCastBtn.setAttribute('title', `Connected to ${deviceName || 'Google TV'} (Click to disconnect)`);
        if (castWord) castWord.textContent = 'Casting:';
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
        if (castWord) castWord.textContent = 'Cast';
        if (label) {
          label.classList.add('hidden');
        }
      }
    }

    updateDebugPill(isConnected ? `Connected: ${deviceName}` : 'Standby');
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
    showDebugModal,
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
