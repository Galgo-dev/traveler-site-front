import { useEstimationDemande } from '../../hooks/useDemandes'
import { useDestinations } from '../../hooks/useDestinations'
import { useFormulaire } from '../../hooks/useFormulaire'
import { useActivitesDuPays } from '../../hooks/usePays'
import { LIBELLES_CATEGORIE, LONGUEUR_MAX_REMARQUES, MAX_VOYAGEURS } from '../../utils/constants'
import { formaterPrix } from '../../utils/formatters'
import { aujourdhuiIso, validerDemande } from '../../utils/validators'
import EstimationPrix from '../demandes/EstimationPrix'
import Button from '../ui/Button'
import Checkbox from '../ui/Checkbox'
import ErrorMessage from '../ui/ErrorMessage'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import './Formulaire.css'
import './DemandeForm.css'

// Toutes les destinations visibles tiennent sur une page (~50 au catalogue).
const DESTINATIONS_COMMANDABLES = { limite: 100 }
const CHOIX_DESTINATION = { valeur: '', libelle: 'Choisissez une destination' }

function lendemain() {
  const demain = new Date(`${aujourdhuiIso()}T00:00:00Z`)
  demain.setUTCDate(demain.getUTCDate() + 1)
  return demain.toISOString().slice(0, 10)
}

function valeursInitiales(destinationId) {
  return {
    destinationId: destinationId ? String(destinationId) : '',
    dateDepart: '',
    dateRetour: '',
    nbAdultes: '2',
    nbEnfants: '0',
    activiteIds: [],
    remarques: '',
  }
}

// Corps attendu par l'API (estimation : sans les remarques, qui n'influencent pas le prix).
function versEstimation({ destinationId, dateDepart, dateRetour, nbAdultes, nbEnfants, activiteIds }) {
  return {
    destinationId: Number(destinationId),
    dateDepart,
    dateRetour,
    nbAdultes: Number(nbAdultes),
    nbEnfants: Number(nbEnfants),
    activiteIds: activiteIds.map(Number),
  }
}

function versDemande(valeurs) {
  const remarques = valeurs.remarques.trim()
  return { ...versEstimation(valeurs), ...(remarques && { remarques }) }
}

function versOptionDestination({ id, nom, pays }) {
  return { valeur: String(id), libelle: pays ? `${nom} (${pays.nom})` : nom }
}

// Les activités de la destination choisie d'abord, puis celles du reste du pays (R6).
function trierActivites(activites, destinationId) {
  const surPlace = (activite) => (String(activite.destination?.id) === destinationId ? 0 : 1)
  return [...activites].sort((a, b) => surPlace(a) - surPlace(b) || a.nom.localeCompare(b.nom, 'fr'))
}

function LibelleActivite({ activite, destinationId }) {
  const ailleurs = activite.destination && String(activite.destination.id) !== destinationId
  return (
    <span className="demande-form__activite">
      <strong>{activite.nom}</strong>
      <span>
        {LIBELLES_CATEGORIE[activite.categorie] ?? activite.categorie} · {formaterPrix(activite.prixParPersonne)} par
        personne
        {/* R10 : l'âge minimum est affiché, pas vérifié. */}
        {activite.ageMinimum != null && ` · à partir de ${activite.ageMinimum} ans`}
        {ailleurs && ` · à ${activite.destination.nom}`}
      </span>
    </span>
  )
}

/**
 * Demande de voyage (V2, §7) : une destination, les dates, les voyageurs, des activités du même pays et des
 * remarques, avec le prix estimé recalculé pendant la saisie.
 * @param {{ destinationInitiale?: string|null, onEnregistrer: (demande: object) => Promise<unknown>,
 *   onSucces: () => void }} props
 */
export default function DemandeForm({ destinationInitiale, onEnregistrer, onSucces }) {
  const { valeurs, erreursChamps, envoi, erreur, modifierChamp, modifierValeurs, soumettre } = useFormulaire({
    valeursInitiales: () => valeursInitiales(destinationInitiale),
    valider: validerDemande,
    versApi: versDemande,
    onEnregistrer,
    onSucces,
  })
  const catalogue = useDestinations(DESTINATIONS_COMMANDABLES)
  const destination = catalogue.destinations.find((d) => String(d.id) === valeurs.destinationId)
  const { activites } = useActivitesDuPays(destination?.paysId)

  // L'estimation n'est demandée qu'une fois la saisie complète et valide.
  const saisieComplete = Object.keys(validerDemande(valeurs)).length === 0
  const estimation = useEstimationDemande(saisieComplete ? versEstimation(valeurs) : null)

  function champ(name) {
    return { name, value: valeurs[name], erreur: erreursChamps[name], onChange: modifierChamp }
  }

  // Les activités dépendent du pays de la destination : changer de destination les vide (R6).
  function changerDestination(event) {
    modifierValeurs({ destinationId: event.target.value, activiteIds: [] })
  }

  function basculerActivite(id, choisie) {
    const ids = valeurs.activiteIds.filter((existant) => existant !== id)
    modifierValeurs({ activiteIds: choisie ? [...ids, id] : ids })
  }

  return (
    <form className="formulaire" onSubmit={soumettre} noValidate>
      {erreur && <ErrorMessage message={erreur.message} />}
      {catalogue.erreur && <ErrorMessage message={catalogue.erreur.message} />}

      <Select
        label="Destination"
        aide="Une demande porte sur une seule destination."
        options={[CHOIX_DESTINATION, ...catalogue.destinations.map(versOptionDestination)]}
        required
        {...champ('destinationId')}
        onChange={changerDestination}
      />

      <div className="formulaire__ligne">
        <Input label="Date de départ" type="date" min={lendemain()} required {...champ('dateDepart')} />
        <Input
          label="Date de retour"
          type="date"
          min={valeurs.dateDepart || lendemain()}
          required
          {...champ('dateRetour')}
        />
      </div>

      <div className="formulaire__ligne">
        <Input
          label="Nombre d'adultes"
          type="number"
          min="1"
          max={MAX_VOYAGEURS}
          inputMode="numeric"
          required
          {...champ('nbAdultes')}
        />
        <Input
          label="Nombre d'enfants"
          aide={`${MAX_VOYAGEURS} voyageurs au maximum, adultes compris.`}
          type="number"
          min="0"
          max={MAX_VOYAGEURS - 1}
          inputMode="numeric"
          required
          {...champ('nbEnfants')}
        />
      </div>

      <fieldset className="demande-form__activites">
        <legend className="champ__label">Activités sur place (facultatif)</legend>
        {!destination && <p className="champ__aide">Choisissez d'abord une destination.</p>}
        {destination && activites.length === 0 && (
          <p className="champ__aide">Aucune activité n'est proposée dans ce pays pour le moment.</p>
        )}
        {destination &&
          trierActivites(activites, valeurs.destinationId).map((activite) => (
            <Checkbox
              key={activite.id}
              label={<LibelleActivite activite={activite} destinationId={valeurs.destinationId} />}
              checked={valeurs.activiteIds.includes(activite.id)}
              onChange={(event) => basculerActivite(activite.id, event.target.checked)}
            />
          ))}
      </fieldset>

      <Textarea
        label="Remarques (facultatif)"
        aide={`Régime alimentaire, mobilité réduite, événement à fêter… (${valeurs.remarques.length} / ${LONGUEUR_MAX_REMARQUES} caractères)`}
        maxLength={LONGUEUR_MAX_REMARQUES}
        {...champ('remarques')}
      />

      <EstimationPrix
        saisieComplete={saisieComplete}
        {...estimation}
        nbAdultes={Number(valeurs.nbAdultes)}
        nbEnfants={Number(valeurs.nbEnfants)}
      />

      <Button type="submit" disabled={envoi}>
        {envoi ? 'Envoi en cours…' : 'Envoyer ma demande'}
      </Button>
    </form>
  )
}
