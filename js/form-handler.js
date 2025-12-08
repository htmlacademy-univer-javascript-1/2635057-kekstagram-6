import Pristine from '../vendor/pristine/pristine.js';


const uploadForm = document.querySelector('.img-upload__form');
const uploadInput = uploadForm.querySelector('.img-upload__input');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancel = uploadForm.querySelector('#upload-cancel');
const hashtagInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');

function openUploadForm() {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function closeUploadForm() {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadForm.reset();
}

function validateHashtags(value) {
  if (value === '') {
    return true;
  }

  const hashtags = value.trim().toLowerCase().split(/\s+/);

  if (hashtags.length > 5) {
    return false;
  }

  const hashtagPattern = /^#[a-zа-яё0-9]{1,19}$/i;
  const seenHashtags = new Set();

  for (const hashtag of hashtags) {
    if (!hashtagPattern.test(hashtag)) {
      return false;
    }

    if (seenHashtags.has(hashtag)) {
      return false;
    }

    seenHashtags.add(hashtag);
  }

  return true;
}

function getHashtagErrorMessage(value) {
  if (value === '') {
    return '';
  }

  const hashtags = value.trim().split(/\s+/);

  if (hashtags.length > 5) {
    return 'Можно указать не более 5 хэш-тегов';
  }

  const hashtagPattern = /^#[a-zа-яё0-9]{1,19}$/i;
  const seenHashtags = new Set();

  for (const hashtag of hashtags) {
    if (!hashtag.startsWith('#')) {
      return 'Хэш-тег должен начинаться с символа #';
    }

    if (hashtag === '#') {
      return 'Хэш-тег не может состоять только из #';
    }

    if (hashtag.includes(' ')) {
      return 'Хэш-теги разделяются пробелами';
    }

    if (!hashtagPattern.test(hashtag)) {
      return 'Хэш-тег содержит недопустимые символы';
    }

    const lowerHashtag = hashtag.toLowerCase();
    if (seenHashtags.has(lowerHashtag)) {
      return 'Хэш-теги не должны повторяться';
    }

    seenHashtags.add(lowerHashtag);
  }

  return '';
}

function validateComment(value) {
  return value.length <= 140;
}

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'form__item--invalid',
  successClass: 'form__item--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'span',
  errorTextClass: 'form__error-text'
});

pristine.addValidator(
  hashtagInput,
  validateHashtags,
  getHashtagErrorMessage
);

pristine.addValidator(
  commentInput,
  validateComment,
  'Длина комментария не может быть больше 140 символов'
);

uploadInput.addEventListener('change', () => {
  openUploadForm();
});

uploadCancel.addEventListener('click', () => {
  closeUploadForm();
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    if (document.activeElement === hashtagInput || document.activeElement === commentInput) {
      return;
    }

    if (!uploadOverlay.classList.contains('hidden')) {
      evt.preventDefault();
      closeUploadForm();
    }
  }
});

uploadForm.addEventListener('submit', (evt) => {
  const isValid = pristine.validate();

  if (!isValid) {
    evt.preventDefault();
  }
});

export { openUploadForm, closeUploadForm };
