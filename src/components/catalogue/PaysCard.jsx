import { Link } from 'react-router-dom'
import { routePaysDetail } from '../../utils/constants'
import './PaysCard.css'

/**
 * Carte d'un pays du catalogue, menant à ses destinations et activités.
 * @param {{ pays: object, niveauTitre?: 2 | 3 }} props
 */
export default function PaysCard({ pays, niveauTitre = 3 }) {
  const { id, nom, continent, descriptionCourte, languePrincipale, monnaie, visaRequis } = pays
  const Titre = `h${niveauTitre}`

  return (
    <article className="pays-card">
      <p className="pays-card__continent">{continent}</p>
      <Titre className="pays-card__nom">
        {/* Le lien s'étend à toute la carte (voir ::after dans le CSS). */}
        <Link className="pays-card__lien" to={routePaysDetail(id)}>
          {nom}
        </Link>
      </Titre>
      {descriptionCourte && <p>{descriptionCourte}</p>}

      <dl className="liste-infos pays-card__infos">
        <div>
          <dt>Langue</dt>
          <dd>{languePrincipale}</dd>
        </div>
        <div>
          <dt>Monnaie</dt>
          <dd>{monnaie}</dd>
        </div>
        <div>
          <dt>Visa pour les Belges</dt>
          <dd>{visaRequis ? 'Obligatoire' : 'Non requis'}</dd>
        </div>
      </dl>

      <p className="pays-card__invite" aria-hidden="true">
        Voir les destinations et activités →
      </p>
    </article>
  )
}
