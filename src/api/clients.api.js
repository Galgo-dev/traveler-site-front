import axiosClient from './axiosClient'

/**
 * Récupère le profil du client connecté.
 * Le premier paramètre est ignoré : il garde la signature compatible avec useRequete.
 * @param {unknown} _
 * @param {{ signal?: AbortSignal }} options
 */
export async function getMonProfil(_, { signal } = {}) {
  const { data } = await axiosClient.get('/clients/moi', { signal })
  return data
}

/**
 * Récupère la liste paginée des clients (personnel uniquement).
 * @param {{ page?: number, limite?: number, q?: string, suppressionDemandee?: boolean }} filtres
 * @param {{ signal?: AbortSignal }} options
 */
export async function getClients(filtres = {}, { signal } = {}) {
  const { data } = await axiosClient.get('/clients', { params: filtres, signal })
  return data
}

/**
 * Récupère le dossier d'un client (personnel uniquement).
 * @param {number|string} id
 * @param {{ signal?: AbortSignal }} options
 */
export async function getClientById(id, { signal } = {}) {
  const { data } = await axiosClient.get(`/clients/${id}`, { signal })
  return data
}

/**
 * Récupère les favoris d'un client, éléments masqués compris (personnel uniquement).
 * @param {number|string} id
 * @param {{ signal?: AbortSignal }} options
 * @returns {Promise<{ destinations: object[], activites: object[] }>}
 */
export async function getFavorisClient(id, { signal } = {}) {
  const { data } = await axiosClient.get(`/clients/${id}/favoris`, { signal })
  return data
}

/**
 * Corrige les informations d'un client, jamais son mot de passe (personnel uniquement).
 * @param {number|string} id
 * @param {{ nom?: string, prenom?: string, email?: string, telephone?: string, dateNaissance?: string }} champs
 */
export async function modifierClient(id, champs) {
  const { data } = await axiosClient.patch(`/clients/${id}`, champs)
  return data
}

/**
 * Efface le compte et les données personnelles d'un client à sa demande (RGPD, personnel uniquement).
 * @param {number|string} id
 */
export async function supprimerClient(id) {
  await axiosClient.delete(`/clients/${id}`)
}

/**
 * Modifie le profil du client connecté (jamais son mot de passe, qui a sa propre route).
 * @param {{ nom?: string, prenom?: string, email?: string, telephone?: string, dateNaissance?: string }} champs
 * @returns {Promise<object>} le profil à jour
 */
export async function modifierMonProfil(champs) {
  const { data } = await axiosClient.patch('/clients/moi', champs)
  return data
}

/**
 * Demande la suppression du compte du client connecté ; un agent l'effacera ensuite.
 * Le mot de passe est redemandé pour confirmer qu'il s'agit bien du titulaire.
 * @param {string} motDePasse
 * @returns {Promise<object>} le profil à jour (suppressionDemandeeLe renseignée)
 */
export async function demanderSuppressionCompte(motDePasse) {
  const { data } = await axiosClient.post('/clients/moi/demande-suppression', { motDePasse })
  return data
}

/**
 * Annule la demande de suppression du compte du client connecté.
 * @returns {Promise<object>} le profil à jour (suppressionDemandeeLe à null)
 */
export async function annulerDemandeSuppressionCompte() {
  const { data } = await axiosClient.delete('/clients/moi/demande-suppression')
  return data
}
