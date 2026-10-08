import { useState } from 'react'
import { LIBELLES_ROLE, ROLES, versOptions } from '../../utils/constants'
import { REGLE_MOT_DE_PASSE, validerAgent } from '../../utils/validators'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'
import Input from '../ui/Input'
import Select from '../ui/Select'
import './Formulaire.css'

const CHAMPS_IDENTITE = [
  { name: 'prenom', label: 'Prénom', autoComplete: 'off' },
  { name: 'nom', label: 'Nom', autoComplete: 'off' },
  { name: 'email', label: 'Adresse e-mail professionnelle', type: 'email', autoComplete: 'off' },
  { name: 'numeroEmploye', label: "Numéro d'employé", autoComplete: 'off' },
]

const CHAMPS_MOT_DE_PASSE = [
  {
    name: 'motDePasse',
    label: 'Mot de passe provisoire',
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

const OPTIONS_ROLE = versOptions(LIBELLES_ROLE)

function valeursInitiales(agent) {
  return {
    prenom: agent?.prenom ?? '',
    nom: agent?.nom ?? '',
    email: agent?.email ?? '',
    numeroEmploye: agent?.numeroEmploye ?? '',
    role: agent?.role ?? ROLES.AGENT,
    motDePasse: '',
    confirmation: '',
  }
}

function versAgent({ prenom, nom, email, numeroEmploye, role, motDePasse }, creation) {
  const agent = {
    prenom: prenom.trim(),
    nom: nom.trim(),
    email: email.trim(),
    numeroEmploye: numeroEmploye.trim(),
    role,
  }
  return creation ? { ...agent, motDePasse } : agent
}

/**
 * Formulaire de création (agent absent) ou de modification d'un compte du personnel.
 * @param {{ agent?: object, onEnregistrer: (agent: object) => Promise<unknown>, onSucces: () => void }} props
 */
export default function AgentForm({ agent, onEnregistrer, onSucces }) {
  const creation = !agent
  const [valeurs, setValeurs] = useState(() => valeursInitiales(agent))
  const [erreursChamps, setErreursChamps] = useState({})
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState(null)

  const champs = creation ? [...CHAMPS_IDENTITE, ...CHAMPS_MOT_DE_PASSE] : CHAMPS_IDENTITE

  function modifierChamp(event) {
    const { name, value } = event.target
    setValeurs((precedentes) => ({ ...precedentes, [name]: value }))
  }

  async function soumettre(event) {
    event.preventDefault()
    setErreur(null)

    const erreurs = validerAgent(valeurs, { creation })
    setErreursChamps(erreurs)
    if (Object.keys(erreurs).length > 0) return

    setEnvoi(true)
    try {
      await onEnregistrer(versAgent(valeurs, creation))
      onSucces()
    } catch (erreurEnregistrement) {
      setErreur(erreurEnregistrement)
      setEnvoi(false)
    }
  }

  return (
    <form className="formulaire" onSubmit={soumettre} noValidate>
      {erreur && <ErrorMessage message={erreur.message} />}

      {champs.map(({ name, ...champ }) => (
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

      <Select
        label="Rôle"
        name="role"
        options={OPTIONS_ROLE}
        aide="L'administrateur peut en plus gérer les comptes du personnel."
        value={valeurs.role}
        erreur={erreursChamps.role}
        onChange={modifierChamp}
      />

      <Button type="submit" disabled={envoi}>
        {envoi ? 'Enregistrement…' : creation ? 'Créer le compte' : 'Enregistrer les modifications'}
      </Button>
    </form>
  )
}
