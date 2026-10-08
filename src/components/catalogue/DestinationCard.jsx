import { Link } from 'react-router-dom'
import { routeDestinationDetail } from '../../utils/constants'
import { formaterPrix } from '../../utils/formatters'
import DestinationPhoto from './DestinationPhoto'
import './DestinationCard.css'

export default function DestinationCard({ destination }) {
  const { id, nom, description, periodeIdeale, prixAPartirDe, photoUrl, pays } = destination

  return (
    <article className="destination-card">
      <DestinationPhoto nom={nom} photoUrl={photoUrl} />

      <div className="destination-card__contenu">
        {pays && <p className="destination-card__pays">{pays.nom}</p>}
        <h2 className="destination-card__nom">
          {/* Le lien s'étend à toute la carte (voir ::after dans le CSS). */}
          <Link className="destination-card__lien" to={routeDestinationDetail(id)}>
            {nom}
          </Link>
        </h2>
        {description && <p>{description}</p>}

        <dl className="liste-infos destination-card__infos">
          {periodeIdeale && (
            <div>
              <dt>Période idéale</dt>
              <dd>{periodeIdeale}</dd>
            </div>
          )}
          {prixAPartirDe != null && (
            <div>
              <dt>Prix indicatif</dt>
              <dd className="destination-card__prix">À partir de {formaterPrix(prixAPartirDe)}</dd>
            </div>
          )}
        </dl>

        <p className="destination-card__invite" aria-hidden="true">
          Voir les détails et activités →
        </p>
      </div>
    </article>
  )
}
