# Front-end de site de voyage

## 1. Contexte

- Petite agence de voyage familiale (fondée en 1987), **7 personnes dont 4 conseillers**.
- Situation actuelle : données dispersées dans des classeurs, fichiers Excel et notes papier → informations perdues, clients confondus (homonymes).
- **Objectif de la V1** : une application web centralisant les **comptes** (clients et agents) et un **catalogue** propre (pays, destinations, activités).

---

## 2. Acteurs et rôles

| Rôle | Création du compte | Description |
|---|---|---|
| **Visiteur** (non connecté) | — | Consulte le catalogue *(à confirmer)* |
| **Client** | S'inscrit lui-même | Consulte le catalogue, gère son profil |
| **Agent** | Créé par un administrateur | Gère le catalogue, consulte les clients |
| **Administrateur** | — (actuellement : la gérante uniquement) | Agent + gestion des comptes agents |

> Proposition de l'analyste (à valider) : **deux rôles côté personnel**, *agent* et *administrateur*.

---

## 3. Fonctionnalités

### 3.1 Client

- S'inscrire (nom, prénom, e-mail, téléphone, date de naissance, mot de passe).
- Se connecter avec **e-mail + mot de passe**.
- Récupérer son mot de passe oublié.
- Consulter le catalogue : pays, destinations, activités par pays.
- Modifier ses informations personnelles.
- Demander la **suppression de son compte** (RGPD).
- *(Peut-être)* Gérer des **favoris** (nécessite un compte).

### 3.2 Agent

- Se connecter (identifiants fournis par l'administrateur).
- **CRUD du catalogue** : pays, destinations, activités.
- Masquer / réactiver un élément du catalogue.
- Consulter la liste des clients et leur dossier.
- Modifier les informations d'un client (correction), **sauf son mot de passe**.

### 3.3 Administrateur

- Toutes les fonctionnalités de l'agent.
- Créer les comptes agents.
- Désactiver les comptes agents (départ d'un employé).

### 3.4 Recherche et navigation (côté client)

- Parcourir la liste des pays → voir les destinations et activités d'un pays.
- Recherche par **mot-clé**.
- Filtre par **catégorie d'activité**.
- Filtre par **budget**.
- Interface volontairement simple.

---

## 4. Modèle de données

### 4.1 Entités et attributs

**Client**
- nom, prénom
- e-mail (**unique**, identifiant de connexion)
- téléphone
- date de naissance
- mot de passe

**Agent**
- nom, prénom
- e-mail professionnel (identifiant de connexion)
- mot de passe
- numéro d'employé *(demandé pour la paie, hors besoin logiciel)*
- rôle : agent / administrateur
- statut : actif / désactivé

**Pays**
- nom
- continent
- langue principale
- monnaie
- description courte
- visa requis pour les Belges (oui/non)
- décalage horaire avec la Belgique
- statut actif / masqué

**Destination** (ville ou région où l'on séjourne)
- nom
- description
- période idéale (ex. « de mai à septembre »)
- prix indicatif « à partir de »
- photo (si possible)
- statut actif / masqué

**Activité**
- nom
- description
- catégorie : culture, détente, sport, gastronomie, aventure
- durée (en heures ou en jours)
- prix par personne
- niveau de difficulté (pour les activités sportives)
- âge minimum
- statut actif / masqué

### 4.2 Relations

- **Pays 1 — N Destination** : une destination appartient à **un seul** pays, obligatoire ; un pays a plusieurs destinations.
- **Pays 1 — N Activité** : une activité appartient à **un seul** pays ; une même activité n'est pas partagée entre pays (deux « cours de cuisine » dans deux pays = deux activités distinctes).
- **Destination 0..1 — N Activité** : lien **optionnel** vers une destination précise (évolution possible).
- *(Peut-être)* **Client N — N Destination/Activité** via les favoris.

---

## 5. Règles de gestion

1. Un e-mail = un seul compte client.
2. Un client ne peut pas se déclarer agent ; seul un administrateur crée les comptes agents.
3. Mot de passe avec un **niveau de sécurité minimal** (pas de « 123456 »).
4. Un agent ne peut **jamais** modifier le mot de passe d'un client.
5. Un client ne voit **jamais** les comptes des autres clients ni ceux des agents.
6. Seuls les agents créent / modifient / suppriment pays, destinations et activités.
7. Une destination ne peut pas exister sans pays.
8. Un pays **ne peut pas être supprimé** tant qu'il contient des destinations ou des activités.
9. Préférer le **masquage** (actif / inactif) à la suppression : élément invisible pour les clients mais conservé en base.
10. Suppression de compte client sur demande → **effacement des données personnelles** (RGPD).

---

## 6. Exigences non fonctionnelles

- **Plateformes** : ordinateur et téléphone (responsive).
- **Accessibilité / ergonomie** : grosses polices, gros boutons, navigation simple (clientèle d'environ 58 ans en moyenne).
- **Langue** : français (néerlandais éventuellement plus tard, hors V1).
- **Volumétrie** : ~20 pays, ~50 destinations, ~200 activités, ~1 000 clients (jusqu'à ~2 000 à terme).
- **Conformité** : RGPD.
- **Sécurité** : mots de passe robustes, cloisonnement des données par rôle.

---

## 7. Hors périmètre (V1)

- Paiement en ligne
- Réservation
- Facturation
- E-mails promotionnels
- Version néerlandaise
- Logo / identité visuelle (logo existant : bleu et blanc, avion en papier)

---

## 8. Points à confirmer

| # | Point | Hypothèse actuelle |
|---|---|---|
| 1 | Accès au catalogue sans connexion | Oui (pour donner envie) |
| 2 | Gestion des favoris | « Peut-être » |
| 3 | Deux rôles personnel (agent / administrateur) | Proposé par l'analyste, à valider |
| 4 | Rattachement des activités | Au pays ; destination optionnelle |
| 5 | Âge minimum des activités | « Ça serait bien » → à confirmer comme obligatoire ou non |
| 6 | Règles exactes de complexité du mot de passe | « Un minimum sérieux » → à définir |
| 7 | Utilité du numéro d'employé dans l'application | Hors besoin fonctionnel, à confirmer |


## Commandes



## Git

- Dépôt : https://github.com/Galgo-dev/traveler-site-front — branche principale `main`.
- **Chaque nouvelle fonctionnalité se développe sur une nouvelle branche** (`feature/<nom-court>`,
  `docs/<nom>` pour la documentation), jamais directement sur `main`. Intégration par pull request.
- Messages de commit en français.
- Ne push jamais sans ma permission
- Ne supprime aucun commit

## Technologies
- React
- Vite
- Axios

## Structure

Organisation par **fonctionnalité** (features) + couches partagées.
Flux : **pages → composants → hooks → services API (Axios) → API Express**.
Un composant n'appelle jamais Axios directement.

```
old-traveler-website/
├── public/                         # Fichiers servis tels quels (favicon, logo…)
├── src/
│   ├── main.jsx                    # Point d'entrée : monte <App /> dans le DOM
│   ├── App.jsx                     # Providers globaux (auth) + routeur
│   ├── api/
│   │   ├── axiosClient.js          # Instance Axios : baseURL (VITE_API_URL), token, intercepteurs d'erreurs
│   │   ├── auth.api.js             # inscription, connexion, mot de passe oublié
│   │   ├── clients.api.js
│   │   ├── agents.api.js
│   │   ├── pays.api.js
│   │   ├── destinations.api.js
│   │   └── activites.api.js
│   ├── routes/
│   │   ├── AppRouter.jsx           # Déclaration de toutes les routes (react-router-dom)
│   │   ├── ProtectedRoute.jsx      # Redirige vers /connexion si non connecté
│   │   └── RoleRoute.jsx           # Restreint l'accès selon le rôle (client / agent / administrateur)
│   ├── layouts/
│   │   ├── PublicLayout.jsx        # En-tête + pied de page pour visiteurs et clients
│   │   └── BackOfficeLayout.jsx    # Menu latéral pour agents et administrateur
│   ├── pages/                      # Un composant par écran (assemble les composants, pas de logique métier)
│   │   ├── public/
│   │   │   ├── AccueilPage.jsx
│   │   │   ├── PaysListePage.jsx
│   │   │   ├── PaysDetailPage.jsx  # destinations + activités d'un pays
│   │   │   ├── DestinationDetailPage.jsx
│   │   │   └── RecherchePage.jsx   # mot-clé, catégorie, budget
│   │   ├── auth/
│   │   │   ├── ConnexionPage.jsx
│   │   │   ├── InscriptionPage.jsx
│   │   │   └── MotDePasseOubliePage.jsx
│   │   ├── client/
│   │   │   ├── ProfilPage.jsx      # modification des infos + demande de suppression (RGPD)
│   │   │   └── FavorisPage.jsx     # (optionnel)
│   │   ├── backoffice/
│   │   │   ├── PaysGestionPage.jsx
│   │   │   ├── DestinationsGestionPage.jsx
│   │   │   ├── ActivitesGestionPage.jsx
│   │   │   ├── ClientsPage.jsx
│   │   │   ├── ClientDetailPage.jsx
│   │   │   └── AgentsPage.jsx      # administrateur uniquement
│   │   └── NotFoundPage.jsx
│   ├── components/
│   │   ├── ui/                     # Composants génériques réutilisables (gros boutons, champs, modale…)
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── layout/                 # Header, Footer, NavBar, SideMenu
│   │   ├── catalogue/              # PaysCard, DestinationCard, ActiviteCard, Filtres
│   │   └── forms/                  # PaysForm, DestinationForm, ActiviteForm, ClientForm, AgentForm
│   ├── hooks/                      # Logique réutilisable (chargement, état, erreurs)
│   │   ├── useAuth.js
│   │   ├── usePays.js
│   │   ├── useDestinations.js
│   │   └── useActivites.js
│   ├── context/
│   │   └── AuthContext.jsx         # Utilisateur connecté, rôle, token, login / logout
│   ├── utils/
│   │   ├── formatters.js           # Prix (€), dates, durées
│   │   ├── validators.js           # Validation côté client (dont complexité du mot de passe)
│   │   └── constants.js            # Catégories d'activité, rôles, routes
│   ├── styles/
│   │   ├── variables.css           # Couleurs (bleu / blanc), tailles de police, espacements
│   │   └── global.css              # Reset + styles de base (polices larges, responsive)
│   └── assets/                     # Images et icônes importées dans le code
├── tests/                          # Tests des composants et hooks
├── .env                            # VITE_API_URL — jamais commité
├── .env.example                    # Modèle des variables attendues — commité
├── index.html
├── vite.config.js
├── package.json
└── claude.md
```

### Conventions

- **Composants** : fichiers `.jsx` en `PascalCase`, un composant par fichier ; hooks en `camelCase` préfixés par `use`.
- **Services API** : fichiers `<ressource>.api.js`, une fonction par endpoint ; ils utilisent uniquement `axiosClient`.
- **Pages** : assemblent layouts et composants ; les appels de données passent par les hooks.
- **Contrôle d'accès** : les routes protégées passent par `ProtectedRoute` / `RoleRoute` ; l'API reste la source de vérité pour les droits.
- **Variables d'environnement** : préfixe `VITE_` obligatoire, lues uniquement dans `api/axiosClient.js`.
- **Accessibilité** : police de base ≥ 18 px, boutons larges, contrastes élevés, libellés explicites sur tous les champs (public d'environ 58 ans).
- **Responsive** : conception mobile d'abord, valeurs communes centralisées dans `styles/variables.css`.


## Règles du projet
- Utilise le clean code


# URL d'appel de l'API

URL de base en local : `http://localhost:3000/api` (port défini par `PORT`, 3000 par défaut).

**Authentification** : les routes protégées attendent l'en-tête
`Authorization: Bearer <token>`. Le token est renvoyé par les routes de connexion.

**Niveaux d'accès**

| Accès | Signification |
|---|---|
| Public | Sans connexion |
| Client | Client connecté |
| Personnel | Agent ou administrateur connecté |
| Admin | Administrateur uniquement |
| Connecté | Tout utilisateur connecté (client ou personnel) |

**Erreurs** : réponse JSON uniforme `{ "error": { "status": 400, "message": "..." } }`.

---

## Santé

| Méthode | URL | Accès | Description |
|---|---|---|---|
| GET | `http://localhost:3000/api/sante` | Public | Vérifie que l'API répond |

---

## Authentification — `/api/auth`

Les routes `POST` ci-dessous sont limitées en nombre de tentatives (réponse 429 au-delà).

| Méthode | URL | Accès | Corps (JSON) |
|---|---|---|---|
| POST | `http://localhost:3000/api/auth/inscription` | Public | `nom`, `prenom`, `email`, `telephone`, `dateNaissance`, `motDePasse` |
| POST | `http://localhost:3000/api/auth/connexion` | Public | `email`, `motDePasse` — connexion client |
| POST | `http://localhost:3000/api/auth/agents/connexion` | Public | `email`, `motDePasse` — connexion du personnel |
| POST | `http://localhost:3000/api/auth/mot-de-passe-oublie` | Public | `email` — envoie un e-mail avec un lien `FRONT_URL/reinitialisation-mot-de-passe?token=…` (en dev : visible sur http://localhost:8025) |
| POST | `http://localhost:3000/api/auth/reinitialisation` | Public | `token` (64 caractères hexadécimaux), `motDePasse` |
| PATCH | `http://localhost:3000/api/auth/mot-de-passe` | Connecté | `motDePasseActuel`, `nouveauMotDePasse` |

Mot de passe : au moins 10 caractères, une majuscule, une minuscule et un chiffre ; les mots de passe trop courants sont refusés.

---

## Clients — `/api/clients`

| Méthode | URL | Accès | Description |
|---|---|---|---|
| GET | `http://localhost:3000/api/clients/moi` | Client | Voir son profil |
| PATCH | `http://localhost:3000/api/clients/moi` | Client | Modifier son profil (`nom`, `prenom`, `email`, `telephone`, `dateNaissance`) |
| DELETE | `http://localhost:3000/api/clients/moi` | Client | Supprimer son compte (RGPD) — corps : `motDePasse` |
| POST | `http://localhost:3000/api/clients/moi/demande-suppression` | Client | Demander la suppression de son compte, traitée par un agent — corps : `motDePasse` (400 si incorrect). Réponse : le profil avec `suppressionDemandeeLe` |
| DELETE | `http://localhost:3000/api/clients/moi/demande-suppression` | Client | Annuler sa demande de suppression. Réponse : le profil |
| GET | `http://localhost:3000/api/clients` | Personnel | Liste des clients — query : `page`, `limite`, `q`, `suppressionDemandee` (`true` : demandes de suppression en attente, les plus anciennes d'abord) |
| GET | `http://localhost:3000/api/clients/:id` | Personnel | Dossier d'un client |
| GET | `http://localhost:3000/api/clients/:id/favoris` | Personnel | Favoris d'un client, éléments masqués compris |
| PATCH | `http://localhost:3000/api/clients/:id` | Personnel | Corriger un client (jamais le mot de passe) |
| DELETE | `http://localhost:3000/api/clients/:id` | Personnel | Effacement RGPD sur demande du client |

### Favoris du client connecté

`:id` est l'identifiant de la destination ou de l'activité (pas de corps à envoyer).

| Méthode | URL | Accès | Description |
|---|---|---|---|
| GET | `http://localhost:3000/api/clients/moi/favoris` | Client | Ses favoris visibles — réponse : `{ "destinations": [...], "activites": [...] }` |
| PUT | `http://localhost:3000/api/clients/moi/favoris/destinations/:id` | Client | Ajouter une destination (201 si ajoutée, 200 si déjà présente) |
| DELETE | `http://localhost:3000/api/clients/moi/favoris/destinations/:id` | Client | Retirer une destination (204 ; 404 si absente des favoris) |
| PUT | `http://localhost:3000/api/clients/moi/favoris/activites/:id` | Client | Ajouter une activité (201 si ajoutée, 200 si déjà présente) |
| DELETE | `http://localhost:3000/api/clients/moi/favoris/activites/:id` | Client | Retirer une activité (204 ; 404 si absente des favoris) |

Seuls les éléments visibles du catalogue peuvent être ajoutés (404 sinon). Un élément masqué ensuite disparaît des favoris du client sans être supprimé, et réapparaît s'il est réactivé. Les favoris sont effacés avec le compte du client.

---

## Personnel — `/api/agents`

| Méthode | URL | Accès | Description |
|---|---|---|---|
| GET | `http://localhost:3000/api/agents/moi` | Personnel | Voir son propre compte |
| GET | `http://localhost:3000/api/agents` | Admin | Liste — query : `page`, `limite`, `q`, `actif`, `role` |
| POST | `http://localhost:3000/api/agents` | Admin | Créer un compte : `nom`, `prenom`, `email`, `motDePasse`, `numeroEmploye`, `role` (`agent` / `administrateur`) |
| GET | `http://localhost:3000/api/agents/:id` | Admin | Détail d'un compte |
| PATCH | `http://localhost:3000/api/agents/:id` | Admin | Modifier : `nom`, `prenom`, `email`, `numeroEmploye`, `role` |
| PATCH | `http://localhost:3000/api/agents/:id/statut` | Admin | Activer / désactiver — corps : `{ "actif": false }` |
| PUT | `http://localhost:3000/api/agents/:id/mot-de-passe` | Admin | Définir un nouveau mot de passe — corps : `motDePasse` |

---

## Pays — `/api/pays`

| Méthode | URL | Accès | Description |
|---|---|---|---|
| GET | `http://localhost:3000/api/pays` | Public | Liste — query : `page`, `limite`, `q`, `continent`, `inclureMasques` |
| GET | `http://localhost:3000/api/pays/:id` | Public | Détail d'un pays |
| GET | `http://localhost:3000/api/pays/:id/destinations` | Public | Destinations du pays (mêmes filtres que `/api/destinations`) |
| GET | `http://localhost:3000/api/pays/:id/activites` | Public | Activités du pays (mêmes filtres que `/api/activites`) |
| POST | `http://localhost:3000/api/pays` | Personnel | Créer : `nom`, `continent`, `languePrincipale`, `monnaie` (obligatoires), `descriptionCourte`, `visaRequis`, `decalageHoraire`, `actif` |
| PATCH | `http://localhost:3000/api/pays/:id` | Personnel | Modifier (au moins un champ) |
| PATCH | `http://localhost:3000/api/pays/:id/statut` | Personnel | Masquer / réactiver — corps : `{ "actif": false }` |
| DELETE | `http://localhost:3000/api/pays/:id` | Personnel | Supprimer (refusé si le pays contient des destinations ou activités) |

Continents : `Afrique`, `Amérique du Nord`, `Amérique du Sud`, `Asie`, `Europe`, `Océanie`, `Antarctique`.

---

## Destinations — `/api/destinations`

| Méthode | URL | Accès | Description |
|---|---|---|---|
| GET | `http://localhost:3000/api/destinations` | Public | Liste — query : `page`, `limite`, `q`, `paysId`, `budgetMax`, `inclureMasques` |
| GET | `http://localhost:3000/api/destinations/:id` | Public | Détail d'une destination |
| POST | `http://localhost:3000/api/destinations` | Personnel | Créer : `paysId`, `nom` (obligatoires), `description`, `periodeIdeale`, `prixAPartirDe`, `photoUrl`, `actif` |
| PATCH | `http://localhost:3000/api/destinations/:id` | Personnel | Modifier (au moins un champ) |
| PATCH | `http://localhost:3000/api/destinations/:id/statut` | Personnel | Masquer / réactiver — corps : `{ "actif": false }` |
| DELETE | `http://localhost:3000/api/destinations/:id` | Personnel | Supprimer |

---

## Activités — `/api/activites`

| Méthode | URL | Accès | Description |
|---|---|---|---|
| GET | `http://localhost:3000/api/activites` | Public | Liste — query : `page`, `limite`, `q`, `paysId`, `destinationId`, `categorie`, `budgetMax`, `inclureMasques` |
| GET | `http://localhost:3000/api/activites/:id` | Public | Détail d'une activité |
| POST | `http://localhost:3000/api/activites` | Personnel | Créer : `paysId`, `nom`, `categorie`, `duree`, `prixParPersonne` (obligatoires), `destinationId`, `description`, `dureeUnite`, `niveauDifficulte`, `ageMinimum`, `actif` |
| PATCH | `http://localhost:3000/api/activites/:id` | Personnel | Modifier (au moins un champ) |
| PATCH | `http://localhost:3000/api/activites/:id/statut` | Personnel | Masquer / réactiver — corps : `{ "actif": false }` |
| DELETE | `http://localhost:3000/api/activites/:id` | Personnel | Supprimer |

Valeurs autorisées :
- `categorie` : `culture`, `detente`, `sport`, `gastronomie`, `aventure`
- `dureeUnite` : `heures`, `jours`
- `niveauDifficulte` : `facile`, `moyen`, `difficile`

---

## Recherche — `/api/recherche`

| Méthode | URL | Accès | Description |
|---|---|---|---|
| GET | `http://localhost:3000/api/recherche` | Public | Recherche dans le catalogue — query : `q`, `categorie`, `budgetMax` |

---

## Demandes de voyage (v2) — `/api/demandes`

Toutes les routes exigent d'être connecté.

| Méthode | URL | Accès | Corps / query |
|---|---|---|---|
| POST | `http://localhost:3000/api/demandes/estimation` | Client | Même corps que la création → `{ prixDestination, prixUnitaire, prixEstime, mentionPrix, activites, avertissement? }` |
| POST | `http://localhost:3000/api/demandes` | Client | `destinationId`, `dateDepart`, `dateRetour` (AAAA-MM-JJ), `nbAdultes`, `nbEnfants`, `activiteIds` (facultatif), `remarques` (facultatif, 1 000 caractères max.) → 201 `{ message, demande, avertissement? }` |
| GET | `http://localhost:3000/api/demandes` | Client / Personnel | Client : ses demandes. Personnel : toutes — query : `etat`, `paysId`, `destinationId`, `clientId`, `q`, `departDu`, `departAu`, `page`, `limite` |
| GET | `http://localhost:3000/api/demandes/:id` | Client / Personnel | Détail ; le personnel voit aussi le client et l'historique |
| POST | `http://localhost:3000/api/demandes/:id/confirmation` | Personnel | — |
| POST | `http://localhost:3000/api/demandes/:id/annulation` | Client / Personnel | `motif` (obligatoire pour le personnel) |

- `etat` : `en_attente`, `confirmee`, `annulee`
- Liste triée par date de commande décroissante.
- Chaque demande expose `voyageTermine` (confirmée et date de retour dépassée).

---

## Avis clients (v3) — `/api/avis`

| Méthode | URL | Accès | Corps / query |
|---|---|---|---|
| GET | `http://localhost:3000/api/destinations/:id/avis` | Public | query : `tri` (`recents`, `meilleures`), `note`, `page`, `limite` → `{ resume, donnees, pagination }` |
| GET | `http://localhost:3000/api/avis/derniers` | Public | 5 derniers avis publiés à 5★ |
| GET | `http://localhost:3000/api/avis/commandes-eligibles` | Client | — |
| GET | `http://localhost:3000/api/avis/moi` | Client | — |
| POST | `http://localhost:3000/api/avis` | Client | `demandeId`, `note`, `titre`, `commentaire`, `anonyme`, `notesActivites` (`[{ activiteId, note }]`) |
| PATCH | `http://localhost:3000/api/avis/:id` | Client | Mêmes champs, tous facultatifs (30 jours après la création) |
| DELETE | `http://localhost:3000/api/avis/:id` | Client | — (30 jours après la création) |
| GET | `http://localhost:3000/api/avis/:id` | Client (le sien) / Personnel | — |
| GET | `http://localhost:3000/api/avis/compteur` | Personnel | → `{ aModerer }` |
| GET | `http://localhost:3000/api/avis/moderation` | Personnel | query : `page`, `limite` |
| GET | `http://localhost:3000/api/avis` | Personnel | query : `etat`, `destinationId`, `paysId`, `note`, `du`, `au`, `page`, `limite` |
| POST | `http://localhost:3000/api/avis/:id/validation` | Personnel | — |
| POST | `http://localhost:3000/api/avis/:id/refus` | Personnel | `motif` (obligatoire) |
| POST | `http://localhost:3000/api/avis/:id/masquage` | Personnel | `motif` (obligatoire) |
| PUT | `http://localhost:3000/api/avis/:id/reponse` | Personnel | `texte` (≤ 1 000 caractères) |

- `etat` d'un avis : `en_attente`, `publie`, `refuse`
- Destinations et activités : champ `avis` avec `noteMoyenne`, `noteMoyenneAffichee`, `nombreAvis` et `libelle`.

---

## Événements en direct — `/api/evenements`

| Méthode | URL | Accès | Description |
|---|---|---|---|
| GET | `http://localhost:3000/api/evenements/catalogue` | Public | Flux Server-Sent Events (`text/event-stream`) : prévient les pages ouvertes de chaque modification du catalogue |

Après chaque création, modification, masquage / réactivation ou suppression **réussie** d'un pays, d'une
destination ou d'une activité, l'API envoie :

```
event: catalogue
data: {"ressource":"destinations"}
```

`ressource` vaut `pays`, `destinations` ou `activites`. Côté navigateur :
`new EventSource(url).addEventListener('catalogue', …)` — la reconnexion après une coupure est automatique.

---

## Exemples d'appels

```
GET  http://localhost:3000/api/pays?continent=Asie
GET  http://localhost:3000/api/pays/3/activites?categorie=gastronomie&budgetMax=100
GET  http://localhost:3000/api/destinations?q=plage&budgetMax=1500
GET  http://localhost:3000/api/recherche?q=cuisine&categorie=gastronomie&budgetMax=80
GET  http://localhost:3000/api/clients?page=2&limite=20&q=dupont
PUT  http://localhost:3000/api/clients/moi/favoris/destinations/12
GET  http://localhost:3000/api/clients/moi/favoris
```

Pagination par défaut : `page=1`, `limite=20` (50 pour le catalogue), `limite` maximum 100.
