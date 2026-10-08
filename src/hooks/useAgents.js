import { useCallback, useState } from 'react'
import {
  changerStatutAgent,
  creerAgent,
  definirMotDePasseAgent,
  getAgents,
  modifierAgent,
} from '../api/agents.api'
import { useRequete } from './useRequete'

// La version ne sert qu'à relancer la requête après une modification : elle n'est pas envoyée à l'API.
function chargerAgents({ filtres }, options) {
  return getAgents(filtres, options)
}

/**
 * Charge les comptes du personnel et expose les actions de gestion (administrateur uniquement).
 * La liste est rechargée après chaque action réussie.
 * @param {{ page?: number, limite?: number, q?: string, actif?: boolean, role?: string }} filtres
 */
export function useAgents(filtres = {}) {
  const [version, setVersion] = useState(0)
  const { donnees, chargement, erreur } = useRequete(chargerAgents, { filtres, version })

  const executer = useCallback(async (action) => {
    const resultat = await action()
    setVersion((precedente) => precedente + 1)
    return resultat
  }, [])

  const creer = useCallback((agent) => executer(() => creerAgent(agent)), [executer])
  const modifier = useCallback((id, champs) => executer(() => modifierAgent(id, champs)), [executer])
  const changerStatut = useCallback(
    (id, actif) => executer(() => changerStatutAgent(id, actif)),
    [executer],
  )
  const definirMotDePasse = useCallback(
    (id, motDePasse) => executer(() => definirMotDePasseAgent(id, motDePasse)),
    [executer],
  )

  return {
    agents: donnees?.donnees ?? [],
    pagination: donnees?.pagination ?? null,
    chargement,
    erreur,
    creer,
    modifier,
    changerStatut,
    definirMotDePasse,
  }
}
