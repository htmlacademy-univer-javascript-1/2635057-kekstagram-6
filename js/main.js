import { createPhotos } from './data.js';
import { renderPictures } from './picture-render.js';
import { setupImageUploadForm } from './pristine-validation.js';

document.addEventListener('DOMContentLoaded', () => {
    const photos = createPhotos();
    renderPictures(photos);
    setupImageUploadForm();
  });
