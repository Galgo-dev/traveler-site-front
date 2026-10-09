import { formaterPrixEstime, formaterVoyageurs } from '../../utils/formatters'
import './DetailPrix.css'

// P8 : sans prix indicatif pour la destination, l'API ne calcule pas d'estimation.
const SANS_ESTIMATION = "Pas d'estimation possible pour cette destination : votre conseiller vous communiquera le prix."

/**
 * Détail du prix estimé (§5) : prix par personne (destination + activités), multiplié par le nombre de
 * voyageurs, les enfants comptant pour moitié.
 * @param {{ prixDestination: number|string|null, prixUnitaire: number|string|null, prixEstime: number|string|null,
 *   activites: { id: number, nom: string, prixParPersonne: number|string }[], nbAdultes: number, nbEnfants: number,
 *   mentionPrix: string }} props
 */
export default function DetailPrix({ prixDestination, prixUnitaire, prixEstime, activites, nbAdultes, nbEnfants, mentionPrix }) {
  if (prixEstime === null || prixEstime === undefined) {
    return <p className="detail-prix__absente">{SANS_ESTIMATION}</p>
  }

  return (
    <>
      <dl className="detail-prix__lignes">
        <div>
          <dt>Destination, par personne</dt>
          <dd>{formaterPrixEstime(prixDestination)}</dd>
        </div>
        {activites.map((activite) => (
          <div key={activite.id}>
            <dt>{activite.nom}, par personne</dt>
            <dd>+ {formaterPrixEstime(activite.prixParPersonne)}</dd>
          </div>
        ))}
        <div>
          <dt>Prix par personne</dt>
          <dd>{formaterPrixEstime(prixUnitaire)}</dd>
        </div>
        <div>
          <dt>Voyageurs</dt>
          <dd>
            × {formaterVoyageurs(nbAdultes, nbEnfants)}
            {nbEnfants > 0 && <span className="detail-prix__precision"> (un enfant compte pour moitié)</span>}
          </dd>
        </div>
      </dl>
      <p className="detail-prix__total">
        Prix estimé : <strong>{formaterPrixEstime(prixEstime)}</strong>
      </p>
      <p className="detail-prix__mention">{mentionPrix}</p>
    </>
  )
}
