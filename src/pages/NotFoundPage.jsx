import { Link } from 'react-router-dom'
import { ROUTES } from '../utils/constants'

export default function NotFoundPage() {
  return (
    <main className="conteneur conteneur--etroit">
      <h1>Page introuvable</h1>
      <p>La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <Link to={ROUTES.ACCUEIL} className="bouton bouton--primaire">
        Retour à l'accueil
      </Link>
    </main>
  )
}
