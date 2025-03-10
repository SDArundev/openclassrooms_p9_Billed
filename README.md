## Debugger un saas

### Outils de débogage

1. **Console du navigateur**
   - Utilisez les DevTools (F12) pour surveiller les logs et les erreurs
   - Vérifiez les requêtes réseau dans l'onglet "Network"

2. **Tests Jest**
   - Exécutez tous les tests : `npm run test`
   - Exécutez un test spécifique :
     ```bash
     npm i -g jest-cli
     jest src/__tests__/your_test_file.js
     ```
   - Consultez la couverture de test : `http://127.0.0.1:8080/coverage/lcov-report/`

3. **Environnement de développement**
   - Backend API : `http://localhost:5678`
   - Frontend : `http://127.0.0.1:8080`

### Points de vérification courants

1. **Authentification**
   - Vérifiez le token JWT dans le localStorage
   - Comptes de test :
     ```
     Admin:
     - email: admin@test.tld
     - mot de passe: admin

     Employé:
     - email: employee@test.tld
     - mot de passe: employee
     ```

2. **Requêtes API**
   - Vérifiez les en-têtes d'autorisation
   - Validez le format des données envoyées
   - Surveillez les codes de réponse HTTP

3. **Base de données**
   - Environnements disponibles : development, test, production
   - Les fichiers SQLite sont stockés localement :
     - Dev : `database_dev.sqlite`
     - Test : `database_test.sqlite`
     - Prod : `database_prod.sqlite`

### Résolution des problèmes courants

1. **Erreurs d'installation**
   - Vérifiez la compatibilité de la version Node.js (v16 ou v18 recommandée)
   - Utilisez NVM pour gérer les versions de Node :
     - Windows : via nvm-windows
     - Mac/Linux : via nvm standard

2. **Problèmes de connexion API**
   - Vérifiez que le backend tourne sur le port 5678
   - Assurez-vous que CORS est correctement configuré
   - Validez les routes API dans `app.js`

3. **Problèmes de tests**
   - Nettoyez le cache Jest si nécessaire
   - Vérifiez les mocks et fixtures dans `/tests`
   - Assurez-vous que la base de test est réinitialisée entre les tests