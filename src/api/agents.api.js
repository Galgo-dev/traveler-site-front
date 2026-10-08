import axiosClient from './axiosClient'

/**
 * Récupère le compte du membre du personnel connecté (agent ou administrateur).
 * Le premier paramètre est ignoré : il garde la signature compatible avec useRequete.
 * @param {unknown} _
 * @param {{ signal?: AbortSignal }} options
 */
export async function getMonCompteAgent(_, { signal } = {}) {
  const { data } = await axiosClient.get('/agents/moi', { signal })
  return data
}

/**
 * Récupère la liste paginée des comptes du personnel (administrateur uniquement).
 * @param {{ page?: number, limite?: number, q?: string, actif?: boolean, role?: 'agent'|'administrateur' }} filtres
 * @param {{ signal?: AbortSignal }} options
 */
export async function getAgents(filtres = {}, { signal } = {}) {
  const { data } = await axiosClient.get('/agents', { params: filtres, signal })
  return data
}

/**
 * Récupère le détail d'un compte du personnel (administrateur uniquement).
 * @param {number|string} id
 * @param {{ signal?: AbortSignal }} options
 */
export async function getAgentById(id, { signal } = {}) {
  const { data } = await axiosClient.get(`/agents/${id}`, { signal })
  return data
}

/**
 * Crée un compte du personnel (administrateur uniquement).
 * @param {{ nom: string, prenom: string, email: string, motDePasse: string,
 *   numeroEmploye: string, role: 'agent'|'administrateur' }} agent
 */
export async function creerAgent(agent) {
  const { data } = await axiosClient.post('/agents', agent)
  return data
}

/**
 * Modifie un compte du personnel, sans toucher au mot de passe (administrateur uniquement).
 * @param {number|string} id
 * @param {{ nom?: string, prenom?: string, email?: string, numeroEmploye?: string,
 *   role?: 'agent'|'administrateur' }} champs
 */
export async function modifierAgent(id, champs) {
  const { data } = await axiosClient.patch(`/agents/${id}`, champs)
  return data
}

/**
 * Active ou désactive un compte du personnel (administrateur uniquement).
 * @param {number|string} id
 * @param {boolean} actif
 */
export async function changerStatutAgent(id, actif) {
  const { data } = await axiosClient.patch(`/agents/${id}/statut`, { actif })
  return data
}

/**
 * Définit un nouveau mot de passe pour un compte du personnel (administrateur uniquement).
 * @param {number|string} id
 * @param {string} motDePasse
 */
export async function definirMotDePasseAgent(id, motDePasse) {
  const { data } = await axiosClient.put(`/agents/${id}/mot-de-passe`, { motDePasse })
  return data
}
