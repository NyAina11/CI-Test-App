function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function isEven(n) {
  return n % 2 === 0;
}

function factorial(n) {
  if (n < 0) throw new Error('factorial: n doit être >= 0');
  return n <= 1 ? 1 : n * factorial(n - 1);
}

module.exports = { add, isEven, factorial };
