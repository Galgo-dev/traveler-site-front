import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../utils/constants'
import Button from '../ui/Button'
import './Header.css'

function ZoneCompte() {
  const { utilisateur, estConnecte, estPersonnel, deconnexion } = useAuth()
  const { pathname } = useLocation()

  if (estConnecte) {
    return (
      <div className="header__compte">
        <span className="header__bienvenue">Bonjour {utilisateur.prenom}</span>
        {estPersonnel && (
          <Link to={ROUTES.GESTION} className="bouton bouton--secondaire">
            Espace agence
          </Link>
        )}
        <Button variante="secondaire" onClick={deconnexion}>
          Se déconnecter
        </Button>
      </div>
    )
  }

  if (pathname === ROUTES.CONNEXION) return null

  return (
    <Link to={ROUTES.CONNEXION} className="bouton bouton--secondaire">
      Se connecter
    </Link>
  )
}

export default function Header() {
  return (
    <header className="header">
      <div className="header__contenu">
        <Link to={ROUTES.ACCUEIL} className="header__marque">
          Nos voyages
        </Link>
        <ZoneCompte />
      </div>
    </header>
  )
}
