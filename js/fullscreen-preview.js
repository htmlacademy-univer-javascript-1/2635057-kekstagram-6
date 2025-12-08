const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const closeButton = bigPicture.querySelector('#picture-cancel');
const commentCountElement = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');

commentCountElement.classList.add('hidden');
commentsLoader.classList.add('hidden');

function renderComments(comments) {
  socialComments.innerHTML = '';
  
  comments.forEach((comment) => {
    const commentElement = document.createElement('li');
    commentElement.classList.add('social__comment');
    
    commentElement.innerHTML = `
      <img
        class="social__picture"
        src="${comment.avatar}"
        alt="${comment.name}"
        width="35" height="35">
      <p class="social__text">${comment.message}</p>
    `;
    
    socialComments.appendChild(commentElement);
  });
}

function openFullscreen(pictureData) {
  bigPictureImg.src = pictureData.url;
  bigPictureImg.alt = pictureData.description;
  likesCount.textContent = pictureData.likes;
  commentsCount.textContent = pictureData.comments.length;
  socialCaption.textContent = pictureData.description;
  
  renderComments(pictureData.comments);
  
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function closeFullscreen() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

closeButton.addEventListener('click', () => {
  closeFullscreen();
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' && !bigPicture.classList.contains('hidden')) {
    evt.preventDefault();
    closeFullscreen();
  }
});

export { openFullscreen, closeFullscreen };