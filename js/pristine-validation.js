const HASHTAG_MAX_LENGTH = 20;
const HASHTAG_COUNT_LIMIT = 5;


function setupImageUploadForm() {
  const uploadFormElement = document.querySelector('.img-upload__form');
  
  if (!uploadFormElement) {
    console.error('Элемент .img-upload__form не найден на странице');
    return;
  }
  
  const imageFileInput = uploadFormElement.querySelector('.img-upload__input');
  const editOverlay = document.querySelector('.img-upload__overlay');
  const closeEditButton = editOverlay.querySelector('#upload-cancel');
  const hashtagInput = uploadFormElement.querySelector('.text__hashtags');
  const commentTextarea = uploadFormElement.querySelector('.text__description');

  let currentValidationError = '';

  if (typeof Pristine === 'undefined') {
    console.error('Библиотека Pristine не загружена');
    return;
  }

  const validator = new Pristine(uploadFormElement, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'span',
    errorTextClass: 'img-upload__error'
  });


  const getValidationError = () => currentValidationError;

  const validateCommentLength = (commentText) => {
    const maxCommentLength = 140;
    return commentText.length <= maxCommentLength;
  };

  const validateHashtagsInput = (hashtagText) => {
    currentValidationError = '';
    const normalizedText = hashtagText.toLowerCase().trim();

    if (!normalizedText) {
      return true;
    }

    const tagsList = normalizedText.split(/\s+/);

    const hasInternalHash = tagsList.some((tag) => tag.indexOf('#', 1) >= 1);
    if (hasInternalHash) {
      currentValidationError = 'Хэш-теги должны разделяться одним пробелом';
      return false;
    }

    const missingHashPrefix = tagsList.some((tag) => tag[0] !== '#');
    if (missingHashPrefix) {
      currentValidationError = 'Хэш-тег должен начинаться с символа #';
      return false;
    }

    const hasEmptyTags = tagsList.some((tag) => tag === '#');
    if (hasEmptyTags) {
      currentValidationError = 'Хэш-тег не может состоять только из #';
      return false;
    }

    const hasDuplicates = tagsList.some((tag, index, array) => array.includes(tag, index + 1));
    if (hasDuplicates) {
      currentValidationError = 'Хэш-теги не должны повторяться';
      return false;
    }

    const exceededLength = tagsList.some((tag) => tag.length > HASHTAG_MAX_LENGTH);
    if (exceededLength) {
      currentValidationError = `Максимальная длина одного хэш-тега ${HASHTAG_MAX_LENGTH} символов, включая решётку`;
      return false;
    }

    if (tagsList.length > HASHTAG_COUNT_LIMIT) {
      currentValidationError = `Нельзя указать больше ${HASHTAG_COUNT_LIMIT} хэш-тегов`;
      return false;
    }

    const invalidChars = tagsList.some((tag) => !/^#[a-zа-яё0-9]{1,19}$/i.test(tag));
    if (invalidChars) {
      currentValidationError = 'Хэш-тег содержит недопустимые символы';
      return false;
    }

    return true;
  };

  const updateSubmitButtonState = () => {
    const submitButton = uploadFormElement.querySelector('.img-upload__submit');
    const isFormValid = validator.validate();

    submitButton.disabled = !isFormValid;
    if (!isFormValid) {
      submitButton.setAttribute('title', 'Исправьте ошибки в форме');
    } else {
      submitButton.removeAttribute('title');
    }
  };

  const displayUploadForm = () => {
    if (!imageFileInput.files[0]) {
      return;
    }
    editOverlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
  };

  const hideUploadForm = () => {
    editOverlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
    uploadFormElement.reset();
    validator.reset();
    imageFileInput.value = '';
    const submitBtn = uploadFormElement.querySelector('.img-upload__submit');
    submitBtn.disabled = false;
    submitBtn.removeAttribute('title');
  };

  const onHashtagFieldInput = () => {
    validator.validate();
    updateSubmitButtonState();
  };

  const onCommentFieldInput = () => {
    validator.validate();
    updateSubmitButtonState();
  };

  const handleDocumentEscape = (event) => {
    if (event.key === 'Escape') {
      if (document.activeElement === hashtagInput || document.activeElement === commentTextarea) {
        return;
      }
      hideUploadForm();
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const isFormValid = validator.validate();

    if (isFormValid) {
      uploadFormElement.submit();
    } else {
      validator.validate();
      updateSubmitButtonState();
    }
  };

  validator.addValidator(
    hashtagInput,
    validateHashtagsInput,
    getValidationError,
    2,
    false
  );

  validator.addValidator(
    commentTextarea,
    validateCommentLength,
    'Комментарий не должен превышать 140 символов',
    2,
    false
  );

  imageFileInput.addEventListener('change', displayUploadForm);
  closeEditButton.addEventListener('click', hideUploadForm);
  document.addEventListener('keydown', handleDocumentEscape);

  [hashtagInput, commentTextarea].forEach((inputField) => {
    inputField.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
      }
    });
  });

  hashtagInput.addEventListener('input', onHashtagFieldInput);
  commentTextarea.addEventListener('input', onCommentFieldInput);
  uploadFormElement.addEventListener('submit', handleFormSubmit);

  updateSubmitButtonState();
}

export { setupImageUploadForm };