// Persistent Global Audio Player Controller

(function() {
  'use strict';

  const playlist = [
    {
      title: "How I Disintegrated (Preview)",
      subtitle: "Album 20 • Raw Acoustic Folk Blues",
      src: "assets/audio/how-i-disintegrated-preview.mp3",
      cover: "assets/images/how-i-disintegrated-cover.webp",
      duration: 45
    },
    {
      title: "The Same Boot (Preview)",
      subtitle: "Album 16 • Political Folk-Rock Anthem",
      src: "assets/audio/the-same-boot-preview.mp3",
      cover: "assets/images/the-same-boot-cover.webp",
      duration: 45
    },
    {
      title: "Nobody's Listening (Preview)",
      subtitle: "The Republic of Nobody • Acoustic Ballad",
      src: "assets/audio/nobodys-listening-preview.mp3",
      cover: "assets/images/nobodys-listening-cover.webp",
      duration: 45
    },
    {
      title: "The Curtains and the Canned Goods (Preview)",
      subtitle: "Album 23 • Winter Homestead Ballad",
      src: "assets/audio/curtains-and-canned-goods-preview.mp3",
      cover: "assets/images/curtains-and-canned-goods-cover.webp",
      duration: 45
    },
    {
      title: "My Brother is a Mark (Preview)",
      subtitle: "The Gardener's Rebellion • Agrarian Outcry",
      src: "assets/audio/my-brother-is-a-mark-preview.mp3",
      cover: "assets/images/my-brother-is-a-mark-cover.webp",
      duration: 45
    },
    {
      title: "Strings and Scythes (Preview)",
      subtitle: "The Gardener's Rebellion • Harvest Acoustic",
      src: "assets/audio/strings-and-scythes-preview.mp3",
      cover: "assets/images/strings-and-scythes-cover.webp",
      duration: 45
    }
  ];

  let currentTrackIdx = 0;
  let isPlaying = false;
  let audio = new Audio();
  audio.preload = 'metadata';

  // DOM Elements
  let playBtn, prevBtn, nextBtn, scrubBar, scrubFill, currentTimeEl, totalTimeEl;
  let trackTitleEl, trackSubtitleEl, trackCoverEl, audioBars, volumeBtn, volumeSlider;
  let heroPlayBtn, heroPlayIcon, heroPlayText;

  function initPlayer() {
    playBtn = document.getElementById('player-play-btn');
    prevBtn = document.getElementById('player-prev-btn');
    nextBtn = document.getElementById('player-next-btn');
    scrubBar = document.getElementById('player-scrub-bar');
    scrubFill = document.getElementById('player-scrub-fill');
    currentTimeEl = document.getElementById('player-current-time');
    totalTimeEl = document.getElementById('player-total-time');
    trackTitleEl = document.getElementById('player-track-title');
    trackSubtitleEl = document.getElementById('player-track-subtitle');
    trackCoverEl = document.getElementById('player-track-cover');
    audioBars = document.querySelectorAll('.audio-bar');
    volumeBtn = document.getElementById('player-volume-btn');
    volumeSlider = document.getElementById('player-volume-slider');

    heroPlayBtn = document.getElementById('hero-soundbite-btn');
    heroPlayIcon = document.getElementById('hero-soundbite-icon');
    heroPlayText = document.getElementById('hero-soundbite-text');

    loadTrack(currentTrackIdx, false);

    // Event Listeners
    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (prevBtn) prevBtn.addEventListener('click', prevTrack);
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);
    if (heroPlayBtn) heroPlayBtn.addEventListener('click', togglePlay);

    if (scrubBar) {
      scrubBar.addEventListener('click', seek);
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
        updateVolumeIcon();
      });
    }

    if (volumeBtn) {
      volumeBtn.addEventListener('click', toggleMute);
    }

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', onTrackEnded);
    audio.addEventListener('loadedmetadata', () => {
      if (totalTimeEl && !isNaN(audio.duration)) {
        totalTimeEl.textContent = formatTime(audio.duration);
      }
    });

    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(e.target.tagName)) {
        e.preventDefault();
        togglePlay();
      }
    });
  }

  function loadTrack(index, autoPlay = true) {
    currentTrackIdx = index;
    const track = playlist[currentTrackIdx];
    audio.src = track.src;

    if (trackTitleEl) trackTitleEl.textContent = track.title;
    if (trackSubtitleEl) trackSubtitleEl.textContent = track.subtitle;
    if (trackCoverEl) {
      trackCoverEl.src = track.cover;
      trackCoverEl.alt = track.title;
    }
    if (currentTimeEl) currentTimeEl.textContent = "0:00";
    if (totalTimeEl) totalTimeEl.textContent = formatTime(track.duration);
    if (scrubFill) scrubFill.style.width = "0%";

    if (autoPlay) {
      play();
    } else {
      pause();
    }
  }

  function play() {
    audio.play().then(() => {
      isPlaying = true;
      updateUI();
    }).catch(err => {
      console.warn("Autoplay prevented or audio source error:", err);
      isPlaying = false;
      updateUI();
    });
  }

  function pause() {
    audio.pause();
    isPlaying = false;
    updateUI();
  }

  function togglePlay() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function prevTrack() {
    let newIdx = currentTrackIdx - 1;
    if (newIdx < 0) newIdx = playlist.length - 1;
    loadTrack(newIdx, true);
  }

  function nextTrack() {
    let newIdx = (currentTrackIdx + 1) % playlist.length;
    loadTrack(newIdx, true);
  }

  function onTrackEnded() {
    nextTrack();
  }

  function seek(e) {
    const rect = scrubBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (!isNaN(audio.duration)) {
      audio.currentTime = pos * audio.duration;
    }
  }

  function toggleMute() {
    audio.muted = !audio.muted;
    updateVolumeIcon();
  }

  function updateVolumeIcon() {
    if (!volumeBtn) return;
    const icon = volumeBtn.querySelector('i');
    if (!icon) return;
    if (audio.muted || audio.volume === 0) {
      icon.className = "fa-solid fa-volume-xmark";
    } else if (audio.volume < 0.5) {
      icon.className = "fa-solid fa-volume-low";
    } else {
      icon.className = "fa-solid fa-volume-high";
    }
  }

  function updateProgress() {
    if (audio.duration && !isNaN(audio.duration)) {
      const pct = (audio.currentTime / audio.duration) * 100;
      if (scrubFill) scrubFill.style.width = pct + "%";
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  }

  function updateUI() {
    // Play button in dock
    if (playBtn) {
      const icon = playBtn.querySelector('i');
      if (icon) {
        icon.className = isPlaying ? "fa-solid fa-pause text-base" : "fa-solid fa-play text-base ml-0.5";
      }
      playBtn.setAttribute('aria-label', isPlaying ? 'Pause audio' : 'Play audio');
    }

    // Hero soundbite button
    if (heroPlayBtn) {
      if (heroPlayIcon) {
        heroPlayIcon.className = isPlaying ? "fa-solid fa-pause text-amber-400" : "fa-solid fa-play text-amber-400 text-xs";
      }
      if (heroPlayText) {
        const currentTitle = playlist[currentTrackIdx]?.title.replace(' (Preview)', '') || 'Acoustic Signature';
        heroPlayText.textContent = isPlaying ? `Playing: ${currentTitle}` : "Hear the Acoustic Signature (1-Click)";
      }
      heroPlayBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    }

    // Animated waveform bars
    audioBars.forEach(bar => {
      if (isPlaying) {
        bar.classList.add('playing');
      } else {
        bar.classList.remove('playing');
      }
    });

    // Update active play buttons across the page
    document.querySelectorAll('[data-track-idx]').forEach(btn => {
      const idx = parseInt(btn.dataset.trackIdx, 10);
      const icon = btn.querySelector('i');
      if (idx === currentTrackIdx && isPlaying) {
        if (icon) icon.className = "fa-solid fa-pause";
        btn.classList.add('ring-2', 'ring-amber-400');
      } else {
        if (icon) icon.className = "fa-solid fa-play";
        btn.classList.remove('ring-2', 'ring-amber-400');
      }
    });
  }

  function formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  // Expose global controller
  window.GlobalAudio = {
    play: play,
    pause: pause,
    togglePlay: togglePlay,
    loadTrack: loadTrack,
    playTrackByIdx: function(idx) { loadTrack(idx, true); },
    getPlaylist: function() { return playlist; },
    getCurrentIndex: function() { return currentTrackIdx; }
  };

  document.addEventListener('DOMContentLoaded', initPlayer);
})();
