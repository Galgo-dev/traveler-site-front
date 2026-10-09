import { useEffect, useState } from 'react'
import { ecouterCatalogue } from '../api/evenements.api'
import { CatalogueContext } from './contexteCatalogue'

/**
 * Écoute les modifications du catalogue (agents) et expose une version qui augmente à chacune.
 * Les hooks du catalogue s'en servent pour recharger leurs données en arrière-plan : une page ouverte
 * affiche ainsi tout de suite un prix corrigé ou une destination masquée, sans rafraîchissement.
 */
export function CatalogueProvider({ children }) {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const incrementer = () => setVersion((precedente) => precedente + 1)
    return ecouterCatalogue({ onModification: incrementer, onReconnexion: incrementer })
  }, [])

  return <CatalogueContext.Provider value={version}>{children}</CatalogueContext.Provider>
}
