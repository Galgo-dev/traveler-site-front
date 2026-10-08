import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../utils/constants'

/**
 * Réserve les routes enfants aux rôles autorisés ; les autres utilisateurs retournent à l'accueil.
 * L'API reste la source de vérité pour les droits.
 * @param {{ roles: string[] }} props
 */
export default function RoleRoute({ roles }) {
  const { role } = useAuth()

  if (!roles.includes(role)) {
    return <Navigate to={ROUTES.ACCUEIL} replace />
  }

  return <Outlet />
}
