import { Link } from 'react-router-dom'
import { useDemandesSuppression } from '../../hooks/useClients'
import { routeClientDetail } from '../../utils/constants'
import { formaterDate } from '../../utils/formatters'
import ErrorMessage from '../ui/ErrorMessage'
import './DemandesSuppression.css'

/**
 * Demandes de suppression de compte en attente, les plus anciennes d'abord.
 * Chaque demande mène au dossier du client, où l'agent efface le compte (RGPD).
 * Rien n'est affiché tant qu'il n'y a aucune demande.
 */
export default function DemandesSuppression() {
  const { demandes, erreur } = useDemandesSuppression()

  if (erreur) {
    return <ErrorMessage message={`Les demandes de suppression n'ont pas pu être chargées : ${erreur.message}`} />
  }
  if (demandes.length === 0) return null

  return (
    <section className="demandes-suppression" aria-labelledby="titre-demandes-suppression">
      <h2 id="titre-demandes-suppression">Demandes de suppression en attente ({demandes.length})</h2>
      <p>Ces clients ont demandé la suppression de leur compte. Ouvrez leur dossier pour effacer leurs données.</p>

      <ul className="demandes-suppression__liste">
        {demandes.map((client) => (
          <li key={client.id} className="demandes-suppression__demande">
            <div>
              <strong>
                {client.prenom} {client.nom}
              </strong>
              <span className="demandes-suppression__email">{client.email}</span>
              <span>Demandée le {formaterDate(client.suppressionDemandeeLe)}</span>
            </div>
            <Link to={routeClientDetail(client.id)} className="bouton bouton--secondaire">
              Ouvrir le dossier
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
