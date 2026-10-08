Titre : Gestion des comptes du personnel par l'administrateur

## Contexte
CLAUDE.md §3.3 : l'administrateur crée les comptes agents et les désactive au départ d'un employé. Jusqu'ici, le front ne savait que lire les comptes du personnel et n'avait ni routes protégées ni espace agence.

## Changements
- **API** (`agents.api.js`) : `creerAgent`, `modifierAgent`, `changerStatutAgent`, `definirMotDePasseAgent`.
- **Accès** : `ProtectedRoute` (redirection vers `/connexion`) et `RoleRoute` (filtrage par rôle) ; `AuthContext` expose `role`, `estPersonnel` et `estAdministrateur`.
- **Espace agence** `/gestion` : `BackOfficeLayout` avec `SideMenu`, bouton « Espace agence » dans l'en-tête et redirection du personnel vers cet espace après connexion.
- **Page `/gestion/agents`** (administrateur) : recherche (nom, rôle, statut), pagination, création, modification, désactivation / réactivation après confirmation, nouveau mot de passe. L'administrateur connecté ne peut pas désactiver son propre compte.
- **Composants UI** : `Select`, `Modal` (`<dialog>` natif), `Pagination`, `SuccessMessage` et variante de bouton `danger`. Ajout de la page 404.
- Validation côté client (`validerAgent`, `validerNouveauMotDePasse`) alignée sur les règles de mot de passe de l'API.

## À savoir pour la revue
- Cette branche part de `feature/page-inscription`, qui n'est pas encore fusionnée : la PR contient donc aussi le commit `6364048` (page d'inscription). Fusionner cette branche d'abord, ou accepter les deux ensemble.
- Une réponse 401 (token expiré) ne déconnecte pas automatiquement : l'erreur s'affiche dans la page. À traiter dans `axiosClient` dans une PR séparée.

## Tests
- `npm run lint` et `npm run build` passent sans erreur.
- Redirections vérifiées dans le navigateur : visiteur → `/connexion`, client → accueil.
- Avec l'API réelle et un faux token, l'erreur s'affiche proprement.
- Parcours création, modification, statut, mot de passe, e-mail en double et filtres testés avec des réponses d'API simulées : pas encore validés avec un vrai compte administrateur.
- Pas de débordement horizontal en mobile (375 px).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
