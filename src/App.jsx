import { AuthProvider } from './context/AuthContext.jsx'
import { CatalogueProvider } from './context/CatalogueContext.jsx'
import { FavorisProvider } from './context/FavorisContext.jsx'
import AppRouter from './routes/AppRouter'

export default function App() {
  return (
    <AuthProvider>
      <CatalogueProvider>
        <FavorisProvider>
          <AppRouter />
        </FavorisProvider>
      </CatalogueProvider>
    </AuthProvider>
  )
}
