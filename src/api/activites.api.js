import axiosClient from './axiosClient'

/**
 * Récupère la liste paginée des activités.
 * @param {{ page?: number, limite?: number, q?: string, paysId?: number, destinationId?: number,
 *   categorie?: string, budgetMax?: number, inclureMasques?: boolean }} filtres
 * @param {{ signal?: AbortSignal }} options
 */
export async function getActivites(filtres = {}, { signal } = {}) {
  const { data } = await axiosClient.get('/activites', { params: filtres, signal })
  return data
}

/**
 * Récupère le détail d'une activité.
 * @param {number|string} id
 * @param {{ signal?: AbortSignal }} options
 */
export async function getActiviteById(id, { signal } = {}) {
  const { data } = await axiosClient.get(`/activites/${id}`, { signal })
  return data
}

/**
 * Crée une activité (personnel uniquement).
 * @param {{ paysId: number, nom: string, categorie: string, duree: number, prixParPersonne: number,
 *   destinationId?: number|null, description?: string, dureeUnite?: 'heures'|'jours',
 *   niveauDifficulte?: string|null, ageMinimum?: number|null }} activite
 */
export async function creerActivite(activite) {
  const { data } = await axiosClient.post('/activites', activite)
  return data
}

/**
 * Modifie une activité (personnel uniquement).
 * @param {number|string} id
 * @param {object} champs au moins un champ de l'activité
 */
export async function modifierActivite(id, champs) {
  const { data } = await axiosClient.patch(`/activites/${id}`, champs)
  return data
}

/**
 * Masque ou réactive une activité (personnel uniquement).
 * @param {number|string} id
 * @param {boolean} actif
 */
export async function changerStatutActivite(id, actif) {
  const { data } = await axiosClient.patch(`/activites/${id}/statut`, { actif })
  return data
}

/**
 * Supprime une activité (personnel uniquement).
 * @param {number|string} id
 */
export async function supprimerActivite(id) {
  await axiosClient.delete(`/activites/${id}`)
}
