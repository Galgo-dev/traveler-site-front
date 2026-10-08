import { useCallback, useState } from 'react'
import { useRequete } from './useRequete'

/**
 * Charge une liste paginée et la recharge après chaque action réussie.
 * @param {(filtres: object, options: { signal: AbortSignal }) => Promise<{ donnees: object[], pagination: object }>} appelListe
 *   fonction de service stable (déclarée hors d'un composant)
 * @param {object} filtres valeur sérialisable en JSON
 */
export function useListeGeree(appelListe, filtres) {
  const [version, setVersion] = useState(0)

  // La version ne sert qu'à relancer la requête : elle n'est pas envoyée à l'API.
  const charger = useCallback(
    ({ filtres: parametres }, options) => appelListe(parametres, options),
    [appelListe],
  )
  const { donnees, chargement, erreur } = useRequete(charger, { filtres, version })

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
