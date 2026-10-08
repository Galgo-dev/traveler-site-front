import { AuthProvider } from './context/AuthContext.jsx'
import { FavorisProvider } from './context/FavorisContext.jsx'
import AppRouter from './routes/AppRouter'

export default function App() {
  return (
    <AuthProvider>
      <FavorisProvider>
        <AppRouter />
      </FavorisProvider>
    </AuthProvider>
  )
}
