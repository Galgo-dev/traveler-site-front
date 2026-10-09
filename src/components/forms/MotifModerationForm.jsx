import { useFormulaire } from '../../hooks/useFormulaire'
import { LONGUEUR_MAX_MOTIF_AVIS, MOTIFS_REFUS_AVIS } from '../../utils/constants'
import { validerModerationAvis } from '../../utils/validators'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import './Formulaire.css'

const VALEURS_INITIALES = { motif: '' }
const OPTIONS_MOTIFS = [
  { valeur: '', libelle: 'Choisir un motif type (facultatif)' },
  ...MOTIFS_REFUS_AVIS.map((motif) => ({ valeur: motif, libelle: motif })),
]

/**
 * Refus d'un avis à modérer ou masquage d'un avis publié : le motif est obligatoire (R11) et montré au client (P3).
 * Un motif type peut être choisi puis adapté.
 * @param {{ explication: string, libelleBouton: string,
 *   onEnregistrer: (motif: string) => Promise<unknown>, onSucces: () => void }} props
 */
export default function MotifModerationForm({ explication, libelleBouton, onEnregistrer, onSucces }) {
  const { valeurs, erreursChamps, envoi, erreur, modifierChamp, modifierValeurs, soumettre } = useFormulaire({
    valeursInitiales: VALEURS_INITIALES,
    valider: validerModerationAvis,
    versApi: ({ motif }) => motif.trim(),
    onEnregistrer,
    onSucces,
  })

  return (
    <form className="formulaire" onSubmit={soumettre} noValidate>
      {erreur && <ErrorMessage message={erreur.message} />}
      <p>{explication}</p>
      <Select
        label="Motif type"
        name="motifType"
        options={OPTIONS_MOTIFS}
        value={MOTIFS_REFUS_AVIS.includes(valeurs.motif) ? valeurs.motif : ''}
        onChange={(event) => event.target.value && modifierValeurs({ motif: event.target.value })}
      />
      <Textarea
        label="Motif envoyé au client"
        aide="Le client lira ce texte : rédigez-le à son intention, poliment."
        name="motif"
        maxLength={LONGUEUR_MAX_MOTIF_AVIS}
        required
        value={valeurs.motif}
        erreur={erreursChamps.motif}
        onChange={modifierChamp}
      />
      <Button type="submit" variante="danger" disabled={envoi}>
        {envoi ? 'Enregistrement…' : libelleBouton}
      </Button>
    </form>
  )
}
