const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const closeButton = bigPicture.querySelector('#picture-cancel');
const commentCountElement = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');

const COMMENTS_PER_STEP = 5;
let currentComments = [];
let commentsShown = 0;

commentCountElement.classList.remove('hidden');
commentsLoader.classList.remove('hidden');

function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const imgElement = document.createElement('img');
  imgElement.classList.add('social__picture');
  imgElement.src = comment.avatar;
  imgElement.alt = comment.name;
  imgElement.width = 35;
  imgElement.height = 35;

  const textElement = document.createElement('p');
  textElement.classList.add('social__text');
  textElement.textContent = comment.message;

  commentElement.appendChild(imgElement);
  commentElement.appendChild(textElement);

  return commentElement;
}

function renderComments() {
  const commentsToShow = Math.min(commentsShown + COMMENTS_PER_STEP, currentComments.length);

  if (commentsShown === 0) {
    socialComments.innerHTML = '';
  }

  for (let i = commentsShown; i < commentsToShow; i++) {
    const commentElement = createCommentElement(currentComments[i]);
    socialComments.appendChild(commentElement);
  }

  commentCountElement.innerHTML = `${commentsToShow} из <span class="comments-count">${currentComments.length}</span> комментариев`;

  if (commentsToShow >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }

  commentsShown = commentsToShow;
}

function onCommentsLoaderClick() {
  renderComments();
}

function resetCommentsState() {
  currentComments = [];
  commentsShown = 0;
  commentsLoader.classList.remove('hidden');
}

function openFullscreen(pictureData) {
  bigPictureImg.src = pictureData.url;
  bigPictureImg.alt = pictureData.description;
  likesCount.textContent = pictureData.likes;
  commentsCount.textContent = pictureData.comments.length;
  socialCaption.textContent = pictureData.description;

  currentComments = pictureData.comments;
  commentsShown = 0;

  renderComments();

  commentsLoader.addEventListener('click', onCommentsLoaderClick);

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function closeFullscreen() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');

  commentsLoader.removeEventListener('click', onCommentsLoaderClick);

  resetCommentsState();
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
