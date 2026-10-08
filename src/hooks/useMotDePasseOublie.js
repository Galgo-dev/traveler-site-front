import { demanderReinitialisation, reinitialiserMotDePasse } from '../api/auth.api'

/**
 * Actions de récupération d'un mot de passe oublié : demande du lien par e-mail,
 * puis choix d'un nouveau mot de passe avec le jeton du lien.
 */
export function useMotDePasseOublie() {
  return { demanderLien: demanderReinitialisation, reinitialiser: reinitialiserMotDePasse }
}
