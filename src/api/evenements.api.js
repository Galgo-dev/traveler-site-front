import axiosClient from './axiosClient'

const EVENEMENT_CATALOGUE = 'catalogue'

/**
 * Écoute en direct les modifications du catalogue faites par les agents (Server-Sent Events).
 * Le navigateur se reconnecte tout seul après une coupure ; comme des modifications ont pu être
 * manquées pendant ce temps, onReconnexion est alors appelé.
 * @param {{ onModification: (evenement: { ressource: 'pays'|'destinations'|'activites' }) => void,
 *   onReconnexion: () => void }} rappels
 * @returns {() => void} fonction qui ferme l'écoute
 */
export function ecouterCatalogue({ onModification, onReconnexion }) {
  // Même adresse de base que toutes les autres requêtes (VITE_API_URL, lue dans axiosClient).
  const source = new EventSource(`${axiosClient.defaults.baseURL}/evenements/catalogue`)
  let dejaConnecte = false

  source.addEventListener(EVENEMENT_CATALOGUE, (evenement) => onModification(JSON.parse(evenement.data)))
  source.addEventListener('open', () => {
    if (dejaConnecte) onReconnexion()
    dejaConnecte = true
  })

  return () => source.close()
}
