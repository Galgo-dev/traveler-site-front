import { useOptionsToutesDestinations } from '../../hooks/useDestinations'
import { useOptionsPays } from '../../hooks/usePays'
import { LIBELLES_ETAT_DEMANDE, versOptions } from '../../utils/constants'
import FiltresGestion from './FiltresGestion'

const OPTIONS_ETAT = versOptions(LIBELLES_ETAT_DEMANDE)
const PERIODE_DEPART = [
  { name: 'departDu', label: 'Départ à partir du' },
  { name: 'departAu', label: "Départ jusqu'au" },
]

/**
 * Filtres de la liste des demandes du personnel (§7) : client, état, pays, destination et période de départ.
 * @param {{ filtres: Record<string, string>, onRechercher: (filtres: Record<string, string>) => void }} props
 */
export default function FiltresDemandes(props) {
  const { options: optionsPays } = useOptionsPays()
  const { options: optionsDestinations } = useOptionsToutesDestinations()

  return (
    <FiltresGestion
      libelleRecherche="Client (nom, prénom ou e-mail)"
      listes={[
        { name: 'etat', label: 'État', options: OPTIONS_ETAT },
        { name: 'paysId', label: 'Pays', options: optionsPays },
        { name: 'destinationId', label: 'Destination', options: optionsDestinations },
      ]}
      dates={PERIODE_DEPART}
      {...props}
    />
  )
}
