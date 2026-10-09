export const ROUTES = {
  ACCUEIL: '/',
  DESTINATIONS: '/destinations',
  DESTINATION_DETAIL: '/destinations/:id',
  PAYS: '/pays',
  PAYS_DETAIL: '/pays/:id',
  RECHERCHE: '/recherche',
  CONNEXION: '/connexion',
  INSCRIPTION: '/inscription',
  MOT_DE_PASSE_OUBLIE: '/mot-de-passe-oublie',
  // Doit correspondre au lien envoyé par e-mail par l'API (FRONT_URL + ce chemin + ?token=…).
  REINITIALISATION_MOT_DE_PASSE: '/reinitialisation-mot-de-passe',
  FAVORIS: '/favoris',
  PROFIL: '/profil',
  NOUVELLE_DEMANDE: '/demandes/nouvelle',
  MES_DEMANDES: '/demandes',
  MA_DEMANDE: '/demandes/:id',
  NOUVEL_AVIS: '/demandes/:id/avis',
  GESTION: '/gestion',
  GESTION_AGENTS: '/gestion/agents',
  GESTION_PAYS: '/gestion/pays',
  GESTION_DESTINATIONS: '/gestion/destinations',
  GESTION_ACTIVITES: '/gestion/activites',
  GESTION_CLIENTS: '/gestion/clients',
  GESTION_CLIENT_DETAIL: '/gestion/clients/:id',
  GESTION_DEMANDES: '/gestion/demandes',
  GESTION_DEMANDE_DETAIL: '/gestion/demandes/:id',
  GESTION_AVIS: '/gestion/avis',
  GESTION_AVIS_DETAIL: '/gestion/avis/:id',
}

export function routeDestinationDetail(id) {
  return `${ROUTES.DESTINATIONS}/${id}`
}

export function routePaysDetail(id) {
  return `${ROUTES.PAYS}/${id}`
}

/** Formulaire de demande, avec la destination présélectionnée si elle est connue. */
export function routeNouvelleDemande(destinationId) {
  return destinationId ? `${ROUTES.NOUVELLE_DEMANDE}?destination=${destinationId}` : ROUTES.NOUVELLE_DEMANDE
}

export function routeMaDemande(id) {
  return `${ROUTES.MES_DEMANDES}/${id}`
}

/** Formulaire d'avis sur une commande terminée (V3). */
export function routeNouvelAvis(demandeId) {
  return `${routeMaDemande(demandeId)}/avis`
}

export function routeGestionDemande(id) {
  return `${ROUTES.GESTION_DEMANDES}/${id}`
}

export function routeGestionAvis(id) {
  return `${ROUTES.GESTION_AVIS}/${id}`
}

/** Liste du personnel limitée aux demandes d'un client (depuis son dossier). */
export function routeDemandesDuClient(clientId) {
  return `${ROUTES.GESTION_DEMANDES}?clientId=${clientId}`
}

export function routeClientDetail(id) {
  return `${ROUTES.GESTION_CLIENTS}/${id}`
}

/**
 * Transforme un dictionnaire { valeur: libellé } en options de liste déroulante.
 * @param {Record<string, string>} libelles
 * @returns {{ valeur: string, libelle: string }[]}
 */
export function versOptions(libelles) {
  return Object.entries(libelles).map(([valeur, libelle]) => ({ valeur, libelle }))
}

export const LIBELLES_CATEGORIE = {
  culture: 'Culture',
  detente: 'Détente',
  sport: 'Sport',
  gastronomie: 'Gastronomie',
  aventure: 'Aventure',
}

export const LIBELLES_DIFFICULTE = {
  facile: 'Facile',
  moyen: 'Moyen',
  difficile: 'Difficile',
}

export const UNITES_DUREE = {
  heures: { singulier: 'heure', pluriel: 'heures' },
  jours: { singulier: 'jour', pluriel: 'jours' },
}

export const ROLES = {
  CLIENT: 'client',
  AGENT: 'agent',
  ADMINISTRATEUR: 'administrateur',
}

export const ROLES_PERSONNEL = [ROLES.AGENT, ROLES.ADMINISTRATEUR]

export const LIBELLES_ROLE = {
  [ROLES.AGENT]: 'Agent',
  [ROLES.ADMINISTRATEUR]: 'Administrateur',
}

export const LIBELLES_STATUT_COMPTE = {
  actif: 'Actif',
  desactive: 'Désactivé',
}

export const CONTINENTS = [
  'Afrique',
  'Amérique du Nord',
  'Amérique du Sud',
  'Asie',
  'Europe',
  'Océanie',
  'Antarctique',
]

export const LIBELLES_STATUT_CATALOGUE = {
  visible: 'Visible',
  masque: 'Masqué',
}

// V2 — Demandes de voyage (récap réunion 2)
export const ETATS_DEMANDE = {
  EN_ATTENTE: 'en_attente',
  CONFIRMEE: 'confirmee',
  ANNULEE: 'annulee',
}

export const LIBELLES_ETAT_DEMANDE = {
  [ETATS_DEMANDE.EN_ATTENTE]: 'En attente',
  [ETATS_DEMANDE.CONFIRMEE]: 'Confirmée',
  [ETATS_DEMANDE.ANNULEE]: 'Annulée',
}

// R5 : 10 voyageurs au maximum, adultes et enfants confondus.
export const MAX_VOYAGEURS = 10
export const LONGUEUR_MAX_REMARQUES = 1000

// V3 — Avis clients (récap réunion 3)
export const NOTE_MAX = 5
// R8 : un commentaire est obligatoire pour une note de 2 étoiles ou moins.
export const NOTE_MAX_SANS_COMMENTAIRE = 2
// P4 : titre court ; R7 : commentaire de 1 000 caractères maximum.
export const LONGUEUR_MAX_TITRE_AVIS = 100
export const LONGUEUR_MAX_COMMENTAIRE_AVIS = 1000

export const LIBELLES_NOTE = {
  1: 'Décevant',
  2: 'Moyen',
  3: 'Bien',
  4: 'Très bien',
  5: 'Excellent',
}

export const ETATS_AVIS = {
  EN_ATTENTE: 'en_attente',
  PUBLIE: 'publie',
  REFUSE: 'refuse',
}

export const LIBELLES_ETAT_AVIS = {
  [ETATS_AVIS.EN_ATTENTE]: 'À modérer',
  [ETATS_AVIS.PUBLIE]: 'Publié',
  [ETATS_AVIS.REFUSE]: 'Refusé',
}

// P4 : réponse de l'agence, 1 000 caractères maximum ; même limite pour le motif de refus.
export const LONGUEUR_MAX_REPONSE_AVIS = 1000
export const LONGUEUR_MAX_MOTIF_AVIS = 1000

// P3 : le client lit le motif de refus ; des motifs types, formulés pour lui, évitent une rédaction maladroite.
export const MOTIFS_REFUS_AVIS = [
  'Votre avis contient des coordonnées ou des informations personnelles, qui ne peuvent pas être publiées.',
  'Votre avis contient des propos injurieux ou irrespectueux.',
  'Votre avis ne porte pas sur le voyage effectué ni sur la destination.',
  "Votre avis contient de la publicité ou des liens vers d'autres sites.",
]

// Fiche destination : plus récents (par défaut) ou meilleures notes (§7).
export const TRIS_AVIS = {
  recents: 'Les plus récents',
  meilleures: 'Les meilleures notes',
}
export const TRI_AVIS_PAR_DEFAUT = 'recents'
