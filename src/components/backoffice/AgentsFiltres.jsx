import { LIBELLES_ROLE, LIBELLES_STATUT_COMPTE, versOptions } from '../../utils/constants'
import FiltresGestion from './FiltresGestion'

const LISTES = [
  { name: 'role', label: 'Rôle', options: versOptions(LIBELLES_ROLE) },
  { name: 'statut', label: 'Statut', options: versOptions(LIBELLES_STATUT_COMPTE) },
]

/**
 * Recherche dans les comptes du personnel par nom / e-mail, rôle et statut.
 * @param {{ filtres: { q: string, role: string, statut: string },
 *   onRechercher: (filtres: { q: string, role: string, statut: string }) => void }} props
 */
export default function AgentsFiltres(props) {
  return <FiltresGestion libelleRecherche="Rechercher (nom, prénom ou e-mail)" listes={LISTES} {...props} />
}
