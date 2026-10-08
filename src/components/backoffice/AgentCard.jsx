import { LIBELLES_ROLE, LIBELLES_STATUT_COMPTE } from '../../utils/constants'
import Button from '../ui/Button'
import CarteGestion from './CarteGestion'
import './AgentCard.css'

/**
 * Fiche d'un membre du personnel avec ses actions de gestion.
 * @param {{ agent: object, estSoiMeme: boolean, onModifier: () => void,
 *   onDefinirMotDePasse: () => void, onChangerStatut: () => void }} props
 */
export default function AgentCard({ agent, estSoiMeme, onModifier, onDefinirMotDePasse, onChangerStatut }) {
  return (
    <CarteGestion
      titre={
        <>
          {agent.prenom} {agent.nom}
          {estSoiMeme && <span className="agent-carte__vous"> (vous)</span>}
        </>
      }
      infos={[
        { libelle: 'E-mail', valeur: agent.email },
        { libelle: "Numéro d'employé", valeur: agent.numeroEmploye || '—' },
        { libelle: 'Rôle', valeur: LIBELLES_ROLE[agent.role] ?? agent.role },
      ]}
      statut={{
        actif: agent.actif,
        libelle: agent.actif ? LIBELLES_STATUT_COMPTE.actif : LIBELLES_STATUT_COMPTE.desactive,
      }}
      actions={
        <>
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
        </>
      }
    />
  )
}
