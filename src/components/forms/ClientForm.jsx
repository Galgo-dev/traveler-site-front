import { useFormulaire } from '../../hooks/useFormulaire'
import { validerClient } from '../../utils/validators'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'
import Input from '../ui/Input'
import './Formulaire.css'

// Le mot de passe d'un client n'est jamais modifiable par le personnel : il n'y a pas de champ pour lui.
const CHAMPS = [
  { name: 'prenom', label: 'Prénom' },
  { name: 'nom', label: 'Nom' },
  { name: 'email', label: 'Adresse e-mail', type: 'email' },
  { name: 'telephone', label: 'Téléphone', type: 'tel' },
  { name: 'dateNaissance', label: 'Date de naissance', type: 'date' },
]

function valeursInitiales(client) {
  return {
    prenom: client.prenom ?? '',
    nom: client.nom ?? '',
    email: client.email ?? '',
    telephone: client.telephone ?? '',
    dateNaissance: client.dateNaissance?.slice(0, 10) ?? '',
  }
}

function versClient({ prenom, nom, email, telephone, dateNaissance }) {
  return {
    prenom: prenom.trim(),
    nom: nom.trim(),
    email: email.trim(),
    telephone: telephone.trim(),
    dateNaissance,
  }
}

/**
 * Correction des informations d'un client par le personnel.
 * @param {{ client: object, onEnregistrer: (champs: object) => Promise<unknown>, onSucces: () => void }} props
 */
export default function ClientForm({ client, onEnregistrer, onSucces }) {
  const { valeurs, erreursChamps, envoi, erreur, modifierChamp, soumettre } = useFormulaire({
    valeursInitiales: () => valeursInitiales(client),
    valider: validerClient,
    versApi: versClient,
    onEnregistrer,
    onSucces,
  })

  return (
    <form className="formulaire" onSubmit={soumettre} noValidate>
      {erreur && <ErrorMessage message={erreur.message} />}

      {CHAMPS.map(({ name, ...champ }) => (
        <Input
          key={name}
          name={name}
          type="text"
          autoComplete="off"
          required
          {...champ}
          value={valeurs[name]}
          erreur={erreursChamps[name]}
          onChange={modifierChamp}
        />
      ))}

      <Button type="submit" disabled={envoi}>
        {envoi ? 'Enregistrement…' : 'Enregistrer les corrections'}
      </Button>
    </form>
  )
}
