import { ETATS_DEMANDE, LIBELLES_ETAT_DEMANDE } from '../../utils/constants'

const CLASSES_ETAT = {
  [ETATS_DEMANDE.EN_ATTENTE]: 'etiquette--attente',
  [ETATS_DEMANDE.CONFIRMEE]: 'etiquette--actif',
  [ETATS_DEMANDE.ANNULEE]: 'etiquette--desactive',
}

/**
 * État d'une demande de voyage : En attente, Confirmée ou Annulée.
 * @param {{ etat: 'en_attente'|'confirmee'|'annulee' }} props
 */
export default function EtatDemande({ etat }) {
  return <span className={`etiquette ${CLASSES_ETAT[etat] ?? ''}`.trim()}>{LIBELLES_ETAT_DEMANDE[etat] ?? etat}</span>
}
