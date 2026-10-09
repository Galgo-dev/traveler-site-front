import { Link } from 'react-router-dom'
import { ETATS_AVIS, NOTE_MAX_SANS_COMMENTAIRE } from '../../utils/constants'
import { formaterDate } from '../../utils/formatters'
import EtatAvis from '../avis/EtatAvis'
import NoteEtoiles from '../avis/NoteEtoiles'
import './AvisGestionCard.css'

// R17 : le personnel voit toujours le vrai client ; R19 : plus de client si le compte a été supprimé.
function auteur({ client, anonyme }) {
  if (!client) return 'Client supprimé (avis anonymisé)'
  return `${client.prenom} ${client.nom}${anonyme ? ' — anonyme pour le public' : ''}`
}

/**
 * Un avis dans les listes du personnel, avec le lien vers sa modération.
 * Un avis négatif (P8 : 2 étoiles ou moins) est signalé.
 * @param {{ avis: object, lien: string }} props
 */
export default function AvisGestionCard({ avis, lien }) {
  const { note, titre, commentaire, etat, destination, createdAt } = avis
  const negatif = note <= NOTE_MAX_SANS_COMMENTAIRE

  return (
    <article className={`avis-gestion-card ${negatif ? 'avis-gestion-card--negatif' : ''}`.trim()}>
      <div className="avis-gestion-card__entete">
        <NoteEtoiles note={note} />
        <EtatAvis etat={etat} />
        {negatif && <span className="etiquette etiquette--desactive">Avis négatif</span>}
      </div>

      <h3 className="avis-gestion-card__titre">{titre}</h3>
      {commentaire && <p className="avis-gestion-card__extrait">{commentaire}</p>}

      <dl className="liste-infos">
        <div>
          <dt>Destination</dt>
          <dd>
            {destination?.nom}
            {destination?.pays && ` · ${destination.pays.nom}`}
          </dd>
        </div>
        <div>
          <dt>Client</dt>
          <dd>{auteur(avis)}</dd>
        </div>
        <div>
          <dt>Déposé le</dt>
          <dd>{formaterDate(createdAt)}</dd>
        </div>
      </dl>

      <Link to={lien} className="bouton bouton--secondaire avis-gestion-card__lien">
        {etat === ETATS_AVIS.EN_ATTENTE ? 'Modérer cet avis' : 'Voir le détail'}
      </Link>
    </article>
  )
}
