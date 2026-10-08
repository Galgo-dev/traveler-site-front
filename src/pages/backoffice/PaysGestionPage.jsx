import GestionCatalogue from '../../components/backoffice/GestionCatalogue'
import PaysForm from '../../components/forms/PaysForm'
import { useGestionPays } from '../../hooks/usePays'
import { CONTINENTS } from '../../utils/constants'
import { formaterDecalageHoraire } from '../../utils/formatters'

const TYPE_PAYS = {
  designation: 'Le pays',
  feminin: false,
  titre: 'Pays',
  introduction:
    'Ajoutez et corrigez les pays du catalogue. Un pays masqué reste conservé mais n’est plus visible par les clients.',
  libelleAjout: 'Ajouter un pays',
  titreCreation: 'Nouveau pays',
  avertissementSuppression: 'Un pays qui contient encore des destinations ou des activités ne peut pas être supprimé.',
}

const RECHERCHE = {
  libelle: 'Rechercher un pays',
  filtresInitiaux: { q: '', continent: '' },
  listes: [
    {
      name: 'continent',
      label: 'Continent',
      options: CONTINENTS.map((continent) => ({ valeur: continent, libelle: continent })),
    },
  ],
}

function decrirePays(pays) {
  return [
    { libelle: 'Continent', valeur: pays.continent },
    { libelle: 'Langue principale', valeur: pays.languePrincipale },
    { libelle: 'Monnaie', valeur: pays.monnaie },
    { libelle: 'Visa pour les Belges', valeur: pays.visaRequis ? 'Requis' : 'Non requis' },
    { libelle: 'Décalage horaire', valeur: formaterDecalageHoraire(pays.decalageHoraire) },
  ]
}

export default function PaysGestionPage() {
  return (
    <GestionCatalogue
      typeElement={TYPE_PAYS}
      useGestion={useGestionPays}
      recherche={RECHERCHE}
      decrire={decrirePays}
      Formulaire={PaysForm}
    />
  )
}
