import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import DestinationsPage from '../pages/public/DestinationsPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Accueil provisoire : redirige vers les destinations tant que AccueilPage n'existe pas. */}
        <Route path="/" element={<Navigate to="/destinations" replace />} />
        <Route path="/destinations" element={<DestinationsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
