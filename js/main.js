import { createPhotos } from './data.js';
import { renderPictures } from './picture-render.js';

const photos = createPhotos();
renderPictures(photos);
