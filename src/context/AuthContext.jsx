import { useCallback, useMemo, useState } from 'react'
import { connecterClient, connecterPersonnel, inscrireClient } from '../api/auth.api'
import { TOKEN_STORAGE_KEY } from '../api/axiosClient'
import { AuthContext } from './contexteAuth'

const UTILISATEUR_STORAGE_KEY = 'utilisateur'

function lireUtilisateurStocke() {
  const utilisateur = localStorage.getItem(UTILISATEUR_STORAGE_KEY)
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (!utilisateur || !token) return null

  try {
    return JSON.parse(utilisateur)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(lireUtilisateurStocke)

  const ouvrirSession = useCallback(({ token, utilisateur: utilisateurConnecte }) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    localStorage.setItem(UTILISATEUR_STORAGE_KEY, JSON.stringify(utilisateurConnecte))
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
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(UTILISATEUR_STORAGE_KEY)
    setUtilisateur(null)
  }, [])

  const valeur = useMemo(
    () => ({ utilisateur, estConnecte: utilisateur !== null, connexion, inscription, deconnexion }),
    [utilisateur, connexion, inscription, deconnexion],
  )

  return <AuthContext.Provider value={valeur}>{children}</AuthContext.Provider>
}
