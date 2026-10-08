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
