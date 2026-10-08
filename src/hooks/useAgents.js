import { useCallback } from 'react'
import {
  changerStatutAgent,
  creerAgent,
  definirMotDePasseAgent,
  getAgents,
  modifierAgent,
} from '../api/agents.api'
import { useListeGeree } from './useListeGeree'

/**
 * Charge les comptes du personnel et expose les actions de gestion (administrateur uniquement).
 * La liste est rechargée après chaque action réussie.
 * @param {{ page?: number, limite?: number, q?: string, actif?: boolean, role?: string }} filtres
 */
export function useAgents(filtres = {}) {
  const { elements, pagination, chargement, erreur, executer } = useListeGeree(getAgents, filtres)

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
    agents: elements,
    pagination,
    chargement,
    erreur,
    creer,
    modifier,
    changerStatut,
    definirMotDePasse,
  }
}
