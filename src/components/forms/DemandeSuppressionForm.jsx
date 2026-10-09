import { useFormulaire } from '../../hooks/useFormulaire'
import { validerDemandeSuppression } from '../../utils/validators'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'
import Input from '../ui/Input'
import './Formulaire.css'

const VALEURS_INITIALES = { motDePasse: '' }

/**
 * Confirmation, par le mot de passe, de la demande de suppression de son compte.
 * @param {{ onEnregistrer: (motDePasse: string) => Promise<unknown>, onSucces: () => void }} props
 */
export default function DemandeSuppressionForm({ onEnregistrer, onSucces }) {
  const { valeurs, erreursChamps, envoi, erreur, modifierChamp, soumettre } = useFormulaire({
    valeursInitiales: VALEURS_INITIALES,
    valider: validerDemandeSuppression,
    versApi: ({ motDePasse }) => motDePasse,
    onEnregistrer,
    onSucces,
  })

  return (
    <form className="formulaire" onSubmit={soumettre} noValidate>
      {erreur && <ErrorMessage message={erreur.message} />}

      <Input
        label="Votre mot de passe"
        aide="Pour confirmer que la demande vient bien de vous."
        type="password"
        name="motDePasse"
        autoComplete="current-password"
        required
        value={valeurs.motDePasse}
        erreur={erreursChamps.motDePasse}
        onChange={modifierChamp}
      />

      <Button type="submit" variante="danger" disabled={envoi}>
        {envoi ? 'Envoi en cours…' : 'Envoyer ma demande de suppression'}
      </Button>
    </form>
  )
}
