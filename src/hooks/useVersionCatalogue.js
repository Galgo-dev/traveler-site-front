import { useContext } from 'react'
import { CatalogueContext } from '../context/contexteCatalogue'

/**
 * Version du catalogue : change dès qu'un agent modifie un pays, une destination ou une activité.
 * À passer comme `actualisation` à useRequete pour recharger les données en arrière-plan.
 */
export function useVersionCatalogue() {
  const version = useContext(CatalogueContext)
  if (version === null) {
    throw new Error("useVersionCatalogue doit être utilisé à l'intérieur de <CatalogueProvider>.")
  }
  return version
}
