import axiosClient from './axiosClient'

/**
 * Récupère les favoris visibles du client connecté.
 * Le premier paramètre est ignoré : il garde la signature compatible avec useRequete.
 * @param {unknown} _
 * @param {{ signal?: AbortSignal }} options
 * @returns {Promise<{ destinations: object[], activites: object[] }>}
 */
export async function getMesFavoris(_, { signal } = {}) {
  const { data } = await axiosClient.get('/clients/moi/favoris', { signal })
  return data
}

/**
 * Ajoute une destination aux favoris du client connecté (sans effet si elle y est déjà).
 * @param {number|string} id
 * @returns {Promise<{ destinations: object[], activites: object[] }>} les favoris à jour
 */
export async function ajouterDestinationFavorite(id) {
  const { data } = await axiosClient.put(`/clients/moi/favoris/destinations/${id}`)
  return data
}

/**
 * Retire une destination des favoris du client connecté.
 * @param {number|string} id
 */
export async function retirerDestinationFavorite(id) {
  await axiosClient.delete(`/clients/moi/favoris/destinations/${id}`)
}

/**
 * Ajoute une activité aux favoris du client connecté (sans effet si elle y est déjà).
 * @param {number|string} id
 * @returns {Promise<{ destinations: object[], activites: object[] }>} les favoris à jour
 */
export async function ajouterActiviteFavorite(id) {
  const { data } = await axiosClient.put(`/clients/moi/favoris/activites/${id}`)
  return data
}

/**
 * Retire une activité des favoris du client connecté.
 * @param {number|string} id
 */
export async function retirerActiviteFavorite(id) {
  await axiosClient.delete(`/clients/moi/favoris/activites/${id}`)
}
