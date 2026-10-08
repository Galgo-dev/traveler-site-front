import { useEffect, useState } from 'react'

const RESULTAT_INITIAL = { cle: null, donnees: null, erreur: null }

/**
 * Exécute un appel de service API et expose ses états de chargement et d'erreur.
 * La requête est relancée quand les paramètres changent et annulée au démontage.
 * @param {(parametres: unknown, options: { signal: AbortSignal }) => Promise<unknown>} appel
 *   fonction de service stable (déclarée hors d'un composant)
 * @param {unknown} parametres valeur sérialisable en JSON
 */
export function useRequete(appel, parametres) {
  const [resultat, setResultat] = useState(RESULTAT_INITIAL)

  // Clé stable : évite de relancer la requête quand les paramètres sont recréés à l'identique.
  const cle = JSON.stringify(parametres ?? null)

  useEffect(() => {
    const controller = new AbortController()

    appel(JSON.parse(cle), { signal: controller.signal })
      .then((donnees) => setResultat({ cle, donnees, erreur: null }))
      .catch((erreur) => {
        if (controller.signal.aborted) return
        setResultat({ cle, donnees: null, erreur })
      })

    return () => controller.abort()
  }, [appel, cle])

  // Le chargement dure tant que le résultat ne correspond pas aux paramètres demandés.
  const chargement = resultat.cle !== cle

  return { donnees: resultat.donnees, chargement, erreur: resultat.erreur }
}
