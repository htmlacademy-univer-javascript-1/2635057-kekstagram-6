import { resetScaleAndEffects } from './scale-and-effects.js';
import { submitFormData } from './server-api.js';

const HASHTAG_MAX_LENGTH = 20;
const HASHTAG_COUNT_LIMIT = 5;

function showNotification(type, message = '') {
  const notification = document.createElement('div');
  notification.className = `form-${type}-notification`;
  
  const icons = {
    success: '✅',
    error: '❌'
  };
  
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${icons[type] || ''}</span>
      <span class="notification-text">${message}</span>
      <button class="notification-close">×</button>
    </div>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#4caf50' : '#f44336'};
    color: white;
    padding: 12px 24px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
      to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes slideOut {
      from { transform: translateX(-50%) translateY(0); opacity: 1; }
      to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
      if (style.parentNode) {
        style.remove();
      }
    }, 300);
  });
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
        if (style.parentNode) {
          style.remove();
        }
      }, 300);
    }
  }, 5000);
  
  const closeOnOutsideClick = (event) => {
    if (!notification.contains(event.target)) {
      notification.remove();
      document.removeEventListener('click', closeOnOutsideClick);
      if (style.parentNode) {
        style.remove();
      }
    }
  };
  
  setTimeout(() => {
    document.addEventListener('click', closeOnOutsideClick);
  }, 100);
}

function setupImageUploadForm() {
  const uploadFormElement = document.querySelector('.img-upload__form');

  if (!uploadFormElement) {
    return;
  }

  const imageFileInput = uploadFormElement.querySelector('.img-upload__input');
  const editOverlay = document.querySelector('.img-upload__overlay');
  const closeEditButton = editOverlay.querySelector('#upload-cancel');
  const hashtagInput = uploadFormElement.querySelector('.text__hashtags');
  const commentTextarea = uploadFormElement.querySelector('.text__description');

  let currentValidationError = '';

  if (typeof Pristine === 'undefined') {
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
    
    if (typeof resetScaleAndEffects === 'function') {
      resetScaleAndEffects();
    }
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

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    const isFormValid = validator.validate();
    
    if (!isFormValid) {
      validator.validate();
      updateSubmitButtonState();
      return;
    }
    
    const submitButton = uploadFormElement.querySelector('.img-upload__submit');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Отправляем...';
    
    try {
      const formData = new FormData(uploadFormElement);
      
      const result = await submitFormData(formData);
      
      if (result.success) {
        showNotification('success', 'Фотография успешно опубликована!');
        
        hideUploadForm();
        
        setTimeout(() => {
          if (typeof loadAndDisplayPhotos === 'function') {
            loadAndDisplayPhotos();
          }
        }, 1000);
        
      } else {
        showNotification('error', result.error || 'Ошибка при отправке');
        
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
      
    } catch (error) {
      console.error('Ошибка при обработке формы:', error);
      showNotification('error', 'Неизвестная ошибка. Попробуйте позже');
      
      submitButton.disabled = false;
      submitButton.textContent = originalText;
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