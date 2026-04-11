const countdownRoot = document.querySelector('[data-countdown]');

if (countdownRoot) {
  const targetValue = countdownRoot.getAttribute('data-target');
  const targetDate = targetValue ? new Date(targetValue) : null;

  const daysEl = countdownRoot.querySelector('[data-countdown-days]');
  const hoursEl = countdownRoot.querySelector('[data-countdown-hours]');
  const minutesEl = countdownRoot.querySelector('[data-countdown-minutes]');
  const secondsEl = countdownRoot.querySelector('[data-countdown-seconds]');
  const messageEl = countdownRoot.querySelector('[data-countdown-message]');

  const setValue = (element, value) => {
    if (!element) {
      return;
    }

    element.textContent = String(value).padStart(2, '0');
  };

  const setAllZeros = () => {
    setValue(daysEl, 0);
    setValue(hoursEl, 0);
    setValue(minutesEl, 0);
    setValue(secondsEl, 0);
  };

  if (!targetDate || Number.isNaN(targetDate.getTime())) {
    setAllZeros();

    if (messageEl) {
      messageEl.textContent = 'Define una fecha valida para el contador.';
    }
  } else {
    let intervalId = null;

    const updateCountdown = () => {
      const now = Date.now();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        setAllZeros();

        if (messageEl) {
          messageEl.textContent = 'Hoy celebramos este gran dia.';
        }

        if (intervalId) {
          window.clearInterval(intervalId);
          intervalId = null;
        }

        return;
      }

      const secondsTotal = Math.floor(distance / 1000);
      const days = Math.floor(secondsTotal / 86400);
      const hours = Math.floor((secondsTotal % 86400) / 3600);
      const minutes = Math.floor((secondsTotal % 3600) / 60);
      const seconds = secondsTotal % 60;

      setValue(daysEl, days);
      setValue(hoursEl, hours);
      setValue(minutesEl, minutes);
      setValue(secondsEl, seconds);

      if (messageEl) {
        messageEl.textContent = 'para celebrar juntos este dia tan especial.';
      }
    };

    updateCountdown();
    intervalId = window.setInterval(updateCountdown, 1000);
  }
}
