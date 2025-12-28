const CONFIG = {
  scale: {
    step: 25,
    min: 25,
    max: 100,
    default: 100
  },
  effects: {
    default: 'none',
    settings: {
      none: { min: 0, max: 100, step: 1, filter: '', unit: '' },
      chrome: { min: 0, max: 1, step: 0.1, filter: 'grayscale', unit: '' },
      sepia: { min: 0, max: 1, step: 0.1, filter: 'sepia', unit: '' },
      marvin: { min: 0, max: 100, step: 1, filter: 'invert', unit: '%' },
      phobos: { min: 0, max: 3, step: 0.1, filter: 'blur', unit: 'px' },
      heat: { min: 1, max: 3, step: 0.1, filter: 'brightness', unit: '' }
    }
  }
};

class ImageScaler {
  constructor() {
    this.form = document.querySelector('.img-upload__form');
    this.scaleDisplay = this.form?.querySelector('.scale__control--value');
    this.btnReduce = this.form?.querySelector('.scale__control--smaller');
    this.btnEnlarge = this.form?.querySelector('.scale__control--bigger');
    this.imagePreview = this.form?.querySelector('.img-upload__preview img');
    
    this.currentScale = CONFIG.scale.default;
  }

  setup() {
    if (!this.isReady()) {
      console.warn('Элементы масштабирования не найдены');
      return;
    }

    this.updateScaleDisplay();
    this.bindEvents();
  }

  isReady() {
    return this.scaleDisplay && this.btnReduce && this.btnEnlarge && this.imagePreview;
  }

  bindEvents() {
    this.btnReduce.addEventListener('click', () => this.adjustScale(-CONFIG.scale.step));
    this.btnEnlarge.addEventListener('click', () => this.adjustScale(CONFIG.scale.step));
  }

  adjustScale(change) {
    this.currentScale += change;
    this.currentScale = Math.max(
      CONFIG.scale.min, 
      Math.min(CONFIG.scale.max, this.currentScale)
    );
    this.updateScaleDisplay();
    this.applyScaleToImage();
  }

  updateScaleDisplay() {
    if (this.scaleDisplay) {
      this.scaleDisplay.value = `${this.currentScale}%`;
    }
  }

  applyScaleToImage() {
    if (this.imagePreview) {
      const scaleFactor = this.currentScale / 100;
      this.imagePreview.style.transform = `scale(${scaleFactor})`;
    }
  }

  restoreDefaults() {
    this.currentScale = CONFIG.scale.default;
    this.updateScaleDisplay();
    this.applyScaleToImage();
  }

  resetForNewImage() {
    this.currentScale = CONFIG.scale.default;
    this.updateScaleDisplay();
    this.applyScaleToImage();
  }
}

class ImageEffects {
  constructor() {
    this.form = document.querySelector('.img-upload__form');
    this.imagePreview = this.form?.querySelector('.img-upload__preview img');
    this.effectOptions = this.form?.querySelectorAll('.effects__radio');
    this.effectSliderContainer = this.form?.querySelector('.effect-level');
    this.effectSliderInput = this.form?.querySelector('.effect-level__value');
    this.sliderTrack = this.form?.querySelector('.effect-level__slider');
    
    this.activeEffect = CONFIG.effects.default;
    this.sliderInstance = null;
  }

  setup() {
    if (!this.isReady()) {
      console.warn('Элементы эффектов не найдены');
      return;
    }

    this.prepareSlider();
    this.bindEffectChanges();
    this.selectDefaultEffect();
  }

  isReady() {
    return this.imagePreview && this.effectOptions && this.sliderTrack;
  }

  prepareSlider() {
    if (typeof noUiSlider === 'undefined' || !this.sliderTrack) {
      return;
    }

    this.sliderInstance = noUiSlider.create(this.sliderTrack, {
      range: { min: 0, max: 100 },
      start: 100,
      step: 1,
      connect: 'lower',
      format: {
        to: (num) => Number(num),
        from: (num) => Number(num)
      }
    });

    this.sliderInstance.on('update', (values) => {
      this.handleSliderChange(values[0]);
    });
  }

  bindEffectChanges() {
    this.effectOptions.forEach((option) => {
      option.addEventListener('change', (event) => {
        this.switchEffect(event.target.value);
      });
    });
  }

  switchEffect(effectName) {
    this.activeEffect = effectName;
    this.configureSliderForEffect();
    this.applyCurrentEffect();
  }

  configureSliderForEffect() {
    const effectConfig = CONFIG.effects.settings[this.activeEffect];
    
    if (this.activeEffect === 'none') {
      this.hideSlider();
      return;
    }

    this.showSlider();

    if (this.sliderInstance && effectConfig) {
      this.sliderInstance.updateOptions({
        range: { min: effectConfig.min, max: effectConfig.max },
        step: effectConfig.step,
        start: effectConfig.max
      });
      
      this.sliderInstance.set(effectConfig.max);
      
      if (this.effectSliderInput) {
        this.effectSliderInput.value = effectConfig.max;
      }
    }
  }

  handleSliderChange(value) {
    if (this.effectSliderInput) {
      this.effectSliderInput.value = value;
    }
    this.applyCurrentEffect(value);
  }

  applyCurrentEffect(intensity = null) {
    const effectConfig = CONFIG.effects.settings[this.activeEffect];
    
    if (!effectConfig || this.activeEffect === 'none') {
      this.imagePreview.style.filter = '';
      return;
    }

    const effectValue = intensity !== null ? intensity : effectConfig.max;
    this.imagePreview.style.filter = `${effectConfig.filter}(${effectValue}${effectConfig.unit})`;
  }

  showSlider() {
    if (this.effectSliderContainer) {
      this.effectSliderContainer.classList.remove('hidden');
    }
  }

  hideSlider() {
    if (this.effectSliderContainer) {
      this.effectSliderContainer.classList.add('hidden');
    }
  }

  selectDefaultEffect() {
    const defaultOption = this.form?.querySelector('#effect-none');
    if (defaultOption) {
      defaultOption.checked = true;
    }
    this.switchEffect(CONFIG.effects.default);
  }

  restoreDefaults() {
    this.selectDefaultEffect();
  }

  resetForNewImage() {
    this.selectDefaultEffect();
  }
}

class ImageEditor {
  constructor() {
    this.scaler = new ImageScaler();
    this.effects = new ImageEffects();
  }

  initialize() {
    this.scaler.setup();
    this.effects.setup();
  }

  reset() {
    this.scaler.restoreDefaults();
    this.effects.restoreDefaults();
  }

  resetForNewImage() {
    this.scaler.resetForNewImage();
    this.effects.resetForNewImage();
  }
}

const editor = new ImageEditor();

const initScaleAndEffects = () => {
  editor.initialize();
};

const resetScaleAndEffects = () => {
  editor.reset();
};

export { initScaleAndEffects, resetScaleAndEffects };
