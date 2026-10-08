import {
  changerStatutActivite,
  creerActivite,
  getActivites,
  modifierActivite,
  supprimerActivite,
} from '../api/activites.api'
import { useGestionCatalogue } from './useGestionCatalogue'

const API_ACTIVITES = {
  lister: getActivites,
  creer: creerActivite,
  modifier: modifierActivite,
  changerStatut: changerStatutActivite,
  supprimer: supprimerActivite,
}

/**
 * Gestion des activités par le personnel, masquées comprises.
 * @param {{ page?: number, q?: string, paysId?: number, categorie?: string }} filtres
 */
export function useGestionActivites(filtres = {}) {
  return useGestionCatalogue(API_ACTIVITES, filtres)
}
