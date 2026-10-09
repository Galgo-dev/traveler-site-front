import { useCallback, useState } from 'react'
import { changerMotDePasse } from '../api/auth.api'
import {
  annulerDemandeSuppressionCompte,
  demanderSuppressionCompte,
  getMonProfil,
  modifierMonProfil,
} from '../api/clients.api'
import { useAuth } from './useAuth'
import { useRequete } from './useRequete'

/**
 * Charge le profil du client connecté et expose sa modification, le changement de mot de passe
 * et la demande de suppression du compte. Le profil est rechargé après chaque action, et l'en-tête mis à jour.
 */
export function useMonProfil() {
  const { mettreAJourUtilisateur } = useAuth()
  // La version ne sert qu'à relancer la requête : getMonProfil ignore son premier paramètre.
  const [version, setVersion] = useState(0)
  const { donnees, chargement, erreur } = useRequete(getMonProfil, version)

  const recharger = useCallback(() => setVersion((precedente) => precedente + 1), [])

  const modifier = useCallback(
    async (champs) => {
      const { nom, prenom, email } = await modifierMonProfil(champs)
      mettreAJourUtilisateur({ nom, prenom, email })
      recharger()
    },
    [mettreAJourUtilisateur, recharger],
  )

  const demanderSuppression = useCallback(
    async (motDePasse) => {
      await demanderSuppressionCompte(motDePasse)
      recharger()
    },
    [recharger],
  )

  const annulerDemandeSuppression = useCallback(async () => {
    await annulerDemandeSuppressionCompte()
    recharger()
  }, [recharger])

  return {
    profil: donnees,
    chargement,
    erreur,
    modifier,
    changerMotDePasse,
    demanderSuppression,
    annulerDemandeSuppression,
  }
}
