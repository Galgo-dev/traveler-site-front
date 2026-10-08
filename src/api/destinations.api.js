import axiosClient from './axiosClient'

/**
 * Récupère les destinations visibles du catalogue.
 * @param {{ page?: number, limite?: number, q?: string, paysId?: number, budgetMax?: number }} filtres
 * @param {{ signal?: AbortSignal }} options
 */
export async function getDestinations(filtres = {}, { signal } = {}) {
  const { data } = await axiosClient.get('/destinations', { params: filtres, signal })
  return data
}

/**
 * Récupère le détail d'une destination, avec son pays et ses activités.
 * @param {number|string} id
 * @param {{ signal?: AbortSignal }} options
 */
export async function getDestinationById(id, { signal } = {}) {
  const { data } = await axiosClient.get(`/destinations/${id}`, { signal })
  return data
}
