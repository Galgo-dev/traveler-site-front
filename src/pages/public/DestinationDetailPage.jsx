import { Link, useParams } from 'react-router-dom'
import ActiviteCard from '../../components/catalogue/ActiviteCard'
import DestinationPhoto from '../../components/catalogue/DestinationPhoto'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import { useDestination } from '../../hooks/useDestination'
import { ROUTES } from '../../utils/constants'
import { formaterPrix } from '../../utils/formatters'
import './DestinationDetailPage.css'

const STATUTS_INTROUVABLE = [400, 404]

function messageErreur(erreur) {
  return STATUTS_INTROUVABLE.includes(erreur.status)
    ? "Cette destination n'existe pas ou n'est plus proposée."
    : erreur.message
}

function ListeActivites({ activites }) {
  if (activites.length === 0) {
    return <p>Aucune activité n'est encore proposée pour cette destination.</p>
  }

  return (
    <ul className="grille-cartes">
      {activites.map((activite) => (
        <li key={activite.id}>
          <ActiviteCard activite={activite} />
        </li>
      ))}
    </ul>
  )
}

function FicheDestination({ destination }) {
  const { nom, description, periodeIdeale, prixAPartirDe, photoUrl, pays, activites = [] } =
    destination
  // Sécurité d'affichage : un élément masqué ne doit jamais être visible côté client.
  const activitesVisibles = activites.filter((activite) => activite.actif !== false)

  return (
    <>
      <section className="destination-detail__entete">
        <DestinationPhoto nom={nom} photoUrl={photoUrl} className="destination-detail__photo" />

        <div>
          {pays && (
            <p className="destination-detail__pays">
              {pays.nom}
              {pays.continent && ` · ${pays.continent}`}
            </p>
          )}
          <h1>{nom}</h1>
          {description && <p className="destination-detail__description">{description}</p>}

          <dl className="liste-infos destination-detail__infos">
            {periodeIdeale && (
              <div>
                <dt>Période idéale</dt>
                <dd>{periodeIdeale}</dd>
              </div>
            )}
            {prixAPartirDe != null && (
              <div>
                <dt>Prix indicatif</dt>
                <dd className="destination-detail__prix">À partir de {formaterPrix(prixAPartirDe)}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <section aria-labelledby="titre-activites">
        <h2 id="titre-activites">Activités sur place ({activitesVisibles.length})</h2>
        <ListeActivites activites={activitesVisibles} />
      </section>
    </>
  )
}

export default function DestinationDetailPage() {
  const { id } = useParams()
  const { destination, chargement, erreur } = useDestination(id)

  return (
    <main className="conteneur">
      <Link className="destination-detail__retour" to={ROUTES.DESTINATIONS}>
        ← Retour aux destinations
      </Link>

      {chargement && <Loader message="Chargement de la destination…" />}
      {!chargement && erreur && <ErrorMessage message={messageErreur(erreur)} />}
      {!chargement && destination && <FicheDestination destination={destination} />}
    </main>
  )
}
