const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../src/index');

test('GET /health répond status ok', async () => {
  const server = createServer().listen(0);
  const port = server.address().port;

  const res = await fetch(`http://localhost:${port}/health`);
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body.status, 'ok');

  server.close();
});

test('GET /add?a=2&b=3 renvoie 5', async () => {
  const server = createServer().listen(0);
  const port = server.address().port;

  const res = await fetch(`http://localhost:${port}/add?a=2&b=3`);
  const body = await res.json();

  assert.equal(body.result, 5);

  server.close();
});
