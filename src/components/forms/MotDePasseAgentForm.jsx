import { useState } from 'react'
import { REGLE_MOT_DE_PASSE, validerNouveauMotDePasse } from '../../utils/validators'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'
import Input from '../ui/Input'
import './Formulaire.css'

const VALEURS_INITIALES = { motDePasse: '', confirmation: '' }

/**
 * Formulaire de définition d'un nouveau mot de passe pour un membre du personnel.
 * @param {{ onEnregistrer: (motDePasse: string) => Promise<unknown>, onSucces: () => void }} props
 */
export default function MotDePasseAgentForm({ onEnregistrer, onSucces }) {
  const [valeurs, setValeurs] = useState(VALEURS_INITIALES)
  const [erreursChamps, setErreursChamps] = useState({})
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState(null)

  function modifierChamp(event) {
    const { name, value } = event.target
    setValeurs((precedentes) => ({ ...precedentes, [name]: value }))
  }

  async function soumettre(event) {
    event.preventDefault()
    setErreur(null)

    const erreurs = validerNouveauMotDePasse(valeurs)
    setErreursChamps(erreurs)
    if (Object.keys(erreurs).length > 0) return

    setEnvoi(true)
    try {
      await onEnregistrer(valeurs.motDePasse)
      onSucces()
    } catch (erreurEnregistrement) {
      setErreur(erreurEnregistrement)
      setEnvoi(false)
    }
  }

  return (
    <form className="formulaire" onSubmit={soumettre} noValidate>
      {erreur && <ErrorMessage message={erreur.message} />}

      <Input
        label="Nouveau mot de passe"
        type="password"
        name="motDePasse"
        autoComplete="new-password"
        aide={REGLE_MOT_DE_PASSE}
        required
        value={valeurs.motDePasse}
        erreur={erreursChamps.motDePasse}
        onChange={modifierChamp}
      />
      <Input
        label="Confirmez le mot de passe"
        type="password"
        name="confirmation"
        autoComplete="new-password"
        required
        value={valeurs.confirmation}
        erreur={erreursChamps.confirmation}
        onChange={modifierChamp}
      />

      <Button type="submit" disabled={envoi}>
        {envoi ? 'Enregistrement…' : 'Définir le mot de passe'}
      </Button>
    </form>
  )
}
