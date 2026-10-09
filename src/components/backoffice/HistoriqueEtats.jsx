import { formaterDateHeure } from '../../utils/formatters'
import './HistoriqueEtats.css'

function libelleChangement({ ancienEtat, nouvelEtat }, libelles, libelleCreation) {
  const nouveau = libelles[nouvelEtat] ?? nouvelEtat
  return ancienEtat ? `${libelles[ancienEtat] ?? ancienEtat} → ${nouveau}` : `${libelleCreation} (${nouveau})`
}

// L'auteur est l'utilisateur qui a agi (client ou membre du personnel).
function libelleAuteur({ type, prenom, nom }) {
  if (type === 'agent') return `${prenom} ${nom} (agence)`
  return prenom ? `${prenom} ${nom} (client)` : 'Le client (compte supprimé)'
}

/**
 * Historique des changements d'état d'une demande ou d'un avis : date, ancien et nouvel état, auteur et,
 * s'il y en a un, motif.
 * @param {{ historique: { id: number, ancienEtat: string|null, nouvelEtat: string, createdAt: string,
 *   motif?: string|null, auteur: { type: 'client'|'agent', prenom?: string, nom?: string } }[],
 *   libelles: Record<string, string>, libelleCreation: string }} props
 *   libelles : libellé de chaque état ; libelleCreation : première ligne, ex. « Demande créée »
 */
export default function HistoriqueEtats({ historique, libelles, libelleCreation }) {
  return (
    <ol className="historique-etats">
      {historique.map((ligne) => (
        <li key={ligne.id} className="historique-etats__ligne">
          <span className="historique-etats__date">{formaterDateHeure(ligne.createdAt)}</span>
          <strong>{libelleChangement(ligne, libelles, libelleCreation)}</strong>
          <span>Par {libelleAuteur(ligne.auteur)}</span>
          {ligne.motif && <span className="historique-etats__motif">Motif : {ligne.motif}</span>}
        </li>
      ))}
    </ol>
  )
}
