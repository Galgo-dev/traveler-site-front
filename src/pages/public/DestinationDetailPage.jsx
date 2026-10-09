import { Link, useParams } from 'react-router-dom'
import ActiviteCard from '../../components/catalogue/ActiviteCard'
import BoutonDemande from '../../components/catalogue/BoutonDemande'
import BoutonFavori from '../../components/catalogue/BoutonFavori'
import DestinationPhoto from '../../components/catalogue/DestinationPhoto'
import InfosPratiques from '../../components/catalogue/InfosPratiques'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import { useDestination } from '../../hooks/useDestination'
import { usePaysDetail } from '../../hooks/usePays'
import { ROUTES, routePaysDetail } from '../../utils/constants'
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

function SectionInfosPratiques({ paysId }) {
  const { pays, chargement, erreur } = usePaysDetail(paysId)

  return (
    <section className="destination-detail__section" aria-labelledby="titre-infos-pratiques">
      <h2 id="titre-infos-pratiques">Formalités et infos pratiques</h2>
      {chargement && <Loader message="Chargement des informations pratiques…" />}
      {!chargement && erreur && (
        <ErrorMessage message="Les informations pratiques sont momentanément indisponibles." />
      )}
      {!chargement && pays && <InfosPratiques pays={pays} />}
    </section>
  )
}

function FicheDestination({ destination }) {
  const { id, nom, description, periodeIdeale, prixAPartirDe, photoUrl, pays, paysId, activites = [] } =
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
              <Link to={routePaysDetail(pays.id)}>{pays.nom}</Link>
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

          <div className="destination-detail__actions">
            <BoutonDemande destinationId={id} />
            <BoutonFavori type="destinations" id={id} nom={nom} />
          </div>
        </div>
      </section>

      <SectionInfosPratiques paysId={paysId} />

      <section className="destination-detail__section" aria-labelledby="titre-activites">
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
      <Link className="lien-retour" to={ROUTES.DESTINATIONS}>
        ← Retour aux destinations
      </Link>

      {chargement && <Loader message="Chargement de la destination…" />}
      {!chargement && erreur && <ErrorMessage message={messageErreur(erreur)} />}
      {!chargement && destination && <FicheDestination destination={destination} />}
    </main>
  )
}
