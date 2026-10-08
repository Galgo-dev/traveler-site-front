import { useEffect, useState } from 'react'
import { getDestinations } from '../api/destinations.api'

const RESULTAT_INITIAL = { cle: null, destinations: [], pagination: null, erreur: null }

/**
 * Charge les destinations du catalogue et expose les états de chargement et d'erreur.
 * @param {{ page?: number, limite?: number, q?: string, paysId?: number, budgetMax?: number }} filtres
 */
export function useDestinations(filtres = {}) {
  const [resultat, setResultat] = useState(RESULTAT_INITIAL)

  // Clé stable : évite de relancer la requête quand l'objet filtres est recréé à l'identique.
  const cleFiltres = JSON.stringify(filtres)

  useEffect(() => {
    const controller = new AbortController()

    getDestinations(JSON.parse(cleFiltres), { signal: controller.signal })
      .then(({ donnees, pagination }) => {
        setResultat({ cle: cleFiltres, destinations: donnees, pagination, erreur: null })
      })
      .catch((erreur) => {
        if (controller.signal.aborted) return
        setResultat({ ...RESULTAT_INITIAL, cle: cleFiltres, erreur })
      })

    return () => controller.abort()
  }, [cleFiltres])

  const { cle, destinations, pagination, erreur } = resultat
  // Le chargement dure tant que le résultat ne correspond pas aux filtres demandés.
  const chargement = cle !== cleFiltres

  return { destinations, pagination, chargement, erreur }
}
