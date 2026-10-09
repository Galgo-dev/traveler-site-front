import { useCallback, useState } from 'react'
import { useRequete } from './useRequete'

/**
 * Charge une liste paginée et la recharge après chaque action réussie.
 * @param {(filtres: object, options: { signal: AbortSignal }) => Promise<{ donnees: object[], pagination: object }>} appelListe
 *   fonction de service stable (déclarée hors d'un composant)
 * @param {object} filtres valeur sérialisable en JSON
 * @param {{ actualisation?: unknown }} [options] recharge la liste en arrière-plan quand cette valeur change
 */
export function useListeGeree(appelListe, filtres, { actualisation } = {}) {
  const [version, setVersion] = useState(0)

  // La version ne sert qu'à relancer la requête : elle n'est pas envoyée à l'API.
  const charger = useCallback(
    ({ filtres: parametres }, options) => appelListe(parametres, options),
    [appelListe],
  )
  const { donnees, chargement, erreur } = useRequete(charger, { filtres, version }, { actualisation })

  const executer = useCallback(async (action) => {
    const resultat = await action()
    setVersion((precedente) => precedente + 1)
    return resultat
  }, [])

  return {
    elements: donnees?.donnees ?? [],
    pagination: donnees?.pagination ?? null,
    chargement,
    erreur,
    executer,
  }
}
