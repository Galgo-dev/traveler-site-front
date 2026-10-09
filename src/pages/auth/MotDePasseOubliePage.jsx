import { useState } from 'react'
import { Link } from 'react-router-dom'
import MotDePasseOublieForm from '../../components/forms/MotDePasseOublieForm'
import SuccessMessage from '../../components/ui/SuccessMessage'
import { useMotDePasseOublie } from '../../hooks/useMotDePasseOublie'
import { ROUTES } from '../../utils/constants'

// Même message que l'adresse existe ou non : on ne révèle pas quels e-mails ont un compte.
const MESSAGE_ENVOI =
  "Si un compte client existe pour cette adresse, un e-mail contenant un lien pour choisir un nouveau mot de passe vient d'y être envoyé. Ce lien n'est valable que pendant une durée limitée. Pensez à vérifier vos courriers indésirables."

export default function MotDePasseOubliePage() {
  const { demanderLien } = useMotDePasseOublie()
  const [envoye, setEnvoye] = useState(false)

  return (
    <main className="conteneur conteneur--etroit">
      <h1>Mot de passe oublié</h1>

      {envoye ? (
        <SuccessMessage message={MESSAGE_ENVOI} />
      ) : (
        <>
          <p>Indiquez l'adresse e-mail de votre compte : nous vous enverrons un lien pour choisir un nouveau mot de passe.</p>
          <MotDePasseOublieForm onEnregistrer={demanderLien} onSucces={() => setEnvoye(true)} />
          <p className="lien-alternatif">
            Vous faites partie du personnel de l'agence ? Demandez un nouveau mot de passe à l'administrateur.
          </p>
        </>
      )}

      <p className="lien-alternatif">
        <Link to={ROUTES.CONNEXION}>← Retour à la connexion</Link>
      </p>
    </main>
  )
}
