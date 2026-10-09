import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../utils/constants'
import Button from '../ui/Button'
import NavBar from './NavBar'
import './Header.css'

function ZoneCompte() {
  const { utilisateur, estConnecte, estClient, estPersonnel, deconnexion } = useAuth()
  const { pathname } = useLocation()

  if (estConnecte) {
    return (
      <div className="header__compte">
        <span className="header__bienvenue">Bonjour {utilisateur.prenom}</span>
        {estClient && (
          <Link to={ROUTES.FAVORIS} className="bouton bouton--secondaire">
            <span aria-hidden="true">♥&nbsp;</span>Mes favoris
          </Link>
        )}
        {estClient && (
          <Link to={ROUTES.MES_DEMANDES} className="bouton bouton--secondaire">
            Mes demandes
          </Link>
        )}
        {estClient && (
          <Link to={ROUTES.PROFIL} className="bouton bouton--secondaire">
            Mon profil
          </Link>
        )}
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
        <NavBar />
        <ZoneCompte />
      </div>
    </header>
  )
}
