import { Link } from 'react-router-dom'
import ActiviteCard from '../../components/catalogue/ActiviteCard'
import DestinationCard from '../../components/catalogue/DestinationCard'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import { useFavoris } from '../../hooks/useFavoris'
import { ROUTES, routeDestinationDetail } from '../../utils/constants'
import './FavorisPage.css'

/** Situe une activité : « Pérou · Lima », avec un lien vers sa destination quand elle en a une. */
function LieuActivite({ activite }) {
  const { pays, destination } = activite

  return (
    <p className="favoris__lieu">
      {pays?.nom}
      {destination && (
        <>
          {' · '}
          <Link to={routeDestinationDetail(destination.id)}>{destination.nom}</Link>
        </>
      )}
    </p>
  )
}

function SectionFavoris({ titre, elements, messageVide, children }) {
  return (
    <section className="favoris__section">
      <h2>
        {titre} ({elements.length})
      </h2>
      {elements.length === 0 ? <p>{messageVide}</p> : <ul className="grille-cartes">{children}</ul>}
    </section>
  )
}

function ListesFavoris({ favoris }) {
  const { destinations, activites } = favoris

  if (destinations.length === 0 && activites.length === 0) {
    return (
      <div className="favoris__vide">
        <p>
          Vous n'avez pas encore de favoris. Sur une destination ou une activité qui vous plaît, cliquez sur
          « Ajouter à mes favoris » pour la retrouver ici.
        </p>
        <Link to={ROUTES.DESTINATIONS} className="bouton bouton--primaire">
          Découvrir nos destinations
        </Link>
      </div>
    )
  }

  return (
    <>
      <SectionFavoris
        titre="Mes destinations"
        elements={destinations}
        messageVide="Aucune destination dans vos favoris."
      >
        {destinations.map((destination) => (
          <li key={destination.id}>
            <DestinationCard destination={destination} niveauTitre={3} />
          </li>
        ))}
      </SectionFavoris>

      <SectionFavoris titre="Mes activités" elements={activites} messageVide="Aucune activité dans vos favoris.">
        {activites.map((activite) => (
          <li key={activite.id} className="favoris__activite">
            <LieuActivite activite={activite} />
            <ActiviteCard activite={activite} />
          </li>
        ))}
      </SectionFavoris>
    </>
  )
}

export default function FavorisPage() {
  const { favoris, chargement, erreur } = useFavoris()

  return (
    <main className="conteneur">
      <h1>Mes favoris</h1>
      <p>Les destinations et activités que vous avez mises de côté.</p>

      {chargement && <Loader message="Chargement de vos favoris…" />}
      {!chargement && erreur && <ErrorMessage message={erreur.message} />}
      {!chargement && !erreur && <ListesFavoris favoris={favoris} />}
    </main>
  )
}
