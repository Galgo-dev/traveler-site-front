import {
  changerStatutDestination,
  creerDestination,
  getDestinations,
  modifierDestination,
  supprimerDestination,
} from '../api/destinations.api'
import { useGestionCatalogue } from './useGestionCatalogue'
import { useRequete } from './useRequete'

const API_DESTINATIONS = {
  lister: getDestinations,
  creer: creerDestination,
  modifier: modifierDestination,
  changerStatut: changerStatutDestination,
  supprimer: supprimerDestination,
}

// Sans pays choisi, aucune requête n'est utile : la liste reste vide.
function chargerDestinationsDuPays(paysId, options) {
  if (!paysId) return Promise.resolve({ donnees: [] })
  return getDestinations({ paysId, limite: 100, inclureMasques: true }, options)
}

/**
 * Charge les destinations du catalogue.
 * @param {{ page?: number, limite?: number, q?: string, paysId?: number, budgetMax?: number }} filtres
 */
export function useDestinations(filtres = {}) {
  const { donnees, chargement, erreur } = useRequete(getDestinations, filtres)

  return {
    destinations: donnees?.donnees ?? [],
    pagination: donnees?.pagination ?? null,
    chargement,
    erreur,
  }
}

/**
 * Gestion des destinations par le personnel, masquées comprises.
 * @param {{ page?: number, q?: string, paysId?: number }} filtres
 */
export function useGestionDestinations(filtres = {}) {
  return useGestionCatalogue(API_DESTINATIONS, filtres)
}

function versOptionDestination({ id, nom, actif }) {
  return { valeur: String(id), libelle: actif ? nom : `${nom} (masquée)` }
}

/**
 * Toutes les destinations d'un pays, masquées comprises, sous forme d'options
 * (liste déroulante du formulaire d'activité).
 * @param {number|string|null} paysId
 */
export function useOptionsDestinations(paysId) {
  const { donnees, chargement, erreur } = useRequete(chargerDestinationsDuPays, paysId || null)

  return { options: (donnees?.donnees ?? []).map(versOptionDestination), chargement, erreur }
}
