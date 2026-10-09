import { useFormulaire } from '../../hooks/useFormulaire'
import { LONGUEUR_MAX_REPONSE_AVIS } from '../../utils/constants'
import { validerReponseAvis } from '../../utils/validators'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'
import Textarea from '../ui/Textarea'
import './Formulaire.css'

/**
 * Réponse publique de l'agence à un avis publié : une seule par avis, modifiable par tout agent (R14, P7).
 * @param {{ texteInitial?: string, onEnregistrer: (texte: string) => Promise<unknown>, onSucces: () => void }} props
 *   texteInitial : réponse déjà publiée, à modifier
 */
export default function ReponseAvisForm({ texteInitial = '', onEnregistrer, onSucces }) {
  const { valeurs, erreursChamps, envoi, erreur, modifierChamp, soumettre } = useFormulaire({
    valeursInitiales: { texte: texteInitial },
    valider: validerReponseAvis,
    versApi: ({ texte }) => texte.trim(),
    onEnregistrer,
    onSucces,
  })

  return (
    <form className="formulaire" onSubmit={soumettre} noValidate>
      {erreur && <ErrorMessage message={erreur.message} />}
      <Textarea
        label="Réponse de l'agence"
        aide={`Visible par tous sous l'avis, signée de votre prénom. (${valeurs.texte.length} / ${LONGUEUR_MAX_REPONSE_AVIS} caractères)`}
        name="texte"
        rows={5}
        maxLength={LONGUEUR_MAX_REPONSE_AVIS}
        required
        value={valeurs.texte}
        erreur={erreursChamps.texte}
        onChange={modifierChamp}
      />
      <Button type="submit" disabled={envoi}>
        {envoi ? 'Enregistrement…' : texteInitial ? 'Modifier la réponse' : 'Publier la réponse'}
      </Button>
    </form>
  )
}
