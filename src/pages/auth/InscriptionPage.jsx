import { Link, useLocation, useNavigate } from 'react-router-dom'
import InscriptionForm from '../../components/forms/InscriptionForm'
import { ROUTES } from '../../utils/constants'

export default function InscriptionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  // Page demandée avant de passer par la connexion (ex. formulaire de demande de voyage).
  const pageDemandee = location.state?.from

  return (
    <main className="conteneur conteneur--etroit">
      <h1>Créer un compte</h1>
      <p>Tous les champs sont obligatoires.</p>
      {/* L'inscription connecte directement le nouveau client. */}
      <InscriptionForm onSucces={() => navigate(pageDemandee ?? ROUTES.ACCUEIL, { replace: true })} />
      <p className="lien-alternatif">
        Déjà un compte ?{' '}
        <Link to={ROUTES.CONNEXION} state={{ from: pageDemandee }}>
          Se connecter
        </Link>
      </p>
    </main>
  )
}
