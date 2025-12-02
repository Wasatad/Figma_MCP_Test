// Testimonials Slider
(function() {
  const testimonialsList = document.querySelector('.testimonials__list');
  const prevBtn = document.querySelector('.testimonials__btn--prev');
  const nextBtn = document.querySelector('.testimonials__btn--next');
  
  if (!testimonialsList) return;

  // Get card width including gap
  function getCardWidth() {
    const firstCard = testimonialsList.querySelector('.testimonial-card');
    if (!firstCard) return 0;
    const cardStyle = window.getComputedStyle(firstCard);
    const gap = parseInt(window.getComputedStyle(testimonialsList).gap) || 0;
    return firstCard.offsetWidth + gap;
  }

  // Update button states
  function updateButtons() {
    const scrollLeft = testimonialsList.scrollLeft;
    const scrollWidth = testimonialsList.scrollWidth;
    const clientWidth = testimonialsList.clientWidth;
    
    if (prevBtn) {
      prevBtn.disabled = scrollLeft <= 0;
    }
    if (nextBtn) {
      nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 1;
    }
  }

  // Scroll to next/prev card
  function scrollToNext() {
    const cardWidth = getCardWidth();
    const currentScroll = testimonialsList.scrollLeft;
    const scrollAmount = cardWidth;
    testimonialsList.scrollTo({
      left: currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  }

  function scrollToPrev() {
    const cardWidth = getCardWidth();
    const currentScroll = testimonialsList.scrollLeft;
    const scrollAmount = cardWidth;
    testimonialsList.scrollTo({
      left: currentScroll - scrollAmount,
      behavior: 'smooth'
    });
  }

  // Button event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', scrollToPrev);
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', scrollToNext);
  }

  // Update buttons on scroll
  testimonialsList.addEventListener('scroll', updateButtons);

  // Update buttons on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateButtons();
    }, 100);
  });

  // Initial button state
  updateButtons();

  // Enable smooth scrolling on touch devices
  let isDown = false;
  let startX;
  let scrollLeft;

  testimonialsList.addEventListener('mousedown', (e) => {
    isDown = true;
    testimonialsList.style.cursor = 'grabbing';
    startX = e.pageX - testimonialsList.offsetLeft;
    scrollLeft = testimonialsList.scrollLeft;
  });

  testimonialsList.addEventListener('mouseleave', () => {
    isDown = false;
    testimonialsList.style.cursor = 'grab';
  });

  testimonialsList.addEventListener('mouseup', () => {
    isDown = false;
    testimonialsList.style.cursor = 'grab';
    updateButtons();
  });

  testimonialsList.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - testimonialsList.offsetLeft;
    const walk = (x - startX) * 2;
    testimonialsList.scrollLeft = scrollLeft - walk;
  });

  // Add grab cursor style
  testimonialsList.style.cursor = 'grab';
})();

