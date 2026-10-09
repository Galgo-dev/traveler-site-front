import { NOTE_MAX } from '../../utils/constants'
import './ResumeNotes.css'

/**
 * Note moyenne et nombre d'avis publiés (R15) : « ★ 4,6 / 5 (23 avis) », ou « Pas encore d'avis » —
 * jamais « 0 étoile » (R16).
 * @param {{ resume?: { noteMoyenneAffichee: string|null, nombreAvis: number }|null, grand?: boolean }} props
 *   grand : présentation de la fiche destination ; sinon, version compacte des cartes
 */
export default function ResumeNotes({ resume, grand = false }) {
  const classe = `resume-notes ${grand ? 'resume-notes--grand' : ''}`.trim()

  if (!resume?.nombreAvis) return <p className={`${classe} resume-notes--vide`}>Pas encore d'avis</p>

  return (
    <p className={classe}>
      <span className="resume-notes__etoile" aria-hidden="true">
        ★
      </span>
      <span className="visuellement-cache">Note moyenne des voyageurs :</span>
      <strong>
        {resume.noteMoyenneAffichee}
        <span className="resume-notes__sur" aria-hidden="true">
          {' '}
          / {NOTE_MAX}
        </span>
        <span className="visuellement-cache"> sur {NOTE_MAX}</span>
      </strong>
      <span className="resume-notes__nombre">({resume.nombreAvis} avis)</span>
    </p>
  )
}
