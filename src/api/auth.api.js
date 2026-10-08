import axiosClient from './axiosClient'

/**
 * Inscrit un nouveau client. L'API renvoie directement un token : le client est connecté.
 * @param {{ nom: string, prenom: string, email: string, telephone: string, dateNaissance: string, motDePasse: string }} client
 *   dateNaissance au format AAAA-MM-JJ
 * @returns {Promise<{ token: string, utilisateur: object }>}
 */
export async function inscrireClient(client) {
  const { data } = await axiosClient.post('/auth/inscription', client)
  return data
}

/**
 * Connecte un client.
 * @param {{ email: string, motDePasse: string }} identifiants
 * @returns {Promise<{ token: string, utilisateur: object }>}
 */
export async function connecterClient(identifiants) {
  const { data } = await axiosClient.post('/auth/connexion', identifiants)
  return data
}

/**
 * Connecte un membre du personnel (agent ou administrateur).
 * @param {{ email: string, motDePasse: string }} identifiants
 * @returns {Promise<{ token: string, utilisateur: object }>}
 */
export async function connecterPersonnel(identifiants) {
  const { data } = await axiosClient.post('/auth/agents/connexion', identifiants)
  return data
}

/**
 * Change le mot de passe de l'utilisateur connecté (client ou membre du personnel).
 * @param {{ motDePasseActuel: string, nouveauMotDePasse: string }} motsDePasse
 */
export async function changerMotDePasse(motsDePasse) {
  const { data } = await axiosClient.patch('/auth/mot-de-passe', motsDePasse)
  return data
}

/**
 * Demande l'envoi d'un lien de réinitialisation du mot de passe (comptes clients).
 * L'API répond toujours le même message, que l'adresse existe ou non.
 * @param {string} email
 * @returns {Promise<{ message: string }>}
 */
export async function demanderReinitialisation(email) {
  const { data } = await axiosClient.post('/auth/mot-de-passe-oublie', { email })
  return data
}

/**
 * Choisit un nouveau mot de passe grâce au jeton reçu par e-mail.
 * @param {{ token: string, motDePasse: string }} reinitialisation token : 64 caractères hexadécimaux
 * @returns {Promise<{ message: string }>}
 */
export async function reinitialiserMotDePasse(reinitialisation) {
  const { data } = await axiosClient.post('/auth/reinitialisation', reinitialisation)
  return data
}
