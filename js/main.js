import { createPhotos } from './data.js';
import { renderPictures } from './picture-render.js';
import { setupImageUploadForm } from './pristine-validation.js';
import { initScaleAndEffects } from './scale-and-effects.js';

document.addEventListener('DOMContentLoaded', () => {
  const photos = createPhotos();
  renderPictures(photos);
  setupImageUploadForm();

  // Инициализируем масштаб и эффекты только если библиотека загружена
  if (typeof noUiSlider !== 'undefined') {
    initScaleAndEffects();
  }
});
