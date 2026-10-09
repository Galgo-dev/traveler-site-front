import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES, routeNouvelleDemande } from '../../utils/constants'

/**
 * Accès au formulaire de demande de voyage depuis une destination.
 * Un visiteur doit d'abord se connecter (§3) ; le personnel ne passe pas de demande.
 * @param {{ destinationId: number }} props
 */
export default function BoutonDemande({ destinationId }) {
  const { estConnecte, estClient } = useAuth()
  const formulaire = routeNouvelleDemande(destinationId)

  if (estClient) {
    return (
      <Link to={formulaire} className="bouton bouton--primaire">
        Demander ce voyage
      </Link>
    )
  }
  if (estConnecte) return null

  // Après la connexion, le visiteur arrive directement sur le formulaire, destination présélectionnée.
  return (
    <Link to={ROUTES.CONNEXION} state={{ from: formulaire }} className="bouton bouton--primaire">
      Connectez-vous pour demander ce voyage
    </Link>
  )
}
