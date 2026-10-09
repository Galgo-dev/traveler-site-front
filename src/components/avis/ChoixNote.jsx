import { useId } from 'react'
import { LIBELLES_NOTE, NOTE_MAX } from '../../utils/constants'
import './ChoixNote.css'

const NOTES = Array.from({ length: NOTE_MAX }, (_, index) => index + 1)

function libelleNote(note) {
  return `${note} étoile${note > 1 ? 's' : ''} sur ${NOTE_MAX} — ${LIBELLES_NOTE[note]}`
}

/**
 * Note de 1 à 5 étoiles : boutons radio (flèches du clavier) présentés en grandes étoiles.
 * @param {{ legende: string, name: string, valeur: string, onChange: (valeur: string) => void,
 *   aide?: string, erreur?: string, facultatif?: boolean, petite?: boolean }} props
 *   facultatif : ajoute le choix « Pas de note » ; petite : étoiles plus discrètes (notes des activités)
 */
export default function ChoixNote({ legende, name, valeur, onChange, aide, erreur, facultatif = false, petite = false }) {
  const id = useId()
  const note = Number(valeur) || 0
  const descriptions = [aide && `${id}-aide`, erreur && `${id}-erreur`].filter(Boolean).join(' ')

  return (
    <fieldset
      className={`choix-note ${petite ? 'choix-note--petite' : ''}`.trim()}
      aria-describedby={descriptions || undefined}
    >
      <legend className="champ__label">{legende}</legend>
      {aide && (
        <p id={`${id}-aide`} className="champ__aide">
          {aide}
        </p>
      )}

      <div className="choix-note__etoiles">
        {NOTES.map((valeurEtoile) => (
          <span key={valeurEtoile} className="choix-note__option">
            <input
              className="visuellement-cache"
              type="radio"
              id={`${id}-${valeurEtoile}`}
              name={name}
              value={valeurEtoile}
              checked={note === valeurEtoile}
              onChange={() => onChange(String(valeurEtoile))}
            />
            <label
              htmlFor={`${id}-${valeurEtoile}`}
              className={`choix-note__etoile ${valeurEtoile <= note ? 'choix-note__etoile--pleine' : ''}`.trim()}
            >
              <span aria-hidden="true">{valeurEtoile <= note ? '★' : '☆'}</span>
              <span className="visuellement-cache">{libelleNote(valeurEtoile)}</span>
            </label>
          </span>
        ))}
        {facultatif && (
          <span className="choix-note__option">
            <input
              className="visuellement-cache"
              type="radio"
              id={`${id}-aucune`}
              name={name}
              value=""
              checked={note === 0}
              onChange={() => onChange('')}
            />
            <label htmlFor={`${id}-aucune`} className="choix-note__aucune">
              Pas de note
            </label>
          </span>
        )}
      </div>

      <p className="choix-note__resume" aria-hidden="true">
        {note ? libelleNote(note) : 'Aucune note choisie'}
      </p>
      {erreur && (
        <p id={`${id}-erreur`} className="champ__erreur">
          {erreur}
        </p>
      )}
    </fieldset>
  )
}
