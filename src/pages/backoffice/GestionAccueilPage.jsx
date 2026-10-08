import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LIBELLES_ROLE, ROUTES } from '../../utils/constants'

export default function GestionAccueilPage() {
  const { utilisateur, role, estAdministrateur } = useAuth()

  return (
    <main>
      <h1>Espace agence</h1>
      <p>
        Bienvenue {utilisateur.prenom}. Vous êtes connecté en tant que{' '}
        <strong>{LIBELLES_ROLE[role].toLowerCase()}</strong>.
      </p>
      {estAdministrateur ? (
        <Link to={ROUTES.GESTION_AGENTS} className="bouton bouton--primaire">
          Gérer les comptes du personnel
        </Link>
      ) : (
        <p>La gestion du catalogue et des clients sera bientôt disponible ici.</p>
      )}
    </main>
  )
}
