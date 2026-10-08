import { formaterPrix } from '../../utils/formatters'
import './DestinationCard.css'

export default function DestinationCard({ destination }) {
  const { nom, description, periodeIdeale, prixAPartirDe, photoUrl, pays } = destination

  return (
    <article className="destination-card">
      {photoUrl ? (
        <img className="destination-card__photo" src={photoUrl} alt={`Vue de ${nom}`} loading="lazy" />
      ) : (
        <div className="destination-card__photo destination-card__photo--absente" aria-hidden="true">
          ✈
        </div>
      )}

      <div className="destination-card__contenu">
        {pays && <p className="destination-card__pays">{pays.nom}</p>}
        <h2 className="destination-card__nom">{nom}</h2>
        {description && <p>{description}</p>}

        <dl className="destination-card__infos">
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
      </div>
    </article>
  )
}
