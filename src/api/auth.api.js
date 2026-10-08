import axiosClient from './axiosClient'

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
