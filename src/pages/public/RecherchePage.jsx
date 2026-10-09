import { useSearchParams } from 'react-router-dom'
import ActiviteSituee from '../../components/catalogue/ActiviteSituee'
import DestinationCard from '../../components/catalogue/DestinationCard'
import Filtres from '../../components/catalogue/Filtres'
import PaysCard from '../../components/catalogue/PaysCard'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import { useRecherche } from '../../hooks/useRecherche'
import { criteresRenseignes, lireCriteres, versCriteresApi } from '../../utils/criteres'

// L'API renvoie au plus 20 résultats de chaque type (pays, destinations, activités).
const RESULTATS_MAX_PAR_TYPE = 20

const SECTIONS = [
  {
    type: 'pays',
    titre: 'Pays',
    rendu: (pays) => <PaysCard pays={pays} />,
  },
  {
    type: 'destinations',
    titre: 'Destinations',
    rendu: (destination) => <DestinationCard destination={destination} niveauTitre={3} />,
  },
  {
    type: 'activites',
    titre: 'Activités',
    rendu: (activite) => <ActiviteSituee activite={activite} />,
  },
]

/** Explique pourquoi certains types de résultats n'apparaissent pas avec les critères choisis. */
function PorteeDesCriteres({ criteres }) {
  if (criteres.categorie) {
    return <p>La catégorie concerne les activités : seules des activités sont proposées.</p>
  }
  if (criteres.budgetMax !== undefined) {
    return <p>Le budget s'applique aux destinations (prix « à partir de ») et aux activités (prix par personne).</p>
  }
  return null
}

function Resultats({ resultats }) {
  const total = SECTIONS.reduce((somme, { type }) => somme + resultats[type].length, 0)

  if (total === 0) {
    return (
      <p role="status">
        Aucun résultat ne correspond à votre recherche. Essayez un autre mot-clé, une autre catégorie ou un budget
        plus élevé.
      </p>
    )
  }

  const resultatsTronques = SECTIONS.some(({ type }) => resultats[type].length >= RESULTATS_MAX_PAR_TYPE)

  return (
    <>
      <p role="status" className="introduction">
        {total} résultat{total > 1 ? 's' : ''}.
        {resultatsTronques && ' Seuls les premiers résultats sont affichés : précisez votre recherche pour affiner.'}
      </p>
      {SECTIONS.filter(({ type }) => resultats[type].length > 0).map(({ type, titre, rendu }) => (
        <section key={type} className="section-catalogue" aria-labelledby={`resultats-${type}`}>
          <h2 id={`resultats-${type}`}>
            {titre} ({resultats[type].length})
          </h2>
          <ul className="grille-cartes">
            {resultats[type].map((element) => (
              <li key={element.id}>{rendu(element)}</li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}

export default function RecherchePage() {
  const [parametresUrl, setParametresUrl] = useSearchParams()
  const criteres = lireCriteres(parametresUrl)
  const criteresApi = versCriteresApi(criteres)
  const { resultats, chargement, erreur } = useRecherche(criteresApi)

  return (
    <main className="conteneur">
      <h1>Rechercher</h1>
      <p className="introduction">
        Cherchez un pays, une destination ou une activité par mot-clé, et affinez par catégorie d'activité ou par
        budget.
      </p>

      {/* La clé réinitialise le formulaire quand l'adresse change (bouton « Précédent » du navigateur). */}
      <Filtres
        key={parametresUrl.toString()}
        criteres={criteres}
        onRechercher={(nouveauxCriteres) => setParametresUrl(criteresRenseignes(nouveauxCriteres))}
      />

      <PorteeDesCriteres criteres={criteresApi} />

      {chargement && <Loader message="Recherche en cours…" />}
      {!chargement && erreur && <ErrorMessage message={erreur.message} />}
      {!chargement && !erreur && !resultats && (
        <p>Saisissez un mot-clé, choisissez une catégorie ou un budget, puis cliquez sur « Rechercher ».</p>
      )}
      {!chargement && !erreur && resultats && <Resultats resultats={resultats} />}
    </main>
  )
}
