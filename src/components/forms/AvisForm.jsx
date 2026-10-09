import { useFormulaire } from '../../hooks/useFormulaire'
import {
  LONGUEUR_MAX_COMMENTAIRE_AVIS,
  LONGUEUR_MAX_TITRE_AVIS,
  NOTE_MAX_SANS_COMMENTAIRE,
} from '../../utils/constants'
import { validerAvis } from '../../utils/validators'
import ChoixNote from '../avis/ChoixNote'
import Button from '../ui/Button'
import Checkbox from '../ui/Checkbox'
import ErrorMessage from '../ui/ErrorMessage'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import './Formulaire.css'
import './AvisForm.css'

const VALEURS_INITIALES = { note: '', titre: '', commentaire: '', anonyme: false, notesActivites: {} }

// Corps attendu par l'API : seules les activités notées sont envoyées (R20, facultatif).
function versAvis(demandeId) {
  return ({ note, titre, commentaire, anonyme, notesActivites }) => {
    const texte = commentaire.trim()
    return {
      demandeId,
      note: Number(note),
      titre: titre.trim(),
      ...(texte && { commentaire: texte }),
      anonyme,
      notesActivites: Object.entries(notesActivites)
        .filter(([, noteActivite]) => noteActivite)
        .map(([activiteId, noteActivite]) => ({ activiteId: Number(activiteId), note: Number(noteActivite) })),
    }
  }
}

function aideCommentaire(note, longueur) {
  const compteur = `(${longueur} / ${LONGUEUR_MAX_COMMENTAIRE_AVIS} caractères)`
  // R8 : une note basse doit être expliquée.
  return note && Number(note) <= NOTE_MAX_SANS_COMMENTAIRE
    ? `Obligatoire pour ${NOTE_MAX_SANS_COMMENTAIRE} étoiles ou moins : dites-nous ce qui ne vous a pas plu. ${compteur}`
    : `Racontez votre séjour : ce que vous avez aimé, vos conseils aux futurs voyageurs… ${compteur}`
}

/**
 * Avis sur la destination d'une commande terminée (V3, §7) : note, titre, commentaire, anonymat et,
 * si la commande en comporte, notes facultatives des activités.
 * @param {{ commande: { id: number, activites: { id: number, nom: string }[] }, signature: string,
 *   onEnregistrer: (avis: object) => Promise<unknown>, onSucces: () => void }} props
 *   signature : nom public du client (« Julie D. »), affiché s'il ne reste pas anonyme
 */
export default function AvisForm({ commande, signature, onEnregistrer, onSucces }) {
  const { valeurs, erreursChamps, envoi, erreur, modifierChamp, modifierValeurs, soumettre } = useFormulaire({
    valeursInitiales: VALEURS_INITIALES,
    valider: validerAvis,
    versApi: versAvis(commande.id),
    onEnregistrer,
    onSucces,
  })
  const noteBasse = valeurs.note && Number(valeurs.note) <= NOTE_MAX_SANS_COMMENTAIRE

  function champ(name) {
    return { name, value: valeurs[name], erreur: erreursChamps[name], onChange: modifierChamp }
  }

  function noterActivite(activiteId, note) {
    modifierValeurs({ notesActivites: { ...valeurs.notesActivites, [activiteId]: note } })
  }

  return (
    <form className="formulaire" onSubmit={soumettre} noValidate>
      {erreur && <ErrorMessage message={erreur.message} />}

      <ChoixNote
        legende="Votre note pour cette destination"
        name="note"
        valeur={valeurs.note}
        onChange={(note) => modifierValeurs({ note })}
        erreur={erreursChamps.note}
      />

      <Input
        label="Titre de votre avis"
        aide={`En quelques mots, ex. « Un séjour inoubliable ». (${valeurs.titre.length} / ${LONGUEUR_MAX_TITRE_AVIS} caractères)`}
        maxLength={LONGUEUR_MAX_TITRE_AVIS}
        required
        {...champ('titre')}
      />

      <Textarea
        label={noteBasse ? 'Commentaire' : 'Commentaire (facultatif)'}
        aide={aideCommentaire(valeurs.note, valeurs.commentaire.length)}
        maxLength={LONGUEUR_MAX_COMMENTAIRE_AVIS}
        rows={6}
        required={Boolean(noteBasse)}
        {...champ('commentaire')}
      />

      {commande.activites.length > 0 && (
        <fieldset className="avis-form__activites">
          <legend className="champ__label">Les activités de votre voyage (facultatif)</legend>
          {commande.activites.map((activite) => (
            <ChoixNote
              key={activite.id}
              legende={activite.nom}
              name={`activite-${activite.id}`}
              valeur={valeurs.notesActivites[activite.id] ?? ''}
              onChange={(note) => noterActivite(activite.id, note)}
              facultatif
              petite
            />
          ))}
        </fieldset>
      )}

      <div>
        <Checkbox label="Rester anonyme" name="anonyme" checked={valeurs.anonyme} onChange={modifierChamp} />
        {/* R17 : l'anonymat ne vaut que pour le public. */}
        <p className="champ__aide">
          {valeurs.anonyme
            ? 'Votre avis sera signé « Voyageur anonyme ». L’agence verra toujours votre nom.'
            : `Votre avis sera signé « ${signature} ».`}
        </p>
      </div>

      {/* R9, R10 : modération avant publication, puis 30 jours pour modifier ou supprimer. */}
      <p className="encadre">
        Votre avis sera relu par notre équipe avant d’être publié. Vous pourrez le modifier ou le supprimer pendant
        30 jours.
      </p>

      <Button type="submit" disabled={envoi}>
        {envoi ? 'Envoi en cours…' : 'Envoyer mon avis'}
      </Button>
    </form>
  )
}
