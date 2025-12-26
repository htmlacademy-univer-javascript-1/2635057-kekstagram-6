const uploadFormElement = document.querySelector('.img-upload__form');
const scaleValueElement = uploadFormElement.querySelector('.scale__control--value');
const scaleSmallerButtonElement = uploadFormElement.querySelector('.scale__control--smaller');
const scaleBiggerButtonElement = uploadFormElement.querySelector('.scale__control--bigger');
const previewImageElement = uploadFormElement.querySelector('.img-upload__preview img');
const effectRadiosElements = uploadFormElement.querySelectorAll('.effects__radio');
const effectLevelContainerElement = uploadFormElement.querySelector('.effect-level');
const effectLevelValueElement = uploadFormElement.querySelector('.effect-level__value');
const effectLevelSliderElement = uploadFormElement.querySelector('.effect-level__slider');

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;
const EFFECT_DEFAULT = 'none';

const EFFECT_SETTINGS = {
  none: {
    min: 0,
    max: 100,
    step: 1,
    filter: '',
    unit: ''
  },
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    filter: 'grayscale',
    unit: ''
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    filter: 'sepia',
    unit: ''
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
    filter: 'invert',
    unit: '%'
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    filter: 'blur',
    unit: 'px'
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    filter: 'brightness',
    unit: ''
  }
};

// 1. МАСШТАБИРОВАНИЕ
const setScale = (value) => {
  const clampedValue = Math.max(SCALE_MIN, Math.min(SCALE_MAX, value));
  scaleValueElement.value = `${clampedValue}%`;
  previewImageElement.style.transform = `scale(${clampedValue / 100})`;
};

const onScaleSmallerButtonClick = () => {
  const currentValue = parseInt(scaleValueElement.value, 10);
  const newValue = currentValue - SCALE_STEP;
  setScale(newValue);
};

const onScaleBiggerButtonClick = () => {
  const currentValue = parseInt(scaleValueElement.value, 10);
  const newValue = currentValue + SCALE_STEP;
  setScale(newValue);
};

const initScale = () => {
  setScale(SCALE_DEFAULT);
  scaleSmallerButtonElement.addEventListener('click', onScaleSmallerButtonClick);
  scaleBiggerButtonElement.addEventListener('click', onScaleBiggerButtonClick);
};

// 2. ЭФФЕКТЫ И СЛАЙДЕР
const applyEffect = (effect, value) => {
  const settings = EFFECT_SETTINGS[effect];

  if (!settings || effect === 'none') {
    previewImageElement.style.filter = '';
    return;
  }

  previewImageElement.style.filter = `${settings.filter}(${value}${settings.unit})`;
};

const updateSlider = (effect) => {
  if (!effectLevelSliderElement.noUiSlider) {
    return;
  }

  const settings = EFFECT_SETTINGS[effect];

  if (effect === 'none') {
    effectLevelContainerElement.classList.add('hidden');
    applyEffect(effect, 0);
    return;
  }

  effectLevelContainerElement.classList.remove('hidden');

  effectLevelSliderElement.noUiSlider.updateOptions({
    range: {
      min: settings.min,
      max: settings.max
    },
    step: settings.step,
    start: settings.max
  });

  effectLevelSliderElement.noUiSlider.set(settings.max);
  effectLevelValueElement.value = settings.max;
  applyEffect(effect, settings.max);
};

const onEffectChange = (evt) => {
  const selectedEffect = evt.target.value;
  updateSlider(selectedEffect);
};

const onSliderUpdate = (values, handle) => {
  const currentValue = values[handle];
  const selectedRadioElement = uploadFormElement.querySelector('.effects__radio:checked');
  const selectedEffect = selectedRadioElement ? selectedRadioElement.value : EFFECT_DEFAULT;

  effectLevelValueElement.value = currentValue;
  applyEffect(selectedEffect, currentValue);
};

const initEffects = () => {
  if (typeof noUiSlider !== 'undefined' && effectLevelSliderElement) {
    noUiSlider.create(effectLevelSliderElement, {
      range: {
        min: 0,
        max: 100
      },
      start: 100,
      step: 1,
      connect: 'lower',
      format: {
        to: (value) => Number(value),
        from: (value) => Number(value)
      }
    });

    effectLevelSliderElement.noUiSlider.on('update', onSliderUpdate);
  }

  effectRadiosElements.forEach((radioElement) => {
    radioElement.addEventListener('change', onEffectChange);
  });

  updateSlider(EFFECT_DEFAULT);
};

const resetScaleAndEffects = () => {
  setScale(SCALE_DEFAULT);

  const noneRadioElement = uploadFormElement.querySelector('#effect-none');
  if (noneRadioElement) {
    noneRadioElement.checked = true;
  }

  updateSlider(EFFECT_DEFAULT);

  if (effectLevelSliderElement.noUiSlider) {
    const settings = EFFECT_SETTINGS[EFFECT_DEFAULT];
    effectLevelSliderElement.noUiSlider.set(settings.max);
  }
};

const initScaleAndEffects = () => {
  initScale();
  initEffects();
};

export { initScaleAndEffects, resetScaleAndEffects };
