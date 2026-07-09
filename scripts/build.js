const fs = require('fs');
const path = require('path');

/**
 * Étape "build" volontairement simple : elle ne fait pas de bundling
 * (ce n'est pas nécessaire pour une appli en HTTP natif), mais elle
 * génère un vrai dossier dist/ avec un manifeste, pour que l'étape ait
 * un effet observable et vérifiable dans le pipeline CI/CD.
 */
const distDir = path.join(__dirname, '..', 'dist');
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

const manifest = {
  name: require('../package.json').name,
  version: require('../package.json').version,
  builtAt: new Date().toISOString(),
  node: process.version
};

fs.writeFileSync(path.join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
fs.copyFileSync(path.join(__dirname, '..', 'src', 'index.js'), path.join(distDir, 'index.js'));
fs.copyFileSync(path.join(__dirname, '..', 'src', 'math.js'), path.join(distDir, 'math.js'));

console.log('Build terminé : dist/manifest.json généré ->', manifest);
