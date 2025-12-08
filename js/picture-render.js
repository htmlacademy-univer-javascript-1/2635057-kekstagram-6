function renderPictures(picturesData) {
  const pictureTemplate = document.querySelector('#picture').content;
  const picturesContainer = document.querySelector('.pictures');

  if (!pictureTemplate || !picturesContainer) {
    return;
  }

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

    fragment.appendChild(pictureElement);
  });

  picturesContainer.innerHTML = '';
  picturesContainer.appendChild(fragment);
}

export { renderPictures };
