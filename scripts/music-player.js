const audio = document.querySelector('#bg-music');

if (audio) {
  let started = false;

  const startAudio = () => {
    if (started) {
      return;
    }

    started = true;
    audio.play().catch(() => {
      started = false;
    });
  };

  ['click', 'touchstart', 'keydown'].forEach((eventName) => {
    document.addEventListener(eventName, startAudio, { once: true, passive: true });
  });
}