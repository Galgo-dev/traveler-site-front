import { useFormulaire } from '../../hooks/useFormulaire'
import { validerDemandeReinitialisation } from '../../utils/validators'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'
import Input from '../ui/Input'
import './Formulaire.css'

const VALEURS_INITIALES = { email: '' }

function versEmail({ email }) {
  return email.trim()
}

/**
 * Demande d'un lien de réinitialisation du mot de passe, envoyé à l'adresse e-mail du compte.
 * @param {{ onEnregistrer: (email: string) => Promise<unknown>, onSucces: () => void }} props
 */
export default function MotDePasseOublieForm({ onEnregistrer, onSucces }) {
  const { valeurs, erreursChamps, envoi, erreur, modifierChamp, soumettre } = useFormulaire({
    valeursInitiales: VALEURS_INITIALES,
    valider: validerDemandeReinitialisation,
    versApi: versEmail,
    onEnregistrer,
    onSucces,
  })

  return (
    <form className="formulaire" onSubmit={soumettre} noValidate>
      {erreur && <ErrorMessage message={erreur.message} />}

      <Input
        label="Adresse e-mail de votre compte"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={valeurs.email}
        erreur={erreursChamps.email}
        onChange={modifierChamp}
      />

      <Button type="submit" disabled={envoi}>
        {envoi ? 'Envoi en cours…' : 'Recevoir le lien par e-mail'}
      </Button>
    </form>
  )
}
