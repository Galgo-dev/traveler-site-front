import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../utils/constants'

/**
 * Redirige vers la page de connexion si personne n'est connecté.
 * La page demandée est mémorisée pour y revenir après la connexion.
 */
export default function ProtectedRoute() {
  const { estConnecte } = useAuth()
  const location = useLocation()

  if (!estConnecte) {
    // L'adresse complète est gardée (ex. ?destination=12) pour revenir exactement au même endroit.
    return <Navigate to={ROUTES.CONNEXION} replace state={{ from: location.pathname + location.search }} />
  }

  return <Outlet />
}
