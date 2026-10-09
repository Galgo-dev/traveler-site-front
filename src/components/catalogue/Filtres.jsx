import { useFormulaire } from '../../hooks/useFormulaire'
import { LIBELLES_CATEGORIE, versOptions } from '../../utils/constants'
import { CRITERES_VIDES } from '../../utils/criteres'
import { validerCriteresRecherche } from '../../utils/validators'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import './Filtres.css'

const OPTIONS_CATEGORIE = [{ valeur: '', libelle: 'Toutes les catégories' }, ...versOptions(LIBELLES_CATEGORIE)]

const CHAMPS = {
  q: (champ) => (
    <Input
      key="q"
      label="Mot-clé"
      aide="Par exemple : plage, cuisine, Rome…"
      type="search"
      {...champ('q')}
    />
  ),
  categorie: (champ) => (
    <Select key="categorie" label="Catégorie d'activité" options={OPTIONS_CATEGORIE} {...champ('categorie')} />
  ),
  budgetMax: (champ) => (
    <Input
      key="budgetMax"
      label="Budget maximum, en euros"
      aide="Prix « à partir de » d'une destination, ou prix par personne d'une activité."
      type="number"
      min="0"
      step="10"
      inputMode="numeric"
      {...champ('budgetMax')}
    />
  ),
}

/**
 * Recherche et filtres du catalogue (mot-clé, catégorie d'activité, budget maximum).
 * Les critères ne sont appliqués qu'au clic sur « Rechercher ».
 * @param {{ criteres: Record<string, string>, champs?: ('q'|'categorie'|'budgetMax')[],
 *   libelleEnvoi?: string, onRechercher: (criteres: Record<string, string>) => void }} props
 *   criteres : valeurs de départ (lues dans l'adresse de la page)
 */
export default function Filtres({
  criteres,
  champs = Object.keys(CRITERES_VIDES),
  libelleEnvoi = 'Rechercher',
  onRechercher,
}) {
  const { valeurs, erreursChamps, modifierChamp, modifierValeurs, soumettre } = useFormulaire({
    valeursInitiales: criteres,
    valider: validerCriteresRecherche,
    versApi: (valeursSaisies) => valeursSaisies,
    onEnregistrer: async (valeursSaisies) => onRechercher(valeursSaisies),
    onSucces: () => {},
  })
  const filtresActifs = champs.some((nom) => String(valeurs[nom] ?? '').trim() !== '')

  function champ(name) {
    return { name, value: valeurs[name], erreur: erreursChamps[name], onChange: modifierChamp }
  }

  function effacer() {
    const vides = Object.fromEntries(champs.map((nom) => [nom, '']))
    modifierValeurs(vides)
    onRechercher(vides)
  }

  return (
    <form className="filtres" role="search" onSubmit={soumettre} noValidate>
      {champs.map((nom) => CHAMPS[nom](champ))}
      <div className="filtres__actions">
        <Button type="submit">{libelleEnvoi}</Button>
        {filtresActifs && (
          <Button variante="secondaire" onClick={effacer}>
            Effacer les filtres
          </Button>
        )}
      </div>
    </form>
  )
}
