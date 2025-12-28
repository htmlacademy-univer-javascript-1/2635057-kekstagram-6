import { openFullscreen } from './fullscreen-preview.js';

function renderPictures(picturesData) {
  const pictureTemplate = document.querySelector('#picture').content;
  const picturesContainer = document.querySelector('.pictures');

  const existingPictures = picturesContainer.querySelectorAll('.picture');
  existingPictures.forEach((picture) => picture.remove());

  const fragment = document.createDocumentFragment();

  picturesData.forEach((picture) => {
    const pictureElement = pictureTemplate.cloneNode(true);
    const pictureLink = pictureElement.querySelector('.picture');
    const imgElement = pictureLink.querySelector('.picture__img');
    const likesElement = pictureLink.querySelector('.picture__likes');
    const commentsElement = pictureLink.querySelector('.picture__comments');

    imgElement.src = picture.url;
    imgElement.alt = picture.description;

    likesElement.textContent = picture.likes;
    commentsElement.textContent = picture.comments.length;

    pictureLink.addEventListener('click', (evt) => {
      evt.preventDefault();
      openFullscreen(picture);
    });

    fragment.appendChild(pictureElement);
  });

  picturesContainer.appendChild(fragment);
}

export { renderPictures };
