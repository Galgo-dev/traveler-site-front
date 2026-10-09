import { Link } from 'react-router-dom'
import { routeClientDetail } from '../../utils/constants'

/**
 * Nom, téléphone et e-mail d'un client pour le rappeler, avec le lien vers son dossier.
 * Sans client (compte supprimé, RGPD), affiche le message d'anonymisation.
 * @param {{ client: { id: number, prenom: string, nom: string, telephone?: string, email: string }|null,
 *   messageAnonymise: string }} props
 */
export default function CoordonneesClient({ client, messageAnonymise }) {
  if (!client) return <p>{messageAnonymise}</p>

  return (
    <dl className="liste-infos">
      <div>
        <dt>Nom</dt>
        <dd>
          <Link to={routeClientDetail(client.id)}>
            {client.prenom} {client.nom}
          </Link>
        </dd>
      </div>
      <div>
        <dt>Téléphone</dt>
        <dd>{client.telephone ? <a href={`tel:${client.telephone.replace(/\s/g, '')}`}>{client.telephone}</a> : '—'}</dd>
      </div>
      <div>
        <dt>E-mail</dt>
        <dd>
          <a href={`mailto:${client.email}`}>{client.email}</a>
        </dd>
      </div>
    </dl>
  )
}
