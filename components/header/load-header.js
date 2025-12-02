/**
 * Header Module Loader
 * Загружает компонент Header из header.html и вставляет в DOM
 */
(function() {
  'use strict';

  async function loadHeader() {
    try {
      // Определяем базовый путь к компонентам на основе текущего URL
      const currentPath = window.location.pathname;
      const isInSubfolder = currentPath.split('/').filter(Boolean).length > 1;
      const componentsBase = isInSubfolder ? '../components' : './components';
      
      const headerPath = componentsBase + '/header/header.html';
      const response = await fetch(headerPath);
      if (!response.ok) {
        throw new Error(`Failed to load header: ${response.statusText}`);
      }
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const headerElement = doc.querySelector('.header');
      
      if (!headerElement) {
        throw new Error('Header element not found in header.html');
      }
      
      // Исправляем пути к изображениям
      const images = headerElement.querySelectorAll('img[src]');
      images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && (src.startsWith('./') || !src.startsWith('http') && !src.startsWith('/'))) {
          // Если путь относительный, добавляем путь к компоненту
          if (src.startsWith('./')) {
            img.setAttribute('src', src.replace('./', componentsBase + '/header/'));
          } else if (!src.startsWith('http') && !src.startsWith('/')) {
            img.setAttribute('src', componentsBase + '/header/' + src);
          }
        }
      });
      
      // Вставляем header в начало body
      document.body.insertBefore(headerElement, document.body.firstChild);
      
      // Загружаем скрипт для мобильного меню
      if (!document.querySelector('script[src*="header.js"]')) {
        const script = document.createElement('script');
        script.src = componentsBase + '/header/header.js';
        script.async = true;
        document.body.appendChild(script);
      }
      
      return headerElement;
    } catch (error) {
      console.error('Error loading header:', error);
      // Fallback: показываем сообщение об ошибке
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'padding: 20px; background: #fee; color: #c00; text-align: center;';
      errorDiv.textContent = 'Ошибка загрузки Header. Убедитесь, что страница открыта через HTTP сервер.';
      document.body.insertBefore(errorDiv, document.body.firstChild);
    }
  }


  // Загружаем header после полной загрузки страницы (включая стили)
  // Это гарантирует, что все CSS файлы загружены и применены
  if (document.readyState === 'complete') {
    // Страница уже полностью загружена
    loadHeader();
  } else if (document.readyState === 'interactive') {
    // DOM готов, но ресурсы еще загружаются
    window.addEventListener('load', loadHeader);
  } else {
    // DOM еще не готов
    window.addEventListener('load', loadHeader);
    // Также добавляем обработчик на DOMContentLoaded для быстрой загрузки
    document.addEventListener('DOMContentLoaded', () => {
      // Небольшая задержка для загрузки стилей через @import
      setTimeout(loadHeader, 200);
    });
  }
})();

