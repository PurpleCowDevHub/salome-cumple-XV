const audio = document.querySelector('#bg-music');

if (audio) {
  let started = false;
  let starting = false;

  const unlockEvents = [
    ['pointerup', { passive: true }],
    ['touchend', { passive: true }],
    ['click', undefined],
  ];

  const removeUnlockListeners = () => {
    unlockEvents.forEach(([eventName, options]) => {
      window.removeEventListener(eventName, startAudio, options);
    });
  };

  const startAudio = () => {
    if (started || starting) {
      return;
    }

    starting = true;
    audio.muted = false;

    const playPromise = audio.play();

    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          started = !audio.paused;
          starting = false;

          if (started) {
            removeUnlockListeners();
          }

          return null;
        })
        .catch(() => {
          starting = false;
        });
      return;
    }

    started = !audio.paused;
    starting = false;

    if (started) {
      removeUnlockListeners();
    }
  };

  unlockEvents.forEach(([eventName, options]) => {
    window.addEventListener(eventName, startAudio, options);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !started && !audio.paused) {
      started = true;
    }
  });
}
