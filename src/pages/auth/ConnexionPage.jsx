import { Link, useLocation, useNavigate } from 'react-router-dom'
import ConnexionForm from '../../components/forms/ConnexionForm'
import { ROUTES } from '../../utils/constants'

export default function ConnexionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from ?? ROUTES.ACCUEIL

  return (
    <main className="conteneur conteneur--etroit">
      <h1>Se connecter</h1>
      <ConnexionForm onSucces={() => navigate(destination, { replace: true })} />
      <p className="lien-alternatif">
        Pas encore de compte ? <Link to={ROUTES.INSCRIPTION}>Créer un compte</Link>
      </p>
    </main>
  )
}
