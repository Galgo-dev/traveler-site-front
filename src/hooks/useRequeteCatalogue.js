import { useRequete } from './useRequete'
import { useVersionCatalogue } from './useVersionCatalogue'

/**
 * Comme useRequete, pour des données du catalogue : elles sont rechargées en arrière-plan dès qu'un agent
 * modifie un pays, une destination ou une activité, sans que la page ait à être rafraîchie.
 * @param {(parametres: unknown, options: { signal: AbortSignal }) => Promise<unknown>} appel
 *   fonction de service stable (déclarée hors d'un composant)
 * @param {unknown} parametres valeur sérialisable en JSON
 */
export function useRequeteCatalogue(appel, parametres) {
  return useRequete(appel, parametres, { actualisation: useVersionCatalogue() })
}
