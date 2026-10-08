import { getDestinationById } from '../api/destinations.api'
import { useRequete } from './useRequete'

/**
 * Charge le détail d'une destination (pays et activités compris).
 * @param {number|string} id
 */
export function useDestination(id) {
  const { donnees, chargement, erreur } = useRequete(getDestinationById, id)

  return { destination: donnees, chargement, erreur }
}
