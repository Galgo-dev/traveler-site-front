import { useOptionsDestinations } from '../../hooks/useDestinations'
import { useFormulaire } from '../../hooks/useFormulaire'
import { useOptionsPays } from '../../hooks/usePays'
import { LIBELLES_CATEGORIE, LIBELLES_DIFFICULTE, UNITES_DUREE, versOptions } from '../../utils/constants'
import { nombreOuNull, texteOuNull, versChamp } from '../../utils/conversions'
import { validerActivite } from '../../utils/validators'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import './Formulaire.css'

const CHOIX_PAYS = { valeur: '', libelle: 'Choisissez un pays' }
const AUCUNE_DESTINATION = { valeur: '', libelle: 'Aucune en particulier (tout le pays)' }
const OPTIONS_CATEGORIE = [{ valeur: '', libelle: 'Choisissez une catégorie' }, ...versOptions(LIBELLES_CATEGORIE)]
const OPTIONS_DIFFICULTE = [{ valeur: '', libelle: 'Non précisé' }, ...versOptions(LIBELLES_DIFFICULTE)]
const OPTIONS_UNITE = Object.entries(UNITES_DUREE).map(([valeur, { pluriel }]) => ({
  valeur,
  libelle: pluriel.charAt(0).toUpperCase() + pluriel.slice(1),
}))

function valeursInitiales(activite) {
  return {
    paysId: versChamp(activite?.paysId),
    destinationId: versChamp(activite?.destinationId),
    nom: activite?.nom ?? '',
    description: activite?.description ?? '',
    categorie: activite?.categorie ?? '',
    duree: versChamp(activite?.duree),
    dureeUnite: activite?.dureeUnite ?? 'heures',
    prixParPersonne: versChamp(activite?.prixParPersonne),
    niveauDifficulte: activite?.niveauDifficulte ?? '',
    ageMinimum: versChamp(activite?.ageMinimum),
  }
}

function versActivite(valeurs) {
  return {
    paysId: Number(valeurs.paysId),
    destinationId: nombreOuNull(valeurs.destinationId),
    nom: valeurs.nom.trim(),
    description: texteOuNull(valeurs.description),
    categorie: valeurs.categorie,
    duree: Number(valeurs.duree),
    dureeUnite: valeurs.dureeUnite,
    prixParPersonne: Number(valeurs.prixParPersonne),
    niveauDifficulte: texteOuNull(valeurs.niveauDifficulte),
    ageMinimum: nombreOuNull(valeurs.ageMinimum),
  }
}

/**
 * Formulaire de création (élément absent) ou de modification d'une activité.
 * L'activité appartient à un pays ; le lien vers une destination de ce pays est facultatif.
 * @param {{ element?: object, onEnregistrer: (activite: object) => Promise<unknown>, onSucces: () => void }} props
 */
export default function ActiviteForm({ element: activite, onEnregistrer, onSucces }) {
  const { valeurs, erreursChamps, envoi, erreur, modifierChamp, modifierValeurs, soumettre } = useFormulaire({
    valeursInitiales: () => valeursInitiales(activite),
    valider: validerActivite,
    versApi: versActivite,
    onEnregistrer,
    onSucces,
  })
  const optionsPays = useOptionsPays()
  const optionsDestinations = useOptionsDestinations(valeurs.paysId)
  const erreurChargement = optionsPays.erreur ?? optionsDestinations.erreur

  function champ(name) {
    return { name, value: valeurs[name], erreur: erreursChamps[name], onChange: modifierChamp }
  }

  // Une destination appartient à un seul pays : changer de pays annule le choix de destination.
  function changerPays(event) {
    modifierValeurs({ paysId: event.target.value, destinationId: '' })
  }

  return (
    <form className="formulaire" onSubmit={soumettre} noValidate>
      {erreur && <ErrorMessage message={erreur.message} />}
      {erreurChargement && <ErrorMessage message={erreurChargement.message} />}

      <Select
        label="Pays"
        options={[CHOIX_PAYS, ...optionsPays.options]}
        required
        {...champ('paysId')}
        onChange={changerPays}
      />
      <Select
        label="Destination (facultatif)"
        aide="Pour rattacher l'activité à une ville ou une région précise du pays."
        options={[AUCUNE_DESTINATION, ...optionsDestinations.options]}
        disabled={!valeurs.paysId}
        {...champ('destinationId')}
      />
      <Input label="Nom de l'activité" required {...champ('nom')} />
      <Textarea label="Description (facultatif)" rows={5} {...champ('description')} />
      <Select label="Catégorie" options={OPTIONS_CATEGORIE} required {...champ('categorie')} />

      <div className="formulaire__ligne">
        <Input label="Durée" type="number" min="0" step="0.5" inputMode="decimal" required {...champ('duree')} />
        <Select label="Unité de durée" options={OPTIONS_UNITE} {...champ('dureeUnite')} />
      </div>

      <Input
        label="Prix par personne, en euros"
        type="number"
        min="0"
        step="1"
        inputMode="numeric"
        required
        {...champ('prixParPersonne')}
      />
      <Select
        label="Niveau de difficulté (facultatif)"
        aide="Surtout utile pour les activités sportives."
        options={OPTIONS_DIFFICULTE}
        {...champ('niveauDifficulte')}
      />
      <Input
        label="Âge minimum, en années (facultatif)"
        type="number"
        min="0"
        step="1"
        inputMode="numeric"
        {...champ('ageMinimum')}
      />

      <Button type="submit" disabled={envoi}>
        {envoi ? 'Enregistrement…' : activite ? 'Enregistrer les modifications' : "Ajouter l'activité"}
      </Button>
    </form>
  )
}
