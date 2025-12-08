import { createPhotos } from './data.js';
import { renderPictures } from './picture-render.js';
import './form-handler.js';

const photos = createPhotos();
renderPictures(photos);
