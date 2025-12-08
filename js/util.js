const getRandomInt = (a, b) => {
    const lower = Math.ceil(Math.min(a, b));
    const upper = Math.floor(Math.max(a, b));
    const result = Math.random() * (upper - lower + 1) + lower;
    return Math.floor(result);
  };
  
  const getRandomArrayElement = (elements) => elements[getRandomInt(0, elements.length - 1)];
  
  function createRandomIdFromRangeGenerator(min, max) {
    const previousValues = [];
  
    return function() {
      let currentValue = getRandomInt(min, max);
      if (previousValues.length >= (max - min + 1)) {
        return null;
      }
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