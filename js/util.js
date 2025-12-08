function getRandomInt(min, max) {
    if (min < 0 || max < 0) {
      return -1;
    }
  
    if (min > max) {
      [min, max] = [max, min];
    }
  
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function getRandomArrayElement(elements) {
    return elements[getRandomInt(0, elements.length - 1)];
  }
  
  function createRandomIdFromRangeGenerator(min, max) {
    const previousValues = [];
  
    return function() {
      let currentValue = getRandomInt(min, max);
  
      while (previousValues.includes(currentValue)) {
        currentValue = getRandomInt(min, max);
      }
  
      previousValues.push(currentValue);
      return currentValue;
    };
  }
  
  function checkStringLength(string, maxLength) {
    return string.length <= maxLength;
  }
  
  function isPalindrome(string) {
    const normalizedString = string.replaceAll(' ', '').toLowerCase();
    const reversedString = normalizedString.split('').reverse().join('');
    return normalizedString === reversedString;
  }
  
  function extractNumber(value) {
    const string = String(value);
    const digits = string.match(/\d/g);
  
    if (!digits) {
      return NaN;
    }
  
    return parseInt(digits.join(''), 10);
  }
  
  export { getRandomInt, getRandomArrayElement, createRandomIdFromRangeGenerator, checkStringLength, isPalindrome, extractNumber };