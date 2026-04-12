const gallery = document.querySelector('.gallery-scroll');

if (gallery) {
  const originalCards = Array.from(gallery.querySelectorAll('.gallery-item'));

  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    gallery.appendChild(clone);
  });

  const firstItem = gallery.querySelector('.gallery-item');
  const cards = Array.from(gallery.querySelectorAll('.gallery-item'));

  if (firstItem) {
    const getLoopWidth = () => gallery.scrollWidth / 2;
    const getMaxScrollLeft = () => Math.max(gallery.scrollWidth - gallery.clientWidth, 0);
    const START_PHOTO_INDEX = 2;
    const LOOP_EDGE_EPSILON = 1;

    const getStep = () => {
      const style = window.getComputedStyle(gallery);
      const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
      return firstItem.getBoundingClientRect().width + gap;
    };

    const USER_IDLE_MS = 1400;
    let lastUserInteractionAt = 0;

    const markUserInteraction = () => {
      lastUserInteractionAt = Date.now();
    };

    const nextSlide = () => {
      if (Date.now() - lastUserInteractionAt < USER_IDLE_MS) {
        return;
      }

      const step = getStep();
      gallery.scrollBy({ left: step, behavior: 'smooth' });
    };

    const normalizeScroll = () => {
      const loopWidth = getLoopWidth();
      const maxScrollLeft = getMaxScrollLeft();

      if (!loopWidth || !maxScrollLeft) {
        return;
      }

      let normalized = gallery.scrollLeft;

      if (normalized <= LOOP_EDGE_EPSILON) {
        normalized = Math.min(normalized + loopWidth, maxScrollLeft);
      } else if (normalized >= maxScrollLeft - LOOP_EDGE_EPSILON) {
        normalized = Math.max(normalized - loopWidth, 0);
      }

      if (Math.abs(normalized - gallery.scrollLeft) > 0.5) {
        gallery.scrollLeft = normalized;
      }
    };

    let cardCenters = [];

    const updateCardMetrics = () => {
      cardCenters = cards.map((card) => card.offsetLeft + card.offsetWidth / 2);
    };

    let scrollEndTimer = null;

    const setScrollingState = () => {
      gallery.classList.add('is-scrolling');

      if (scrollEndTimer) {
        window.clearTimeout(scrollEndTimer);
      }

      scrollEndTimer = window.setTimeout(() => {
        gallery.classList.remove('is-scrolling');
      }, 140);
    };

    const initializeScrollPosition = () => {
      const loopWidth = getLoopWidth();
      const maxScrollLeft = getMaxScrollLeft();

      if (!loopWidth || !maxScrollLeft) {
        return;
      }

      const initialScroll = loopWidth + getStep() * START_PHOTO_INDEX;
      gallery.scrollLeft = Math.min(Math.max(initialScroll, 0), maxScrollLeft);
    };

    const updateCardSizes = () => {
      normalizeScroll();

      const center = gallery.scrollLeft + gallery.clientWidth / 2;
      const maxDistance = Math.max(gallery.clientWidth * 0.75, 1);

      cards.forEach((card, index) => {
        const cardCenter = cardCenters[index] ?? card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(center - cardCenter);
        const ratio = Math.min(distance / maxDistance, 1);
        const scale = 1 - ratio * 0.16;
        const opacity = 1 - ratio * 0.28;

        card.style.transform = `scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(1000 - Math.round(ratio * 1000));
      });
    };

    let ticking = false;

    const onScroll = () => {
      normalizeScroll();
      setScrollingState();

      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        updateCardSizes();
        ticking = false;
      });
    };

    updateCardMetrics();
    initializeScrollPosition();

    gallery.addEventListener('scroll', onScroll, { passive: true });

    ['wheel', 'touchstart', 'pointerdown', 'pointermove'].forEach((eventName) => {
      gallery.addEventListener(eventName, markUserInteraction, { passive: true });
    });

    window.addEventListener('resize', () => {
      updateCardMetrics();
      normalizeScroll();
      updateCardSizes();
    });

    updateCardSizes();

    window.setInterval(nextSlide, 3000);
  }
}