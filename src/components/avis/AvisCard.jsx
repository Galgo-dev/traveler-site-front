import { Link } from 'react-router-dom'
import { routeDestinationDetail } from '../../utils/constants'
import { formaterDate } from '../../utils/formatters'
import NoteEtoiles from './NoteEtoiles'
import './AvisCard.css'

/**
 * Un avis publié, tel que le voit le public (§7) : note, titre, commentaire, auteur (« Julie D. » ou
 * « Voyageur anonyme »), mois du séjour, date de publication et réponse de l'agence.
 * @param {{ avis: import('../../api/avis.api').AvisPublic & { destination?: { id: number, nom: string } },
 *   niveauTitre?: 3 | 4, avecDestination?: boolean }} props
 *   avecDestination : rappelle la destination (page d'accueil)
 */
export default function AvisCard({ avis, niveauTitre = 3, avecDestination = false }) {
  const { note, titre, commentaire, auteur, sejour, publieLe, reponse, destination } = avis
  const Titre = `h${niveauTitre}`

  return (
    <article className="avis-card">
      <NoteEtoiles note={note} />
      <Titre className="avis-card__titre">{titre}</Titre>
      {avecDestination && destination && (
        <p className="avis-card__destination">
          <Link to={routeDestinationDetail(destination.id)}>{destination.nom}</Link>
        </p>
      )}
      {commentaire && <p className="avis-card__commentaire">{commentaire}</p>}

      <p className="avis-card__auteur">
        <strong>{auteur}</strong>
        {/* P10 : mois et année de départ. */}
        {sejour && ` · séjour en ${sejour.libelle}`}
        {publieLe && ` · publié le ${formaterDate(publieLe)}`}
      </p>

      {reponse && (
        <div className="avis-card__reponse">
          <p className="avis-card__reponse-titre">
            Réponse de l'agence{reponse.agent && ` — ${reponse.agent}`}
          </p>
          <p className="avis-card__commentaire">{reponse.texte}</p>
        </div>
      )}
    </article>
  )
}
