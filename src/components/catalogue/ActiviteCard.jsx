import { LIBELLES_CATEGORIE, LIBELLES_DIFFICULTE } from '../../utils/constants'
import { formaterDuree, formaterPrix } from '../../utils/formatters'
import ResumeNotes from '../avis/ResumeNotes'
import BoutonFavori from './BoutonFavori'
import './ActiviteCard.css'

export default function ActiviteCard({ activite }) {
  const {
    id,
    nom,
    description,
    categorie,
    duree,
    dureeUnite,
    prixParPersonne,
    niveauDifficulte,
    ageMinimum,
    avis,
  } = activite

  return (
    <article className="activite-card">
      <p className="activite-card__categorie">
        {LIBELLES_CATEGORIE[categorie] ?? categorie}
      </p>
      <h3 className="activite-card__nom">{nom}</h3>
      {/* P11 : moyenne des notes données dans les avis, affichée seulement quand il y en a. */}
      {avis?.nombreAvis > 0 && <ResumeNotes resume={avis} />}
      {description && <p>{description}</p>}

      <dl className="liste-infos activite-card__infos">
        <div>
          <dt>Durée</dt>
          <dd>{formaterDuree(duree, dureeUnite)}</dd>
        </div>
        <div>
          <dt>Prix par personne</dt>
          <dd className="activite-card__prix">{formaterPrix(prixParPersonne)}</dd>
        </div>
        {niveauDifficulte && (
          <div>
            <dt>Difficulté</dt>
            <dd>{LIBELLES_DIFFICULTE[niveauDifficulte] ?? niveauDifficulte}</dd>
          </div>
        )}
        {ageMinimum != null && (
          <div>
            <dt>Âge minimum</dt>
            <dd>À partir de {ageMinimum} ans</dd>
          </div>
        )}
      </dl>

      <BoutonFavori type="activites" id={id} nom={nom} />
    </article>
  )
}
