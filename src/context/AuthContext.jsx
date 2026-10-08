import { useCallback, useMemo, useState } from 'react'
import { connecterClient, connecterPersonnel, inscrireClient } from '../api/auth.api'
import { ROLES, ROLES_PERSONNEL } from '../utils/constants'
import { effacerSession, enregistrerSession, lireUtilisateur } from '../utils/session'
import { AuthContext } from './contexteAuth'

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(lireUtilisateur)

  const ouvrirSession = useCallback(({ token, utilisateur: utilisateurConnecte }) => {
    enregistrerSession(token, utilisateurConnecte)
    setUtilisateur(utilisateurConnecte)
    return utilisateurConnecte
  }, [])

  const connexion = useCallback(
    async (identifiants, { personnel = false } = {}) => {
      const connecter = personnel ? connecterPersonnel : connecterClient
      return ouvrirSession(await connecter(identifiants))
    },
    [ouvrirSession],
  )

  // L'API renvoie un token à l'inscription : le nouveau client est directement connecté.
  const inscription = useCallback(
    async (client) => ouvrirSession(await inscrireClient(client)),
    [ouvrirSession],
  )

  const deconnexion = useCallback(() => {
    effacerSession()
    setUtilisateur(null)
  }, [])

  const valeur = useMemo(() => {
    const role = utilisateur?.role ?? null
    return {
      utilisateur,
      role,
      estConnecte: utilisateur !== null,
      estClient: role === ROLES.CLIENT,
      estPersonnel: ROLES_PERSONNEL.includes(role),
      estAdministrateur: role === ROLES.ADMINISTRATEUR,
      connexion,
      inscription,
      deconnexion,
    }
  }, [utilisateur, connexion, inscription, deconnexion])

  return <AuthContext.Provider value={valeur}>{children}</AuthContext.Provider>
}
