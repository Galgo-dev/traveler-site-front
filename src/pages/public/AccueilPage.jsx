import { Link } from 'react-router-dom'
import AvisCard from '../../components/avis/AvisCard'
import DestinationCard from '../../components/catalogue/DestinationCard'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import { useDerniersAvis } from '../../hooks/useAvis'
import { useDestinations } from '../../hooks/useDestinations'
import { ROUTES } from '../../utils/constants'
import './AccueilPage.css'

const NOMBRE_DESTINATIONS_A_LA_UNE = 3

const ATOUTS = [
  {
    titre: 'Depuis 1987',
    texte: "Une agence familiale qui organise vos voyages avec soin depuis plus de trente-cinq ans.",
  },
  {
    titre: 'Des conseillers à votre écoute',
    texte: 'Nos conseillers prennent le temps de comprendre vos envies et de répondre à vos questions.',
  },
  {
    titre: 'Un catalogue clair',
    texte: 'Pays, destinations et activités présentés simplement, avec les prix et la meilleure période pour partir.',
  },
]

function Bandeau() {
  return (
    <section className="accueil__bandeau">
      <div className="conteneur">
        <h1 className="accueil__titre">Voyagez l'esprit tranquille</h1>
        <p className="accueil__accroche">
          Agence de voyage familiale depuis 1987, nous vous aidons à choisir votre prochaine
          destination et les activités qui vous ressemblent.
        </p>
        <Link className="accueil__bouton" to={ROUTES.DESTINATIONS}>
          Découvrir nos destinations
        </Link>
      </div>
    </section>
  )
}

function ListeDestinations({ destinations }) {
  if (destinations.length === 0) {
    return <p>Aucune destination n'est disponible pour le moment.</p>
  }

  return (
    <ul className="grille-cartes">
      {destinations.map((destination) => (
        <li key={destination.id}>
          <DestinationCard destination={destination} niveauTitre={3} />
        </li>
      ))}
    </ul>
  )
}

function DestinationsALaUne() {
  const { destinations, chargement, erreur } = useDestinations({
    limite: NOMBRE_DESTINATIONS_A_LA_UNE,
  })

  return (
    <section className="accueil__section" aria-labelledby="titre-destinations-une">
      <h2 id="titre-destinations-une">Destinations à la une</h2>

      {chargement && <Loader message="Chargement des destinations…" />}
      {!chargement && erreur && <ErrorMessage message={erreur.message} />}
      {!chargement && !erreur && <ListeDestinations destinations={destinations} />}

      <Link className="accueil__lien-suite" to={ROUTES.DESTINATIONS}>
        Voir toutes nos destinations →
      </Link>
    </section>
  )
}

/** Les 5 derniers avis publiés à 5 étoiles (V3, souhaitable) ; rien tant qu'il n'y en a pas. */
function DerniersAvis() {
  const { avis } = useDerniersAvis()
  if (avis.length === 0) return null

  return (
    <section className="accueil__section" aria-labelledby="titre-derniers-avis">
      <h2 id="titre-derniers-avis">Ils ont voyagé avec nous</h2>
      <ul className="grille-cartes">
        {avis.map((unAvis) => (
          <li key={unAvis.id}>
            <AvisCard avis={unAvis} avecDestination />
          </li>
        ))}
      </ul>
    </section>
  )
}

function ListeAtouts() {
  return (
    <section className="accueil__section" aria-labelledby="titre-atouts">
      <h2 id="titre-atouts">Pourquoi voyager avec nous</h2>
      <ul className="grille-cartes">
        {ATOUTS.map(({ titre, texte }) => (
          <li key={titre} className="accueil__atout">
            <h3>{titre}</h3>
            <p>{texte}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function AccueilPage() {
  return (
    <main>
      <Bandeau />
      <div className="conteneur">
        <DestinationsALaUne />
        <DerniersAvis />
        <ListeAtouts />
      </div>
    </main>
  )
}
