const test = require('node:test');
const assert = require('node:assert/strict');
const { add, isEven, factorial } = require('../src/math');

test('add() additionne correctement deux nombres', () => {
  assert.equal(add(2, 3), 5);
  assert.equal(add(-1, 1), 0);
});

test('isEven() détecte les nombres pairs', () => {
  assert.equal(isEven(4), true);
  assert.equal(isEven(7), false);
});

test('factorial() calcule la factorielle', () => {
  assert.equal(factorial(0), 1);
  assert.equal(factorial(5), 120);
});

test('factorial() rejette les nombres négatifs', () => {
  assert.throws(() => factorial(-1));
});
