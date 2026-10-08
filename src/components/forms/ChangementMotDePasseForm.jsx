import { useFormulaire } from '../../hooks/useFormulaire'
import { REGLE_MOT_DE_PASSE, validerChangementMotDePasse } from '../../utils/validators'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'
import Input from '../ui/Input'
import './Formulaire.css'

const VALEURS_INITIALES = { motDePasseActuel: '', nouveauMotDePasse: '', confirmation: '' }

function versApi({ motDePasseActuel, nouveauMotDePasse }) {
  return { motDePasseActuel, nouveauMotDePasse }
}

/**
 * Changement de son propre mot de passe : l'ancien est demandé pour confirmer qu'il s'agit bien du titulaire.
 * @param {{ onEnregistrer: (motsDePasse: { motDePasseActuel: string, nouveauMotDePasse: string }) => Promise<unknown>,
 *   onSucces: () => void }} props
 */
export default function ChangementMotDePasseForm({ onEnregistrer, onSucces }) {
  const { valeurs, erreursChamps, envoi, erreur, modifierChamp, soumettre } = useFormulaire({
    valeursInitiales: VALEURS_INITIALES,
    valider: validerChangementMotDePasse,
    versApi,
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
        label="Mot de passe actuel"
        type="password"
        autoComplete="current-password"
        required
        {...champ('motDePasseActuel')}
      />
      <Input
        label="Nouveau mot de passe"
        type="password"
        autoComplete="new-password"
        aide={REGLE_MOT_DE_PASSE}
        required
        {...champ('nouveauMotDePasse')}
      />
      <Input
        label="Confirmez le nouveau mot de passe"
        type="password"
        autoComplete="new-password"
        required
        {...champ('confirmation')}
      />

      <Button type="submit" disabled={envoi}>
        {envoi ? 'Enregistrement…' : 'Changer mon mot de passe'}
      </Button>
    </form>
  )
}
