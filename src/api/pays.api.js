import axiosClient from './axiosClient'

/**
 * Récupère le détail d'un pays (langue, monnaie, visa, décalage horaire…).
 * @param {number|string} id
 * @param {{ signal?: AbortSignal }} options
 */
export async function getPaysById(id, { signal } = {}) {
  const { data } = await axiosClient.get(`/pays/${id}`, { signal })
  return data
}
