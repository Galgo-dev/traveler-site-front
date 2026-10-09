import {
  changerStatutPays,
  creerPays,
  getActivitesDuPays,
  getDestinationsDuPays,
  getPays,
  getPaysById,
  modifierPays,
  supprimerPays,
} from '../api/pays.api'
import { useGestionCatalogue } from './useGestionCatalogue'
import { useRequeteCatalogue } from './useRequeteCatalogue'

const API_PAYS = {
  lister: getPays,
  creer: creerPays,
  modifier: modifierPays,
  changerStatut: changerStatutPays,
  supprimer: supprimerPays,
}

// Assez pour tout le catalogue (~20 pays) en une seule page.
const TOUS_LES_PAYS = { limite: 100, inclureMasques: true }
// Côté client : tous les pays visibles, ou toutes les destinations / activités d'un pays, en une page.
const UNE_SEULE_PAGE = { limite: 100 }

/**
 * Charge le détail d'un pays (langue, monnaie, visa, décalage horaire).
 * @param {number|string} id
 */
export function usePaysDetail(id) {
  const { donnees, chargement, erreur } = useRequeteCatalogue(getPaysById, id)

  return { pays: donnees, chargement, erreur }
}

/**
 * Gestion des pays par le personnel, masqués compris.
 * @param {{ page?: number, q?: string, continent?: string }} filtres
 */
export function useGestionPays(filtres = {}) {
  return useGestionCatalogue(API_PAYS, filtres)
}

function versOptionPays({ id, nom, actif }) {
  return { valeur: String(id), libelle: actif ? nom : `${nom} (masqué)` }
}

/**
 * Tous les pays, masqués compris, sous forme d'options pour les listes déroulantes du back-office.
 */
export function useOptionsPays() {
  const { donnees, chargement, erreur } = useRequeteCatalogue(getPays, TOUS_LES_PAYS)

  return { options: (donnees?.donnees ?? []).map(versOptionPays), chargement, erreur }
}

/**
 * Tous les pays visibles du catalogue, pour la page « Nos pays ».
 */
export function useListePays() {
  const { donnees, chargement, erreur } = useRequeteCatalogue(getPays, UNE_SEULE_PAGE)

  return { pays: donnees?.donnees ?? [], chargement, erreur }
}

/**
 * Destinations visibles d'un pays.
 * @param {number|string} id
 */
export function useDestinationsDuPays(id) {
  const { donnees, chargement, erreur } = useRequeteCatalogue(getDestinationsDuPays, { id, filtres: UNE_SEULE_PAGE })

  return { destinations: donnees?.donnees ?? [], chargement, erreur }
}

// Sans pays choisi (ex. formulaire de demande avant le choix de la destination), aucune requête n'est utile.
function chargerActivitesDuPays(parametres, options) {
  return parametres.id ? getActivitesDuPays(parametres, options) : Promise.resolve({ donnees: [] })
}

/**
 * Activités visibles d'un pays, éventuellement filtrées par catégorie et budget.
 * @param {number|string|null} id
 * @param {{ categorie?: string, budgetMax?: number }} filtres
 */
export function useActivitesDuPays(id, filtres = {}) {
  const { donnees, chargement, erreur } = useRequeteCatalogue(chargerActivitesDuPays, {
    id: id ?? null,
    filtres: { ...UNE_SEULE_PAGE, ...filtres },
  })

  return { activites: donnees?.donnees ?? [], chargement, erreur }
}
