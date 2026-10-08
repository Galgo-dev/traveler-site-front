import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import ConnexionPage from '../pages/auth/ConnexionPage'
import DestinationDetailPage from '../pages/public/DestinationDetailPage'
import DestinationsPage from '../pages/public/DestinationsPage'
import { ROUTES } from '../utils/constants'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          {/* Accueil provisoire : redirige vers les destinations tant que AccueilPage n'existe pas. */}
          <Route path={ROUTES.ACCUEIL} element={<Navigate to={ROUTES.DESTINATIONS} replace />} />
          <Route path={ROUTES.DESTINATIONS} element={<DestinationsPage />} />
          <Route path={ROUTES.DESTINATION_DETAIL} element={<DestinationDetailPage />} />
          <Route path={ROUTES.CONNEXION} element={<ConnexionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
