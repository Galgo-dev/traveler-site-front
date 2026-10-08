import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AccueilPage from '../pages/public/AccueilPage'
import DestinationDetailPage from '../pages/public/DestinationDetailPage'
import DestinationsPage from '../pages/public/DestinationsPage'
import { ROUTES } from '../utils/constants'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.ACCUEIL} element={<AccueilPage />} />
        <Route path={ROUTES.DESTINATIONS} element={<DestinationsPage />} />
        <Route path={ROUTES.DESTINATION_DETAIL} element={<DestinationDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
