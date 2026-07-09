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

    if (url.pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><title>ci-test-app</title></head>
<body style="font-family: system-ui, sans-serif; background:#0b0f14; color:#e6edf3; padding:2rem;">
  <h1>✅ ci-test-app est en ligne test</h1>
  <p>Version de build : ${new Date().toISOString()}</p>
  <p>Endpoints disponibles :</p>
  <ul>
    <li><a style="color:#58a6ff" href="/health">/health</a></li>
    <li><a style="color:#58a6ff" href="/add?a=2&b=3">/add?a=2&b=3</a></li>
  </ul>
</body>
</html>`);
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
