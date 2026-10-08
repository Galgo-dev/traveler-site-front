import { useCallback, useState } from 'react'
import { changerMotDePasse } from '../api/auth.api'
import { getMonProfil, modifierMonProfil } from '../api/clients.api'
import { useAuth } from './useAuth'
import { useRequete } from './useRequete'

/**
 * Charge le profil du client connecté et expose sa modification et le changement de mot de passe.
 * Le profil est rechargé après chaque modification, et l'en-tête mis à jour.
 */
export function useMonProfil() {
  const { mettreAJourUtilisateur } = useAuth()
  // La version ne sert qu'à relancer la requête : getMonProfil ignore son premier paramètre.
  const [version, setVersion] = useState(0)
  const { donnees, chargement, erreur } = useRequete(getMonProfil, version)

  const modifier = useCallback(
    async (champs) => {
      const { nom, prenom, email } = await modifierMonProfil(champs)
      mettreAJourUtilisateur({ nom, prenom, email })
      setVersion((precedente) => precedente + 1)
    },
    [mettreAJourUtilisateur],
  )

  return { profil: donnees, chargement, erreur, modifier, changerMotDePasse }
}
