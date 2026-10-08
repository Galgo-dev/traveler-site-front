import { useFormulaire } from '../../hooks/useFormulaire'
import { CONTINENTS } from '../../utils/constants'
import { nombreOuNull, texteOuNull, versChamp } from '../../utils/conversions'
import { validerPays } from '../../utils/validators'
import Button from '../ui/Button'
import Checkbox from '../ui/Checkbox'
import ErrorMessage from '../ui/ErrorMessage'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import './Formulaire.css'

const OPTIONS_CONTINENT = [
  { valeur: '', libelle: 'Choisissez un continent' },
  ...CONTINENTS.map((continent) => ({ valeur: continent, libelle: continent })),
]

function valeursInitiales(pays) {
  return {
    nom: pays?.nom ?? '',
    continent: pays?.continent ?? '',
    languePrincipale: pays?.languePrincipale ?? '',
    monnaie: pays?.monnaie ?? '',
    descriptionCourte: pays?.descriptionCourte ?? '',
    visaRequis: pays?.visaRequis ?? false,
    decalageHoraire: versChamp(pays?.decalageHoraire ?? 0),
  }
}

function versPays(valeurs) {
  return {
    nom: valeurs.nom.trim(),
    continent: valeurs.continent,
    languePrincipale: valeurs.languePrincipale.trim(),
    monnaie: valeurs.monnaie.trim(),
    descriptionCourte: texteOuNull(valeurs.descriptionCourte),
    visaRequis: valeurs.visaRequis,
    decalageHoraire: nombreOuNull(valeurs.decalageHoraire) ?? 0,
  }
}

/**
 * Formulaire de création (élément absent) ou de modification d'un pays.
 * @param {{ element?: object, onEnregistrer: (pays: object) => Promise<unknown>, onSucces: () => void }} props
 */
export default function PaysForm({ element: pays, onEnregistrer, onSucces }) {
  const { valeurs, erreursChamps, envoi, erreur, modifierChamp, soumettre } = useFormulaire({
    valeursInitiales: () => valeursInitiales(pays),
    valider: validerPays,
    versApi: versPays,
    onEnregistrer,
    onSucces,
  })

  function champ(name) {
    return { name, value: valeurs[name], erreur: erreursChamps[name], onChange: modifierChamp }
  }

  return (
    <form className="formulaire" onSubmit={soumettre} noValidate>
      {erreur && <ErrorMessage message={erreur.message} />}

      <Input label="Nom du pays" required {...champ('nom')} />
      <Select label="Continent" options={OPTIONS_CONTINENT} required {...champ('continent')} />
      <Input label="Langue principale" required {...champ('languePrincipale')} />
      <Input label="Monnaie" aide="Par exemple : Euro (EUR)" required {...champ('monnaie')} />
      <Textarea label="Description courte (facultatif)" {...champ('descriptionCourte')} />
      <Input
        label="Décalage horaire avec la Belgique (en heures)"
        aide="0 si même heure, 2 si 2 heures de plus, -6 si 6 heures de moins."
        type="number"
        step="0.5"
        inputMode="decimal"
        {...champ('decalageHoraire')}
      />
      <Checkbox
        label="Visa requis pour les Belges"
        name="visaRequis"
        checked={valeurs.visaRequis}
        onChange={modifierChamp}
      />

      <Button type="submit" disabled={envoi}>
        {envoi ? 'Enregistrement…' : pays ? 'Enregistrer les modifications' : 'Ajouter le pays'}
      </Button>
    </form>
  )
}
