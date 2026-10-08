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
