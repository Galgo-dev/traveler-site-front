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

/**
 * Crée une destination (personnel uniquement).
 * @param {{ paysId: number, nom: string, description?: string, periodeIdeale?: string,
 *   prixAPartirDe?: number, photoUrl?: string }} destination
 */
export async function creerDestination(destination) {
  const { data } = await axiosClient.post('/destinations', destination)
  return data
}

/**
 * Modifie une destination (personnel uniquement).
 * @param {number|string} id
 * @param {object} champs au moins un champ de la destination
 */
export async function modifierDestination(id, champs) {
  const { data } = await axiosClient.patch(`/destinations/${id}`, champs)
  return data
}

/**
 * Masque ou réactive une destination (personnel uniquement).
 * @param {number|string} id
 * @param {boolean} actif
 */
export async function changerStatutDestination(id, actif) {
  const { data } = await axiosClient.patch(`/destinations/${id}/statut`, { actif })
  return data
}

/**
 * Supprime une destination (personnel uniquement).
 * @param {number|string} id
 */
export async function supprimerDestination(id) {
  await axiosClient.delete(`/destinations/${id}`)
}
