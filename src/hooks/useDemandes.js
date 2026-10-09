import { useCallback, useState } from 'react'
import {
  annulerDemande,
  confirmerDemande,
  creerDemande,
  estimerDemande,
  getDemandeById,
  getDemandes,
} from '../api/demandes.api'
import { useRequete } from './useRequete'
import { useRequeteCatalogue } from './useRequeteCatalogue'

// Sans saisie complète et valide, aucune estimation n'est demandée.
function chargerEstimation(demande, options) {
  return demande ? estimerDemande(demande, options) : Promise.resolve(null)
}

// La version ne sert qu'à relancer la requête après une action : elle n'est pas envoyée à l'API.
function chargerDemande({ id }, options) {
  return getDemandeById(id, options)
}

/**
 * Prix estimé d'une demande en cours de saisie (§7 : affiché avant la validation).
 * Il est recalculé à chaque changement et quand un agent modifie un tarif ; il n'est figé qu'à l'envoi.
 * @param {import('../api/demandes.api').NouvelleDemande | null} demande null tant que la saisie est incomplète
 */
export function useEstimationDemande(demande) {
  const { donnees, chargement, erreur } = useRequeteCatalogue(chargerEstimation, demande)

  return { estimation: donnees, chargement: Boolean(demande) && chargement, erreur }
}

/**
 * Envoi d'une nouvelle demande de voyage par le client connecté.
 */
export function useCreationDemande() {
  return { creer: creerDemande }
}

/**
 * Liste des demandes : celles du client connecté (R15), ou toutes pour le personnel.
 * @param {{ page?: number, etat?: string, paysId?: number, destinationId?: number, clientId?: number,
 *   q?: string, departDu?: string, departAu?: string }} filtres
 */
export function useDemandes(filtres = {}) {
  const { donnees, chargement, erreur } = useRequete(getDemandes, filtres)

  return {
    demandes: donnees?.donnees ?? [],
    pagination: donnees?.pagination ?? null,
    chargement,
    erreur,
  }
}

/**
 * Détail d'une demande, avec la confirmation (personnel) et l'annulation.
 * Le détail est rechargé après chaque action, historique compris.
 * @param {number|string} id
 */
export function useDemande(id) {
  const [version, setVersion] = useState(0)
  const { donnees, chargement, erreur } = useRequete(chargerDemande, { id, version })

  const recharger = useCallback(() => setVersion((precedente) => precedente + 1), [])

  const confirmer = useCallback(async () => {
    await confirmerDemande(id)
    recharger()
  }, [id, recharger])

  const annuler = useCallback(
    async (motif) => {
      await annulerDemande(id, motif)
      recharger()
    },
    [id, recharger],
  )

  return { demande: donnees, chargement: chargement && !donnees, erreur, confirmer, annuler }
}
