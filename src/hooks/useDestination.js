import { getDestinationById } from '../api/destinations.api'
import { useRequeteCatalogue } from './useRequeteCatalogue'

/**
 * Charge le détail d'une destination (pays et activités compris).
 * @param {number|string} id
 */
export function useDestination(id) {
  const { donnees, chargement, erreur } = useRequeteCatalogue(getDestinationById, id)

  return { destination: donnees, chargement, erreur }
}
