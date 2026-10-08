import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'
import Checkbox from '../ui/Checkbox'
import ErrorMessage from '../ui/ErrorMessage'
import Input from '../ui/Input'
import './Formulaire.css'

const IDENTIFIANTS_VIDES = { email: '', motDePasse: '' }

export default function ConnexionForm({ onSucces }) {
  const { connexion } = useAuth()
  const [identifiants, setIdentifiants] = useState(IDENTIFIANTS_VIDES)
  const [personnel, setPersonnel] = useState(false)
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState(null)

  function modifierChamp(event) {
    const { name, value } = event.target
    setIdentifiants((precedents) => ({ ...precedents, [name]: value }))
  }

  async function soumettre(event) {
    event.preventDefault()
    setEnvoi(true)
    setErreur(null)

    try {
      const utilisateur = await connexion(identifiants, { personnel })
      onSucces(utilisateur)
    } catch (erreurConnexion) {
      setErreur(erreurConnexion)
      setEnvoi(false)
    }
  }

  return (
    <form className="formulaire" onSubmit={soumettre}>
      {erreur && <ErrorMessage message={erreur.message} />}

      <Input
        label="Adresse e-mail"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={identifiants.email}
        onChange={modifierChamp}
      />
      <Input
        label="Mot de passe"
        type="password"
        name="motDePasse"
        autoComplete="current-password"
        required
        value={identifiants.motDePasse}
        onChange={modifierChamp}
      />

      <Checkbox
        label="Je fais partie du personnel de l'agence"
        checked={personnel}
        onChange={(event) => setPersonnel(event.target.checked)}
      />

      <Button type="submit" disabled={envoi}>
        {envoi ? 'Connexion en cours…' : 'Se connecter'}
      </Button>
    </form>
  )
}
