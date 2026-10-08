import GestionCatalogue from '../../components/backoffice/GestionCatalogue'
import DestinationForm from '../../components/forms/DestinationForm'
import { useGestionDestinations } from '../../hooks/useDestinations'
import { useOptionsPays } from '../../hooks/usePays'
import { formaterPrix } from '../../utils/formatters'

const TYPE_DESTINATION = {
  designation: 'La destination',
  feminin: true,
  titre: 'Destinations',
  introduction:
    'Ajoutez et corrigez les villes et régions proposées. Une destination masquée reste conservée mais n’est plus visible par les clients.',
  libelleAjout: 'Ajouter une destination',
  titreCreation: 'Nouvelle destination',
}

const FILTRES_INITIAUX = { q: '', paysId: '' }

function decrireDestination(destination) {
  return [
    { libelle: 'Pays', valeur: destination.pays?.nom ?? '—' },
    { libelle: 'Période idéale', valeur: destination.periodeIdeale || '—' },
    {
      libelle: 'Prix indicatif',
      valeur: destination.prixAPartirDe == null ? '—' : `À partir de ${formaterPrix(destination.prixAPartirDe)}`,
    },
  ]
}

export default function DestinationsGestionPage() {
  const { options: optionsPays } = useOptionsPays()

  return (
    <GestionCatalogue
      typeElement={TYPE_DESTINATION}
      useGestion={useGestionDestinations}
      recherche={{
        libelle: 'Rechercher une destination',
        filtresInitiaux: FILTRES_INITIAUX,
        listes: [{ name: 'paysId', label: 'Pays', options: optionsPays }],
      }}
      decrire={decrireDestination}
      Formulaire={DestinationForm}
    />
  )
}
