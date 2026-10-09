import axiosClient from './axiosClient'

// V3 — Avis clients (récap réunion 3). Les avis publiés sont publics ; la rédaction est réservée au client
// connecté (R1) et la modération au personnel.

/**
 * Résumé des notes d'une destination ou d'une activité. Seuls les avis « publié » comptent (R15).
 * @typedef {object} ResumeNotes
 * @property {number|null} noteMoyenne
 * @property {string|null} noteMoyenneAffichee une décimale et une virgule, ex. « 4,6 » (P9)
 * @property {number} nombreAvis
 * @property {string} libelle « ★ 4,6 (23 avis) », ou « Pas encore d'avis » s'il n'y en a aucun (R16)
 */

/**
 * Avis publié, tel que le voit le public.
 * @typedef {object} AvisPublic
 * @property {number} id
 * @property {number} note de 1 à 5
 * @property {string} titre
 * @property {string|null} commentaire
 * @property {string} auteur « Julie D. », ou « Voyageur anonyme » (R17, R19)
 * @property {{ dateDepart: string, libelle: string }} sejour mois et année de départ (P10)
 * @property {string} publieLe
 * @property {{ texte: string, date: string, modifieeLe: string, agent: string|null }|null} reponse
 *   réponse de l'agence, signée du prénom du dernier agent qui l'a écrite (P7)
 */

/**
 * Avis du client connecté, avec son état et ce qu'il peut encore en faire.
 * @typedef {object} AvisClient
 * @property {number} id
 * @property {number} demandeId
 * @property {'en_attente'|'publie'|'refuse'} etat
 * @property {string|null} motifRefus visible par le client (P3)
 * @property {boolean} modifiable vrai pendant les 30 jours qui suivent la création (R9, P1)
 * @property {string} modifiableJusquau
 */

/**
 * Corps de création d'un avis sur une commande terminée (« confirmée », retour dépassé : R2, R3).
 * L'API contrôle les règles et renvoie une erreur au message explicite si l'une n'est pas respectée.
 * @typedef {object} NouvelAvis
 * @property {number} demandeId un seul avis par commande (R4), porte sur sa destination (R5)
 * @property {number} note entier de 1 à 5 (R6)
 * @property {string} titre 100 caractères maximum (P4)
 * @property {string} [commentaire] 1 000 caractères maximum (R7), obligatoire si la note est de 2 ou moins (R8)
 * @property {boolean} [anonyme] faux par défaut ; le public verra « Voyageur anonyme » (R17)
 * @property {{ activiteId: number, note: number }[]} [notesActivites] activités de la commande uniquement (R20)
 */

// --- Public ---

/**
 * Avis publiés d'une destination, avec le résumé de ses notes (R15). Une destination masquée renvoie une 404 (R18).
 * @param {number|string} destinationId
 * @param {{ tri?: 'recents'|'meilleures', note?: number, page?: number, limite?: number }} filtres
 *   tri : plus récents par défaut ; note : filtre sur le nombre d'étoiles
 * @param {{ signal?: AbortSignal }} options
 * @returns {Promise<{ resume: ResumeNotes, donnees: AvisPublic[], pagination: object }>}
 */
export async function getAvisDestination(destinationId, filtres = {}, { signal } = {}) {
  const { data } = await axiosClient.get(`/destinations/${destinationId}/avis`, { params: filtres, signal })
  return data
}

/**
 * Les 5 derniers avis publiés à 5 étoiles, pour la page d'accueil.
 * @param {{ signal?: AbortSignal }} options
 * @returns {Promise<AvisPublic[]>} chaque avis indique aussi sa destination
 */
export async function getDerniersAvis({ signal } = {}) {
  const { data } = await axiosClient.get('/avis/derniers', { signal })
  return data
}

// --- Client connecté ---

/**
 * Commandes sur lesquelles le client peut encore donner son avis (bouton « Donner mon avis »).
 * @param {{ signal?: AbortSignal }} options
 * @returns {Promise<{ id: number, destination: object, dateDepart: string, dateRetour: string,
 *   activites: object[] }[]>} activites : celles de la commande, que le client peut noter (R20)
 */
export async function getCommandesEligibles({ signal } = {}) {
  const { data } = await axiosClient.get('/avis/commandes-eligibles', { signal })
  return data
}

/**
 * Avis du client connecté, du plus récent au plus ancien, avec leur état et l'éventuel motif de refus.
 * @param {{ signal?: AbortSignal }} options
 * @returns {Promise<AvisClient[]>}
 */
export async function getMesAvis({ signal } = {}) {
  const { data } = await axiosClient.get('/avis/moi', { signal })
  return data
}

/**
 * Dépose un avis, « en attente de validation » jusqu'à sa modération (R10).
 * @param {NouvelAvis} avis
 * @returns {Promise<AvisClient>}
 */
export async function creerAvis(avis) {
  const { data } = await axiosClient.post('/avis', avis)
  return data
}

/**
 * Modifie son avis pendant 30 jours (R9). Un changement de contenu le renvoie « en attente » et le retire de
 * l'affichage public (R12) ; changer seulement l'anonymat ne relance pas la modération (P5).
 * @param {number|string} id
 * @param {Partial<Omit<NouvelAvis, 'demandeId'>>} modifications au moins un champ
 * @returns {Promise<AvisClient>}
 */
export async function modifierAvis(id, modifications) {
  const { data } = await axiosClient.patch(`/avis/${id}`, modifications)
  return data
}

/**
 * Supprime définitivement son avis, quel que soit son état, pendant 30 jours (R9, §8).
 * @param {number|string} id
 */
export async function supprimerAvis(id) {
  await axiosClient.delete(`/avis/${id}`)
}

// --- Client (le sien) ou personnel ---

/**
 * Détail d'un avis. Un client ne reçoit que les siens ; le personnel reçoit aussi le vrai client, même si l'avis
 * est anonyme (R17), la commande liée, le modérateur et l'historique de modération (P14).
 * @param {number|string} id
 * @param {{ signal?: AbortSignal }} options
 */
export async function getAvisById(id, { signal } = {}) {
  const { data } = await axiosClient.get(`/avis/${id}`, { signal })
  return data
}

// --- Personnel ---

/**
 * Nombre d'avis à modérer, pour le tableau de bord.
 * @param {{ signal?: AbortSignal }} options
 * @returns {Promise<{ aModerer: number }>}
 */
export async function getCompteurAvis({ signal } = {}) {
  const { data } = await axiosClient.get('/avis/compteur', { signal })
  return data
}

/**
 * File de modération : avis « en attente de validation », les plus anciens d'abord.
 * @param {{ page?: number, limite?: number }} filtres
 * @param {{ signal?: AbortSignal }} options
 */
export async function getFileModeration(filtres = {}, { signal } = {}) {
  const { data } = await axiosClient.get('/avis/moderation', { params: filtres, signal })
  return data
}

/**
 * Tous les avis, les négatifs (note de 2 ou moins, P8) en premier, puis les plus récents.
 * @param {{ etat?: 'en_attente'|'publie'|'refuse', destinationId?: number, paysId?: number, note?: number,
 *   du?: string, au?: string, page?: number, limite?: number }} filtres du / au : période de dépôt (AAAA-MM-JJ)
 * @param {{ signal?: AbortSignal }} options
 */
export async function getAvis(filtres = {}, { signal } = {}) {
  const { data } = await axiosClient.get('/avis', { params: filtres, signal })
  return data
}

/**
 * Publie un avis en attente de validation.
 * @param {number|string} id
 * @returns {Promise<object>} l'avis à jour
 */
export async function validerAvis(id) {
  const { data } = await axiosClient.post(`/avis/${id}/validation`)
  return data
}

/**
 * Refuse un avis en attente ; le motif, obligatoire (R11), est montré au client (P3).
 * @param {number|string} id
 * @param {string} motif
 * @returns {Promise<object>} l'avis à jour
 */
export async function refuserAvis(id, motif) {
  const { data } = await axiosClient.post(`/avis/${id}/refus`, { motif })
  return data
}

/**
 * Masque un avis publié : il passe « refusé » et quitte l'affichage public. Motif obligatoire (R11).
 * @param {number|string} id
 * @param {string} motif
 * @returns {Promise<object>} l'avis à jour
 */
export async function masquerAvis(id, motif) {
  const { data } = await axiosClient.post(`/avis/${id}/masquage`, { motif })
  return data
}

/**
 * Écrit ou remplace la réponse unique de l'agence à un avis publié (R14, P6) ; 1 000 caractères maximum (P4).
 * Le texte du client n'est jamais modifiable par le personnel (R13).
 * @param {number|string} id
 * @param {string} texte
 * @returns {Promise<object>} l'avis à jour
 */
export async function repondreAvis(id, texte) {
  const { data } = await axiosClient.put(`/avis/${id}/reponse`, { texte })
  return data
}
