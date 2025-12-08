import { createPhotos } from './data.js';
import { renderPictures } from './picture-render.js';
import { setupImageUploadForm } from './pristine-validation.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM загружен, запускаем приложение');
  
  try {
    const photos = createPhotos();
    renderPictures(photos);
    setupImageUploadForm();
    console.log('✅ Приложение успешно запущено');
  } catch (error) {
    console.error('❌ Ошибка запуска приложения:', error);
  }
});