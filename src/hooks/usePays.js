import { getPaysById } from '../api/pays.api'
import { useRequete } from './useRequete'

/**
 * Charge le détail d'un pays (langue, monnaie, visa, décalage horaire).
 * @param {number|string} id
 */
export function usePaysDetail(id) {
  const { donnees, chargement, erreur } = useRequete(getPaysById, id)

  return { pays: donnees, chargement, erreur }
}
