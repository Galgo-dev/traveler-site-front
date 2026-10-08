import { useState } from 'react'

/**
 * État commun des formulaires : valeurs, validation côté client, envoi et erreur de l'API.
 * @param {{ valeursInitiales: object | (() => object),
 *   valider: (valeurs: object) => Record<string, string>,
 *   versApi: (valeurs: object) => object,
 *   onEnregistrer: (donnees: object) => Promise<unknown>,
 *   onSucces: () => void }} options
 */
export function useFormulaire({ valeursInitiales, valider, versApi, onEnregistrer, onSucces }) {
  const [valeurs, setValeurs] = useState(valeursInitiales)
  const [erreursChamps, setErreursChamps] = useState({})
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState(null)

  function modifierValeurs(changements) {
    setValeurs((precedentes) => ({ ...precedentes, ...changements }))
  }

  function modifierChamp(event) {
    const { name, type, value, checked } = event.target
    modifierValeurs({ [name]: type === 'checkbox' ? checked : value })
  }

  async function soumettre(event) {
    event.preventDefault()
    setErreur(null)

    const erreurs = valider(valeurs)
    setErreursChamps(erreurs)
    if (Object.keys(erreurs).length > 0) return

    setEnvoi(true)
    try {
      await onEnregistrer(versApi(valeurs))
      onSucces()
    } catch (erreurEnregistrement) {
      setErreur(erreurEnregistrement)
      setEnvoi(false)
    }
  }

  return { valeurs, erreursChamps, envoi, erreur, modifierChamp, modifierValeurs, soumettre }
}
