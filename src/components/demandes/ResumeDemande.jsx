import { Link } from 'react-router-dom'
import { LIBELLES_CATEGORIE, routeDestinationDetail } from '../../utils/constants'
import { formaterDate, formaterDateHeure, formaterPrixEstime, formaterVoyageurs } from '../../utils/formatters'
import DetailPrix from './DetailPrix'
import EtatDemande from './EtatDemande'
import './ResumeDemande.css'

function Activites({ activites }) {
  if (activites.length === 0) return <p>Aucune activité choisie.</p>

  return (
    <ul className="resume-demande__activites">
      {activites.map((activite) => (
        <li key={activite.id}>
          <strong>{activite.nom}</strong>
          {activite.categorie && ` — ${LIBELLES_CATEGORIE[activite.categorie] ?? activite.categorie}`}
          {` — ${formaterPrixEstime(activite.prixParPersonne)} par personne`}
          {/* R10 : l'âge minimum est affiché, pas vérifié. */}
          {activite.ageMinimum != null && ` — à partir de ${activite.ageMinimum} ans`}
          {/* R9 : une activité masquée depuis reste dans la demande. */}
          {activite.actif === false && <span className="resume-demande__retiree"> (n'est plus proposée)</span>}
        </li>
      ))}
    </ul>
  )
}

/**
 * Détail d'une demande de voyage, commun au client et au personnel : voyage, activités, remarques et prix
 * estimé tels qu'ils ont été figés à la commande.
 * @param {{ demande: object }} props
 */
export default function ResumeDemande({ demande }) {
  const { destination, dateDepart, dateRetour, nbAdultes, nbEnfants, activites = [], remarques, etat } = demande

  return (
    <div className="resume-demande">
      <section className="resume-demande__bloc" aria-labelledby="titre-voyage">
        <div className="resume-demande__entete">
          <h2 id="titre-voyage">Le voyage</h2>
          <EtatDemande etat={etat} />
        </div>
        <dl className="liste-infos">
          <div>
            <dt>Destination</dt>
            <dd>
              {destination ? (
                <Link to={routeDestinationDetail(destination.id)}>{destination.nom}</Link>
              ) : (
                '—'
              )}
              {destination?.pays && ` · ${destination.pays.nom}`}
            </dd>
          </div>
          <div>
            <dt>Dates</dt>
            <dd>
              Du {formaterDate(dateDepart)} au {formaterDate(dateRetour)}
            </dd>
          </div>
          <div>
            <dt>Voyageurs</dt>
            <dd>{formaterVoyageurs(nbAdultes, nbEnfants)}</dd>
          </div>
          <div>
            <dt>Demande envoyée le</dt>
            <dd>{formaterDateHeure(demande.dateCommande)}</dd>
          </div>
        </dl>
      </section>

      <section className="resume-demande__bloc" aria-labelledby="titre-activites-demande">
        <h2 id="titre-activites-demande">Activités</h2>
        <Activites activites={activites} />
      </section>

      <section className="resume-demande__bloc" aria-labelledby="titre-remarques">
        <h2 id="titre-remarques">Remarques</h2>
        <p className="resume-demande__remarques">{remarques || 'Aucune remarque.'}</p>
      </section>

      <section className="resume-demande__bloc" aria-labelledby="titre-prix">
        <h2 id="titre-prix">Prix estimé à la commande</h2>
        <DetailPrix {...demande} activites={activites} />
      </section>
    </div>
  )
}
