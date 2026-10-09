import { Link, useParams, useSearchParams } from 'react-router-dom'
import ActiviteSituee from '../../components/catalogue/ActiviteSituee'
import DestinationCard from '../../components/catalogue/DestinationCard'
import Filtres from '../../components/catalogue/Filtres'
import InfosPratiques from '../../components/catalogue/InfosPratiques'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import { useActivitesDuPays, useDestinationsDuPays, usePaysDetail } from '../../hooks/usePays'
import { ROUTES } from '../../utils/constants'
import { criteresRenseignes, lireCriteres, versCriteresApi } from '../../utils/criteres'
import './PaysDetailPage.css'

const STATUTS_INTROUVABLE = [400, 404]
// Sur la page d'un pays, seules les activités se filtrent (par catégorie et budget).
const FILTRES_ACTIVITES = ['categorie', 'budgetMax']

function messageErreur(erreur) {
  return STATUTS_INTROUVABLE.includes(erreur.status)
    ? "Ce pays n'existe pas ou n'est plus proposé."
    : erreur.message
}

function SectionDestinations({ paysId }) {
  const { destinations, chargement, erreur } = useDestinationsDuPays(paysId)

  return (
    <section className="section-catalogue" aria-labelledby="titre-destinations">
      <h2 id="titre-destinations">Destinations ({destinations.length})</h2>
      {chargement && <Loader message="Chargement des destinations…" />}
      {!chargement && erreur && <ErrorMessage message={erreur.message} />}
      {!chargement && !erreur && destinations.length === 0 && (
        <p>Aucune destination n'est encore proposée dans ce pays.</p>
      )}
      {!chargement && !erreur && destinations.length > 0 && (
        <ul className="grille-cartes">
          {destinations.map((destination) => (
            <li key={destination.id}>
              <DestinationCard destination={destination} niveauTitre={3} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function SectionActivites({ paysId }) {
  const [parametresUrl, setParametresUrl] = useSearchParams()
  const criteres = lireCriteres(parametresUrl, FILTRES_ACTIVITES)
  const filtresActifs = Object.keys(criteresRenseignes(criteres)).length > 0
  const { activites, chargement, erreur } = useActivitesDuPays(paysId, versCriteresApi(criteres))

  function filtrer(nouveauxCriteres) {
    setParametresUrl(criteresRenseignes(nouveauxCriteres), { replace: true })
  }

  return (
    <section className="section-catalogue" aria-labelledby="titre-activites">
      <h2 id="titre-activites">Activités ({activites.length})</h2>
      <Filtres
        key={parametresUrl.toString()}
        criteres={criteres}
        champs={FILTRES_ACTIVITES}
        libelleEnvoi="Filtrer les activités"
        onRechercher={filtrer}
      />
      {chargement && <Loader message="Chargement des activités…" />}
      {!chargement && erreur && <ErrorMessage message={erreur.message} />}
      {!chargement && !erreur && activites.length === 0 && (
        <p>
          {filtresActifs
            ? 'Aucune activité ne correspond à ces filtres. Essayez une autre catégorie ou un budget plus élevé.'
            : "Aucune activité n'est encore proposée dans ce pays."}
        </p>
      )}
      {!chargement && !erreur && activites.length > 0 && (
        <ul className="grille-cartes">
          {activites.map((activite) => (
            <li key={activite.id}>
              <ActiviteSituee activite={activite} avecPays={false} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function FichePays({ pays }) {
  return (
    <>
      <header className="pays-detail__entete">
        <p className="pays-detail__continent">{pays.continent}</p>
        <h1>{pays.nom}</h1>
        {pays.descriptionCourte && <p className="pays-detail__description">{pays.descriptionCourte}</p>}
      </header>

      <section className="section-catalogue" aria-labelledby="titre-infos-pratiques">
        <h2 id="titre-infos-pratiques">Formalités et infos pratiques</h2>
        <InfosPratiques pays={pays} />
      </section>

      <SectionDestinations paysId={pays.id} />
      <SectionActivites paysId={pays.id} />
    </>
  )
}

export default function PaysDetailPage() {
  const { id } = useParams()
  const { pays, chargement, erreur } = usePaysDetail(id)

  return (
    <main className="conteneur">
      <Link className="lien-retour" to={ROUTES.PAYS}>
        ← Tous les pays
      </Link>

      {chargement && <Loader message="Chargement du pays…" />}
      {!chargement && erreur && <ErrorMessage message={messageErreur(erreur)} />}
      {!chargement && pays && <FichePays pays={pays} />}
    </main>
  )
}
