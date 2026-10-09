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

/**
 * Récupère la liste paginée des pays.
 * @param {{ page?: number, limite?: number, q?: string, continent?: string, inclureMasques?: boolean }} filtres
 * @param {{ signal?: AbortSignal }} options
 */
export async function getPays(filtres = {}, { signal } = {}) {
  const { data } = await axiosClient.get('/pays', { params: filtres, signal })
  return data
}

/**
 * Crée un pays (personnel uniquement).
 * @param {{ nom: string, continent: string, languePrincipale: string, monnaie: string,
 *   descriptionCourte?: string, visaRequis?: boolean, decalageHoraire?: number }} pays
 */
export async function creerPays(pays) {
  const { data } = await axiosClient.post('/pays', pays)
  return data
}

/**
 * Modifie un pays (personnel uniquement).
 * @param {number|string} id
 * @param {object} champs au moins un champ du pays
 */
export async function modifierPays(id, champs) {
  const { data } = await axiosClient.patch(`/pays/${id}`, champs)
  return data
}

/**
 * Masque ou réactive un pays (personnel uniquement).
 * @param {number|string} id
 * @param {boolean} actif
 */
export async function changerStatutPays(id, actif) {
  const { data } = await axiosClient.patch(`/pays/${id}/statut`, { actif })
  return data
}

/**
 * Supprime un pays (personnel uniquement). Refusé par l'API s'il contient des destinations ou activités.
 * @param {number|string} id
 */
export async function supprimerPays(id) {
  await axiosClient.delete(`/pays/${id}`)
}

/**
 * Récupère les destinations visibles d'un pays.
 * @param {{ id: number|string, filtres?: { page?: number, limite?: number, q?: string, budgetMax?: number } }} parametres
 * @param {{ signal?: AbortSignal }} options
 */
export async function getDestinationsDuPays({ id, filtres = {} }, { signal } = {}) {
  const { data } = await axiosClient.get(`/pays/${id}/destinations`, { params: filtres, signal })
  return data
}

/**
 * Récupère les activités visibles d'un pays.
 * @param {{ id: number|string, filtres?: { page?: number, limite?: number, q?: string,
 *   categorie?: string, budgetMax?: number } }} parametres
 * @param {{ signal?: AbortSignal }} options
 */
export async function getActivitesDuPays({ id, filtres = {} }, { signal } = {}) {
  const { data } = await axiosClient.get(`/pays/${id}/activites`, { params: filtres, signal })
  return data
}
