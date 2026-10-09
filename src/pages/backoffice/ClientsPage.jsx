import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import ClientCard from '../../components/backoffice/ClientCard'
import DemandesSuppression from '../../components/backoffice/DemandesSuppression'
import FiltresGestion from '../../components/backoffice/FiltresGestion'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import Pagination from '../../components/ui/Pagination'
import SuccessMessage from '../../components/ui/SuccessMessage'
import { useClients } from '../../hooks/useClients'

const FILTRES_VIDES = { q: '' }

function ListeClients({ clients }) {
  if (clients.length === 0) {
    return <p>Aucun client ne correspond à votre recherche.</p>
  }

  return (
    <ul className="grille-cartes">
      {clients.map((client) => (
        <li key={client.id}>
          <ClientCard client={client} />
        </li>
      ))}
    </ul>
  )
}

export default function ClientsPage() {
  // Message transmis par le dossier d'un client après son effacement.
  const succes = useLocation().state?.succes
  const [filtres, setFiltres] = useState(FILTRES_VIDES)
  const [page, setPage] = useState(1)
  const { clients, pagination, chargement, erreur } = useClients({ page, ...(filtres.q && { q: filtres.q }) })

  function rechercher(nouveauxFiltres) {
    setFiltres(nouveauxFiltres)
    setPage(1)
  }

  return (
    <main>
      <h1>Clients</h1>
      <p>Retrouvez un client pour consulter son dossier, corriger ses informations ou effacer son compte à sa demande.</p>

      {succes && <SuccessMessage message={succes} />}

      <DemandesSuppression />

      <FiltresGestion
        libelleRecherche="Rechercher (nom, prénom ou e-mail)"
        filtres={filtres}
        onRechercher={rechercher}
      />

      {chargement && <Loader message="Chargement des clients…" />}
      {!chargement && erreur && <ErrorMessage message={erreur.message} />}
      {!chargement && !erreur && (
        <>
          <ListeClients clients={clients} />
          {pagination && <Pagination page={pagination.page} pages={pagination.pages} onChanger={setPage} />}
        </>
      )}
    </main>
  )
}
