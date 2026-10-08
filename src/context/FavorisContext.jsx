import { useCallback, useMemo, useState } from 'react'
import {
  ajouterActiviteFavorite,
  ajouterDestinationFavorite,
  getMesFavoris,
  retirerActiviteFavorite,
  retirerDestinationFavorite,
} from '../api/favoris.api'
import { useAuth } from '../hooks/useAuth'
import { useRequete } from '../hooks/useRequete'
import { FavorisContext } from './contexteFavoris'

const AUCUN_FAVORI = { destinations: [], activites: [] }

// Les clés correspondent à celles de la réponse de l'API : { destinations, activites }.
const ACTIONS_PAR_TYPE = {
  destinations: { ajouter: ajouterDestinationFavorite, retirer: retirerDestinationFavorite },
  activites: { ajouter: ajouterActiviteFavorite, retirer: retirerActiviteFavorite },
}

// Seul un client connecté a des favoris : pour les autres, aucune requête n'est envoyée.
function chargerFavoris(idClient, options) {
  return idClient ? getMesFavoris(null, options) : Promise.resolve(AUCUN_FAVORI)
}

/**
 * Charge une seule fois les favoris du client connecté et les partage entre tous les écrans
 * (cartes du catalogue, fiche destination, page « Mes favoris »).
 */
export function FavorisProvider({ children }) {
  const { utilisateur, estClient } = useAuth()
  const idClient = estClient ? utilisateur.id : null
  const { donnees, chargement, erreur } = useRequete(chargerFavoris, idClient)

  // Favoris modifiés depuis le chargement, rattachés au client pour être oubliés à la déconnexion.
  const [miseAJour, setMiseAJour] = useState(null)
  const favoris = (miseAJour?.idClient === idClient ? miseAJour.favoris : donnees) ?? AUCUN_FAVORI

  const ajouter = useCallback(
    async (type, id) => {
      const favorisAJour = await ACTIONS_PAR_TYPE[type].ajouter(id)
      setMiseAJour({ idClient, favoris: favorisAJour })
    },
    [idClient],
  )

  const retirer = useCallback(
    async (type, id) => {
      await ACTIONS_PAR_TYPE[type].retirer(id)
      setMiseAJour((precedente) => {
        const base = (precedente?.idClient === idClient ? precedente.favoris : donnees) ?? AUCUN_FAVORI
        return {
          idClient,
          favoris: { ...base, [type]: base[type].filter((element) => element.id !== Number(id)) },
        }
      })
    },
    [idClient, donnees],
  )

  const estFavori = useCallback(
    (type, id) => favoris[type].some((element) => element.id === Number(id)),
    [favoris],
  )

  const valeur = useMemo(
    () => ({ favoris, chargement, erreur, estClient, estFavori, ajouter, retirer }),
    [favoris, chargement, erreur, estClient, estFavori, ajouter, retirer],
  )

  return <FavorisContext.Provider value={valeur}>{children}</FavorisContext.Provider>
}
