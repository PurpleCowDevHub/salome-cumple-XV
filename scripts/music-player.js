const audio = document.querySelector('#bg-music');

if (audio) {
  let started = false;
  let touchStartY = null;

  const scrollKeys = new Set([
    'ArrowDown',
    'ArrowUp',
    'PageDown',
    'PageUp',
    'Space',
    'Home',
    'End',
  ]);

  const removeUnlockListeners = () => {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('keydown', onKeyDown);
  };

  const startAudio = () => {
    if (started) {
      return;
    }

    audio.muted = false;

    const playPromise = audio.play();

    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          started = true;
          removeUnlockListeners();
        })
        .catch(() => {
          started = false;
        });
      return;
    }

    started = !audio.paused;

    if (started) {
      removeUnlockListeners();
    }
  };

  const onWheel = () => {
    startAudio();
  };

  const onScroll = () => {
    if (!started) {
      startAudio();
    }
  };

  const onTouchStart = (event) => {
    const touch = event.touches?.[0];
    touchStartY = touch ? touch.clientY : null;
  };

  const onTouchMove = (event) => {
    const touch = event.touches?.[0];

    if (!touch) {
      return;
    }

    if (touchStartY === null) {
      touchStartY = touch.clientY;
      return;
    }

    // Only unlock after an actual swipe movement.
    if (Math.abs(touch.clientY - touchStartY) > 6) {
      startAudio();
    }
  };

  const onKeyDown = (event) => {
    if (scrollKeys.has(event.code)) {
      startAudio();
    }
  };

  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('keydown', onKeyDown);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !started && !audio.paused) {
      started = true;
    }
  });
}