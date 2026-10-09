import { useOptionsToutesDestinations } from '../../hooks/useDestinations'
import { useOptionsPays } from '../../hooks/usePays'
import { LIBELLES_ETAT_AVIS, NOTE_MAX, versOptions } from '../../utils/constants'
import FiltresGestion from './FiltresGestion'

const OPTIONS_ETAT = versOptions(LIBELLES_ETAT_AVIS)
const OPTIONS_NOTE = Array.from({ length: NOTE_MAX }, (_, index) => {
  const note = NOTE_MAX - index
  return { valeur: String(note), libelle: `${note} étoile${note > 1 ? 's' : ''}` }
})
const PERIODE_DEPOT = [
  { name: 'du', label: 'Déposé à partir du' },
  { name: 'au', label: "Déposé jusqu'au" },
]

/**
 * Filtres de la liste de tous les avis (§7) : état, pays, destination, note et période de dépôt.
 * @param {{ filtres: Record<string, string>, onRechercher: (filtres: Record<string, string>) => void }} props
 */
export default function FiltresAvis(props) {
  const { options: optionsPays } = useOptionsPays()
  const { options: optionsDestinations } = useOptionsToutesDestinations()

  return (
    <FiltresGestion
      listes={[
        { name: 'etat', label: 'État', options: OPTIONS_ETAT },
        { name: 'paysId', label: 'Pays', options: optionsPays },
        { name: 'destinationId', label: 'Destination', options: optionsDestinations },
        { name: 'note', label: 'Note', options: OPTIONS_NOTE },
      ]}
      dates={PERIODE_DEPOT}
      {...props}
    />
  )
}
