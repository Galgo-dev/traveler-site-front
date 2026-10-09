import { rechercher } from '../api/recherche.api'
import { useRequeteCatalogue } from './useRequeteCatalogue'

const AUCUN_RESULTAT = { pays: [], destinations: [], activites: [] }

// Sans aucun critère, rien n'est recherché : la page invite d'abord à en saisir un.
function chargerRecherche(criteres, options) {
  return Object.keys(criteres).length === 0 ? Promise.resolve(null) : rechercher(criteres, options)
}

/**
 * Recherche dans le catalogue visible (mot-clé, catégorie d'activité, budget maximum).
 * @param {{ q?: string, categorie?: string, budgetMax?: number }} criteres critères renseignés uniquement
 * @returns {{ resultats: { pays: object[], destinations: object[], activites: object[] } | null,
 *   chargement: boolean, erreur: Error | null }} resultats vaut null tant qu'aucun critère n'est donné
 */
export function useRecherche(criteres) {
  const { donnees, chargement, erreur } = useRequeteCatalogue(chargerRecherche, criteres)

  return { resultats: donnees && { ...AUCUN_RESULTAT, ...donnees }, chargement, erreur }
}
