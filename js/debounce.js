function createDebouncer(delay = 500) {
  let timerId = null;

  return function(callback) {
    return function(...args) {
      if (timerId) {
        clearTimeout(timerId);
      }

      timerId = setTimeout(() => {
        callback.apply(this, args);
        timerId = null;
      }, delay);
    };
  };
}

export { createDebouncer };
