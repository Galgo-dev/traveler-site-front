import axiosClient from './axiosClient'

// V2 — Demandes de voyage (récap réunion 2). Réservé au client connecté : un visiteur doit créer un compte.

/**
 * Corps commun à l'estimation et à la création d'une demande (§4 du récap).
 * L'API contrôle les règles R1 à R7 et renvoie une erreur 400 au message explicite si l'une n'est pas respectée.
 * @typedef {object} NouvelleDemande
 * @property {number} destinationId une seule destination (R7), active (R8)
 * @property {string} dateDepart AAAA-MM-JJ, dans le futur (R2) et au moins 7 jours après la demande (R3)
 * @property {string} dateRetour AAAA-MM-JJ, strictement après la date de départ (R1)
 * @property {number} nbAdultes au moins 1 (R4)
 * @property {number} nbEnfants 0 ou plus ; 10 voyageurs au maximum, adultes compris (R5)
 * @property {number[]} [activiteIds] activités du pays de la destination uniquement (R6)
 * @property {string} [remarques] texte libre (régime, mobilité réduite…), 1 000 caractères maximum
 */

/**
 * Calcule le prix estimé d'une demande avant sa validation, sans rien enregistrer.
 * Prix estimé = (prix de la destination + Σ prix des activités) × (adultes + 0,5 × enfants).
 * @param {NouvelleDemande} demande
 * @returns {Promise<{ destination: object, activites: object[], prixDestination: number, prixUnitaire: number,
 *   prixEstime: number, mentionPrix: string, avertissement?: string }>}
 *   mentionPrix : « Estimation, non contractuel » ; avertissement : demande identique déjà en attente (R14, non bloquant)
 */
export async function estimerDemande(demande) {
  const { data } = await axiosClient.post('/demandes/estimation', demande)
  return data
}

/**
 * Enregistre la demande de voyage du client connecté, à l'état « en attente », avec son prix estimé figé.
 * @param {NouvelleDemande} demande
 * @returns {Promise<{ message: string, demande: object, avertissement?: string }>}
 *   message : confirmation à afficher (« … un conseiller vous rappellera sous 48 heures ») ;
 *   avertissement : demande identique déjà en attente (R14, la demande est tout de même créée)
 */
export async function creerDemande(demande) {
  const { data } = await axiosClient.post('/demandes', demande)
  return data
}

/**
 * Liste des demandes de voyage, de la plus récente à la plus ancienne commande.
 * Un client ne reçoit que les siennes (R15) ; le personnel les reçoit toutes.
 * @param {{ page?: number, limite?: number, etat?: 'en_attente'|'confirmee'|'annulee', paysId?: number,
 *   destinationId?: number, clientId?: number, q?: string, departDu?: string, departAu?: string }} filtres
 *   paysId, destinationId, clientId, q (nom ou e-mail du client), departDu et departAu : personnel uniquement
 * @param {{ signal?: AbortSignal }} options
 */
export async function getDemandes(filtres = {}, { signal } = {}) {
  const { data } = await axiosClient.get('/demandes', { params: filtres, signal })
  return data
}

/**
 * Détail d'une demande : destination, activités et prix figés à la commande.
 * Le personnel reçoit en plus le client (null si son compte a été supprimé), le motif d'annulation et l'historique.
 * @param {number|string} id
 * @param {{ signal?: AbortSignal }} options
 */
export async function getDemandeById(id, { signal } = {}) {
  const { data } = await axiosClient.get(`/demandes/${id}`, { signal })
  return data
}

/**
 * Confirme une demande « en attente » (personnel uniquement).
 * @param {number|string} id
 * @returns {Promise<object>} la demande à jour
 */
export async function confirmerDemande(id) {
  const { data } = await axiosClient.post(`/demandes/${id}/confirmation`)
  return data
}

/**
 * Annule une demande. Le client ne peut annuler que si elle est « en attente » (R11) ;
 * le personnel doit indiquer un motif (R13).
 * @param {number|string} id
 * @param {string} [motif]
 * @returns {Promise<object>} la demande à jour
 */
export async function annulerDemande(id, motif) {
  const { data } = await axiosClient.post(`/demandes/${id}/annulation`, motif ? { motif } : {})
  return data
}
