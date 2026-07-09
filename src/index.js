const http = require('http');
const { add, isEven, factorial } = require('./math');

/**
 * Application minimaliste en HTTP natif (aucune dépendance externe),
 * pour que ce dépôt reste rapide à cloner/installer lors des tests
 * du pipeline CI/CD.
 */
function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    if (url.pathname === '/add') {
      const a = Number(url.searchParams.get('a'));
      const b = Number(url.searchParams.get('b'));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ result: add(a, b) }));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route inconnue' }));
  });
}

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  createServer().listen(PORT, () => {
    console.log(`ci-test-app démarré sur http://localhost:${PORT}`);
  });
}

module.exports = { createServer, add, isEven, factorial };
