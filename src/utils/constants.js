export const ROUTES = {
  ACCUEIL: '/',
  DESTINATIONS: '/destinations',
  DESTINATION_DETAIL: '/destinations/:id',
  CONNEXION: '/connexion',
  INSCRIPTION: '/inscription',
  GESTION: '/gestion',
  GESTION_AGENTS: '/gestion/agents',
}

export function routeDestinationDetail(id) {
  return `${ROUTES.DESTINATIONS}/${id}`
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
