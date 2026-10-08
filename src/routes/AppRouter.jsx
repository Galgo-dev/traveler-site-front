import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import ConnexionPage from '../pages/auth/ConnexionPage'
import InscriptionPage from '../pages/auth/InscriptionPage'
import AccueilPage from '../pages/public/AccueilPage'
import DestinationDetailPage from '../pages/public/DestinationDetailPage'
import DestinationsPage from '../pages/public/DestinationsPage'
import { ROUTES } from '../utils/constants'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.ACCUEIL} element={<AccueilPage />} />
          <Route path={ROUTES.DESTINATIONS} element={<DestinationsPage />} />
          <Route path={ROUTES.DESTINATION_DETAIL} element={<DestinationDetailPage />} />
          <Route path={ROUTES.CONNEXION} element={<ConnexionPage />} />
          <Route path={ROUTES.INSCRIPTION} element={<InscriptionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
