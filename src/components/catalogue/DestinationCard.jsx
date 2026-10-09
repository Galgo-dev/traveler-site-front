import { Link } from 'react-router-dom'
import { routeDestinationDetail } from '../../utils/constants'
import { formaterPrix } from '../../utils/formatters'
import ResumeNotes from '../avis/ResumeNotes'
import BoutonFavori from './BoutonFavori'
import DestinationPhoto from './DestinationPhoto'
import './DestinationCard.css'

/**
 * @param {{ destination: object, niveauTitre?: 2 | 3 }} props
 *   niveauTitre : niveau du titre de la carte, selon la hiérarchie de la page
 */
export default function DestinationCard({ destination, niveauTitre = 2 }) {
  const { id, nom, description, periodeIdeale, prixAPartirDe, photoUrl, pays, avis } = destination
  const Titre = `h${niveauTitre}`

  return (
    <article className="destination-card">
      <DestinationPhoto nom={nom} photoUrl={photoUrl} />

      <div className="destination-card__contenu">
        {pays && <p className="destination-card__pays">{pays.nom}</p>}
        <Titre className="destination-card__nom">
          {/* Le lien s'étend à toute la carte (voir ::after dans le CSS). */}
          <Link className="destination-card__lien" to={routeDestinationDetail(id)}>
            {nom}
          </Link>
        </Titre>
        {/* V3 : « ★ 4,6 / 5 (23 avis) » ou « Pas encore d'avis » (R16). */}
        <ResumeNotes resume={avis} />
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

        <BoutonFavori type="destinations" id={id} nom={nom} />
      </div>
    </article>
  )
}
