import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCompteurAvis } from '../../hooks/useAvis'
import { LIBELLES_ROLE, ROUTES } from '../../utils/constants'
import './GestionAccueilPage.css'

const SECTIONS = [
  { to: ROUTES.GESTION_PAYS, titre: 'Pays', description: 'Ajouter, corriger ou masquer les pays du catalogue.' },
  {
    to: ROUTES.GESTION_DESTINATIONS,
    titre: 'Destinations',
    description: 'Gérer les villes et régions proposées dans chaque pays.',
  },
  {
    to: ROUTES.GESTION_ACTIVITES,
    titre: 'Activités',
    description: 'Gérer les activités : catégorie, durée, prix, âge minimum…',
  },
  {
    to: ROUTES.GESTION_DEMANDES,
    titre: 'Demandes de voyage',
    description: 'Rappeler les clients, confirmer ou annuler leurs demandes de voyage.',
  },
  {
    to: ROUTES.GESTION_AVIS,
    titre: 'Avis clients',
    description: 'Publier ou refuser les avis des clients et y répondre au nom de l’agence.',
  },
  {
    to: ROUTES.GESTION_CLIENTS,
    titre: 'Clients',
    description: 'Consulter le dossier d’un client, corriger ses informations ou effacer son compte.',
  },
  {
    to: ROUTES.GESTION_AGENTS,
    titre: 'Comptes du personnel',
    description: 'Créer les comptes des agents et désactiver ceux des employés qui partent.',
    administrateurSeulement: true,
  },
]

/** Compteur du tableau de bord (§7) : il mène directement à la file de modération. */
function AvisAModerer() {
  const { aModerer, chargement, erreur } = useCompteurAvis()
  if (chargement || erreur || aModerer === 0) return null

  return (
    <Link to={ROUTES.GESTION_AVIS} className="encadre gestion-accueil__alerte">
      <strong>
        {aModerer} avis à modérer
      </strong>
      <span>Ouvrir la file de modération →</span>
    </Link>
  )
}

export default function GestionAccueilPage() {
  const { utilisateur, role, estAdministrateur } = useAuth()
  const sectionsVisibles = SECTIONS.filter(
    ({ administrateurSeulement }) => !administrateurSeulement || estAdministrateur,
  )

  return (
    <main>
      <h1>Espace agence</h1>
      <p>
        Bienvenue {utilisateur.prenom}. Vous êtes connecté en tant que{' '}
        <strong>{LIBELLES_ROLE[role].toLowerCase()}</strong>. Que souhaitez-vous faire ?
      </p>

      <AvisAModerer />

      <ul className="grille-cartes">
        {sectionsVisibles.map(({ to, titre, description }) => (
          <li key={to}>
            <Link to={to} className="raccourci-gestion">
              <span className="raccourci-gestion__titre">{titre}</span>
              <span>{description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
