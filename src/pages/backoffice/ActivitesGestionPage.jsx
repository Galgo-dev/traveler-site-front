import GestionCatalogue from '../../components/backoffice/GestionCatalogue'
import ActiviteForm from '../../components/forms/ActiviteForm'
import { useGestionActivites } from '../../hooks/useActivites'
import { useOptionsPays } from '../../hooks/usePays'
import { LIBELLES_CATEGORIE, LIBELLES_DIFFICULTE, versOptions } from '../../utils/constants'
import { formaterDuree, formaterPrix } from '../../utils/formatters'

const TYPE_ACTIVITE = {
  designation: "L'activité",
  feminin: true,
  titre: 'Activités',
  introduction:
    'Ajoutez et corrigez les activités proposées dans chaque pays. Une activité masquée reste conservée mais n’est plus visible par les clients.',
  libelleAjout: 'Ajouter une activité',
  titreCreation: 'Nouvelle activité',
}

const FILTRES_INITIAUX = { q: '', paysId: '', categorie: '' }
const OPTIONS_CATEGORIE = versOptions(LIBELLES_CATEGORIE)

function decrireActivite(activite) {
  return [
    { libelle: 'Pays', valeur: activite.pays?.nom ?? '—' },
    { libelle: 'Destination', valeur: activite.destination?.nom ?? 'Tout le pays' },
    { libelle: 'Catégorie', valeur: LIBELLES_CATEGORIE[activite.categorie] ?? activite.categorie },
    { libelle: 'Durée', valeur: formaterDuree(activite.duree, activite.dureeUnite) },
    { libelle: 'Prix par personne', valeur: formaterPrix(activite.prixParPersonne) },
    {
      libelle: 'Difficulté',
      valeur: LIBELLES_DIFFICULTE[activite.niveauDifficulte] ?? 'Non précisée',
    },
    {
      libelle: 'Âge minimum',
      valeur: activite.ageMinimum == null ? 'Aucun' : `${activite.ageMinimum} ans`,
    },
  ]
}

export default function ActivitesGestionPage() {
  const { options: optionsPays } = useOptionsPays()

  return (
    <GestionCatalogue
      typeElement={TYPE_ACTIVITE}
      useGestion={useGestionActivites}
      recherche={{
        libelle: 'Rechercher une activité',
        filtresInitiaux: FILTRES_INITIAUX,
        listes: [
          { name: 'paysId', label: 'Pays', options: optionsPays },
          { name: 'categorie', label: 'Catégorie', options: OPTIONS_CATEGORIE },
        ],
      }}
      decrire={decrireActivite}
      Formulaire={ActiviteForm}
    />
  )
}
