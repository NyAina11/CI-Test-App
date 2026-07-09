# ci-test-app

Petite application Node.js **sans dépendance externe**, conçue uniquement
pour servir de dépôt de test au projet [Pipeline CI/CD](../cicd-project) :
elle a de vraies étapes `install` / `test` / `build` qui fonctionnent, pour
valider que le pipeline s'exécute correctement de bout en bout.

## Ce que fait le projet

- `src/math.js` : quelques fonctions simples (`add`, `isEven`, `factorial`)
- `src/index.js` : un serveur HTTP natif (`http` du cœur de Node, aucune lib
  externe) exposant `GET /health` et `GET /add?a=..&b=..`
- `test/*.test.js` : 6 tests unitaires/intégration avec le test runner natif
  de Node (`node:test` + `node:assert`)
- `scripts/build.js` : génère un dossier `dist/` avec un manifeste
  (nom, version, date de build, version de Node) — une étape "build" simple
  mais avec un effet réel et vérifiable

Aucune dépendance runtime : `npm install` est quasi instantané, ce qui rend
les tests du pipeline rapides et fiables.

## Utilisation en local

```bash
npm install
npm test     # lance les 6 tests (node --test)
npm run build  # génère dist/manifest.json
npm start    # démarre le serveur sur http://localhost:3000
```

## Mise sur GitHub

```bash
cd ci-test-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<ton-utilisateur>/ci-test-app.git
git push -u origin main
```

## Utilisation avec le projet Pipeline CI/CD

### 1. Déclenchement manuel

Dans l'onglet **"Nouveau déploiement"** du projet principal :

| Champ | Valeur |
|---|---|
| Dépôt | `https://github.com/<ton-utilisateur>/ci-test-app.git` |
| Branche | `main` |

Étapes à utiliser (celles par défaut conviennent déjà) :

| Nom | Commande |
|---|---|
| `install` | `npm install` |
| `test` | `npm test` |
| `build` | `npm run build --if-present` |
| `deploy` | `echo "Déployé avec succès !"` |

Toutes les étapes doivent passer au vert.

### 2. Déclenchement automatique (polling)

Dans l'onglet **"Surveillance (auto)"** :

| Champ | Valeur |
|---|---|
| Dépôt | `https://github.com/<ton-utilisateur>/ci-test-app.git` |
| Branche | `main` |
| Intervalle | `30` (secondes, pour voir vite le résultat en démo) |

Ensuite, pousse un commit sur `main` (par exemple modifie `README.md`) : au
prochain contrôle, le pipeline se déclenche tout seul, sans webhook ni IP
publique.

### 3. Déploiement persistant (zero-downtime)

`ci-test-app` est prêt pour le mode "déploiement persistant" du projet
principal : il lit déjà `PORT` depuis l'environnement et expose `/health`.

Dans le formulaire (manuel ou watch), coche "Déploiement persistant" avec :

| Champ | Valeur |
|---|---|
| Commande de démarrage | `npm start` |
| Route de vérification de santé | `/health` |

Lance un premier pipeline réussi → une URL "Application en ligne" apparaît
(ex: `http://localhost:41234`), clique dessus pour voir la page d'accueil.

Ensuite, pour observer la bascule intelligente :
1. Pousse un commit qui **casse un test** (voir section 4 ci-dessous) → le
   nouveau pipeline échoue à l'étape `test`, l'étape `serve` est ignorée, et
   **l'ancienne URL continue de répondre normalement**.
2. Corrige le test et pousse à nouveau → le nouveau pipeline réussit,
   **l'ancien serveur est arrêté**, et une **nouvelle URL** (nouveau port)
   apparaît comme "Application en ligne".

### 4. Simuler un échec de pipeline

Pour tester le comportement en cas d'échec (étape rouge + étapes suivantes
ignorées), casse volontairement un test avant de pousser, par exemple dans
`test/math.test.js` :

```js
test('add() additionne correctement deux nombres', () => {
  assert.equal(add(2, 3), 999); // ← assertion volontairement fausse
});
```

Commit + push → le pipeline échoue à l'étape `test`, et les étapes `build`
et `deploy` passeront en statut "Ignorée".

N'oublie pas de revenir à la version correcte ensuite pour continuer à
tester le cas de succès.
