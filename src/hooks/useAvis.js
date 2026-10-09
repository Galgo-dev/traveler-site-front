import { useCallback, useState } from 'react'
import {
  creerAvis,
  getAvis,
  getAvisById,
  getCommandesEligibles,
  getCompteurAvis,
  getFileModeration,
  masquerAvis,
  refuserAvis,
  repondreAvis,
  validerAvis,
} from '../api/avis.api'
import { useRequete } from './useRequete'

// L'appel ne prend pas de paramètres : seule l'annulation est transmise.
function chargerCommandesEligibles(_parametres, options) {
  return getCommandesEligibles(options)
}

function chargerCompteur(_parametres, options) {
  return getCompteurAvis(options)
}

// La version ne sert qu'à relancer la requête après une action : elle n'est pas envoyée à l'API.
function chargerAvis({ id }, options) {
  return getAvisById(id, options)
}

function versListe({ donnees, chargement, erreur }) {
  return {
    avis: donnees?.donnees ?? [],
    pagination: donnees?.pagination ?? null,
    chargement,
    erreur,
  }
}

/**
 * Commandes terminées sur lesquelles le client connecté peut encore donner son avis (R2 à R4).
 */
export function useCommandesEligibles() {
  const { donnees, chargement, erreur } = useRequete(chargerCommandesEligibles, null)

  return { commandes: donnees ?? [], chargement, erreur }
}

/**
 * Envoi d'un avis par le client connecté ; il reste « en attente de validation » jusqu'à sa modération (R10).
 */
export function useCreationAvis() {
  return { creer: creerAvis }
}

/**
 * Nombre d'avis à modérer, pour le tableau de bord du personnel.
 */
export function useCompteurAvis() {
  const { donnees, chargement, erreur } = useRequete(chargerCompteur, null)

  return { aModerer: donnees?.aModerer ?? 0, chargement, erreur }
}

/**
 * File de modération : avis en attente, les plus anciens d'abord.
 * @param {{ page?: number }} filtres
 */
export function useFileModeration(filtres = {}) {
  return versListe(useRequete(getFileModeration, filtres))
}

/**
 * Tous les avis pour le personnel, les négatifs (note ≤ 2, P8) en premier.
 * @param {{ page?: number, etat?: string, destinationId?: number, paysId?: number, note?: number,
 *   du?: string, au?: string }} filtres
 */
export function useAvisGestion(filtres = {}) {
  return versListe(useRequete(getAvis, filtres))
}

/**
 * Détail d'un avis pour le personnel, avec les actions de modération et la réponse de l'agence.
 * Le détail est rechargé après chaque action, historique compris.
 * @param {number|string} id
 */
export function useModerationAvis(id) {
  const [version, setVersion] = useState(0)
  const { donnees, chargement, erreur } = useRequete(chargerAvis, { id, version })

  const recharger = useCallback(() => setVersion((precedente) => precedente + 1), [])

  // Chaque action renvoie l'avis à jour ; on recharge pour rester aligné sur l'API.
  const apres = useCallback(
    (action) =>
      async (...parametres) => {
        await action(id, ...parametres)
        recharger()
      },
    [id, recharger],
  )

  return {
    avis: donnees,
    chargement: chargement && !donnees,
    erreur,
    valider: apres(validerAvis),
    refuser: apres(refuserAvis),
    masquer: apres(masquerAvis),
    repondre: apres(repondreAvis),
  }
}
