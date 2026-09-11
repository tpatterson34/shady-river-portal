/**
 * Trevor Swistchew Publishing Portal - Companion Audio Controller
 * Manages embedded audio playback, scrubber controls, and synchronization with top mini-player.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioCompanion();
});

function initAudioCompanion() {
  const audioElement = document.getElementById('companion-audio');
  if (!audioElement) return;

  // Main Player elements
  const mainPlayBtn = document.getElementById('main-play-btn');
  const mainPlayIcon = document.getElementById('main-play-icon');
  const mainScrubber = document.getElementById('main-scrubber');
  const currentTimeDisplay = document.getElementById('current-time');
  const totalDurationDisplay = document.getElementById('total-duration');
  const volumeSlider = document.getElementById('volume-slider');
  const muteBtn = document.getElementById('mute-btn');
  const muteIcon = document.getElementById('mute-icon');

  // Sticky Header Mini-player elements
  const miniPlayBtn = document.getElementById('header-mini-play');
  const miniPlayIcon = document.getElementById('header-mini-icon');
  const miniTrackTitle = document.getElementById('header-mini-track');

  let isScrubbing = false;

  // Format seconds to mm:ss
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // Update UI play state
  function updatePlayState(isPlaying) {
    if (mainPlayIcon) {
      mainPlayIcon.className = isPlaying ? 'fa-solid fa-pause text-amber-500' : 'fa-solid fa-play text-amber-500';
    }
    if (mainPlayBtn) {
      mainPlayBtn.setAttribute('aria-label', isPlaying ? 'Pause Audio' : 'Play Audio');
    }
    if (miniPlayIcon) {
      miniPlayIcon.className = isPlaying ? 'fa-solid fa-pause text-amber-500 text-xs' : 'fa-solid fa-play text-amber-500 text-xs';
    }
    if (miniPlayBtn) {
      miniPlayBtn.setAttribute('aria-label', isPlaying ? 'Pause Audio' : 'Play Audio');
    }
  }

  // Toggle playback
  function togglePlay() {
    if (audioElement.paused) {
      audioElement.play().catch(err => {
        console.warn('Audio playback error:', err);
      });
    } else {
      audioElement.pause();
    }
  }

  if (mainPlayBtn) mainPlayBtn.addEventListener('click', togglePlay);
  if (miniPlayBtn) miniPlayBtn.addEventListener('click', togglePlay);

  audioElement.addEventListener('play', () => updatePlayState(true));
  audioElement.addEventListener('pause', () => updatePlayState(false));

  // Time & Duration updates
  audioElement.addEventListener('loadedmetadata', () => {
    if (totalDurationDisplay) {
      totalDurationDisplay.textContent = formatTime(audioElement.duration);
    }
    if (mainScrubber) {
      mainScrubber.max = Math.floor(audioElement.duration);
    }
  });

  audioElement.addEventListener('timeupdate', () => {
    if (!isScrubbing && mainScrubber) {
      mainScrubber.value = audioElement.currentTime;
    }
    if (currentTimeDisplay) {
      currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
    }
  });

  // Scrubber user interaction
  if (mainScrubber) {
    mainScrubber.addEventListener('input', () => {
      isScrubbing = true;
      if (currentTimeDisplay) {
        currentTimeDisplay.textContent = formatTime(mainScrubber.value);
      }
    });

    mainScrubber.addEventListener('change', () => {
      audioElement.currentTime = mainScrubber.value;
      isScrubbing = false;
    });
  }

  // Volume & Mute
  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      audioElement.volume = volumeSlider.value;
      audioElement.muted = (volumeSlider.value == 0);
      updateMuteIcon();
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      audioElement.muted = !audioElement.muted;
      updateMuteIcon();
    });
  }

  function updateMuteIcon() {
    if (!muteIcon) return;
    if (audioElement.muted || audioElement.volume === 0) {
      muteIcon.className = 'fa-solid fa-volume-xmark text-stone-400';
    } else if (audioElement.volume < 0.5) {
      muteIcon.className = 'fa-solid fa-volume-low text-stone-400';
    } else {
      muteIcon.className = 'fa-solid fa-volume-high text-stone-400';
    }
  }
}
