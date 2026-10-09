import { useState } from 'react'
import { Link } from 'react-router-dom'
import DemandeCard from '../../components/demandes/DemandeCard'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import Pagination from '../../components/ui/Pagination'
import { useDemandes } from '../../hooks/useDemandes'
import { ROUTES, routeMaDemande } from '../../utils/constants'

function ListeDemandes({ demandes }) {
  if (demandes.length === 0) {
    return (
      <div className="encadre">
        <p>Vous n'avez pas encore fait de demande de voyage.</p>
        <Link to={ROUTES.DESTINATIONS} className="bouton bouton--primaire">
          Découvrir nos destinations
        </Link>
      </div>
    )
  }

  return (
    <ul className="grille-cartes">
      {demandes.map((demande) => (
        <li key={demande.id}>
          <DemandeCard demande={demande} lien={routeMaDemande(demande.id)} />
        </li>
      ))}
    </ul>
  )
}

export default function MesDemandesPage() {
  const [page, setPage] = useState(1)
  const { demandes, pagination, chargement, erreur } = useDemandes({ page })

  return (
    <main className="conteneur">
      <h1>Mes demandes de voyage</h1>
      <p className="introduction">
        Vos demandes, de la plus récente à la plus ancienne. Un conseiller vous rappelle pour chaque nouvelle demande.
      </p>

      {chargement && <Loader message="Chargement de vos demandes…" />}
      {!chargement && erreur && <ErrorMessage message={erreur.message} />}
      {!chargement && !erreur && (
        <>
          <ListeDemandes demandes={demandes} />
          {pagination && <Pagination page={pagination.page} pages={pagination.pages} onChanger={setPage} />}
        </>
      )}
    </main>
  )
}
