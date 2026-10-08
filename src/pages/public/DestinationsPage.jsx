import DestinationCard from '../../components/catalogue/DestinationCard'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import { useDestinations } from '../../hooks/useDestinations'
import './DestinationsPage.css'

function ListeDestinations({ destinations }) {
  if (destinations.length === 0) {
    return <p>Aucune destination n'est disponible pour le moment.</p>
  }

  return (
    <ul className="destinations-grille">
      {destinations.map((destination) => (
        <li key={destination.id}>
          <DestinationCard destination={destination} />
        </li>
      ))}
    </ul>
  )
}

export default function DestinationsPage() {
  const { destinations, chargement, erreur } = useDestinations()

  return (
    <main className="conteneur">
      <h1>Nos destinations</h1>
      <p className="destinations-intro">
        Découvrez les villes et régions où nous vous emmenons, avec la meilleure période pour partir.
      </p>

      {chargement && <Loader message="Chargement des destinations…" />}
      {!chargement && erreur && <ErrorMessage message={erreur.message} />}
      {!chargement && !erreur && <ListeDestinations destinations={destinations} />}
    </main>
  )
}
