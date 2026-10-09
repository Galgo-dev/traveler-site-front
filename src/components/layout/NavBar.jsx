import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../utils/constants'
import './NavBar.css'

const LIENS = [
  { to: ROUTES.PAYS, libelle: 'Pays' },
  { to: ROUTES.DESTINATIONS, libelle: 'Destinations' },
  { to: ROUTES.RECHERCHE, libelle: 'Rechercher' },
]

function classeLien({ isActive }) {
  return `navigation__lien ${isActive ? 'navigation__lien--actif' : ''}`.trim()
}

/** Navigation principale du catalogue, visible par tous (visiteurs, clients et personnel). */
export default function NavBar() {
  return (
    <nav className="navigation" aria-label="Navigation principale">
      <ul className="navigation__liste">
        {LIENS.map(({ to, libelle }) => (
          <li key={to}>
            <NavLink to={to} className={classeLien}>
              {libelle}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
