import { Link, useLocation, useNavigate } from 'react-router-dom'
import ConnexionForm from '../../components/forms/ConnexionForm'
import ErrorMessage from '../../components/ui/ErrorMessage'
import { useAuth } from '../../hooks/useAuth'
import { ROLES_PERSONNEL, ROUTES } from '../../utils/constants'

function pageParDefaut(utilisateur) {
  return ROLES_PERSONNEL.includes(utilisateur.role) ? ROUTES.GESTION : ROUTES.ACCUEIL
}

export default function ConnexionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { sessionExpiree } = useAuth()

  function redirigerApresConnexion(utilisateur) {
    const destination = location.state?.from ?? pageParDefaut(utilisateur)
    navigate(destination, { replace: true })
  }

  return (
    <main className="conteneur conteneur--etroit">
      <h1>Se connecter</h1>
      {sessionExpiree && (
        <ErrorMessage message="Votre session a expiré. Pour votre sécurité, veuillez vous reconnecter." />
      )}
      <ConnexionForm onSucces={redirigerApresConnexion} />
      <p className="lien-alternatif">
        Pas encore de compte ? <Link to={ROUTES.INSCRIPTION}>Créer un compte</Link>
      </p>
    </main>
  )
}
