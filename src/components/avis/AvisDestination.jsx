import { useState } from 'react'
import { useAvisDestination } from '../../hooks/useAvis'
import { NOTE_MAX, TRI_AVIS_PAR_DEFAUT, TRIS_AVIS, versOptions } from '../../utils/constants'
import ErrorMessage from '../ui/ErrorMessage'
import Loader from '../ui/Loader'
import Pagination from '../ui/Pagination'
import Select from '../ui/Select'
import AvisCard from './AvisCard'
import ResumeNotes from './ResumeNotes'
import './AvisDestination.css'

const OPTIONS_TRI = versOptions(TRIS_AVIS)
const OPTIONS_NOTE = [
  { valeur: '', libelle: 'Toutes les notes' },
  ...Array.from({ length: NOTE_MAX }, (_, index) => {
    const note = NOTE_MAX - index
    return { valeur: String(note), libelle: `${note} étoile${note > 1 ? 's' : ''}` }
  }),
]
const CRITERES_INITIAUX = { tri: TRI_AVIS_PAR_DEFAUT, note: '', page: 1 }

function versFiltres({ tri, note, page }) {
  return { tri, page, ...(note && { note: Number(note) }) }
}

function messageAucunAvis(filtreNote) {
  return filtreNote
    ? `Aucun avis avec ${filtreNote} étoile${filtreNote > 1 ? 's' : ''} pour le moment.`
    : 'Aucun avis à afficher.'
}

function ListeAvis({ avis, filtreNote }) {
  if (avis.length === 0) return <p className="encadre">{messageAucunAvis(filtreNote)}</p>

  return (
    <ul className="avis-destination__liste">
      {avis.map((unAvis) => (
        <li key={unAvis.id}>
          <AvisCard avis={unAvis} />
        </li>
      ))}
    </ul>
  )
}

/**
 * Avis publiés d'une destination (§7) : note moyenne, nombre d'avis, puis la liste, triée par date ou par note
 * et filtrable par nombre d'étoiles. Sans avis publié : « Pas encore d'avis » (R16).
 * @param {{ destinationId: number|string, resumeInitial?: object }} props
 *   resumeInitial : résumé déjà reçu avec la destination, affiché pendant le chargement de la liste
 */
export default function AvisDestination({ destinationId, resumeInitial }) {
  const [criteres, setCriteres] = useState(CRITERES_INITIAUX)
  const { resume, avis, pagination, chargement, erreur } = useAvisDestination(destinationId, versFiltres(criteres))
  const resumeAffiche = resume ?? resumeInitial
  const aDesAvis = Boolean(resumeAffiche?.nombreAvis)

  // Changer le tri ou le filtre repart de la première page.
  function modifierCritere(event) {
    const { name, value } = event.target
    setCriteres((precedents) => ({ ...precedents, [name]: value, page: 1 }))
  }

  return (
    <section className="avis-destination" aria-labelledby="titre-avis-destination" id="avis">
      <h2 id="titre-avis-destination">Avis des voyageurs</h2>
      <ResumeNotes resume={resumeAffiche} grand />

      {aDesAvis && (
        <>
          <div className="avis-destination__criteres">
            <Select label="Trier par" name="tri" options={OPTIONS_TRI} value={criteres.tri} onChange={modifierCritere} />
            <Select
              label="Afficher"
              name="note"
              options={OPTIONS_NOTE}
              value={criteres.note}
              onChange={modifierCritere}
            />
          </div>

          {chargement && <Loader message="Chargement des avis…" />}
          {!chargement && erreur && <ErrorMessage message={erreur.message} />}
          {!chargement && !erreur && (
            <>
              <ListeAvis avis={avis} filtreNote={Number(criteres.note)} />
              {pagination && (
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  onChanger={(page) => setCriteres((precedents) => ({ ...precedents, page }))}
                />
              )}
            </>
          )}
        </>
      )}

      {!aDesAvis && (
        <p>Les voyageurs qui sont partis avec nous pourront bientôt partager leur expérience ici.</p>
      )}
    </section>
  )
}
