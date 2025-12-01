// Steps Lines Height Adjustment
(function() {
  function adjustStepLines() {
    const stepItems = document.querySelectorAll('.step-item');
    
    stepItems.forEach((stepItem) => {
      const line = stepItem.querySelector('.step-item__line');
      if (!line) return;
      
      const stepItemHeight = stepItem.offsetHeight;
      const numberHeight = 48; // height of .step-item__number
      const gap = parseInt(window.getComputedStyle(stepItem).gap) || 8; // var(--num-2) = 8px
      const topGap = parseInt(window.getComputedStyle(stepItem.querySelector('.step-item__top')).gap) || 8;
      
      // Calculate available height for line
      const availableHeight = stepItemHeight - numberHeight - gap - topGap;
      
      // Set max-height to available height
      line.style.maxHeight = `${Math.max(0, availableHeight)}px`;
    });
  }
  
  // Adjust on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', adjustStepLines);
  } else {
    adjustStepLines();
  }
  
  // Adjust on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(adjustStepLines, 100);
  });
  
  // Adjust when content changes (for dynamic content)
  const observer = new MutationObserver(() => {
    adjustStepLines();
  });
  
  const stepsContainer = document.querySelector('.steps');
  if (stepsContainer) {
    observer.observe(stepsContainer, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }
})();

