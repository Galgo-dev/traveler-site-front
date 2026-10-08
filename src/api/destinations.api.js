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
