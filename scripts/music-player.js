const audio = document.querySelector('#bg-music');
const welcomeOverlay = document.querySelector('#welcome-overlay');
const startButton = document.querySelector('[data-start-experience]');

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

  const focusMainContent = () => {
    const mainContent = document.querySelector('main');

    if (!mainContent) {
      return;
    }

    if (!mainContent.hasAttribute('tabindex')) {
      mainContent.setAttribute('tabindex', '-1');
    }

    mainContent.focus({ preventScroll: true });
    mainContent.addEventListener(
      'blur',
      () => {
        if (mainContent.getAttribute('tabindex') === '-1') {
          mainContent.removeAttribute('tabindex');
        }
      },
      { once: true }
    );
  };

  const dismissWelcomeOverlay = () => {
    if (!welcomeOverlay) {
      return;
    }

    const activeElement = document.activeElement;
    if (activeElement && welcomeOverlay.contains(activeElement) && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }

    welcomeOverlay.setAttribute('inert', '');
    welcomeOverlay.classList.add('is-hidden');
    welcomeOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    focusMainContent();
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

  if (welcomeOverlay && startButton) {
    document.body.classList.add('no-scroll');

    startButton.addEventListener('click', () => {
      dismissWelcomeOverlay();
      startAudio();
    });
  } else if (!startButton) {
    // Si no hay overlay de bienvenida o botón, permitir unlock por cualquier interacción
    unlockEvents.forEach(([eventName, options]) => {
      window.addEventListener(eventName, startAudio, options);
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !started && !audio.paused) {
      started = true;
    }
  });
}
