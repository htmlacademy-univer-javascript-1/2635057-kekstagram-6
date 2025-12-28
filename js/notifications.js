export function showSuccessMessage() {
  const successTemplate = document.querySelector('#success');
  if (!successTemplate) {return;}

  const successElement = successTemplate.content.cloneNode(true);
  const successContainer = successElement.querySelector('.success');
  const successButton = successContainer.querySelector('.success__button');

  document.body.appendChild(successElement);

  const closeSuccess = () => {
    if (successContainer.parentNode) {
      successContainer.parentNode.removeChild(successContainer);
    }
    document.removeEventListener('keydown', onEscapePress);
    document.removeEventListener('click', onOutsideClick);
  };

  const onEscapePress = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeSuccess();
    }
  };

  const onOutsideClick = (evt) => {
    if (!evt.target.closest('.success__inner')) {
      closeSuccess();
    }
  };

  successButton.addEventListener('click', closeSuccess);
  document.addEventListener('keydown', onEscapePress);
  setTimeout(() => {
    document.addEventListener('click', onOutsideClick);
  }, 100);
}

export function showErrorMessage() {
  const errorTemplate = document.querySelector('#error');
  if (!errorTemplate) {return;}

  const errorElement = errorTemplate.content.cloneNode(true);
  const errorContainer = errorElement.querySelector('.error');
  const errorButton = errorContainer.querySelector('.error__button');

  document.body.appendChild(errorElement);

  const closeError = () => {
    if (errorContainer.parentNode) {
      errorContainer.parentNode.removeChild(errorContainer);
    }
    document.removeEventListener('keydown', onEscapePress);
    document.removeEventListener('click', onOutsideClick);
  };

  const onEscapePress = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeError();
    }
  };

  const onOutsideClick = (evt) => {
    if (!evt.target.closest('.error__inner')) {
      closeError();
    }
  };

  errorButton.addEventListener('click', closeError);
  document.addEventListener('keydown', onEscapePress);
  setTimeout(() => {
    document.addEventListener('click', onOutsideClick);
  }, 100);
}
