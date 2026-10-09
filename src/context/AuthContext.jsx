import { useCallback, useEffect, useMemo, useState } from 'react'
import { connecterClient, connecterPersonnel, inscrireClient } from '../api/auth.api'
import { ROLES, ROLES_PERSONNEL } from '../utils/constants'
import {
  effacerSession,
  enregistrerSession,
  enregistrerUtilisateur,
  expirerSession,
  lireExpiration,
  lireUtilisateur,
  surExpiration,
} from '../utils/session'
import { AuthContext } from './contexteAuth'

// Plus grand délai accepté par setTimeout (environ 24 jours).
const DELAI_MAX_MINUTEUR = 2 ** 31 - 1

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(lireUtilisateur)
  // Vrai quand la dernière session s'est fermée d'elle-même : la page de connexion l'explique.
  const [sessionExpiree, setSessionExpiree] = useState(false)

  // Expiration signalée par le minuteur ci-dessous ou par un refus 401 de l'API (axiosClient).
  useEffect(
    () =>
      surExpiration(() => {
        setUtilisateur(null)
        setSessionExpiree(true)
      }),
    [],
  )

  // Déconnexion automatique à la date d'expiration du token, même si la page reste ouverte sans activité.
  useEffect(() => {
    if (!utilisateur) return undefined

    const expiration = lireExpiration()
    if (expiration === null) return undefined

    const delai = Math.min(Math.max(expiration - Date.now(), 0), DELAI_MAX_MINUTEUR)
    const minuteur = setTimeout(expirerSession, delai)
    return () => clearTimeout(minuteur)
  }, [utilisateur])

  const ouvrirSession = useCallback(({ token, utilisateur: utilisateurConnecte }) => {
    enregistrerSession(token, utilisateurConnecte)
    setUtilisateur(utilisateurConnecte)
    setSessionExpiree(false)
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

  // Garde l'en-tête (« Bonjour … ») à jour après une modification du profil.
  const mettreAJourUtilisateur = useCallback((champs) => {
    setUtilisateur((precedent) => {
      const utilisateurAJour = { ...precedent, ...champs }
      enregistrerUtilisateur(utilisateurAJour)
      return utilisateurAJour
    })
  }, [])

  const deconnexion = useCallback(() => {
    effacerSession()
    setUtilisateur(null)
    setSessionExpiree(false)
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
      sessionExpiree,
      connexion,
      inscription,
      mettreAJourUtilisateur,
      deconnexion,
    }
  }, [utilisateur, sessionExpiree, connexion, inscription, mettreAJourUtilisateur, deconnexion])

  return <AuthContext.Provider value={valeur}>{children}</AuthContext.Provider>
}
