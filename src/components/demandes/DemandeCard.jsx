import { Link } from 'react-router-dom'
import { formaterDate, formaterPrixEstime, formaterVoyageurs } from '../../utils/formatters'
import EtatDemande from './EtatDemande'
import './DemandeCard.css'

function nomClient(client) {
  return client ? `${client.prenom} ${client.nom}` : 'Client supprimé (demande anonymisée)'
}

/**
 * Résumé d'une demande de voyage dans une liste, avec le lien vers son détail.
 * @param {{ demande: object, lien: string, avecClient?: boolean, lienAvis?: string|null }} props
 *   avecClient : affiche le client (liste du personnel) ; lienAvis : voyage terminé à noter (V3)
 */
export default function DemandeCard({ demande, lien, avecClient = false, lienAvis = null }) {
  const { destination, dateDepart, dateRetour, nbAdultes, nbEnfants, prixEstime, dateCommande, etat } = demande

  return (
    <article className="demande-card">
      <div className="demande-card__entete">
        <h3 className="demande-card__titre">
          {destination?.nom}
          {destination?.pays && <span className="demande-card__pays"> · {destination.pays.nom}</span>}
        </h3>
        <EtatDemande etat={etat} />
      </div>

      <dl className="liste-infos">
        {avecClient && (
          <div>
            <dt>Client</dt>
            <dd>{nomClient(demande.client)}</dd>
          </div>
        )}
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
          <dt>Prix estimé</dt>
          <dd>{prixEstime === null ? 'À communiquer par le conseiller' : formaterPrixEstime(prixEstime)}</dd>
        </div>
        <div>
          <dt>Demande du</dt>
          <dd>{formaterDate(dateCommande)}</dd>
        </div>
      </dl>

      <div className="demande-card__liens">
        {lienAvis && (
          <Link to={lienAvis} className="bouton bouton--primaire">
            Donner mon avis
          </Link>
        )}
        <Link to={lien} className="bouton bouton--secondaire">
          Voir le détail
        </Link>
      </div>
    </article>
  )
}
