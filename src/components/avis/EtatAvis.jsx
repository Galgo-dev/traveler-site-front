import { ETATS_AVIS, LIBELLES_ETAT_AVIS } from '../../utils/constants'

const CLASSES_ETAT = {
  [ETATS_AVIS.EN_ATTENTE]: 'etiquette--attente',
  [ETATS_AVIS.PUBLIE]: 'etiquette--actif',
  [ETATS_AVIS.REFUSE]: 'etiquette--desactive',
}

/**
 * État d'un avis : à modérer, publié ou refusé.
 * @param {{ etat: 'en_attente'|'publie'|'refuse' }} props
 */
export default function EtatAvis({ etat }) {
  return <span className={`etiquette ${CLASSES_ETAT[etat] ?? ''}`.trim()}>{LIBELLES_ETAT_AVIS[etat] ?? etat}</span>
}
