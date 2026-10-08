export const ROUTES = {
  ACCUEIL: '/',
  DESTINATIONS: '/destinations',
  DESTINATION_DETAIL: '/destinations/:id',
  CONNEXION: '/connexion',
  INSCRIPTION: '/inscription',
  FAVORIS: '/favoris',
  GESTION: '/gestion',
  GESTION_AGENTS: '/gestion/agents',
  GESTION_PAYS: '/gestion/pays',
  GESTION_DESTINATIONS: '/gestion/destinations',
  GESTION_ACTIVITES: '/gestion/activites',
  GESTION_CLIENTS: '/gestion/clients',
  GESTION_CLIENT_DETAIL: '/gestion/clients/:id',
}

export function routeDestinationDetail(id) {
  return `${ROUTES.DESTINATIONS}/${id}`
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
