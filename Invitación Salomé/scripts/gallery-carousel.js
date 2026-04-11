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

    const getStep = () => {
      const style = window.getComputedStyle(gallery);
      const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
      return firstItem.getBoundingClientRect().width + gap;
    };

    const nextSlide = () => {
      const step = getStep();
      gallery.scrollBy({ left: step, behavior: 'smooth' });
    };

    const normalizeScroll = () => {
      const loopWidth = getLoopWidth();

      if (!loopWidth) {
        return;
      }

      while (gallery.scrollLeft >= loopWidth) {
        gallery.scrollLeft -= loopWidth;
      }
    };

    const updateCardSizes = () => {
      normalizeScroll();

      const center = gallery.scrollLeft + gallery.clientWidth / 2;
      const maxDistance = Math.max(gallery.clientWidth * 0.75, 1);

      cards.forEach((card) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(center - cardCenter);
        const ratio = Math.min(distance / maxDistance, 1);
        const scale = 1 - ratio * 0.16;
        const opacity = 1 - ratio * 0.28;
        const shadowBlur = 26 - ratio * 12;

        card.style.transform = `scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.boxShadow = `0 10px ${shadowBlur}px rgba(54, 78, 101, 0.2)`;
        card.style.zIndex = String(1000 - Math.round(ratio * 1000));
      });
    };

    let ticking = false;

    const onScroll = () => {
      normalizeScroll();

      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        updateCardSizes();
        ticking = false;
      });
    };

    gallery.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateCardSizes);
    updateCardSizes();

    window.setInterval(nextSlide, 3000);
  }
}