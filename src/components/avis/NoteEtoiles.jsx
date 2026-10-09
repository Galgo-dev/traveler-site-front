import { NOTE_MAX } from '../../utils/constants'
import './NoteEtoiles.css'

/**
 * Note affichée en étoiles (lecture seule), lue « 4 étoiles sur 5 » par les lecteurs d'écran.
 * @param {{ note: number }} props
 */
export default function NoteEtoiles({ note }) {
  const etoiles = '★'.repeat(note) + '☆'.repeat(NOTE_MAX - note)

  return (
    <span className="note-etoiles">
      <span aria-hidden="true">{etoiles}</span>
      <span className="visuellement-cache">
        {note} étoile{note > 1 ? 's' : ''} sur {NOTE_MAX}
      </span>
    </span>
  )
}
