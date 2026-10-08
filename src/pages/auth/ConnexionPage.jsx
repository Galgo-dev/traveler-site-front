import { useLocation, useNavigate } from 'react-router-dom'
import ConnexionForm from '../../components/forms/ConnexionForm'
import { ROUTES } from '../../utils/constants'
import './ConnexionPage.css'

export default function ConnexionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from ?? ROUTES.ACCUEIL

  return (
    <main className="conteneur connexion-page">
      <h1>Se connecter</h1>
      <ConnexionForm onSucces={() => navigate(destination, { replace: true })} />
    </main>
  )
}
