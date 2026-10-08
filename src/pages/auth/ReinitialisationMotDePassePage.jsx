import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import ReinitialisationMotDePasseForm from '../../components/forms/ReinitialisationMotDePasseForm'
import ErrorMessage from '../../components/ui/ErrorMessage'
import { useMotDePasseOublie } from '../../hooks/useMotDePasseOublie'
import { ROUTES } from '../../utils/constants'
import { estJetonReinitialisationValide } from '../../utils/validators'

const MESSAGE_REUSSITE = 'Votre mot de passe a été modifié. Vous pouvez maintenant vous connecter avec celui-ci.'

/** Page ouverte depuis le lien reçu par e-mail : /reinitialisation-mot-de-passe?token=… */
export default function ReinitialisationMotDePassePage() {
  const [parametres] = useSearchParams()
  const token = parametres.get('token')
  const navigate = useNavigate()
  const { reinitialiser } = useMotDePasseOublie()

  function terminer() {
    navigate(ROUTES.CONNEXION, { replace: true, state: { message: MESSAGE_REUSSITE } })
  }

  return (
    <main className="conteneur conteneur--etroit">
      <h1>Choisir un nouveau mot de passe</h1>

      {estJetonReinitialisationValide(token) ? (
        <ReinitialisationMotDePasseForm token={token} onEnregistrer={reinitialiser} onSucces={terminer} />
      ) : (
        <ErrorMessage message="Ce lien de réinitialisation est incomplet ou invalide. Vérifiez que vous avez copié tout le lien reçu par e-mail, ou demandez-en un nouveau." />
      )}

      <p className="lien-alternatif">
        Lien expiré ? <Link to={ROUTES.MOT_DE_PASSE_OUBLIE}>Demander un nouveau lien</Link>
      </p>
    </main>
  )
}
