import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { REGLE_MOT_DE_PASSE, validerInscription } from '../../utils/validators'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'
import Input from '../ui/Input'
import './Formulaire.css'

const CHAMPS = [
  { name: 'prenom', label: 'Prénom', autoComplete: 'given-name' },
  { name: 'nom', label: 'Nom', autoComplete: 'family-name' },
  { name: 'email', label: 'Adresse e-mail', type: 'email', autoComplete: 'email' },
  { name: 'telephone', label: 'Téléphone', type: 'tel', autoComplete: 'tel' },
  { name: 'dateNaissance', label: 'Date de naissance', type: 'date', autoComplete: 'bday' },
  {
    name: 'motDePasse',
    label: 'Mot de passe',
    type: 'password',
    autoComplete: 'new-password',
    aide: REGLE_MOT_DE_PASSE,
  },
  {
    name: 'confirmation',
    label: 'Confirmez le mot de passe',
    type: 'password',
    autoComplete: 'new-password',
  },
]

const VALEURS_INITIALES = Object.fromEntries(CHAMPS.map(({ name }) => [name, '']))

function versClient({ nom, prenom, email, telephone, dateNaissance, motDePasse }) {
  return {
    nom: nom.trim(),
    prenom: prenom.trim(),
    email: email.trim(),
    telephone: telephone.trim(),
    dateNaissance,
    motDePasse,
  }
}

export default function InscriptionForm({ onSucces }) {
  const { inscription } = useAuth()
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

    const erreurs = validerInscription(valeurs)
    setErreursChamps(erreurs)
    if (Object.keys(erreurs).length > 0) return

    setEnvoi(true)
    try {
      await inscription(versClient(valeurs))
      onSucces()
    } catch (erreurInscription) {
      setErreur(erreurInscription)
      setEnvoi(false)
    }
  }

  return (
    <form className="formulaire" onSubmit={soumettre} noValidate>
      {erreur && <ErrorMessage message={erreur.message} />}

      {CHAMPS.map(({ name, ...champ }) => (
        <Input
          key={name}
          name={name}
          type="text"
          required
          {...champ}
          value={valeurs[name]}
          erreur={erreursChamps[name]}
          onChange={modifierChamp}
        />
      ))}

      <Button type="submit" disabled={envoi}>
        {envoi ? 'Création du compte…' : 'Créer mon compte'}
      </Button>
    </form>
  )
}
