import { creerAvis, getCommandesEligibles } from '../api/avis.api'
import { useRequete } from './useRequete'

// L'appel ne prend pas de paramètres : seule l'annulation est transmise.
function chargerCommandesEligibles(_parametres, options) {
  return getCommandesEligibles(options)
}

/**
 * Commandes terminées sur lesquelles le client connecté peut encore donner son avis (R2 à R4).
 */
export function useCommandesEligibles() {
  const { donnees, chargement, erreur } = useRequete(chargerCommandesEligibles, null)

  return { commandes: donnees ?? [], chargement, erreur }
}

/**
 * Envoi d'un avis par le client connecté ; il reste « en attente de validation » jusqu'à sa modération (R10).
 */
export function useCreationAvis() {
  return { creer: creerAvis }
}
