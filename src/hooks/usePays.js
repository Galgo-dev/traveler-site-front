import {
  changerStatutPays,
  creerPays,
  getPays,
  getPaysById,
  modifierPays,
  supprimerPays,
} from '../api/pays.api'
import { useGestionCatalogue } from './useGestionCatalogue'
import { useRequete } from './useRequete'

const API_PAYS = {
  lister: getPays,
  creer: creerPays,
  modifier: modifierPays,
  changerStatut: changerStatutPays,
  supprimer: supprimerPays,
}

// Assez pour tout le catalogue (~20 pays) en une seule page.
const TOUS_LES_PAYS = { limite: 100, inclureMasques: true }

/**
 * Charge le détail d'un pays (langue, monnaie, visa, décalage horaire).
 * @param {number|string} id
 */
export function usePaysDetail(id) {
  const { donnees, chargement, erreur } = useRequete(getPaysById, id)

  return { pays: donnees, chargement, erreur }
}

/**
 * Gestion des pays par le personnel, masqués compris.
 * @param {{ page?: number, q?: string, continent?: string }} filtres
 */
export function useGestionPays(filtres = {}) {
  const { elements, ...gestion } = useGestionCatalogue(API_PAYS, filtres)

  return { pays: elements, ...gestion }
}

/**
 * Tous les pays, masqués compris, pour alimenter les listes déroulantes du back-office.
 */
export function useOptionsPays() {
  const { donnees, chargement, erreur } = useRequete(getPays, TOUS_LES_PAYS)

  return { pays: donnees?.donnees ?? [], chargement, erreur }
}
