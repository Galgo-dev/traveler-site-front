import { useCallback } from 'react'
import { useListeGeree } from './useListeGeree'

/**
 * Charge un type d'élément du catalogue, masqués compris, et expose ses actions de gestion
 * (personnel uniquement). La liste est rechargée après chaque action réussie.
 * @param {{ lister: Function, creer: Function, modifier: Function, changerStatut: Function,
 *   supprimer: Function }} api fonctions de service stables (déclarées hors d'un composant)
 * @param {object} filtres
 */
export function useGestionCatalogue(api, filtres) {
  const { elements, pagination, chargement, erreur, executer } = useListeGeree(api.lister, {
    ...filtres,
    inclureMasques: true,
  })

  const creer = useCallback((element) => executer(() => api.creer(element)), [api, executer])
  const modifier = useCallback(
    (id, champs) => executer(() => api.modifier(id, champs)),
    [api, executer],
  )
  const changerStatut = useCallback(
    (id, actif) => executer(() => api.changerStatut(id, actif)),
    [api, executer],
  )
  const supprimer = useCallback((id) => executer(() => api.supprimer(id)), [api, executer])

  return { elements, pagination, chargement, erreur, creer, modifier, changerStatut, supprimer }
}
