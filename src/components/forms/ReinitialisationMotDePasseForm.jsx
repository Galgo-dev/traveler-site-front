import { useFormulaire } from '../../hooks/useFormulaire'
import { REGLE_MOT_DE_PASSE, validerNouveauMotDePasse } from '../../utils/validators'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'
import Input from '../ui/Input'
import './Formulaire.css'

const VALEURS_INITIALES = { motDePasse: '', confirmation: '' }

/**
 * Choix d'un nouveau mot de passe à partir du lien de réinitialisation.
 * @param {{ token: string, onEnregistrer: (reinitialisation: { token: string, motDePasse: string }) => Promise<unknown>,
 *   onSucces: () => void }} props
 */
export default function ReinitialisationMotDePasseForm({ token, onEnregistrer, onSucces }) {
  const { valeurs, erreursChamps, envoi, erreur, modifierChamp, soumettre } = useFormulaire({
    valeursInitiales: VALEURS_INITIALES,
    valider: validerNouveauMotDePasse,
    versApi: ({ motDePasse }) => ({ token, motDePasse }),
    onEnregistrer,
    onSucces,
  })

  function champ(name) {
    return { name, value: valeurs[name], erreur: erreursChamps[name], onChange: modifierChamp }
  }

  return (
    <form className="formulaire" onSubmit={soumettre} noValidate>
      {erreur && <ErrorMessage message={erreur.message} />}

      <Input
        label="Nouveau mot de passe"
        type="password"
        autoComplete="new-password"
        aide={REGLE_MOT_DE_PASSE}
        required
        {...champ('motDePasse')}
      />
      <Input
        label="Confirmez le nouveau mot de passe"
        type="password"
        autoComplete="new-password"
        required
        {...champ('confirmation')}
      />

      <Button type="submit" disabled={envoi}>
        {envoi ? 'Enregistrement…' : 'Enregistrer mon nouveau mot de passe'}
      </Button>
    </form>
  )
}
