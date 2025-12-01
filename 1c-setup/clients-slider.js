// Clients Slider
(function() {
  const clientsLogos = document.querySelector('.clients__logos');
  const prevBtn = document.querySelector('.clients__btn--prev');
  const nextBtn = document.querySelector('.clients__btn--next');
  
  if (!clientsLogos) return;

  // Get logo width including gap
  function getLogoWidth() {
    const firstLogo = clientsLogos.querySelector('.clients__logo');
    if (!firstLogo) return 0;
    const gap = parseInt(window.getComputedStyle(clientsLogos).gap) || 0;
    return firstLogo.offsetWidth + gap;
  }

  // Update button states
  function updateButtons() {
    const scrollLeft = clientsLogos.scrollLeft;
    const scrollWidth = clientsLogos.scrollWidth;
    const clientWidth = clientsLogos.clientWidth;
    
    if (prevBtn) {
      prevBtn.disabled = scrollLeft <= 0;
    }
    if (nextBtn) {
      nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 1;
    }
  }

  // Scroll to next/prev logo
  function scrollToNext() {
    const logoWidth = getLogoWidth();
    const currentScroll = clientsLogos.scrollLeft;
    const scrollAmount = logoWidth * 3; // Scroll by 3 logos at a time
    clientsLogos.scrollTo({
      left: currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  }

  function scrollToPrev() {
    const logoWidth = getLogoWidth();
    const currentScroll = clientsLogos.scrollLeft;
    const scrollAmount = logoWidth * 3; // Scroll by 3 logos at a time
    clientsLogos.scrollTo({
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
  clientsLogos.addEventListener('scroll', updateButtons);

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

  clientsLogos.addEventListener('mousedown', (e) => {
    isDown = true;
    clientsLogos.style.cursor = 'grabbing';
    startX = e.pageX - clientsLogos.offsetLeft;
    scrollLeft = clientsLogos.scrollLeft;
  });

  clientsLogos.addEventListener('mouseleave', () => {
    isDown = false;
    clientsLogos.style.cursor = 'grab';
  });

  clientsLogos.addEventListener('mouseup', () => {
    isDown = false;
    clientsLogos.style.cursor = 'grab';
    updateButtons();
  });

  clientsLogos.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - clientsLogos.offsetLeft;
    const walk = (x - startX) * 2;
    clientsLogos.scrollLeft = scrollLeft - walk;
  });

  // Add grab cursor style
  clientsLogos.style.cursor = 'grab';
})();

