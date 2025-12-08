function checkStringLength(str, maxLength) {
    return str.length <= maxLength;
  }
  
  console.log(checkStringLength('проверяемая строка', 20)); // true
  console.log(checkStringLength('проверяемая строка', 10)); // false
  
  
  function isPalindrome(str) {
    const normalized = str.toLowerCase().replaceAll(' ', '');
    return normalized === normalized.split('').reverse().join('');
  }
  
  console.log(isPalindrome('топот')); // true
  console.log(isPalindrome('ДовОд')); // true
  console.log(isPalindrome('Кекс'));  // false
  console.log(isPalindrome('Лёша на полке клопа нашёл')); // true
  
  
  function extractNumber(value) {
    const str = String(value);
    const digits = str.match(/\d/g);
    if (!digits) {
      return NaN;
    }
    return parseInt(digits.join(''), 10);
  }
  
  console.log(extractNumber('2023 год'));            // 2023
  console.log(extractNumber('ECMAScript 2022'));     // 2022
  console.log(extractNumber('1 кефир, 0.5 батона')); // 105
  console.log(extractNumber('агент 007'));           // 7
  console.log(extractNumber('а я томат'));           // NaN
  console.log(extractNumber(2023)); // 2023
  console.log(extractNumber(-1));   // 1
  console.log(extractNumber(1.5));  // 15
  