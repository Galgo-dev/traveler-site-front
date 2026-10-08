export const ROUTES = {
  ACCUEIL: '/',
  DESTINATIONS: '/destinations',
  DESTINATION_DETAIL: '/destinations/:id',
  CONNEXION: '/connexion',
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
