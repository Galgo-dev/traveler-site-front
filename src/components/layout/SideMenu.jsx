import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../utils/constants'
import './SideMenu.css'

const LIENS = [
  { to: ROUTES.GESTION, libelle: 'Accueil de la gestion', end: true },
  { to: ROUTES.GESTION_PAYS, libelle: 'Pays' },
  { to: ROUTES.GESTION_DESTINATIONS, libelle: 'Destinations' },
  { to: ROUTES.GESTION_ACTIVITES, libelle: 'Activités' },
  { to: ROUTES.GESTION_DEMANDES, libelle: 'Demandes de voyage' },
  { to: ROUTES.GESTION_AVIS, libelle: 'Avis clients' },
  { to: ROUTES.GESTION_CLIENTS, libelle: 'Clients' },
  { to: ROUTES.GESTION_AGENTS, libelle: 'Comptes du personnel', administrateurSeulement: true },
]

function classeLien({ isActive }) {
  return `menu-lateral__lien ${isActive ? 'menu-lateral__lien--actif' : ''}`.trim()
}

export default function SideMenu() {
  const { estAdministrateur } = useAuth()
  const liensVisibles = LIENS.filter(({ administrateurSeulement }) => !administrateurSeulement || estAdministrateur)

  return (
    <nav className="menu-lateral" aria-label="Menu de gestion">
      <ul className="menu-lateral__liste">
        {liensVisibles.map(({ to, libelle, end }) => (
          <li key={to}>
            <NavLink to={to} end={end} className={classeLien}>
              {libelle}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
