import { renderPictures } from './picture-render.js';
import { setupImageUploadForm } from './pristine-validation.js';
import { initScaleAndEffects } from './scale-and-effects.js';
import { fetchPhotoCollection } from './server-api.js';

function showLoadError(message) {
  const errorContainer = document.createElement('div');
  errorContainer.className = 'load-error-notification';
  errorContainer.innerHTML = `
    <div class="load-error-content">
      <h3>Ошибка загрузки</h3>
      <p>${message}</p>
      <button class="retry-button">Попробовать снова</button>
    </div>
  `;

  errorContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff6b6b;
    color: white;
    padding: 15px;
    border-radius: 8px;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;

  document.body.appendChild(errorContainer);

  setTimeout(() => {
    if (errorContainer.parentNode) {
      errorContainer.remove();
    }
  }, 5000);

  const retryButton = errorContainer.querySelector('.retry-button');
  retryButton.addEventListener('click', () => {
    errorContainer.remove();
    loadAndDisplayPhotos();
  });
}

async function loadAndDisplayPhotos() {
  const pictureContainer = document.querySelector('.pictures');

  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'photos-loading';
  loadingIndicator.textContent = 'Загружаем фотографии...';
  loadingIndicator.style.cssText = `
    text-align: center;
    padding: 40px;
    color: #ffe753;
    font-size: 18px;
  `;

  pictureContainer.appendChild(loadingIndicator);

  try {
    const photos = await fetchPhotoCollection();

    loadingIndicator.remove();

    renderPictures(photos);

    if (typeof setupPhotoFilters === 'function') {
      setupPhotoFilters(photos);
    }

  } catch (error) {
    loadingIndicator.remove();
    showLoadError(error.message);

    const fallbackMessage = document.createElement('div');
    fallbackMessage.className = 'photos-fallback';
    fallbackMessage.innerHTML = `
      <p>Не удалось загрузить фотографии.</p>
      <button class="reload-button">Обновить страницу</button>
    `;
    fallbackMessage.style.cssText = `
      text-align: center;
      padding: 40px;
      color: #ffe753;
    `;

    pictureContainer.appendChild(fallbackMessage);

    const reloadButton = fallbackMessage.querySelector('.reload-button');
    reloadButton.addEventListener('click', () => {
      window.location.reload();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadAndDisplayPhotos();

  setupImageUploadForm();

  if (typeof noUiSlider !== 'undefined') {
    initScaleAndEffects();
  }
});
