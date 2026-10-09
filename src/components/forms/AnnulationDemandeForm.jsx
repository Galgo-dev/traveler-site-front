import { useFormulaire } from '../../hooks/useFormulaire'
import { LONGUEUR_MAX_REMARQUES } from '../../utils/constants'
import { validerAnnulationDemande } from '../../utils/validators'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'
import Textarea from '../ui/Textarea'
import './Formulaire.css'

const VALEURS_INITIALES = { motif: '' }

/**
 * Annulation d'une demande par le personnel : le motif est obligatoire (R13) et l'annulation est définitive (§6).
 * @param {{ onEnregistrer: (motif: string) => Promise<unknown>, onSucces: () => void }} props
 */
export default function AnnulationDemandeForm({ onEnregistrer, onSucces }) {
  const { valeurs, erreursChamps, envoi, erreur, modifierChamp, soumettre } = useFormulaire({
    valeursInitiales: VALEURS_INITIALES,
    valider: validerAnnulationDemande,
    versApi: ({ motif }) => motif.trim(),
    onEnregistrer,
    onSucces,
  })

  return (
    <form className="formulaire" onSubmit={soumettre} noValidate>
      {erreur && <ErrorMessage message={erreur.message} />}
      <p>L'annulation est définitive : la demande ne pourra plus être confirmée.</p>
      <Textarea
        label="Motif de l'annulation"
        aide="Par exemple : à la demande du client par téléphone, destination indisponible aux dates choisies…"
        name="motif"
        maxLength={LONGUEUR_MAX_REMARQUES}
        required
        value={valeurs.motif}
        erreur={erreursChamps.motif}
        onChange={modifierChamp}
      />
      <Button type="submit" variante="danger" disabled={envoi}>
        {envoi ? 'Enregistrement…' : 'Annuler la demande'}
      </Button>
    </form>
  )
}
