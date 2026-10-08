import { useContext } from 'react'
import { FavorisContext } from '../context/contexteFavoris'

/**
 * Donne accès aux favoris du client connecté et aux actions d'ajout / de retrait.
 * Le type d'élément vaut 'destinations' ou 'activites'.
 */
export function useFavoris() {
  const contexte = useContext(FavorisContext)
  if (!contexte) {
    throw new Error("useFavoris doit être utilisé à l'intérieur de <FavorisProvider>.")
  }
  return contexte
}
