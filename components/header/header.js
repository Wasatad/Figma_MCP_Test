/**
 * Header mobile menu navigation
 * Handles burger menu toggle and mobile menu overlay
 */

(function () {
  'use strict';

  const SELECTORS = {
    menuToggle: '[data-menu-toggle]',
    menuClose: '[data-menu-close]',
    mobileMenu: '[data-mobile-menu]',
    body: 'body',
  };

  const CLASSES = {
    isOpen: 'is-open',
    noScroll: 'no-scroll',
  };

  const header = document.querySelector('.header');
  if (!header) return;

  const menuToggle = header.querySelector(SELECTORS.menuToggle);
  const menuClose = header.querySelector(SELECTORS.menuClose);
  const mobileMenu = header.querySelector(SELECTORS.mobileMenu);
  const body = document.querySelector(SELECTORS.body);

  if (!menuToggle || !menuClose || !mobileMenu) return;

  /**
   * Open mobile menu
   */
  function openMenu() {
    mobileMenu.classList.add(CLASSES.isOpen);
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Закрыть меню');
    body.classList.add(CLASSES.noScroll);
    
    // Focus trap: focus first focusable element
    const firstFocusable = mobileMenu.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  /**
   * Close mobile menu
   */
  function closeMenu() {
    mobileMenu.classList.remove(CLASSES.isOpen);
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Открыть меню');
    body.classList.remove(CLASSES.noScroll);
    
    // Return focus to toggle button
    menuToggle.focus();
  }

  /**
   * Toggle mobile menu
   */
  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains(CLASSES.isOpen);
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  /**
   * Handle escape key
   */
  function handleEscape(event) {
    if (event.key === 'Escape' && mobileMenu.classList.contains(CLASSES.isOpen)) {
      closeMenu();
    }
  }

  /**
   * Handle click outside menu
   */
  function handleClickOutside(event) {
    if (
      mobileMenu.classList.contains(CLASSES.isOpen) &&
      !mobileMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  }

  // Event listeners
  menuToggle.addEventListener('click', toggleMenu);
  menuClose.addEventListener('click', closeMenu);
  document.addEventListener('keydown', handleEscape);
  document.addEventListener('click', handleClickOutside);

  // Close menu on window resize (if resizing to desktop)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 1024 && mobileMenu.classList.contains(CLASSES.isOpen)) {
        closeMenu();
      }
    }, 250);
  });

})();

