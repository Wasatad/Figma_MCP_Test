/**
 * Footer Module Loader
 * Загружает компонент Footer из footer.html и вставляет в DOM
 */
(function() {
  'use strict';

  async function loadFooter() {
    try {
      // Определяем базовый путь к компонентам на основе текущего URL
      const currentPath = window.location.pathname;
      const isInSubfolder = currentPath.split('/').filter(Boolean).length > 1;
      const componentsBase = isInSubfolder ? '../components' : './components';
      
      const footerPath = componentsBase + '/footer/footer.html';
      const response = await fetch(footerPath);
      if (!response.ok) {
        throw new Error(`Failed to load footer: ${response.statusText}`);
      }
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const footerElement = doc.querySelector('.footer');
      
      if (!footerElement) {
        throw new Error('Footer element not found in footer.html');
      }
      
      // Исправляем пути к изображениям
      const images = footerElement.querySelectorAll('img[src]');
      images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && (src.startsWith('./') || !src.startsWith('http') && !src.startsWith('/'))) {
          if (src.startsWith('./')) {
            img.setAttribute('src', src.replace('./', componentsBase + '/footer/'));
          } else if (!src.startsWith('http') && !src.startsWith('/')) {
            img.setAttribute('src', componentsBase + '/footer/' + src);
          }
        }
      });
      
      // Вставляем footer в конец body
      document.body.appendChild(footerElement);
      
      return footerElement;
    } catch (error) {
      console.error('Error loading footer:', error);
      // Fallback: показываем сообщение об ошибке
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'padding: 20px; background: #fee; color: #c00; text-align: center;';
      errorDiv.textContent = 'Ошибка загрузки Footer. Убедитесь, что страница открыта через HTTP сервер.';
      document.body.appendChild(errorDiv);
    }
  }


  // Загружаем footer после полной загрузки страницы (включая стили)
  // Это гарантирует, что все CSS файлы загружены и применены
  if (document.readyState === 'complete') {
    // Страница уже полностью загружена
    loadFooter();
  } else if (document.readyState === 'interactive') {
    // DOM готов, но ресурсы еще загружаются
    window.addEventListener('load', loadFooter);
  } else {
    // DOM еще не готов
    window.addEventListener('load', loadFooter);
    // Также добавляем обработчик на DOMContentLoaded для быстрой загрузки
    document.addEventListener('DOMContentLoaded', () => {
      // Небольшая задержка для загрузки стилей через @import
      setTimeout(loadFooter, 200);
    });
  }
})();


