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
