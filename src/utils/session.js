// Stockage de la session de connexion (token + utilisateur).
// sessionStorage est propre à chaque onglet : un lien collé dans un nouvel onglet ou une nouvelle
// fenêtre redemande la connexion, et la session disparaît à la fermeture de l'onglet.
const stockage = window.sessionStorage

const CLE_TOKEN = 'token'
const CLE_UTILISATEUR = 'utilisateur'

// Les versions précédentes gardaient la session dans localStorage, partagé par tous les onglets :
// on l'efface pour qu'aucune ancienne session ne reste ouverte.
window.localStorage.removeItem(CLE_TOKEN)
window.localStorage.removeItem(CLE_UTILISATEUR)

export function lireToken() {
  return stockage.getItem(CLE_TOKEN)
}

/** Utilisateur de la session de cet onglet, ou null si personne n'y est connecté. */
export function lireUtilisateur() {
  const utilisateur = stockage.getItem(CLE_UTILISATEUR)
  if (!utilisateur || !lireToken()) return null

  try {
    return JSON.parse(utilisateur)
  } catch {
    return null
  }
}

export function enregistrerSession(token, utilisateur) {
  stockage.setItem(CLE_TOKEN, token)
  stockage.setItem(CLE_UTILISATEUR, JSON.stringify(utilisateur))
}

export function effacerSession() {
  stockage.removeItem(CLE_TOKEN)
  stockage.removeItem(CLE_UTILISATEUR)
}

/**
 * Date d'expiration de la session (en millisecondes), lue dans le champ `exp` du token JWT,
 * ou null si elle est inconnue. Le contenu du token n'est pas vérifié ici : l'API reste
 * la seule à contrôler sa validité.
 */
export function lireExpiration() {
  const token = lireToken()
  if (!token) return null

  try {
    const contenuBase64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(contenuBase64))
    return typeof exp === 'number' ? exp * 1000 : null
  } catch {
    return null
  }
}

const abonnesExpiration = new Set()

/**
 * Prévient quand la session expire (date atteinte ou refus 401 de l'API).
 * @param {() => void} rappel
 * @returns {() => void} fonction de désabonnement
 */
export function surExpiration(rappel) {
  abonnesExpiration.add(rappel)
  return () => abonnesExpiration.delete(rappel)
}

/** Ferme la session de l'onglet et prévient les abonnés (le contexte d'authentification). */
export function expirerSession() {
  effacerSession()
  abonnesExpiration.forEach((rappel) => rappel())
}
