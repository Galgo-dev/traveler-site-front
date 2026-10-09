import { useCallback, useMemo, useState } from 'react'
import {
  ajouterActiviteFavorite,
  ajouterDestinationFavorite,
  getMesFavoris,
  retirerActiviteFavorite,
  retirerDestinationFavorite,
} from '../api/favoris.api'
import { useAuth } from '../hooks/useAuth'
import { useRequeteCatalogue } from '../hooks/useRequeteCatalogue'
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
  const { donnees, chargement, erreur } = useRequeteCatalogue(chargerFavoris, idClient)

  // Favoris modifiés par le client depuis le dernier chargement. Ils sont rattachés au client (oubliés à la
  // déconnexion) et aux données chargées : dès que le catalogue est rechargé, les données fraîches priment.
  const [miseAJour, setMiseAJour] = useState(null)
  const miseAJourValable = miseAJour?.idClient === idClient && miseAJour.chargees === donnees
  const favoris = (miseAJourValable ? miseAJour.favoris : donnees) ?? AUCUN_FAVORI

  const ajouter = useCallback(
    async (type, id) => {
      const favorisAJour = await ACTIONS_PAR_TYPE[type].ajouter(id)
      setMiseAJour({ idClient, chargees: donnees, favoris: favorisAJour })
    },
    [idClient, donnees],
  )

  const retirer = useCallback(
    async (type, id) => {
      await ACTIONS_PAR_TYPE[type].retirer(id)
      setMiseAJour((precedente) => {
        const valable = precedente?.idClient === idClient && precedente.chargees === donnees
        const base = (valable ? precedente.favoris : donnees) ?? AUCUN_FAVORI
        return {
          idClient,
          chargees: donnees,
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
