import { Link, useSearchParams } from 'react-router-dom'
import AvisGestionCard from '../../components/backoffice/AvisGestionCard'
import FiltresAvis from '../../components/backoffice/FiltresAvis'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import Pagination from '../../components/ui/Pagination'
import { useAvisGestion, useCompteurAvis, useFileModeration } from '../../hooks/useAvis'
import { ROUTES, routeGestionAvis } from '../../utils/constants'
import { criteresRenseignes, lireCriteres } from '../../utils/criteres'
import './AvisGestionPage.css'

const VUE_TOUS = 'tous'
const FILTRES = ['etat', 'paysId', 'destinationId', 'note', 'du', 'au']

function ListeAvis({ avis, messageVide }) {
  if (avis.length === 0) return <p className="encadre">{messageVide}</p>

  return (
    <ul className="grille-cartes">
      {avis.map((unAvis) => (
        <li key={unAvis.id}>
          <AvisGestionCard avis={unAvis} lien={routeGestionAvis(unAvis.id)} />
        </li>
      ))}
    </ul>
  )
}

function ResultatListe({ avis, pagination, chargement, erreur, messageVide, onChangerPage }) {
  if (chargement) return <Loader message="Chargement des avis…" />
  if (erreur) return <ErrorMessage message={erreur.message} />

  return (
    <>
      <ListeAvis avis={avis} messageVide={messageVide} />
      {pagination && <Pagination page={pagination.page} pages={pagination.pages} onChanger={onChangerPage} />}
    </>
  )
}

/** File de modération : les avis en attente, les plus anciens d'abord (§7). */
function FileModeration({ page, onChangerPage }) {
  const liste = useFileModeration({ page })

  return (
    <>
      <p>Les avis les plus anciens d'abord. Ouvrez un avis pour le publier ou le refuser.</p>
      <ResultatListe {...liste} messageVide="Aucun avis à modérer pour le moment." onChangerPage={onChangerPage} />
    </>
  )
}

/** Tous les avis, filtrables ; les avis négatifs sont affichés en premier (§7, P8). */
function TousLesAvis({ parametresUrl, page, onRechercher, onChangerPage }) {
  const filtres = lireCriteres(parametresUrl, FILTRES)
  const liste = useAvisGestion({ ...criteresRenseignes(filtres), page })

  return (
    <>
      <p>Les avis négatifs (2 étoiles ou moins) d'abord, puis les plus récents.</p>
      <FiltresAvis key={parametresUrl.toString()} filtres={filtres} onRechercher={onRechercher} />
      <ResultatListe {...liste} messageVide="Aucun avis ne correspond à ces critères." onChangerPage={onChangerPage} />
    </>
  )
}

export default function AvisGestionPage() {
  const [parametresUrl, setParametresUrl] = useSearchParams()
  const vueTous = parametresUrl.get('vue') === VUE_TOUS
  const page = Number(parametresUrl.get('page')) || 1
  const { aModerer } = useCompteurAvis()

  function changerPage(nouvellePage) {
    setParametresUrl({ ...Object.fromEntries(parametresUrl), page: String(nouvellePage) })
  }

  // Une nouvelle recherche repart de la première page.
  function rechercher(filtres) {
    setParametresUrl({ vue: VUE_TOUS, ...criteresRenseignes(filtres) })
  }

  return (
    <main>
      <h1>Avis clients</h1>

      <nav className="onglets" aria-label="Listes d'avis">
        <Link
          to={ROUTES.GESTION_AVIS}
          className="onglets__lien"
          aria-current={vueTous ? undefined : 'page'}
        >
          À modérer ({aModerer})
        </Link>
        <Link
          to={`${ROUTES.GESTION_AVIS}?vue=${VUE_TOUS}`}
          className="onglets__lien"
          aria-current={vueTous ? 'page' : undefined}
        >
          Tous les avis
        </Link>
      </nav>

      {vueTous ? (
        <TousLesAvis
          parametresUrl={parametresUrl}
          page={page}
          onRechercher={rechercher}
          onChangerPage={changerPage}
        />
      ) : (
        <FileModeration page={page} onChangerPage={changerPage} />
      )}
    </main>
  )
}
