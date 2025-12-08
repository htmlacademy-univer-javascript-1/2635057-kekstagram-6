import { createPhotos } from './data.js';
import { renderPictures } from './picture-render.js';
import { setupImageUploadForm } from './pristine-validation.js';


const photos = createPhotos();
renderPictures(photos);
setupImageUploadForm();