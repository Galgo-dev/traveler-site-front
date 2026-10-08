import { Link, useNavigate } from 'react-router-dom'
import InscriptionForm from '../../components/forms/InscriptionForm'
import { ROUTES } from '../../utils/constants'

export default function InscriptionPage() {
  const navigate = useNavigate()

  return (
    <main className="conteneur conteneur--etroit">
      <h1>Créer un compte</h1>
      <p>Tous les champs sont obligatoires.</p>
      <InscriptionForm onSucces={() => navigate(ROUTES.ACCUEIL, { replace: true })} />
      <p className="lien-alternatif">
        Déjà un compte ? <Link to={ROUTES.CONNEXION}>Se connecter</Link>
      </p>
    </main>
  )
}
