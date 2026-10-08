import { getDestinations } from '../api/destinations.api'
import { useRequete } from './useRequete'

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
