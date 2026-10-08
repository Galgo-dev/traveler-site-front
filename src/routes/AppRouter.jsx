import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BackOfficeLayout from '../layouts/BackOfficeLayout'
import PublicLayout from '../layouts/PublicLayout'
import ConnexionPage from '../pages/auth/ConnexionPage'
import InscriptionPage from '../pages/auth/InscriptionPage'
import MotDePasseOubliePage from '../pages/auth/MotDePasseOubliePage'
import ReinitialisationMotDePassePage from '../pages/auth/ReinitialisationMotDePassePage'
import ActivitesGestionPage from '../pages/backoffice/ActivitesGestionPage'
import AgentsPage from '../pages/backoffice/AgentsPage'
import ClientDetailPage from '../pages/backoffice/ClientDetailPage'
import ClientsPage from '../pages/backoffice/ClientsPage'
import DestinationsGestionPage from '../pages/backoffice/DestinationsGestionPage'
import GestionAccueilPage from '../pages/backoffice/GestionAccueilPage'
import PaysGestionPage from '../pages/backoffice/PaysGestionPage'
import FavorisPage from '../pages/client/FavorisPage'
import ProfilPage from '../pages/client/ProfilPage'
import NotFoundPage from '../pages/NotFoundPage'
import AccueilPage from '../pages/public/AccueilPage'
import DestinationDetailPage from '../pages/public/DestinationDetailPage'
import DestinationsPage from '../pages/public/DestinationsPage'
import { ROLES, ROLES_PERSONNEL, ROUTES } from '../utils/constants'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'

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
          <Route path={ROUTES.MOT_DE_PASSE_OUBLIE} element={<MotDePasseOubliePage />} />
          <Route path={ROUTES.REINITIALISATION_MOT_DE_PASSE} element={<ReinitialisationMotDePassePage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute roles={[ROLES.CLIENT]} />}>
              <Route path={ROUTES.FAVORIS} element={<FavorisPage />} />
              <Route path={ROUTES.PROFIL} element={<ProfilPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute roles={ROLES_PERSONNEL} />}>
            <Route element={<BackOfficeLayout />}>
              <Route path={ROUTES.GESTION} element={<GestionAccueilPage />} />
              <Route path={ROUTES.GESTION_PAYS} element={<PaysGestionPage />} />
              <Route path={ROUTES.GESTION_DESTINATIONS} element={<DestinationsGestionPage />} />
              <Route path={ROUTES.GESTION_ACTIVITES} element={<ActivitesGestionPage />} />
              <Route path={ROUTES.GESTION_CLIENTS} element={<ClientsPage />} />
              <Route path={ROUTES.GESTION_CLIENT_DETAIL} element={<ClientDetailPage />} />
              <Route element={<RoleRoute roles={[ROLES.ADMINISTRATEUR]} />}>
                <Route path={ROUTES.GESTION_AGENTS} element={<AgentsPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
