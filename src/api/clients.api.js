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
 * @param {{ page?: number, limite?: number, q?: string }} filtres
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
