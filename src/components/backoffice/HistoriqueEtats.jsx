import { LIBELLES_ETAT_DEMANDE } from '../../utils/constants'
import { formaterDateHeure } from '../../utils/formatters'
import './HistoriqueDemande.css'

function libelleChangement({ ancienEtat, nouvelEtat }) {
  const nouveau = LIBELLES_ETAT_DEMANDE[nouvelEtat] ?? nouvelEtat
  return ancienEtat ? `${LIBELLES_ETAT_DEMANDE[ancienEtat] ?? ancienEtat} → ${nouveau}` : `Demande créée (${nouveau})`
}

// P4 : l'auteur est l'utilisateur qui a agi (client ou membre du personnel).
function libelleAuteur({ type, prenom, nom }) {
  if (type === 'agent') return `${prenom} ${nom} (agence)`
  return prenom ? `${prenom} ${nom} (client)` : 'Le client (compte supprimé)'
}

/**
 * Historique des changements d'état d'une demande (§4) : date, ancien et nouvel état, auteur.
 * @param {{ historique: { id: number, ancienEtat: string|null, nouvelEtat: string, createdAt: string,
 *   auteur: { type: 'client'|'agent', prenom?: string, nom?: string } }[] }} props
 */
export default function HistoriqueDemande({ historique }) {
  return (
    <ol className="historique-demande">
      {historique.map((ligne) => (
        <li key={ligne.id} className="historique-demande__ligne">
          <span className="historique-demande__date">{formaterDateHeure(ligne.createdAt)}</span>
          <strong>{libelleChangement(ligne)}</strong>
          <span>Par {libelleAuteur(ligne.auteur)}</span>
        </li>
      ))}
    </ol>
  )
}
