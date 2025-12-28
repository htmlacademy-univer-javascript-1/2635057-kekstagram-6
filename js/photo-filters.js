import { createDebouncer } from './debounce.js';

const RANDOM_COUNT = 10;
const DELAY_MS = 500;

class PhotoFilters {
  constructor() {
    this.photos = [];
    this.debouncedFilter = createDebouncer(DELAY_MS);
    this.container = document.querySelector('.img-filters');
    this.buttons = null;
  }

  setup(photos, updateCallback) {
    if (!this.container) {
      return;
    }

    this.photos = [...photos];
    this.updateCallback = updateCallback;

    this.showContainer();
    this.setupButtons();
  }

  showContainer() {
    this.container.classList.remove('img-filters--inactive');
  }

  setupButtons() {
    this.buttons = this.container.querySelectorAll('.img-filters__button');

    this.buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        this.handleButtonClick(event);
      });
    });
  }

  handleButtonClick(event) {
    const clicked = event.target;
    if (!clicked.matches('.img-filters__button')) {
      return;
    }

    const active = this.container.querySelector('.img-filters__button--active');
    if (active) {
      active.classList.remove('img-filters__button--active');
    }

    clicked.classList.add('img-filters__button--active');

    const filterId = clicked.id;

    const applyFilter = () => {
      const filtered = this.applyFilter(filterId);
      if (this.updateCallback) {
        this.updateCallback(filtered);
      }
    };

    this.debouncedFilter(applyFilter)();
  }

  applyFilter(filterId) {
    switch(filterId) {
      case 'filter-random':
        return this.getRandomPhotos();
      case 'filter-discussed':
        return this.getDiscussedPhotos();
      default:
        return [...this.photos];
    }
  }

  getRandomPhotos() {
    const shuffled = [...this.photos].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, RANDOM_COUNT);
  }

  getDiscussedPhotos() {
    return [...this.photos].sort((a, b) => b.comments.length - a.comments.length);
  }
}

export { PhotoFilters };
