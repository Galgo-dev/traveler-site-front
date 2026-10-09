import { useCallback, useState } from 'react'
import {
  getClientById,
  getClients,
  getFavorisClient,
  modifierClient,
  supprimerClient,
} from '../api/clients.api'
import { useRequete } from './useRequete'

// Toutes les demandes en attente tiennent sur une page : elles sont traitées au fil de l'eau.
const DEMANDES_SUPPRESSION = { suppressionDemandee: true, limite: 100 }

// La version ne sert qu'à relancer la requête après une correction : elle n'est pas envoyée à l'API.
function chargerClient({ id }, options) {
  return getClientById(id, options)
}

/**
 * Charge la liste paginée des clients (personnel uniquement).
 * @param {{ page?: number, limite?: number, q?: string }} filtres
 */
export function useClients(filtres = {}) {
  const { donnees, chargement, erreur } = useRequete(getClients, filtres)

  return {
    clients: donnees?.donnees ?? [],
    pagination: donnees?.pagination ?? null,
    chargement,
    erreur,
  }
}

/**
 * Charge les clients ayant demandé la suppression de leur compte, les plus anciennes demandes d'abord
 * (personnel uniquement).
 */
export function useDemandesSuppression() {
  const { donnees, chargement, erreur } = useRequete(getClients, DEMANDES_SUPPRESSION)

  return { demandes: donnees?.donnees ?? [], chargement, erreur }
}

/**
 * Charge le dossier d'un client et ses favoris, et expose la correction et l'effacement RGPD
 * (personnel uniquement). Le dossier est rechargé après une correction.
 * @param {number|string} id
 */
export function useDossierClient(id) {
  const [version, setVersion] = useState(0)
  const dossier = useRequete(chargerClient, { id, version })
  const favoris = useRequete(getFavorisClient, id)

  const modifier = useCallback(
    async (champs) => {
      const client = await modifierClient(id, champs)
      setVersion((precedente) => precedente + 1)
      return client
    },
    [id],
  )

  const effacer = useCallback(() => supprimerClient(id), [id])

  return {
    client: dossier.donnees,
    chargement: dossier.chargement,
    erreur: dossier.erreur,
    favoris: favoris.donnees,
    chargementFavoris: favoris.chargement,
    erreurFavoris: favoris.erreur,
    modifier,
    effacer,
  }
}
