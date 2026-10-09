import axiosClient from './axiosClient'

/**
 * Recherche dans le catalogue visible : pays, destinations et activités.
 * Avec une catégorie, seules des activités sont renvoyées ; avec un budget, aucun pays.
 * @param {{ q?: string, categorie?: string, budgetMax?: number }} criteres
 * @param {{ signal?: AbortSignal }} options
 * @returns {Promise<{ pays: object[], destinations: object[], activites: object[] }>}
 */
export async function rechercher(criteres = {}, { signal } = {}) {
  const { data } = await axiosClient.get('/recherche', { params: criteres, signal })
  return data
}
