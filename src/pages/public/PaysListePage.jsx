import PaysCard from '../../components/catalogue/PaysCard'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import { useListePays } from '../../hooks/usePays'
import { CONTINENTS } from '../../utils/constants'

/** Pays regroupés par continent, dans l'ordre habituel des continents ; les continents vides sont omis. */
function PaysParContinent({ pays }) {
  if (pays.length === 0) {
    return <p>Aucun pays n'est disponible pour le moment.</p>
  }

  return CONTINENTS.map((continent) => {
    const paysDuContinent = pays.filter((unPays) => unPays.continent === continent)
    if (paysDuContinent.length === 0) return null

    return (
      <section key={continent} className="section-catalogue" aria-label={continent}>
        <h2>{continent}</h2>
        <ul className="grille-cartes">
          {paysDuContinent.map((unPays) => (
            <li key={unPays.id}>
              <PaysCard pays={unPays} />
            </li>
          ))}
        </ul>
      </section>
    )
  })
}

export default function PaysListePage() {
  const { pays, chargement, erreur } = useListePays()

  return (
    <main className="conteneur">
      <h1>Nos pays</h1>
      <p className="introduction">
        Choisissez un pays pour découvrir ses destinations, ses activités et les formalités pour s'y rendre.
      </p>

      {chargement && <Loader message="Chargement des pays…" />}
      {!chargement && erreur && <ErrorMessage message={erreur.message} />}
      {!chargement && !erreur && <PaysParContinent pays={pays} />}
    </main>
  )
}
