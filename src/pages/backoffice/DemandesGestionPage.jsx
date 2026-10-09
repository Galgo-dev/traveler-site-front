import { Link, useSearchParams } from 'react-router-dom'
import FiltresDemandes from '../../components/backoffice/FiltresDemandes'
import DemandeCard from '../../components/demandes/DemandeCard'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import Pagination from '../../components/ui/Pagination'
import { useDemandes } from '../../hooks/useDemandes'
import { ROUTES, routeGestionDemande } from '../../utils/constants'
import { criteresRenseignes, lireCriteres } from '../../utils/criteres'

// Filtres saisis dans le formulaire ; clientId vient du dossier d'un client (« Voir ses demandes de voyage »).
const FILTRES = ['q', 'etat', 'paysId', 'destinationId', 'departDu', 'departAu']

function ListeDemandes({ demandes }) {
  if (demandes.length === 0) {
    return <p className="encadre">Aucune demande ne correspond à ces critères.</p>
  }

  return (
    <ul className="grille-cartes">
      {demandes.map((demande) => (
        <li key={demande.id}>
          <DemandeCard demande={demande} lien={routeGestionDemande(demande.id)} avecClient />
        </li>
      ))}
    </ul>
  )
}

/** Rappelle que la liste est limitée à un client, avec le moyen de voir toutes les demandes. */
function FiltreClient({ demandes }) {
  const client = demandes.find((demande) => demande.client)?.client
  return (
    <p className="encadre">
      Demandes {client ? `de ${client.prenom} ${client.nom}` : "d'un client"} uniquement.{' '}
      <Link to={ROUTES.GESTION_DEMANDES}>Voir toutes les demandes</Link>
    </p>
  )
}

export default function DemandesGestionPage() {
  const [parametresUrl, setParametresUrl] = useSearchParams()
  const filtres = lireCriteres(parametresUrl, FILTRES)
  const clientId = parametresUrl.get('clientId')
  const page = Number(parametresUrl.get('page')) || 1
  const { demandes, pagination, chargement, erreur } = useDemandes({
    ...criteresRenseignes(filtres),
    ...(clientId && { clientId }),
    page,
  })

  // Une nouvelle recherche repart de la première page ; le filtre client est conservé.
  function rechercher(nouveauxFiltres) {
    setParametresUrl({ ...criteresRenseignes(nouveauxFiltres), ...(clientId && { clientId }) })
  }

  function changerPage(nouvellePage) {
    setParametresUrl({ ...Object.fromEntries(parametresUrl), page: String(nouvellePage) })
  }

  return (
    <main>
      <h1>Demandes de voyage</h1>
      <p>De la plus récente à la plus ancienne commande. Ouvrez une demande pour la confirmer ou l'annuler.</p>

      {clientId && !chargement && <FiltreClient demandes={demandes} />}

      <FiltresDemandes key={parametresUrl.toString()} filtres={filtres} onRechercher={rechercher} />

      {chargement && <Loader message="Chargement des demandes…" />}
      {!chargement && erreur && <ErrorMessage message={erreur.message} />}
      {!chargement && !erreur && (
        <>
          <ListeDemandes demandes={demandes} />
          {pagination && <Pagination page={pagination.page} pages={pagination.pages} onChanger={changerPage} />}
        </>
      )}
    </main>
  )
}
