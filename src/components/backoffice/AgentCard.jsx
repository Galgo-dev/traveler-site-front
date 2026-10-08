import { LIBELLES_ROLE, LIBELLES_STATUT_COMPTE } from '../../utils/constants'
import Button from '../ui/Button'
import './AgentCard.css'

/**
 * Fiche d'un membre du personnel avec ses actions de gestion.
 * @param {{ agent: object, estSoiMeme: boolean, onModifier: () => void,
 *   onDefinirMotDePasse: () => void, onChangerStatut: () => void }} props
 */
export default function AgentCard({ agent, estSoiMeme, onModifier, onDefinirMotDePasse, onChangerStatut }) {
  const statut = agent.actif ? 'actif' : 'desactive'

  return (
    <article className={`agent-carte agent-carte--${statut}`}>
      <h3 className="agent-carte__nom">
        {agent.prenom} {agent.nom}
        {estSoiMeme && <span className="agent-carte__vous"> (vous)</span>}
      </h3>

      <dl className="liste-infos">
        <dt>E-mail</dt>
        <dd className="agent-carte__email">{agent.email}</dd>
        <dt>Numéro d'employé</dt>
        <dd>{agent.numeroEmploye || '—'}</dd>
        <dt>Rôle</dt>
        <dd>{LIBELLES_ROLE[agent.role] ?? agent.role}</dd>
        <dt>Statut</dt>
        <dd>
          <span className={`etiquette etiquette--${statut}`}>{LIBELLES_STATUT_COMPTE[statut]}</span>
        </dd>
      </dl>

      <div className="agent-carte__actions">
        <Button variante="secondaire" onClick={onModifier}>
          Modifier
        </Button>
        <Button variante="secondaire" onClick={onDefinirMotDePasse}>
          Nouveau mot de passe
        </Button>
        {!estSoiMeme && (
          <Button variante={agent.actif ? 'danger' : 'primaire'} onClick={onChangerStatut}>
            {agent.actif ? 'Désactiver' : 'Réactiver'}
          </Button>
        )}
      </div>
    </article>
  )
}
