import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useFavoris } from '../../hooks/useFavoris'
import { ROUTES } from '../../utils/constants'
import './BoutonFavori.css'

function BoutonClient({ type, id, nom }) {
  const { estFavori, ajouter, retirer } = useFavoris()
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState(null)
  const actif = estFavori(type, id)

  async function basculer() {
    setEnvoi(true)
    setErreur(null)
    try {
      await (actif ? retirer(type, id) : ajouter(type, id))
    } catch (erreurFavori) {
      setErreur(erreurFavori)
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <div className="bouton-favori">
      <button
        type="button"
        className={`bouton bouton--secondaire bouton-favori__bouton ${actif ? 'bouton-favori__bouton--actif' : ''}`.trim()}
        aria-pressed={actif}
        disabled={envoi}
        onClick={basculer}
      >
        <span className="bouton-favori__coeur" aria-hidden="true">
          {actif ? '♥' : '♡'}
        </span>
        {actif ? 'Dans mes favoris' : 'Ajouter à mes favoris'}
        <span className="visuellement-cache"> : {nom}</span>
      </button>
      {erreur && (
        <p className="bouton-favori__erreur" role="alert">
          {erreur.message}
        </p>
      )}
    </div>
  )
}

/**
 * Ajoute ou retire un élément des favoris du client connecté.
 * Un visiteur est invité à se connecter ; le personnel ne voit pas ce bouton.
 * @param {{ type: 'destinations'|'activites', id: number, nom: string }} props
 */
export default function BoutonFavori(props) {
  const { estConnecte, estClient } = useAuth()
  const { pathname } = useLocation()

  if (estClient) return <BoutonClient {...props} />
  if (estConnecte) return null

  return (
    <div className="bouton-favori">
      <Link
        to={ROUTES.CONNEXION}
        state={{ from: pathname }}
        className="bouton bouton--secondaire bouton-favori__bouton"
      >
        <span className="bouton-favori__coeur" aria-hidden="true">
          ♡
        </span>
        Connectez-vous pour l'ajouter à vos favoris
        <span className="visuellement-cache"> : {props.nom}</span>
      </Link>
    </div>
  )
}
