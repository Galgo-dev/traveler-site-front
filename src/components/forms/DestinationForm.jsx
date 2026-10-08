import { useFormulaire } from '../../hooks/useFormulaire'
import { useOptionsPays } from '../../hooks/usePays'
import { nombreOuNull, texteOuNull, versChamp } from '../../utils/conversions'
import { validerDestination } from '../../utils/validators'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import './Formulaire.css'

const CHOIX_PAYS = { valeur: '', libelle: 'Choisissez un pays' }

function valeursInitiales(destination) {
  return {
    paysId: versChamp(destination?.paysId),
    nom: destination?.nom ?? '',
    description: destination?.description ?? '',
    periodeIdeale: destination?.periodeIdeale ?? '',
    prixAPartirDe: versChamp(destination?.prixAPartirDe),
    photoUrl: destination?.photoUrl ?? '',
  }
}

function versDestination(valeurs) {
  return {
    paysId: Number(valeurs.paysId),
    nom: valeurs.nom.trim(),
    description: texteOuNull(valeurs.description),
    periodeIdeale: texteOuNull(valeurs.periodeIdeale),
    prixAPartirDe: nombreOuNull(valeurs.prixAPartirDe),
    photoUrl: texteOuNull(valeurs.photoUrl),
  }
}

/**
 * Formulaire de création (élément absent) ou de modification d'une destination.
 * @param {{ element?: object, onEnregistrer: (destination: object) => Promise<unknown>, onSucces: () => void }} props
 */
export default function DestinationForm({ element: destination, onEnregistrer, onSucces }) {
  const optionsPays = useOptionsPays()
  const { valeurs, erreursChamps, envoi, erreur, modifierChamp, soumettre } = useFormulaire({
    valeursInitiales: () => valeursInitiales(destination),
    valider: validerDestination,
    versApi: versDestination,
    onEnregistrer,
    onSucces,
  })

  function champ(name) {
    return { name, value: valeurs[name], erreur: erreursChamps[name], onChange: modifierChamp }
  }

  return (
    <form className="formulaire" onSubmit={soumettre} noValidate>
      {erreur && <ErrorMessage message={erreur.message} />}
      {optionsPays.erreur && <ErrorMessage message={optionsPays.erreur.message} />}

      <Select label="Pays" options={[CHOIX_PAYS, ...optionsPays.options]} required {...champ('paysId')} />
      <Input label="Nom de la destination (ville ou région)" required {...champ('nom')} />
      <Textarea label="Description (facultatif)" rows={5} {...champ('description')} />
      <Input
        label="Période idéale (facultatif)"
        aide="Par exemple : de mai à septembre"
        {...champ('periodeIdeale')}
      />
      <Input
        label="Prix indicatif « à partir de », en euros (facultatif)"
        type="number"
        min="0"
        step="1"
        inputMode="numeric"
        {...champ('prixAPartirDe')}
      />
      <Input
        label="Adresse de la photo (facultatif)"
        aide="Adresse web complète de l'image, commençant par https://"
        type="url"
        {...champ('photoUrl')}
      />

      <Button type="submit" disabled={envoi}>
        {envoi ? 'Enregistrement…' : destination ? 'Enregistrer les modifications' : 'Ajouter la destination'}
      </Button>
    </form>
  )
}
