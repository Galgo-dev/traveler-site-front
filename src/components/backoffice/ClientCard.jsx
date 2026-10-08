import { Link } from 'react-router-dom'
import { routeClientDetail } from '../../utils/constants'
import { formaterDate } from '../../utils/formatters'
import CarteGestion from './CarteGestion'

/**
 * Résumé d'un client dans la liste du personnel, avec l'accès à son dossier.
 * @param {{ client: object }} props
 */
export default function ClientCard({ client }) {
  return (
    <CarteGestion
      titre={`${client.prenom} ${client.nom}`}
      infos={[
        { libelle: 'E-mail', valeur: client.email },
        { libelle: 'Téléphone', valeur: client.telephone || '—' },
        { libelle: 'Date de naissance', valeur: client.dateNaissance ? formaterDate(client.dateNaissance) : '—' },
      ]}
      actions={
        <Link to={routeClientDetail(client.id)} className="bouton bouton--secondaire">
          Ouvrir le dossier
        </Link>
      }
    />
  )
}
